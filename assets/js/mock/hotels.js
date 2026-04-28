// 酒店Mock数据 v4 - 12 条，覆盖各阶段不同状态，时间跨度 6 个月
const CITY_TIER_MAP = {
  '北京': '一线', '上海': '一线', '广州': '一线', '深圳': '一线',
  '成都': '新一线', '杭州': '新一线', '重庆': '新一线', '武汉': '新一线',
  '苏州': '新一线', '西安': '新一线', '南京': '新一线', '东莞': '新一线',
  '长沙': '新一线', '沈阳': '新一线', '青岛': '新一线', '合肥': '新一线',
  '佛山': '新一线', '宁波': '新一线', '昆明': '新一线', '郑州': '新一线',
  '大连': '二线', '厦门': '二线', '济南': '二线', '哈尔滨': '二线',
  '福州': '二线', '无锡': '二线', '温州': '二线', '石家庄': '二线',
  '南宁': '二线', '贵阳': '二线', '南昌': '二线', '珠海': '二线',
  '三亚': '三线', '丽江': '三线', '桂林': '三线', '黄山': '三线',
  '张家界': '三线', '九寨沟': '四线'
};

const MOCK_HOTELS = [

  // ── id:1 ── 三亚亚特兰蒂斯 │ 谈判进行中
  {
    id: 1,
    name: '三亚亚特兰蒂斯酒店',
    address: '海南省三亚市海棠区海棠北路',
    cityTier: '三线',
    owner: '复星旅文',
    brand: 'Atlantis',
    totalRooms: 1314,
    kidsRooms: 20,
    ctripLink: 'https://hotels.ctrip.com/hotels/1',
    peakPrice: 2800,
    offPrice: 1500,
    scenicSpots: '海棠湾、蜈支洲岛、亚龙湾热带天堂森林公园',
    contacts: [
      { name: '张经理', position: '客房总监', phone: '138****1234', email: 'zhang@example.com' },
      { name: '李总', position: '总经理', phone: '139****5678', email: 'li@example.com' }
    ],
    signedAt: null,
    stageData: {
      visit: {
        records: [{ date: '2025-12-18', caseName: '长隆熊猫酒店亲子房', visitors: '张经理、王总', summary: '对IP主题房非常感兴趣，认可理念' }],
        hasVisit: true
      },
      screening: {
        scores: { locationMatch: 8, trafficHealth: 7, hotelTierMatch: 9, hasDecisionMaker: 13, isRealContact: 12, interestLevel: 18, pushWillingness: 8, guaranteeWillingness: 7 },
        totalScore: 82, result: 'qualified', completed: true
      },
      pitch: {
        sessions: [
          { date: '2026-01-15', type: '线下会议', hotelParticipants: [{ name: '张经理', position: '客房总监' }, { name: '李总', position: '总经理' }], minutes: '初步介绍产品，酒店方对IP定制主题房表示浓厚兴趣', minutesLink: '' },
          { date: '2026-02-08', type: '线上会议', hotelParticipants: [{ name: '李总', position: '总经理' }], minutes: '深入讨论合作模式，酒店方倾向旺季保底方案', minutesLink: 'https://docs.example.com/atlantis-pitch2' }
        ],
        completed: true
      },
      negotiate: {
        rounds: [
          { date: '2026-03-05', hotelParticipants: '李总、张经理', ourParticipants: '王总监、陈经理', terms: { mode: '旺季保底', peakGuarantee: '50万', rooms: 20, period: '3年', peakShare: '15%', offShare: '10%' }, description: '首轮谈判，双方在保底额度上有分歧，酒店方希望60万', minutesLink: '' }
        ],
        completed: false
      },
      contract: { version: '', reviewStatus: '', ourSignDate: '', hotelSignDate: '', finalTerms: { mode: '' }, completed: false }
    },
    createdAt: '2025-12-10',
    updatedAt: '2026-03-05'
  },

  // ── id:2 ── 杭州西溪湿地洲际 │ 产品讲解进行中
  {
    id: 2,
    name: '杭州西溪湿地洲际酒店',
    address: '浙江省杭州市西湖区紫金港路',
    cityTier: '新一线',
    owner: '绿城集团',
    brand: 'IHG洲际',
    totalRooms: 386,
    kidsRooms: 12,
    ctripLink: 'https://hotels.ctrip.com/hotels/2',
    peakPrice: 1600,
    offPrice: 900,
    scenicSpots: '西溪湿地、西湖、灵隐寺',
    contacts: [
      { name: '刘总', position: '运营总监', phone: '137****9012', email: 'liu@example.com' }
    ],
    signedAt: null,
    stageData: {
      visit: { records: [], hasVisit: false },
      screening: {
        scores: { locationMatch: 7, trafficHealth: 8, hotelTierMatch: 8, hasDecisionMaker: 10, isRealContact: 14, interestLevel: 15, pushWillingness: 7, guaranteeWillingness: 5 },
        totalScore: 74, result: 'qualified', completed: true
      },
      pitch: {
        sessions: [
          { date: '2026-02-20', type: '线下会议', hotelParticipants: [{ name: '刘总', position: '运营总监' }], minutes: '实地参观现有客房，讨论亲子房改造可行性，刘总初步认可方案', minutesLink: '' }
        ],
        completed: false
      },
      negotiate: { rounds: [], completed: false },
      contract: { version: '', reviewStatus: '', ourSignDate: '', hotelSignDate: '', finalTerms: { mode: '' }, completed: false }
    },
    createdAt: '2026-01-20',
    updatedAt: '2026-02-20'
  },

  // ── id:3 ── 成都环球中心天堂洲际 │ 仅建档（参观过案例）
  {
    id: 3,
    name: '成都环球中心天堂洲际酒店',
    address: '四川省成都市高新区天府大道北段',
    cityTier: '新一线',
    owner: '世纪城集团',
    brand: 'IHG洲际',
    totalRooms: 500,
    kidsRooms: 0,
    ctripLink: 'https://hotels.ctrip.com/hotels/3',
    peakPrice: 1200,
    offPrice: 680,
    scenicSpots: '环球中心水乐园、锦里、宽窄巷子',
    contacts: [
      { name: '赵经理', position: '市场部经理', phone: '136****3456', email: 'zhao@example.com' }
    ],
    signedAt: null,
    stageData: {
      visit: {
        records: [{ date: '2026-03-01', caseName: '长隆熊猫酒店亲子房', visitors: '赵经理', summary: '初步接触，对亲子房改造有兴趣但亲子房数为0，需改造规划' }],
        hasVisit: true
      },
      screening: { scores: {}, totalScore: 0, result: '', completed: false },
      pitch: { sessions: [], completed: false },
      negotiate: { rounds: [], completed: false },
      contract: { version: '', reviewStatus: '', ourSignDate: '', hotelSignDate: '', finalTerms: { mode: '' }, completed: false }
    },
    createdAt: '2026-02-28',
    updatedAt: '2026-03-01'
  },

  // ── id:4 ── 上海外滩华尔道夫 │ 已签约 ✓
  {
    id: 4,
    name: '上海外滩华尔道夫酒店',
    address: '上海市黄浦区中山东一路2号',
    cityTier: '一线',
    owner: '锦江集团',
    brand: 'Waldorf Astoria',
    totalRooms: 260,
    kidsRooms: 8,
    ctripLink: 'https://hotels.ctrip.com/hotels/4',
    peakPrice: 3500,
    offPrice: 2200,
    scenicSpots: '外滩、豫园、南京路步行街',
    contacts: [
      { name: '孙总', position: '酒店总经理', phone: '135****7890', email: 'sun@example.com' },
      { name: '周经理', position: '客房部经理', phone: '186****2345', email: 'zhou@example.com' }
    ],
    signedAt: '2026-03-15',
    stageData: {
      visit: {
        records: [{ date: '2025-11-15', caseName: '北京王府半岛亲子房', visitors: '孙总、周经理', summary: '非常认可高端亲子房定位，认为与酒店品调高度契合' }],
        hasVisit: true
      },
      screening: {
        scores: { locationMatch: 10, trafficHealth: 9, hotelTierMatch: 10, hasDecisionMaker: 15, isRealContact: 15, interestLevel: 19, pushWillingness: 9, guaranteeWillingness: 8 },
        totalScore: 95, result: 'qualified', completed: true
      },
      pitch: {
        sessions: [
          { date: '2025-12-10', type: '线下会议', hotelParticipants: [{ name: '孙总', position: '总经理' }, { name: '周经理', position: '客房部经理' }], minutes: '双方达成初步合作共识，计划春节后推进合同', minutesLink: 'https://docs.example.com/waldorf-pitch1' }
        ],
        completed: true
      },
      negotiate: {
        rounds: [
          { date: '2026-02-05', hotelParticipants: '孙总', ourParticipants: '张总、李经理', terms: { mode: '全年保底', yearGuarantee: '80万', rooms: 8, period: '5年', peakShare: '20%', offShare: '15%' }, description: '首轮谈判确定全年保底模式，酒店方对额度有异议', minutesLink: '' },
          { date: '2026-02-25', hotelParticipants: '孙总、周经理', ourParticipants: '张总', terms: { mode: '全年保底', yearGuarantee: '75万', rooms: 8, period: '5年', peakShare: '20%', offShare: '15%' }, description: '调整保底额度至75万，双方达成一致', minutesLink: '' }
        ],
        completed: true
      },
      contract: {
        version: 'V2.0', reviewStatus: 'approved', ourSignDate: '2026-03-10', hotelSignDate: '2026-03-15',
        finalTerms: { mode: '全年保底', yearGuarantee: '75万', rooms: 8, period: '5年', peakShare: '20%', offShare: '15%' },
        completed: true
      }
    },
    createdAt: '2025-11-10',
    updatedAt: '2026-03-15'
  },

  // ── id:5 ── 广州长隆熊猫 │ 产品讲解进行中
  {
    id: 5,
    name: '广州长隆熊猫酒店',
    address: '广东省广州市番禺区长隆旅游度假区',
    cityTier: '一线',
    owner: '长隆集团',
    brand: '长隆',
    totalRooms: 1500,
    kidsRooms: 30,
    ctripLink: 'https://hotels.ctrip.com/hotels/5',
    peakPrice: 1800,
    offPrice: 800,
    scenicSpots: '长隆野生动物世界、长隆欢乐世界、长隆水上乐园',
    contacts: [
      { name: '吴经理', position: '业务拓展经理', phone: '133****6789', email: 'wu@example.com' }
    ],
    signedAt: null,
    stageData: {
      visit: {
        records: [{ date: '2026-01-25', caseName: '三亚亚特兰蒂斯亲子房', visitors: '吴经理', summary: '对水族馆主题亲子房印象深刻，认为可参考到熊猫IP' }],
        hasVisit: true
      },
      screening: {
        scores: { locationMatch: 9, trafficHealth: 10, hotelTierMatch: 8, hasDecisionMaker: 10, isRealContact: 13, interestLevel: 16, pushWillingness: 8, guaranteeWillingness: 6 },
        totalScore: 80, result: 'qualified', completed: true
      },
      pitch: {
        sessions: [
          { date: '2026-03-05', type: '线下会议', hotelParticipants: [{ name: '吴经理', position: '业务拓展经理' }], minutes: '实地考察了5间样板房，讨论熊猫动物主题亲子房概念，酒店方反应积极', minutesLink: '' }
        ],
        completed: false
      },
      negotiate: { rounds: [], completed: false },
      contract: { version: '', reviewStatus: '', ourSignDate: '', hotelSignDate: '', finalTerms: { mode: '' }, completed: false }
    },
    createdAt: '2026-01-15',
    updatedAt: '2026-03-05'
  },

  // ── id:6 ── 武汉光谷凯悦 │ 合同推进中
  {
    id: 6,
    name: '武汉光谷凯悦酒店',
    address: '湖北省武汉市东湖高新区高新大道',
    cityTier: '新一线',
    owner: '光谷联合集团',
    brand: 'Hyatt',
    totalRooms: 350,
    kidsRooms: 15,
    ctripLink: 'https://hotels.ctrip.com/hotels/6',
    peakPrice: 1100,
    offPrice: 650,
    scenicSpots: '光谷步行街、东湖绿道、武汉大学',
    contacts: [
      { name: '陈总监', position: '市场总监', phone: '132****4567', email: 'chen@example.com' },
      { name: '何经理', position: '客房经理', phone: '177****8901', email: 'he@example.com' }
    ],
    signedAt: null,
    stageData: {
      visit: { records: [], hasVisit: false },
      screening: {
        scores: { locationMatch: 6, trafficHealth: 7, hotelTierMatch: 7, hasDecisionMaker: 12, isRealContact: 11, interestLevel: 14, pushWillingness: 7, guaranteeWillingness: 3 },
        totalScore: 67, result: 'nurture', completed: true
      },
      pitch: {
        sessions: [
          { date: '2026-01-20', type: '线下会议', hotelParticipants: [{ name: '陈总监', position: '市场总监' }], minutes: '初次拜访，介绍奇趣庄园品牌及合作案例，陈总监表示需要内部评估', minutesLink: '' },
          { date: '2026-02-15', type: '线上会议', hotelParticipants: [{ name: '陈总监', position: '市场总监' }, { name: '何经理', position: '客房经理' }], minutes: '二次沟通，酒店内部已通过评估，同意推进合作模式谈判', minutesLink: 'https://docs.example.com/hyatt-pitch2' }
        ],
        completed: true
      },
      negotiate: {
        rounds: [
          { date: '2026-02-25', hotelParticipants: '陈总监', ourParticipants: '王总监', terms: { mode: '旺季保底', peakGuarantee: '30万', rooms: 15, period: '3年', peakShare: '18%', offShare: '12%' }, description: '首轮明确旺季保底方向，额度待进一步商议', minutesLink: '' },
          { date: '2026-03-10', hotelParticipants: '陈总监、何经理', ourParticipants: '王总监、张经理', terms: { mode: '旺季保底', peakGuarantee: '28万', rooms: 15, period: '3年', peakShare: '18%', offShare: '12%' }, description: '最终达成28万保底共识，安排法务出合同', minutesLink: '' }
        ],
        completed: true
      },
      contract: {
        version: 'V1.0', reviewStatus: 'reviewing', ourSignDate: '', hotelSignDate: '',
        finalTerms: { mode: '旺季保底', peakGuarantee: '28万', rooms: 15, period: '3年', peakShare: '18%', offShare: '12%' },
        completed: false
      }
    },
    createdAt: '2025-12-20',
    updatedAt: '2026-03-12'
  },

  // ── id:7 ── 南京涵碧楼 │ 已签约 ✓
  {
    id: 7,
    name: '南京涵碧楼酒店',
    address: '江苏省南京市玄武区北京东路',
    cityTier: '新一线',
    owner: '涵碧楼集团',
    brand: '涵碧楼',
    totalRooms: 180,
    kidsRooms: 6,
    ctripLink: 'https://hotels.ctrip.com/hotels/7',
    peakPrice: 2200,
    offPrice: 1400,
    scenicSpots: '玄武湖、中山陵、夫子庙',
    contacts: [
      { name: '林总', position: '总经理', phone: '189****2233', email: 'lin@example.com' }
    ],
    signedAt: '2026-02-28',
    stageData: {
      visit: {
        records: [{ date: '2025-11-20', caseName: '上海外滩华尔道夫亲子房', visitors: '林总', summary: '高端定位完全契合涵碧楼品牌调性，林总非常满意' }],
        hasVisit: true
      },
      screening: {
        scores: { locationMatch: 9, trafficHealth: 8, hotelTierMatch: 10, hasDecisionMaker: 15, isRealContact: 15, interestLevel: 20, pushWillingness: 10, guaranteeWillingness: 4 },
        totalScore: 91, result: 'qualified', completed: true
      },
      pitch: {
        sessions: [
          { date: '2025-12-05', type: '线下会议', hotelParticipants: [{ name: '林总', position: '总经理' }], minutes: '林总拍板，明确全年保底合作模式，推进极快', minutesLink: '' }
        ],
        completed: true
      },
      negotiate: {
        rounds: [
          { date: '2026-01-08', hotelParticipants: '林总', ourParticipants: '张总', terms: { mode: '全年保底', yearGuarantee: '55万', rooms: 6, period: '5年', peakShare: '22%', offShare: '16%' }, description: '一轮即达成共识，林总决策效率极高', minutesLink: '' }
        ],
        completed: true
      },
      contract: {
        version: 'V1.0', reviewStatus: 'approved', ourSignDate: '2026-02-20', hotelSignDate: '2026-02-28',
        finalTerms: { mode: '全年保底', yearGuarantee: '55万', rooms: 6, period: '5年', peakShare: '22%', offShare: '16%' },
        completed: true
      }
    },
    createdAt: '2025-11-15',
    updatedAt: '2026-02-28'
  },

  // ── id:8 ── 苏州太湖君悦 │ 意向筛选进行中（有评分未完成）
  {
    id: 8,
    name: '苏州太湖君悦酒店',
    address: '江苏省苏州市吴中区太湖大道',
    cityTier: '新一线',
    owner: '太湖度假区管委会',
    brand: 'Grand Hyatt',
    totalRooms: 420,
    kidsRooms: 18,
    ctripLink: 'https://hotels.ctrip.com/hotels/8',
    peakPrice: 1400,
    offPrice: 780,
    scenicSpots: '太湖风景区、灵山大佛、木渎古镇',
    contacts: [
      { name: '方经理', position: '运营总监', phone: '135****6655', email: 'fang@example.com' }
    ],
    signedAt: null,
    stageData: {
      visit: { records: [], hasVisit: false },
      screening: {
        scores: { locationMatch: 5, trafficHealth: 6, hotelTierMatch: 7, hasDecisionMaker: 8, isRealContact: 8, interestLevel: 10, pushWillingness: 5, guaranteeWillingness: 3 },
        totalScore: 52, result: 'nurture', completed: false
      },
      pitch: { sessions: [], completed: false },
      negotiate: { rounds: [], completed: false },
      contract: { version: '', reviewStatus: '', ourSignDate: '', hotelSignDate: '', finalTerms: { mode: '' }, completed: false }
    },
    createdAt: '2026-02-01',
    updatedAt: '2026-02-18'
  },

  // ── id:9 ── 西安希尔顿逸林 │ 仅建档
  {
    id: 9,
    name: '西安希尔顿逸林酒店',
    address: '陕西省西安市雁塔区长安路',
    cityTier: '新一线',
    owner: '陕投集团',
    brand: 'DoubleTree by Hilton',
    totalRooms: 320,
    kidsRooms: 12,
    ctripLink: 'https://hotels.ctrip.com/hotels/9',
    peakPrice: 980,
    offPrice: 560,
    scenicSpots: '大雁塔、曲江池、大唐不夜城',
    contacts: [
      { name: '杜总', position: '酒店总经理', phone: '178****3344', email: 'du@example.com' }
    ],
    signedAt: null,
    stageData: {
      visit: { records: [], hasVisit: false },
      screening: { scores: {}, totalScore: 0, result: '', completed: false },
      pitch: { sessions: [], completed: false },
      negotiate: { rounds: [], completed: false },
      contract: { version: '', reviewStatus: '', ourSignDate: '', hotelSignDate: '', finalTerms: { mode: '' }, completed: false }
    },
    createdAt: '2026-03-10',
    updatedAt: '2026-03-10'
  },

  // ── id:10 ── 重庆丽思卡尔顿 │ 谈判进行中
  {
    id: 10,
    name: '重庆丽思卡尔顿酒店',
    address: '重庆市江北区嘉滨路',
    cityTier: '新一线',
    owner: '龙湖地产',
    brand: 'Ritz-Carlton',
    totalRooms: 280,
    kidsRooms: 10,
    ctripLink: 'https://hotels.ctrip.com/hotels/10',
    peakPrice: 2600,
    offPrice: 1600,
    scenicSpots: '洪崖洞、解放碑、磁器口',
    contacts: [
      { name: '周总', position: '总经理', phone: '136****7788', email: 'zhou@example.com' },
      { name: '马经理', position: '销售总监', phone: '151****2233', email: 'ma@example.com' }
    ],
    signedAt: null,
    stageData: {
      visit: {
        records: [
          { date: '2026-01-10', caseName: '南京涵碧楼亲子房', visitors: '周总、马经理', summary: '对高端小户型亲子房设计理念高度认同' }
        ],
        hasVisit: true
      },
      screening: {
        scores: { locationMatch: 9, trafficHealth: 8, hotelTierMatch: 10, hasDecisionMaker: 14, isRealContact: 14, interestLevel: 17, pushWillingness: 9, guaranteeWillingness: 7 },
        totalScore: 88, result: 'qualified', completed: true
      },
      pitch: {
        sessions: [
          { date: '2026-01-18', type: '线下会议', hotelParticipants: [{ name: '周总', position: '总经理' }], minutes: '首次拜访，介绍产品体系，周总表示高度认可', minutesLink: '' },
          { date: '2026-02-01', type: '线下会议', hotelParticipants: [{ name: '周总', position: '总经理' }, { name: '马经理', position: '销售总监' }], minutes: '深度讨论改造方案，确定10间亲子套房改造计划', minutesLink: 'https://docs.example.com/ritz-pitch2' },
          { date: '2026-02-22', type: '线上会议', hotelParticipants: [{ name: '马经理', position: '销售总监' }], minutes: '马经理确认内部立项，推动进入商务谈判阶段', minutesLink: '' }
        ],
        completed: true
      },
      negotiate: {
        rounds: [
          { date: '2026-03-15', hotelParticipants: '周总、马经理', ourParticipants: '张总、陈经理', terms: { mode: '全年保底', yearGuarantee: '72万', rooms: 10, period: '5年', peakShare: '22%', offShare: '16%' }, description: '首轮谈判，丽思卡尔顿要求保底额度不低于72万，条款框架已基本确定', minutesLink: '' }
        ],
        completed: false
      },
      contract: { version: '', reviewStatus: '', ourSignDate: '', hotelSignDate: '', finalTerms: { mode: '' }, completed: false }
    },
    createdAt: '2026-01-05',
    updatedAt: '2026-03-15'
  },

  // ── id:11 ── 青岛海尔大酒店 │ 筛选完成（无效客户）
  {
    id: 11,
    name: '青岛海尔大酒店',
    address: '山东省青岛市城阳区青岛路',
    cityTier: '新一线',
    owner: '海尔集团',
    brand: '海尔大酒店',
    totalRooms: 260,
    kidsRooms: 8,
    ctripLink: 'https://hotels.ctrip.com/hotels/11',
    peakPrice: 780,
    offPrice: 420,
    scenicSpots: '栈桥、八大关、崂山',
    contacts: [
      { name: '宋经理', position: '市场经理', phone: '152****9900', email: 'song@example.com' }
    ],
    signedAt: null,
    stageData: {
      visit: { records: [], hasVisit: false },
      screening: {
        scores: { locationMatch: 4, trafficHealth: 5, hotelTierMatch: 4, hasDecisionMaker: 5, isRealContact: 6, interestLevel: 10, pushWillingness: 5, guaranteeWillingness: 4 },
        totalScore: 43, result: 'invalid', completed: true
      },
      pitch: { sessions: [], completed: false },
      negotiate: { rounds: [], completed: false },
      contract: { version: '', reviewStatus: '', ourSignDate: '', hotelSignDate: '', finalTerms: { mode: '' }, completed: false }
    },
    createdAt: '2026-01-08',
    updatedAt: '2026-01-25'
  },

  // ── id:12 ── 大连香格里拉 │ 筛选完成（合格），待进入讲解
  {
    id: 12,
    name: '大连香格里拉大酒店',
    address: '辽宁省大连市中山区人民路',
    cityTier: '二线',
    owner: '香格里拉集团',
    brand: 'Shangri-La',
    totalRooms: 563,
    kidsRooms: 16,
    ctripLink: 'https://hotels.ctrip.com/hotels/12',
    peakPrice: 1600,
    offPrice: 900,
    scenicSpots: '星海广场、旅顺口、老虎滩海洋公园',
    contacts: [
      { name: '韩总', position: '总经理', phone: '138****5566', email: 'han@example.com' },
      { name: '李经理', position: '收益总监', phone: '177****8800', email: 'li2@example.com' }
    ],
    signedAt: null,
    stageData: {
      visit: {
        records: [{ date: '2025-12-15', caseName: '杭州西溪湿地洲际亲子房', visitors: '韩总、李经理', summary: '对自然湿地主题设计非常感兴趣，认为符合大连海洋城市调性' }],
        hasVisit: true
      },
      screening: {
        scores: { locationMatch: 8, trafficHealth: 8, hotelTierMatch: 9, hasDecisionMaker: 13, isRealContact: 13, interestLevel: 16, pushWillingness: 10, guaranteeWillingness: 8 },
        totalScore: 85, result: 'qualified', completed: true
      },
      pitch: { sessions: [], completed: false },
      negotiate: { rounds: [], completed: false },
      contract: { version: '', reviewStatus: '', ourSignDate: '', hotelSignDate: '', finalTerms: { mode: '' }, completed: false }
    },
    createdAt: '2025-11-25',
    updatedAt: '2026-01-05'
  }

];
