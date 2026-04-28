// 线下运营模块 mock 数据 & 常量
// - 时间范围：2026-01-01 ~ 今天
// - 三大模块：升级券（酒店×券）/ 好评（酒店×渠道）/ 全员营销（活动）
// - 数据维度：天，aggregate 在 utils 侧按筛选时间范围 sum
// - 字段含义：
//     coupons：每条 = 一个升级券 SKU 在某酒店某天的售卖数（>=0）
//     reviews：每条 = 一家酒店某渠道某天的好评数
//     activities：活动主档（含起止/参与酒店）；activityDaily：每条 = 一个活动某天的 qr/scan/download

const OFFLINE_MOCK_VERSION = '2026-04-22-v5';

const OFFLINE_DATE_START = '2026-01-01';

const OFFLINE_REVIEW_CHANNELS = ['ctrip', 'meituan', 'douyin', 'fliggy'];
const OFFLINE_REVIEW_CHANNEL_LABELS = {
  ctrip: '携程',
  meituan: '美团',
  douyin: '抖音',
  fliggy: '飞猪'
};

// 8 个升级券 SKU
const OFFLINE_COUPON_SKUS = [
  { id: 'cpn_01', title: '亲子房春季焕新升级活动', price: 99 },
  { id: 'cpn_02', title: '亲子房踏青周末升级活动', price: 128 },
  { id: 'cpn_03', title: '亲子房五一假期升级活动', price: 299 },
  { id: 'cpn_04', title: '亲子房端午亲子升级活动', price: 168 },
  { id: 'cpn_05', title: '亲子房暑期欢乐升级活动', price: 199 },
  { id: 'cpn_06', title: '亲子房中秋团圆升级活动', price: 158 },
  { id: 'cpn_07', title: '亲子房国庆畅玩升级活动', price: 388 },
  { id: 'cpn_08', title: '亲子房冬日暖心升级活动', price: 88 }
];

// 5 个全员营销活动
const OFFLINE_ACTIVITY_TEMPLATES = [
  { id: 'act_01', title: '元旦亲子房大促', startOffset: 0, endOffset: 35 },              // 2026-01-01 ~ 2026-02-05
  { id: 'act_02', title: '元宵亲子房福礼季', startOffset: 30, endOffset: 50 },            // 2026-01-31 ~ 2026-02-20
  { id: 'act_03', title: '春游亲子房焕新季', startOffset: 60, endOffset: 90 },            // 2026-03-02 ~ 2026-04-01
  { id: 'act_04', title: '清明亲子房出游节', startOffset: 80, endOffset: 100 },           // 2026-03-22 ~ 2026-04-11
  { id: 'act_05', title: '五一亲子房大促', startOffset: 100, endOffset: 130 }             // 2026-04-11 ~ 持续中
];

