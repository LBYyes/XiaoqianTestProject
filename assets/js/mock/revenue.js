// 收益管理模块 mock 数据 & 常量
// - 月份范围：2026-01 ~ 2026-04
// - 周维度：自然周（周一~周日），跨月那周只算落在本月内的天数
// - 字段含义：
//     ctrip/douyin/fliggy/meituan：4 个 OTA 渠道间夜
//     upgradeCoupon：升级券间夜（线下渠道之一，计入"线下小计"，计入"结算间夜"）
//     otherOffline：线下其他渠道间夜（线下小计 = 升级券 + 线下其他）
//     occupancy：占房间夜（不计入结算）
//     settlementAmount：当周总金额（口径：酒店支付给平台，按 OTA 4 渠道间夜 × 单价 100~140 元）
//     总销售间夜 = OTA小计 + 线下小计

const REVENUE_MOCK_VERSION = '2026-04-23-v5';

const REVENUE_MONTH_KEYS = ['2026-01', '2026-02', '2026-03', '2026-04'];

const REVENUE_OTA_CHANNELS = ['ctrip', 'douyin', 'fliggy', 'meituan'];
const REVENUE_CHANNEL_LABELS = {
  ctrip: '携程',
  douyin: '抖音',
  fliggy: '飞猪',
  meituan: '美团',
  upgradeCoupon: '升级券',
  otherOffline: '线下其他',
  occupancy: '占房'
};
// 周报表格列顺序：4个OTA → OTA小计 → 升级券 → 线下其他 → 线下小计 → 占房
const REVENUE_WEEKLY_COLUMNS = ['ctrip', 'douyin', 'fliggy', 'meituan', 'otaSubtotal', 'upgradeCoupon', 'otherOffline', 'offlineSubtotal', 'occupancy'];

// —— 工具函数 ——
function getDaysInMonth(monthKey) {
  const safe = String(monthKey || '');
  if (!/^\d{4}-\d{2}$/.test(safe)) return 0;
  const [year, month] = safe.split('-').map(Number);
  return new Date(year, month, 0).getDate();
}

