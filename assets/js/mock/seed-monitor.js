// 种草监控模块 mock 数据 & 常量
// - 时间范围：2026-01-01 ~ 今天
// - 5 类矩阵号 × 4 个平台 × 多账号
// - 数据维度：天，aggregate 在 utils 侧按筛选时间范围 sum
// - 核心改造（v4）：每条 post 记录新增 hotelId，按酒店 × 平台维度统计
//     - 员工号：每个员工号强绑 1 家酒店（OTA_MOCK_HOTELS 前 8 家）
//     - 其他号：跨酒店通用号；每帖按 (账号|平台|日期|帖序) 稳定 hash 分配 hotelId
//                 前 15 家酒店权重高（核心运营），后续酒店权重低（更真实的长尾分布）
// - 核心改造（v5）：账号实体由「矩阵 × 平台」唯一确定
//     - 取消 account.platforms 数组，改为 account.platform 单值
//     - 例：原 1 个 KOC「体验官」跨 [小红书, 抖音] → 拆为 2 个独立账号
//           「体验官-红薯号 (xhs)」「体验官-抖音号 (douyin)」
//     - 员工号：每家绑酒店 × 该矩阵支持的平台数 个独立员工号
//     - accountId 形如 ${matrixId}_acc_${idx}_${platform}，保证全局唯一
// - 字段：
//     posts：每条 = 一个账号在某平台某天对某酒店的"发布汇总"
//            (accountId, matrixId, platform, hotelId, date, postCount, exposure, likes, comments, favorites, shares)
// - 关键词模块已移除（v4 改造）

const SEED_MONITOR_VERSION = '2026-04-22-v5';
const SEED_MONITOR_DATE_START = '2026-01-01';
// 核心运营酒店数：前 N 家承载主要发布量
const SEED_CORE_HOTEL_COUNT = 15;

// —— 5 类矩阵号 ——
const SEED_MATRIX_TYPES = [
  {
    id: 'kol',
    label: '达人号',
    aliasShort: 'KOL',
    aliasFull: '达人号 / KOL',
    freqWindow: 'quarter',
    freqWindowDays: 90,
    freqMin: 6,
    freqMax: 8,
    freqDesc: '季度 6~8 次',
    engagementThreshold: 0.03,
    scoreOverall: 4.20,
    scoreTruth: 5,
    scoreContent: 5,
    accountCount: 5,
    contentDirection: '沉浸式体验（全程体验vlog）/ 功能种草（XR科技体验、高科技遛娃）/ 亲子攻略（解放家长、NPC带娃）',
    accountCategory: '亲子类、酒店测评类、本地生活探店',
    policy: '筛选达人 + 内容brief',
    execFocus: '一定要保证质量'
  },
  {
    id: 'koc',
    label: 'KOC',
    aliasShort: 'KOC',
    aliasFull: 'KOC（0车马费）',
    freqWindow: 'month',
    freqWindowDays: 30,
    freqMin: 10,
    freqMax: 10,
    freqDesc: '月度 10 篇',
    engagementThreshold: 0.05,
    scoreOverall: 3.65,
    scoreTruth: 5,
    scoreContent: 3.5,
    accountCount: 6,
    contentDirection: '真实体验测评 / 功能种草（XR科技体验、高科技遛娃）/ 情绪种草（亲子高质量陪伴）/ 攻略干货（亲子游）',
    accountCategory: '真实亲子类、本地生活，无过度商业痕迹',
    policy: '招募体验官 / 试睡员',
    execFocus: '保证质量'
  },
  {
    id: 'marketing',
    label: '营销号',
    aliasShort: '官方',
    aliasFull: '营销号（自控）',
    freqWindow: 'day',
    freqWindowDays: 1,
    freqMin: 6,
    freqMax: 6,
    freqDesc: '日度 6 篇',
    engagementThreshold: 0.01,
    scoreOverall: 2.45,
    scoreTruth: 1.5,
    scoreContent: 2,
    accountCount: 4,
    contentDirection: '真实体验测评 / 情绪种草 / 攻略干货',
    accountCategory: '亲子类、本地生活',
    policy: '自注册账号',
    execFocus: '保证IP和频率'
  },
  {
    id: 'staff',
    label: '员工号',
    aliasShort: '员工',
    aliasFull: '员工号（前台）',
    freqWindow: 'week',
    freqWindowDays: 7,
    freqMin: 12,
    freqMax: 12,
    freqDesc: '周度 12 篇（周四五六）',
    engagementThreshold: 0.02,
    scoreOverall: 2.80,
    scoreTruth: 4,
    scoreContent: 2,
    accountCount: 8,
    contentDirection: '真实体验 / 情绪种草 / 二刷复购体验 / 攻略干货',
    accountCategory: '泛生活、亲子类',
    policy: '营销/前厅负责人沟通激励政策',
    execFocus: '保证真实性和频率'
  },
  {
    id: 'civilian',
    label: '素人号',
    aliasShort: '云剪',
    aliasFull: '素人号（云剪）',
    freqWindow: 'occasion',
    freqWindowDays: 30,
    freqMin: 50,
    freqMax: 50,
    freqDesc: '节点性 50/次（约 50/月）',
    engagementThreshold: 0.005,
    scoreOverall: 1.85,
    scoreTruth: 1.5,
    scoreContent: 2,
    accountCount: 10,
    contentDirection: '科技感混剪 / 真实体验快剪 / 攻略速览',
    accountCategory: '酒店、旅游、亲子',
    policy: '外包',
    execFocus: '节点性氛围烘托'
  }
];