// —— 工具函数 ——
function __offlineHash(str) {
  let h = 0;
  const text = String(str || '');
  for (let i = 0; i < text.length; i += 1) h = ((h * 31) + text.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function __offlineRand(seed, salt) {
  return (__offlineHash(`${seed}|${salt}`) % 10000) / 10000;
}

function __offlineFmtDate(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function __offlineParseDate(s) {
  const str = String(s || '');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(str)) return null;
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function __offlineAddDays(d, n) {
  const next = new Date(d);
  next.setDate(next.getDate() + n);
  return next;
}

// 取本轮 mock 数据的截止日（默认今天，2026-04-22 之后会随系统时间增长）
function getOfflineDateEnd() {
  const today = new Date();
  return __offlineFmtDate(today);
}

// 升级券-酒店绑定关系（每个 SKU 绑定 6~10 家酒店）
function getOfflineCouponHotelBindings(hotels) {
  const result = [];
  OFFLINE_COUPON_SKUS.forEach((sku) => {
    const sorted = (hotels || []).slice().sort((a, b) => {
      return __offlineHash(`${sku.id}|${a.id}`) - __offlineHash(`${sku.id}|${b.id}`);
    });
    const bindCount = 6 + (__offlineHash(`${sku.id}|bindCount`) % 5); // 6~10
    sorted.slice(0, bindCount).forEach((h) => {
      result.push({ couponId: sku.id, hotelId: String(h.id) });
    });
  });
  return result;
}

// 营销活动：参与酒店（每个活动 8~16 家）
function buildOfflineActivities(hotels) {
  const startBase = __offlineParseDate(OFFLINE_DATE_START);
  const todayStr = getOfflineDateEnd();
  return OFFLINE_ACTIVITY_TEMPLATES.map((tpl) => {
    const startDate = __offlineFmtDate(__offlineAddDays(startBase, tpl.startOffset));
    const endDate = __offlineFmtDate(__offlineAddDays(startBase, tpl.endOffset));
    const status = endDate < todayStr ? 'ended' : 'ongoing';
    const sorted = (hotels || []).slice().sort((a, b) => {
      return __offlineHash(`${tpl.id}|${a.id}`) - __offlineHash(`${tpl.id}|${b.id}`);
    });
    const partCount = 5 + (__offlineHash(`${tpl.id}|partCount`) % 4); // 5~8（首屏可放下）
    const participatingHotelIds = sorted.slice(0, partCount).map((h) => String(h.id));
    return {
      id: tpl.id,
      title: tpl.title,
      startDate,
      endDate,
      status,
      participatingHotelIds
    };
  });
}

// 升级券日记录：
// - 每天约 8 家酒店有销量（6~10 家波动）
// - 同一日、同一家酒店仅 1 个 SKU 有销量（其余 SKU 当日视为 0）
// - 单家单日销量 1~3 张
function buildOfflineCouponDaily(hotels) {
  const bindings = getOfflineCouponHotelBindings(hotels);
  const startBase = __offlineParseDate(OFFLINE_DATE_START);
  const todayStr = getOfflineDateEnd();
  const records = [];
  const hotelSkuMap = new Map();
  bindings.forEach(({ couponId, hotelId }) => {
    const key = String(hotelId);
    if (!hotelSkuMap.has(key)) hotelSkuMap.set(key, []);
    hotelSkuMap.get(key).push(couponId);
  });
  const hotelIdsWithBindings = Array.from(hotelSkuMap.keys());
  let cursor = new Date(startBase);
  while (__offlineFmtDate(cursor) <= todayStr) {
    const dateStr = __offlineFmtDate(cursor);
    // 当日候选酒店按稳定哈希排序，取前 N 家
    const ranked = hotelIdsWithBindings.slice().sort((a, b) => {
      return __offlineHash(`${dateStr}|${a}|coupon`) - __offlineHash(`${dateStr}|${b}|coupon`);
    });
    const baseCount = 6 + (__offlineHash(`${dateStr}|couponHotelCount`) % 5); // 6~10
    const targetCount = Math.min(baseCount, ranked.length);
    const activeHotelIds = ranked.slice(0, targetCount);
    activeHotelIds.forEach((hotelId) => {
      const sortedCouponIds = (hotelSkuMap.get(hotelId) || []).slice().sort();
      if (!sortedCouponIds.length) return;
      const idx = __offlineHash(`${hotelId}|${dateStr}|pickSku`) % sortedCouponIds.length;
      const couponId = sortedCouponIds[idx];
      const r2 = __offlineRand(`${couponId}|${hotelId}|${dateStr}`, 'qty');
      let count = 1;
      if (r2 < 0.68) count = 1;
      else if (r2 < 0.9) count = 2;
      else count = 3;
      records.push({ couponId, hotelId, date: dateStr, count });
    });
    cursor = __offlineAddDays(cursor, 1);
  }
  return records;
}

// 好评日记录：
// - 每天仅约 10 家酒店有好评（8~12 波动）
// - 命中酒店在 4 渠道上生成好评；未命中酒店当日为 0
function buildOfflineReviewDaily(hotels) {
  const startBase = __offlineParseDate(OFFLINE_DATE_START);
  const todayStr = getOfflineDateEnd();
  const records = [];
  let cursor = new Date(startBase);
  while (__offlineFmtDate(cursor) <= todayStr) {
    const dateStr = __offlineFmtDate(cursor);
    const launchedHotels = (hotels || []).filter((h) => {
      const launch = String(h.launchDate || '');
      return !launch || launch <= dateStr;
    });
    const ranked = launchedHotels.slice().sort((a, b) => {
      return __offlineHash(`${dateStr}|${a.id}|review`) - __offlineHash(`${dateStr}|${b.id}|review`);
    });
    const baseCount = 8 + (__offlineHash(`${dateStr}|reviewHotelCount`) % 5); // 8~12
    const targetCount = Math.min(baseCount, ranked.length);
    const activeHotels = ranked.slice(0, targetCount);
    activeHotels.forEach((h) => {
      OFFLINE_REVIEW_CHANNELS.forEach((channel) => {
        const r = __offlineRand(`${h.id}|${channel}|${dateStr}`, 'rev');
        // 命中酒店下，大约 65% 的渠道有好评
        let count = 0;
        if (r < 0.65) {
          const r2 = __offlineRand(`${h.id}|${channel}|${dateStr}`, 'revQty');
          // 渠道权重：携程/美团多，抖音/飞猪少
          const weight = channel === 'ctrip' ? 1.4
            : channel === 'meituan' ? 1.2
            : channel === 'fliggy' ? 0.7
            : 0.9;
          count = Math.max(Math.round((1 + r2 * 4) * weight), 1);
        }
        if (count > 0) records.push({ hotelId: String(h.id), channel, date: dateStr, count });
      });
    });
    cursor = __offlineAddDays(cursor, 1);
  }
  return records;
}

// 活动-酒店-日记录：仅在活动起止区间内、参与酒店、不超过今天
// 字段：{ activityId, hotelId, date, qrGenerated, scanCount, orderCount }
//   - 注：原 v1 字段名 downloadCount 改为 orderCount，与"下单量"语义一致
function buildOfflineActivityDaily(activities) {
  const todayStr = getOfflineDateEnd();
  const records = [];
  (activities || []).forEach((act) => {
    const start = __offlineParseDate(act.startDate);
    const end = __offlineParseDate(act.endDate);
    if (!start || !end) return;
    const hotelIds = act.participatingHotelIds || [];
    if (!hotelIds.length) return;
    let cursor = new Date(start);
    while (__offlineFmtDate(cursor) <= act.endDate && __offlineFmtDate(cursor) <= todayStr) {
      const dateStr = __offlineFmtDate(cursor);
      hotelIds.forEach((hotelId) => {
        // 单酒店当日二维码生成量：5~25
        const qrSeed = __offlineRand(`${act.id}|${hotelId}|${dateStr}`, 'qr');
        const qrGen = Math.round(5 + qrSeed * 20);
        // 扫码量 = qrGen × (1.5~3.5)
        const scanRatio = 1.5 + __offlineRand(`${act.id}|${hotelId}|${dateStr}`, 'scanR') * 2;
        const scanCount = Math.round(qrGen * scanRatio);
        // 下单量 = 扫码量 × (8%~22%)
        const orderRatio = 0.08 + __offlineRand(`${act.id}|${hotelId}|${dateStr}`, 'orderR') * 0.14;
        const orderCount = Math.round(scanCount * orderRatio);
        // 部分酒店当日活动可能为 0（没有任何推广）
        const noActivityRand = __offlineRand(`${act.id}|${hotelId}|${dateStr}`, 'noAct');
        if (noActivityRand < 0.15) {
          return; // 跳过该日该酒店
        }
        records.push({
          activityId: act.id,
          hotelId: String(hotelId),
          date: dateStr,
          qrGenerated: qrGen,
          scanCount,
          orderCount
        });
      });
      cursor = __offlineAddDays(cursor, 1);
    }
  });
  return records;
}