// 字符串 → 稳定 hash（用于伪随机种子）
function __revenueHash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i += 1) {
    h = ((h * 31) + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

// 由种子派生 0~1 的伪随机数
function __revenueRand(seed, salt) {
  return (__revenueHash(`${seed}|${salt}`) % 10000) / 10000;
}

// 把月份切成"自然周（周一~周日）"片段，跨月那个周片段只算本月内的天数
// 返回：[{ weekIndex, startDate, endDate, label, days }]
function getRevenueWeeksInMonth(monthKey) {
  if (!/^\d{4}-\d{2}$/.test(monthKey || '')) return [];
  const [year, month] = monthKey.split('-').map(Number);
  const monthStart = new Date(year, month - 1, 1);
  const monthEnd = new Date(year, month, 0);
  const result = [];
  let cursor = new Date(monthStart);
  let weekIdx = 1;
  const fmtDate = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const fmtLabel = (d) => `${d.getMonth() + 1}/${d.getDate()}`;
  while (cursor <= monthEnd) {
    // 本周末（周日）：getDay() 0=日 1~6=一~六；自然周为周一起，所以周日的偏移 = 7 - dow（dow=1~7）
    const dow = cursor.getDay() === 0 ? 7 : cursor.getDay();
    const daysToSunday = 7 - dow;
    const weekEnd = new Date(cursor);
    weekEnd.setDate(weekEnd.getDate() + daysToSunday);
    const segEnd = weekEnd <= monthEnd ? weekEnd : monthEnd;
    const days = Math.round((segEnd - cursor) / 86400000) + 1;
    result.push({
      weekIndex: weekIdx,
      startDate: fmtDate(cursor),
      endDate: fmtDate(segEnd),
      label: `W${weekIdx} ${fmtLabel(cursor)}-${fmtLabel(segEnd)}`,
      days
    });
    cursor = new Date(segEnd);
    cursor.setDate(cursor.getDate() + 1);
    weekIdx += 1;
  }
  return result;
}

const REVENUE_COOPERATION_ROOM_OPTIONS = [3, 5, 8, 10, 20];
function pickRevenueCooperationRoomsByHotelId(hotelId) {
  const idx = __revenueHash(`${hotelId}|revenueRooms`) % REVENUE_COOPERATION_ROOM_OPTIONS.length;
  return REVENUE_COOPERATION_ROOM_OPTIONS[idx];
}

function __splitTotal(total, weights, seedKey) {
  const safeTotal = Math.max(Math.round(Number(total) || 0), 0);
  const list = (weights || []).map((w) => Math.max(Number(w) || 0, 0));
  if (!list.length) return [];
  const sumWeight = list.reduce((s, w) => s + w, 0);
  if (!sumWeight || !safeTotal) return list.map(() => 0);
  const raws = list.map((w) => (w / sumWeight) * safeTotal);
  const base = raws.map((v) => Math.floor(v));
  let remain = safeTotal - base.reduce((s, x) => s + x, 0);
  if (remain > 0) {
    const order = raws
      .map((v, i) => ({ i, frac: v - Math.floor(v), tie: __revenueRand(seedKey, `split_${i}`) }))
      .sort((a, b) => {
        if (b.frac !== a.frac) return b.frac - a.frac;
        return b.tie - a.tie;
      });
    let cursor = 0;
    while (remain > 0) {
      const target = order[cursor % order.length].i;
      base[target] += 1;
      remain -= 1;
      cursor += 1;
    }
  }
  return base;
}

// 给单家酒店生成一份完整的"周维度记录"（覆盖 REVENUE_MONTH_KEYS 全部月份）
// 入住率（月）：控制在 15%~45%
function buildRevenueWeeklyForHotel(hotelId, cooperationRooms) {
  const rooms = Math.max(Number(cooperationRooms) || 10, 3);
  const all = [];
  REVENUE_MONTH_KEYS.forEach((monthKey) => {
    const monthDays = getDaysInMonth(monthKey);
    const monthCapacity = rooms * monthDays;
    const targetRate = 0.15 + __revenueRand(`${hotelId}|${monthKey}`, 'targetRate') * 0.30;
    const settledMonth = Math.max(Math.round(monthCapacity * targetRate), 0);
    const occupancyRate = 0.03 + __revenueRand(`${hotelId}|${monthKey}`, 'occupancyRate') * 0.08;
    const occupancyMonth = Math.max(Math.round(monthCapacity * occupancyRate), 0);

    const weeks = getRevenueWeeksInMonth(monthKey);
    const weekWeights = weeks.map((wk, idx) => wk.days * (0.9 + __revenueRand(`${hotelId}|${monthKey}`, `wkWeight_${idx}`) * 0.2));
    const settledByWeek = __splitTotal(settledMonth, weekWeights, `${hotelId}|${monthKey}|settled`);
    const occupancyByWeek = __splitTotal(occupancyMonth, weekWeights, `${hotelId}|${monthKey}|occupancy`);
    const unitPrice = 100 + Math.round(__revenueRand(`${hotelId}|${monthKey}`, 'price') * 40);

    weeks.forEach((wk, idx) => {
      const settledWeek = settledByWeek[idx] || 0;
      const upgradeRatio = 0.04 + __revenueRand(`${hotelId}|${monthKey}|w${wk.weekIndex}`, 'upgradeRatio') * 0.06;
      // 线下其他：1%~3%（小幅占比）
      const otherRatio = 0.01 + __revenueRand(`${hotelId}|${monthKey}|w${wk.weekIndex}`, 'otherRatio') * 0.02;
      const upgradeCoupon = Math.min(Math.max(Math.round(settledWeek * upgradeRatio), 0), settledWeek);
      const otherOffline = Math.min(Math.max(Math.round(settledWeek * otherRatio), 0), Math.max(settledWeek - upgradeCoupon, 0));
      const otaNights = Math.max(settledWeek - upgradeCoupon - otherOffline, 0);
      const channelWeights = [
        0.38 + __revenueRand(`${hotelId}|${monthKey}|w${wk.weekIndex}`, 'ctripW') * 0.20,
        0.16 + __revenueRand(`${hotelId}|${monthKey}|w${wk.weekIndex}`, 'douyinW') * 0.12,
        0.14 + __revenueRand(`${hotelId}|${monthKey}|w${wk.weekIndex}`, 'fliggyW') * 0.10,
        0.18 + __revenueRand(`${hotelId}|${monthKey}|w${wk.weekIndex}`, 'meituanW') * 0.14
      ];
      const [ctrip, douyin, fliggy, meituan] = __splitTotal(otaNights, channelWeights, `${hotelId}|${monthKey}|w${wk.weekIndex}|ota`);
      const occupancy = occupancyByWeek[idx] || 0;
      const settlementAmount = otaNights * unitPrice;
      all.push({
        id: `${hotelId}-${monthKey}-w${wk.weekIndex}`,
        hotelId: String(hotelId),
        monthKey,
        weekIndex: wk.weekIndex,
        weekStartDate: wk.startDate,
        weekEndDate: wk.endDate,
        weekLabel: wk.label,
        days: wk.days,
        nights: { ctrip, douyin, fliggy, meituan, upgradeCoupon, otherOffline, occupancy },
        settlementAmount
      });
    });
  });
  return all;
}

// 月度官方值：默认与周累加一致（后续可在 utils 侧二次处理）
function buildRevenueMonthlyForHotel(hotelId, weeklyRecords, cooperationRooms) {
  const byMonth = {};
  weeklyRecords.forEach((r) => {
    if (!byMonth[r.monthKey]) byMonth[r.monthKey] = { settledNights: 0, occupancy: 0, amount: 0 };
    const otaNights = r.nights.ctrip + r.nights.douyin + r.nights.fliggy + r.nights.meituan;
    const offlineNights = (Number(r.nights.upgradeCoupon) || 0) + (Number(r.nights.otherOffline) || 0);
    byMonth[r.monthKey].settledNights += otaNights + offlineNights;
    byMonth[r.monthKey].occupancy += r.nights.occupancy;
    byMonth[r.monthKey].amount += r.settlementAmount;
  });
  return REVENUE_MONTH_KEYS.map((monthKey) => {
    const agg = byMonth[monthKey] || { settledNights: 0, occupancy: 0, amount: 0 };
    // 合同月度约定占房数（先给基础值，最终由 utils 统一处理“仅3条超约定”）
    const monthDays = getDaysInMonth(monthKey);
    const rooms = Math.max(Number(cooperationRooms) || 10, 3);
    const contractRatio = 0.04 + __revenueRand(`${hotelId}|${monthKey}`, 'contractOccuRatio') * 0.05;
    const contractOccupancyLimit = Math.max(Math.round(rooms * monthDays * contractRatio), 0);
    return {
      id: `${hotelId}-${monthKey}`,
      hotelId: String(hotelId),
      monthKey,
      settledNights: Math.max(agg.settledNights, 0),
      occupancyNights: agg.occupancy,
      settlementAmount: Math.max(agg.amount, 0),
      contractOccupancyLimit
    };
  });
}