// —— 4 个平台 ——
const SEED_PLATFORMS = [
  { id: 'xhs',     label: '小红书' },
  { id: 'douyin',  label: '抖音' },
  { id: 'xq',      label: '星球号' },
  { id: 'video',   label: '视频号' }
];

// —— 矩阵号 × 平台 关系（哪个矩阵号在哪些平台发布）——
const SEED_MATRIX_PLATFORM_MAP = {
  kol:       ['xhs', 'douyin', 'xq', 'video'],
  koc:       ['xhs', 'douyin'],
  marketing: ['xhs', 'douyin', 'xq', 'video'],
  staff:     ['xhs', 'douyin'],
  civilian:  ['douyin', 'video']
};

// —— 内容方向库（用于生成 mock 标题）——
const SEED_TITLE_PIECES = {
  kol: [
    '住进真实XR亲子房｜全家沉浸式体验',
    '解放家长神器！NPC带娃实测',
    '亲子游避雷｜奇趣庄园一日攻略',
    '把游乐园搬进酒店是种什么体验',
    '科技感拉满的亲子房｜全程vlog',
    '带娃出游救星：奇趣XR亲子房深度体验'
  ],
  koc: [
    '真·亲子房住宿体验｜没有滤镜',
    '奇趣XR亲子房值不值199？',
    '试睡员实拍｜亲子房真实使用反馈',
    '高质量亲子陪伴的一晚',
    '攻略｜亲子游就来奇趣庄园',
    '功能种草：XR遛娃神器拆解'
  ],
  marketing: [
    '【官方】奇趣亲子房限时特惠',
    '科技遛娃｜奇趣XR亲子房上线',
    '亲子陪伴最佳选择｜爱丽丝科技乐园房',
    '今日福利｜亲子房升级券',
    '奇趣庄园招募体验官'
  ],
  staff: [
    '前台亲测｜亲子房真实场景',
    '酒店人下班来住自家房',
    '今日入住小记｜亲子房',
    '同事带娃来玩｜真实回购体验',
    '复购第N次｜还是亲子房好住',
    '酒店日常｜亲子房客人反馈'
  ],
  civilian: [
    '奇趣XR｜30秒速看',
    '科技感混剪｜亲子房精彩瞬间',
    '攻略速递｜爱丽丝庄园',
    '亲子游必看｜30秒攻略',
    '酒店速览｜爱丽丝亲子房',
    '快剪｜带娃来这就对了'
  ]
};

// —— 工具函数 ——
function __seedHash(str) {
  let h = 0;
  const text = String(str || '');
  for (let i = 0; i < text.length; i += 1) h = ((h * 31) + text.charCodeAt(i)) | 0;
  return Math.abs(h);
}
function __seedRand(seed, salt) {
  return (__seedHash(`${seed}|${salt}`) % 10000) / 10000;
}
function __seedFmtDate(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function __seedParseDate(s) {
  const str = String(s || '');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(str)) return null;
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}
function __seedAddDays(d, n) {
  const next = new Date(d);
  next.setDate(next.getDate() + n);
  return next;
}
function getSeedDateEnd() {
  const today = new Date();
  return __seedFmtDate(today);
}

// —— 获取酒店列表（依赖 OTA_MOCK_HOTELS 已先加载）——
function __getSeedHotels() {
  return (typeof OTA_MOCK_HOTELS !== 'undefined' && Array.isArray(OTA_MOCK_HOTELS))
    ? OTA_MOCK_HOTELS : [];
}

// —— 平台短标识（用作账号昵称后缀）——
const SEED_PLATFORM_SUFFIX = {
  xhs:    '红薯号',
  douyin: '抖音号',
  xq:     '星球号',
  video:  '视频号'
};

// —— 生成账号列表（v5：账号 = 矩阵 × 平台 唯一实体）——
// 规则：
//   - 一个"逻辑账号实体"（如 KOC 体验官）会按其支持的平台拆为 N 个独立账号
//   - accountId 形如 ${matrixId}_acc_${idx}_${platform}，保证全局唯一
//   - 昵称在原基础名后追加平台短标识："体验官-红薯号"、"体验官-抖音号"
//   - 员工号：每家绑定酒店 × 该矩阵支持平台数 = 8 × 2 = 16 个独立员工号
function buildSeedAccounts() {
  const accounts = [];
  const hotels = __getSeedHotels();
  SEED_MATRIX_TYPES.forEach((m) => {
    const platforms = SEED_MATRIX_PLATFORM_MAP[m.id] || [];
    if (!platforms.length) return;
    for (let i = 0; i < m.accountCount; i += 1) {
      const idx = i + 1;
      // 该"逻辑账号"在哪些平台开通：与 v4 相同的稳定挑选规则，但每个平台拆成独立 account
      const subsetSeed = __seedRand(`${m.id}|${idx}|platforms`, 'sub');
      let bind;
      if (platforms.length <= 1) {
        bind = platforms.slice();
      } else if (subsetSeed < 0.45) {
        bind = platforms.slice(); // 全平台
      } else if (subsetSeed < 0.8) {
        bind = platforms.slice(0, 2);
      } else {
        const pickIdx = __seedHash(`${m.id}|${idx}|pick`) % platforms.length;
        bind = [platforms[pickIdx]];
      }
      // 员工号强绑酒店
      let boundHotelId = null;
      let boundHotelName = '';
      if (m.id === 'staff' && hotels.length) {
        const hotel = hotels[(idx - 1) % hotels.length];
        boundHotelId = hotel.id;
        boundHotelName = hotel.name;
      }
      const baseNick = __buildAccountBaseNickname(m, idx, boundHotelName);
      bind.forEach((platform) => {
        accounts.push({
          id: `${m.id}_acc_${String(idx).padStart(2, '0')}_${platform}`,
          matrixId: m.id,
          platform,
          nickname: __decorateNicknameWithPlatform(baseNick, platform),
          // 兼容字段：保留 platforms 数组形式（仅含自身），避免漏改其他历史调用点
          platforms: [platform],
          boundHotelId,
          baseAccountKey: `${m.id}_acc_${String(idx).padStart(2, '0')}` // 同一逻辑账号在多平台共享此 key
        });
      });
    }
  });
  return accounts;
}

function __buildAccountBaseNickname(m, idx, boundHotelName) {
  const prefix = {
    kol: ['亲子达人', '探店达人', '科技种草', 'XR体验官', '亲子探秘'],
    koc: ['真实测评', '宝妈实测', '奶爸日记', '试睡员', '体验官', '小K测评'],
    marketing: ['爱丽丝官方', '奇趣XR官方', '亲子房官方', '官方种草'],
    civilian: Array.from({ length: 10 }, (_, i) => `素人号${String(i + 1).padStart(2, '0')}`)
  };
  // 员工号：用绑定酒店简称 + 员工编号（更直观）
  if (m.id === 'staff') {
    const shortName = boundHotelName ? boundHotelName.replace(/酒店|大酒店|度假酒店$/, '').slice(0, 6) : '酒店';
    return `${shortName}前台${String(idx).padStart(2, '0')}`;
  }
  const list = prefix[m.id] || [];
  if (list[idx - 1]) return list[idx - 1];
  return `${m.aliasShort}${String(idx).padStart(2, '0')}`;
}

function __decorateNicknameWithPlatform(baseNick, platform) {
  const suffix = SEED_PLATFORM_SUFFIX[platform] || platform;
  return `${baseNick}-${suffix}`;
}

// —— 按权重为非员工号帖子分配酒店 ——
// 前 SEED_CORE_HOTEL_COUNT 家酒店权重为后续酒店的 4 倍（核心运营 vs 长尾）
// 入参：accId, platform, dateStr, postIdx — 同一组合稳定返回同一 hotelId
function __pickHotelForPost(hotels, accId, platform, dateStr, postIdx) {
  if (!hotels.length) return null;
  const r = __seedRand(`${accId}|${platform}|${dateStr}|${postIdx}`, 'hotel'); // 0~1
  const coreCount = Math.min(SEED_CORE_HOTEL_COUNT, hotels.length);
  const tailCount = hotels.length - coreCount;
  const coreWeight = coreCount * 4;
  const tailWeight = tailCount * 1;
  const totalWeight = coreWeight + tailWeight || 1;
  const cut = coreWeight / totalWeight; // 核心命中概率 ≈ 0.86 (15 核心 + 35 长尾时)
  if (r < cut) {
    const idx = Math.floor((r / cut) * coreCount) % Math.max(coreCount, 1);
    return hotels[idx].id;
  }
  if (tailCount <= 0) return hotels[0].id;
  const idx = coreCount + (Math.floor(((r - cut) / (1 - cut)) * tailCount) % tailCount);
  return hotels[idx].id;
}

// —— 生成发布日记录 ——
// 按矩阵号确定性调度（保留 v3 调度逻辑），新增 hotelId 维度
// - 员工号：使用 account.boundHotelId（强绑酒店）
// - 其他矩阵号：按权重分配酒店（核心 15 家高权重，长尾 35 家低权重）
// 一条记录 = (账号|平台|日期|hotelId) 的发布汇总；如同账号同日同平台对多家酒店发帖，会拆为多条
function buildSeedPostDaily(accounts) {
  const startBase = __seedParseDate(SEED_MONITOR_DATE_START);
  const todayStr = getSeedDateEnd();
  const todayDate = __seedParseDate(todayStr);
  const hotels = __getSeedHotels();
  const records = [];

  SEED_MATRIX_TYPES.forEach((m) => {
    const matrixAccounts = accounts.filter((a) => a.matrixId === m.id);
    if (!matrixAccounts.length) return;

    const dailyTarget = m.freqMin / Math.max(m.freqWindowDays, 1);

    function postsForDay(d) {
      if (dailyTarget >= 1) {
        return Math.ceil(dailyTarget * 1.15);
      }
      const gap = Math.max(1, Math.floor((1 / dailyTarget) * 0.85));
      const diff = Math.round((todayDate - d) / 86400000);
      return diff >= 0 && diff % gap === 0 ? 1 : 0;
    }

    // v5：account 已是「矩阵×平台」唯一实体，cell 与 account 一一对应
    const cells = matrixAccounts.map((acc) => ({
      accId: acc.id, acc, platform: acc.platform
    }));
    if (!cells.length) return;

    let cursor = new Date(startBase);
    while (__seedFmtDate(cursor) <= todayStr) {
      const dateStr = __seedFmtDate(cursor);
      const totalPosts = postsForDay(cursor);
      if (totalPosts > 0) {
        // key = accId|platform|hotelId → postCount 累加
        const aggr = new Map();
        const startIdx = __seedHash(`${m.id}|${dateStr}|start`) % cells.length;
        for (let i = 0; i < totalPosts; i += 1) {
          const cellIdx = (startIdx + i) % cells.length;
          const c = cells[cellIdx];
          let hotelId;
          if (m.id === 'staff') {
            hotelId = c.acc.boundHotelId || (hotels[0] && hotels[0].id);
          } else {
            hotelId = __pickHotelForPost(hotels, c.accId, c.platform, dateStr, i);
          }
          if (!hotelId) continue;
          const k = `${c.accId}|${c.platform}|${hotelId}`;
          aggr.set(k, (aggr.get(k) || 0) + 1);
        }
        aggr.forEach((postCount, k) => {
          const [accId, platform, hotelIdStr] = k.split('|');
          const hotelId = Number(hotelIdStr);
          const exposureBase = ({
            kol: 8000, koc: 3000, marketing: 2000, staff: 1500, civilian: 800
          })[m.id] || 1000;
          const expSalt = `${accId}|${platform}|${dateStr}|${hotelId}`;
          const exposureRand = 0.6 + __seedRand(expSalt, 'exp') * 1.2;
          const exposurePerPost = Math.max(50, Math.round(exposureBase * exposureRand));
          const exposure = exposurePerPost * postCount;

          const passRand = __seedRand(expSalt, 'pass');
          const targetRate = m.engagementThreshold;
          const ratio = passRand < 0.55
            ? targetRate * (1 + __seedRand(expSalt, 'rateUp') * 1.5)
            : targetRate * (0.3 + __seedRand(expSalt, 'rateDn') * 0.6);
          const interactTotal = Math.round(exposure * ratio);
          const likes = Math.round(interactTotal * 0.60);
          const comments = Math.round(interactTotal * 0.15);
          const favorites = Math.round(interactTotal * 0.15);
          const shares = Math.max(0, interactTotal - likes - comments - favorites);

          records.push({
            accountId: accId,
            matrixId: m.id,
            platform,
            hotelId,
            date: dateStr,
            postCount,
            exposure,
            likes,
            comments,
            favorites,
            shares
          });
        });
      }
      cursor = __seedAddDays(cursor, 1);
    }
  });
  return records;
}

// —— 简单稳定的"标题生成器"：用于详情页发布列表 ——
function buildSeedPostTitle(matrixId, accountId, dateStr, idx) {
  const pool = SEED_TITLE_PIECES[matrixId] || ['亲子房体验记录'];
  const seed = __seedHash(`${accountId}|${dateStr}|${idx}|title`);
  return pool[seed % pool.length];
}
