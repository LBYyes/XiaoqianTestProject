const OTA_MOCK_VERSION = '2026-04-22-v23';

const OTA_CHANNEL_OPTIONS = [
  { key: 'ctrip', label: '携程' },
  { key: 'meituan', label: '美团' },
  { key: 'fliggy', label: '飞猪' },
  { key: 'douyin', label: '抖音' }
];

const OTA_MOCK_HOTELS = [
  {
    id: 101,
    name: '成都环球中心天堂洲际酒店',
    province: '四川省',
    ownerSales: '李川',
    ownerOps: '王莉',
    themeName: '奇趣爱丽丝',
    launchDate: '2026-04-01',
    targetPremiumRate: 0.2,
    channels: ['ctrip', 'meituan', 'douyin'],
    roomTypes: [
      { id: 'queen', name: '奇趣爱丽丝-亲子大床房', basePrice: 799 },
      { id: 'twin', name: '奇趣爱丽丝-亲子双床房', basePrice: 899 }
    ]
  },
  {
    id: 102,
    name: '杭州西溪湿地洲际酒店',
    province: '浙江省',
    ownerSales: '陈森',
    ownerOps: '王莉',
    themeName: '奇趣爱丽丝',
    launchDate: '2026-04-02',
    targetPremiumRate: 0.25,
    channels: ['ctrip', 'wechat', 'fliggy'],
    roomTypes: [
      { id: 'family', name: '奇趣爱丽丝-亲子家庭房', basePrice: 1099 }
    ]
  },
  {
    id: 103,
    name: '青岛海天大酒店',
    province: '山东省',
    ownerSales: '刘颖',
    ownerOps: '周娜',
    themeName: '奇趣爱丽丝',
    launchDate: '2026-04-03',
    targetPremiumRate: 0.18,
    channels: ['ctrip', 'meituan'],
    roomTypes: [
      { id: 'queen', name: '奇趣爱丽丝-亲子大床房', basePrice: 699 },
      { id: 'suite', name: '奇趣爱丽丝-亲子套房', basePrice: 1299 }
    ]
  },
  {
    id: 104,
    name: '重庆尼依格罗酒店',
    province: '重庆',
    ownerSales: '赵峰',
    ownerOps: '周娜',
    themeName: '奇趣爱丽丝',
    launchDate: '2026-04-04',
    targetPremiumRate: 0.25,
    channels: ['ctrip', 'wechat', 'douyin'],
    roomTypes: [
      { id: 'theme', name: '奇趣爱丽丝-IP主题房', basePrice: 999 }
    ]
  },
  {
    id: 105,
    name: '苏州金鸡湖凯宾斯基酒店',
    province: '江苏省',
    ownerSales: '李川',
    ownerOps: '王莉',
    themeName: '奇趣爱丽丝',
    launchDate: '2026-04-05',
    targetPremiumRate: 0.22,
    channels: ['ctrip', 'wechat', 'meituan'],
    roomTypes: [
      { id: 'queen', name: '奇趣爱丽丝-亲子大床房', basePrice: 860 },
      { id: 'twin', name: '奇趣爱丽丝-亲子双床房', basePrice: 930 }
    ]
  },
  {
    id: 106,
    name: '南京紫峰洲际酒店',
    province: '江苏省',
    ownerSales: '陈森',
    ownerOps: '王莉',
    themeName: '奇趣爱丽丝',
    launchDate: '2026-04-06',
    targetPremiumRate: 0.2,
    channels: ['ctrip', 'fliggy'],
    roomTypes: [
      { id: 'family', name: '奇趣爱丽丝-亲子家庭房', basePrice: 980 }
    ]
  },
  {
    id: 107,
    name: '武汉光谷凯悦酒店',
    province: '湖北省',
    ownerSales: '高航',
    ownerOps: '王莉',
    themeName: '奇趣爱丽丝',
    launchDate: '2026-04-07',
    targetPremiumRate: 0.18,
    channels: ['ctrip', 'meituan', 'douyin'],
    roomTypes: [
      { id: 'theme', name: '奇趣爱丽丝-IP主题房', basePrice: 760 }
    ]
  },
  {
    id: 108,
    name: '长沙梅溪湖英迪格酒店',
    province: '湖南省',
    ownerSales: '王卓',
    ownerOps: '王莉',
    themeName: '奇趣爱丽丝',
    launchDate: '2026-04-08',
    targetPremiumRate: 0.23,
    channels: ['ctrip', 'wechat', 'douyin'],
    roomTypes: [
      { id: 'queen', name: '奇趣爱丽丝-亲子大床房', basePrice: 820 }
    ]
  },
  {
    id: 109,
    name: '厦门海景洲际酒店',
    province: '福建省',
    ownerSales: '刘颖',
    ownerOps: '周娜',
    themeName: '奇趣爱丽丝',
    launchDate: '2026-04-09',
    targetPremiumRate: 0.21,
    channels: ['ctrip', 'wechat', 'fliggy'],
    roomTypes: [
      { id: 'suite', name: '奇趣爱丽丝-亲子套房', basePrice: 1499 }
    ]
  },
  {
    id: 110,
    name: '郑州绿地JW万豪酒店',
    province: '河南省',
    ownerSales: '赵峰',
    ownerOps: '周娜',
    themeName: '奇趣爱丽丝',
    launchDate: '2026-04-10',
    targetPremiumRate: 0.2,
    channels: ['ctrip', 'meituan'],
    roomTypes: [
      { id: 'family', name: '奇趣爱丽丝-亲子家庭房', basePrice: 880 }
    ]
  },
  {
    id: 111,
    name: '合肥君悦酒店',
    province: '安徽省',
    ownerSales: '吴桐',
    ownerOps: '周娜',
    themeName: '奇趣爱丽丝',
    launchDate: '2026-04-11',
    targetPremiumRate: 0.19,
    channels: ['ctrip', 'wechat', 'meituan'],
    roomTypes: [
      { id: 'queen', name: '奇趣爱丽丝-亲子大床房', basePrice: 790 },
      { id: 'twin', name: '奇趣爱丽丝-亲子双床房', basePrice: 860 }
    ]
  },
  {
    id: 112,
    name: '福州世茂洲际酒店',
    province: '福建省',
    ownerSales: '王卓',
    ownerOps: '周娜',
    themeName: '奇趣爱丽丝',
    launchDate: '2026-04-12',
    targetPremiumRate: 0.22,
    channels: ['ctrip', 'fliggy'],
    roomTypes: [
      { id: 'theme', name: '奇趣爱丽丝-IP主题房', basePrice: 920 }
    ]
  },
  {
    id: 113,
    name: '无锡君来洲际酒店',
    province: '江苏省',
    ownerSales: '陈森',
    ownerOps: '王莉',
    themeName: '奇趣爱丽丝',
    launchDate: '2026-04-13',
    targetPremiumRate: 0.2,
    channels: ['ctrip', 'wechat'],
    roomTypes: [
      { id: 'family', name: '奇趣爱丽丝-亲子家庭房', basePrice: 900 }
    ]
  },
  {
    id: 114,
    name: '宁波柏悦酒店',
    province: '浙江省',
    ownerSales: '高航',
    ownerOps: '王莉',
    themeName: '奇趣爱丽丝',
    launchDate: '2026-04-14',
    targetPremiumRate: 0.24,
    channels: ['ctrip', 'douyin'],
    roomTypes: [
      { id: 'suite', name: '奇趣爱丽丝-亲子套房', basePrice: 1699 }
    ]
  },
  {
    id: 115,
    name: '济南喜来登酒店',
    province: '山东省',
    ownerSales: '吴桐',
    ownerOps: '周娜',
    themeName: '奇趣爱丽丝',
    launchDate: '2026-04-15',
    targetPremiumRate: 0.17,
    channels: ['ctrip', 'meituan', 'douyin'],
    roomTypes: [
      { id: 'queen', name: '奇趣爱丽丝-亲子大床房', basePrice: 740 }
    ]
  },
  {
    id: 116,
    name: '南昌香格里拉酒店',
    province: '江西省',
    ownerSales: '赵峰',
    ownerOps: '周娜',
    themeName: '奇趣爱丽丝',
    launchDate: '2026-04-16',
    targetPremiumRate: 0.2,
    channels: ['ctrip', 'wechat', 'fliggy'],
    roomTypes: [
      { id: 'theme', name: '奇趣爱丽丝-IP主题房', basePrice: 830 }
    ]
  },
  {
    id: 117,
    name: '昆明洲际酒店',
    province: '云南省',
    ownerSales: '李川',
    ownerOps: '王莉',
    themeName: '奇趣爱丽丝',
    launchDate: '2026-04-16',
    targetPremiumRate: 0.21,
    channels: ['ctrip', 'wechat', 'douyin'],
    roomTypes: [
      { id: 'queen', name: '奇趣爱丽丝-亲子大床房', basePrice: 880 },
      { id: 'suite', name: '奇趣爱丽丝-亲子套房', basePrice: 1480 }
    ]
  },
  {
    id: 118,
    name: '大连君悦酒店',
    province: '辽宁省',
    ownerSales: '赵峰',
    ownerOps: '周娜',
    themeName: '奇趣爱丽丝',
    launchDate: '2026-04-16',
    targetPremiumRate: 0.2,
    channels: ['ctrip', 'meituan'],
    roomTypes: [
      { id: 'family', name: '奇趣爱丽丝-亲子家庭房', basePrice: 930 }
    ]
  },
  {
    id: 119,
    name: '贵阳凯宾斯基大酒店',
    province: '贵州省',
    ownerSales: '陈森',
    ownerOps: '王莉',
    themeName: '奇趣爱丽丝',
    launchDate: '2026-04-16',
    targetPremiumRate: 0.2,
    channels: ['ctrip', 'wechat', 'meituan'],
    roomTypes: [
      { id: 'queen', name: '奇趣爱丽丝-亲子大床房', basePrice: 820 }
    ]
  },
  {
    id: 120,
    name: '三亚亚特兰蒂斯酒店',
    province: '海南省',
    ownerSales: '李川',
    ownerOps: '王莉',
    themeName: '奇趣爱丽丝',
    launchDate: '2026-04-17',
    targetPremiumRate: 0.22,
    channels: ['ctrip', 'douyin'],
    roomTypes: [
      { id: 'theme', name: '奇趣爱丽丝-IP主题房', basePrice: 1280 }
    ]
  },
  {
    id: 121,
    name: '北京环球影城大酒店',
    province: '北京市',
    ownerSales: '赵峰',
    ownerOps: '王莉',
    themeName: '奇趣爱丽丝',
    launchDate: '2026-04-17',
    targetPremiumRate: 0.2,
    channels: ['ctrip', 'wechat', 'meituan'],
    roomTypes: [
      { id: 'theme', name: '奇趣爱丽丝-IP主题房', basePrice: 1380 }
    ]
  },
  {
    id: 122,
    name: '上海宝格丽酒店',
    province: '上海市',
    ownerSales: '陈森',
    ownerOps: '王莉',
    themeName: '奇趣爱丽丝',
    launchDate: '2026-04-18',
    targetPremiumRate: 0.28,
    channels: ['ctrip', 'wechat', 'fliggy'],
    roomTypes: [
      { id: 'theme', name: '奇趣爱丽丝-IP主题房', basePrice: 1880 }
    ]
  },
  {
    id: 123,
    name: '西安威斯汀大酒店',
    province: '陕西省',
    ownerSales: '刘颖',
    ownerOps: '周娜',
    themeName: '奇趣爱丽丝',
    launchDate: '2026-04-18',
    targetPremiumRate: 0.19,
    channels: ['ctrip', 'meituan'],
    roomTypes: [
      { id: 'theme', name: '奇趣爱丽丝-IP主题房', basePrice: 980 }
    ]
  },
  {
    id: 124,
    name: '天津丽思卡尔顿酒店',
    province: '天津市',
    ownerSales: '王卓',
    ownerOps: '王莉',
    themeName: '奇趣爱丽丝',
    launchDate: '2026-04-19',
    targetPremiumRate: 0.21,
    channels: ['ctrip', 'wechat'],
    roomTypes: [
      { id: 'theme', name: '奇趣爱丽丝-IP主题房', basePrice: 1320 }
    ]
  },
  {
    id: 125,
    name: '长春凯悦酒店',
    province: '吉林省',
    ownerSales: '吴桐',
    ownerOps: '周娜',
    themeName: '奇趣爱丽丝',
    launchDate: '2026-04-19',
    targetPremiumRate: 0.18,
    channels: ['ctrip', 'meituan'],
    roomTypes: [
      { id: 'theme', name: '奇趣爱丽丝-IP主题房', basePrice: 860 }
    ]
  },
  {
    id: 126,
    name: '哈尔滨香格里拉酒店',
    province: '黑龙江省',
    ownerSales: '赵峰',
    ownerOps: '周娜',
    themeName: '奇趣爱丽丝',
    launchDate: '2026-04-20',
    targetPremiumRate: 0.2,
    channels: ['ctrip', 'wechat', 'douyin'],
    roomTypes: [
      { id: 'theme', name: '奇趣爱丽丝-IP主题房', basePrice: 920 }
    ]
  },
  {
    id: 127,
    name: '石家庄希尔顿酒店',
    province: '河北省',
    ownerSales: '陈森',
    ownerOps: '王莉',
    themeName: '奇趣爱丽丝',
    launchDate: '2026-04-20',
    targetPremiumRate: 0.17,
    channels: ['ctrip', 'meituan'],
    roomTypes: [
      { id: 'theme', name: '奇趣爱丽丝-IP主题房', basePrice: 840 }
    ]
  },
  {
    id: 128,
    name: '太原洲际酒店',
    province: '山西省',
    ownerSales: '李川',
    ownerOps: '周娜',
    themeName: '奇趣爱丽丝',
    launchDate: '2026-04-21',
    targetPremiumRate: 0.2,
    channels: ['ctrip', 'fliggy'],
    roomTypes: [
      { id: 'theme', name: '奇趣爱丽丝-IP主题房', basePrice: 900 }
    ]
  },
  {
    id: 129,
    name: '呼和浩特香格里拉酒店',
    province: '内蒙古',
    ownerSales: '高航',
    ownerOps: '王莉',
    themeName: '奇趣爱丽丝',
    launchDate: '2026-04-21',
    targetPremiumRate: 0.19,
    channels: ['ctrip', 'wechat'],
    roomTypes: [
      { id: 'theme', name: '奇趣爱丽丝-IP主题房', basePrice: 870 }
    ]
  },
  {
    id: 130,
    name: '兰州凯悦酒店',
    province: '甘肃省',
    ownerSales: '赵峰',
    ownerOps: '周娜',
    themeName: '奇趣爱丽丝',
    launchDate: '2026-04-22',
    targetPremiumRate: 0.18,
    channels: ['ctrip', 'douyin'],
    roomTypes: [
      { id: 'theme', name: '奇趣爱丽丝-IP主题房', basePrice: 860 }
    ]
  },
  {
    id: 131,
    name: '银川喜来登酒店',
    province: '宁夏',
    ownerSales: '吴桐',
    ownerOps: '周娜',
    themeName: '奇趣爱丽丝',
    launchDate: '2026-04-22',
    targetPremiumRate: 0.2,
    channels: ['ctrip', 'wechat'],
    roomTypes: [
      { id: 'theme', name: '奇趣爱丽丝-IP主题房', basePrice: 880 }
    ]
  },
  {
    id: 132,
    name: '西宁索菲特酒店',
    province: '青海省',
    ownerSales: '王卓',
    ownerOps: '王莉',
    themeName: '奇趣爱丽丝',
    launchDate: '2026-04-23',
    targetPremiumRate: 0.22,
    channels: ['ctrip', 'fliggy'],
    roomTypes: [
      { id: 'theme', name: '奇趣爱丽丝-IP主题房', basePrice: 930 }
    ]
  },
  {
    id: 133,
    name: '乌鲁木齐希尔顿酒店',
    province: '新疆',
    ownerSales: '李川',
    ownerOps: '王莉',
    themeName: '奇趣爱丽丝',
    launchDate: '2026-04-23',
    targetPremiumRate: 0.2,
    channels: ['ctrip', 'wechat', 'douyin'],
    roomTypes: [
      { id: 'theme', name: '奇趣爱丽丝-IP主题房', basePrice: 940 }
    ]
  },
  {
    id: 134,
    name: '拉萨瑞吉度假酒店',
    province: '西藏',
    ownerSales: '刘颖',
    ownerOps: '周娜',
    themeName: '奇趣爱丽丝',
    launchDate: '2026-04-24',
    targetPremiumRate: 0.24,
    channels: ['ctrip', 'douyin'],
    roomTypes: [
      { id: 'theme', name: '奇趣爱丽丝-IP主题房', basePrice: 1580 }
    ]
  },
  {
    id: 135,
    name: '海口鲁能希尔顿酒店',
    province: '海南省',
    ownerSales: '陈森',
    ownerOps: '王莉',
    themeName: '奇趣爱丽丝',
    launchDate: '2026-04-24',
    targetPremiumRate: 0.21,
    channels: ['ctrip', 'wechat', 'meituan'],
    roomTypes: [
      { id: 'theme', name: '奇趣爱丽丝-IP主题房', basePrice: 1020 }
    ]
  },
  {
    id: 136,
    name: '深圳四季酒店',
    province: '广东省',
    ownerSales: '高航',
    ownerOps: '王莉',
    themeName: '奇趣爱丽丝',
    launchDate: '2026-04-25',
    targetPremiumRate: 0.26,
    channels: ['ctrip', 'wechat', 'douyin'],
    roomTypes: [
      { id: 'theme', name: '奇趣爱丽丝-IP主题房', basePrice: 1760 }
    ]
  },
  {
    id: 137,
    name: '广州瑰丽酒店',
    province: '广东省',
    ownerSales: '赵峰',
    ownerOps: '周娜',
    themeName: '奇趣爱丽丝',
    launchDate: '2026-04-25',
    targetPremiumRate: 0.23,
    channels: ['ctrip', 'fliggy'],
    roomTypes: [
      { id: 'theme', name: '奇趣爱丽丝-IP主题房', basePrice: 1580 }
    ]
  },
  {
    id: 138,
    name: '珠海瑞吉酒店',
    province: '广东省',
    ownerSales: '王卓',
    ownerOps: '王莉',
    themeName: '奇趣爱丽丝',
    launchDate: '2026-04-26',
    targetPremiumRate: 0.22,
    channels: ['ctrip', 'meituan', 'douyin'],
    roomTypes: [
      { id: 'theme', name: '奇趣爱丽丝-IP主题房', basePrice: 1360 }
    ]
  },
  {
    id: 139,
    name: '桂林香格里拉酒店',
    province: '广西',
    ownerSales: '吴桐',
    ownerOps: '周娜',
    themeName: '奇趣爱丽丝',
    launchDate: '2026-04-26',
    targetPremiumRate: 0.19,
    channels: ['ctrip', 'wechat'],
    roomTypes: [
      { id: 'theme', name: '奇趣爱丽丝-IP主题房', basePrice: 920 }
    ]
  }
];

const OTA_MOCK_RECORDS = [
  { id: '101-2026-04-01-ctrip', hotelId: 101, date: '2026-04-01', channel: 'ctrip', presalePackageTitle: '爱丽丝主题房+双人自助早餐', roomInputs: [{ roomTypeId: 'queen', status: 'on_sale', basePrice: 799, salePrice: 1008 }, { roomTypeId: 'twin', status: 'sold_out', basePrice: 899, salePrice: 1120 }] },
  { id: '101-2026-04-02-ctrip', hotelId: 101, date: '2026-04-02', channel: 'ctrip', roomInputs: [{ roomTypeId: 'queen', status: 'on_sale', basePrice: 799, salePrice: 1060 }, { roomTypeId: 'twin', status: 'sold_out', basePrice: 899, salePrice: 1160 }] },
  { id: '101-2026-04-02-meituan', hotelId: 101, date: '2026-04-02', channel: 'meituan', roomInputs: [{ roomTypeId: 'queen', status: 'unavailable', basePrice: 799, salePrice: 0 }, { roomTypeId: 'twin', status: 'on_sale', basePrice: 899, salePrice: 1040 }] },

  { id: '102-2026-04-03-ctrip', hotelId: 102, date: '2026-04-03', channel: 'ctrip', roomInputs: [{ roomTypeId: 'family', status: 'on_sale', basePrice: 1099, salePrice: 1320 }] },
  { id: '102-2026-04-04-wechat', hotelId: 102, date: '2026-04-04', channel: 'wechat', roomInputs: [{ roomTypeId: 'family', status: 'on_sale', basePrice: 1099, salePrice: 1410 }] },

  { id: '103-2026-04-05-ctrip', hotelId: 103, date: '2026-04-05', channel: 'ctrip', roomInputs: [{ roomTypeId: 'queen', status: 'on_sale', basePrice: 699, salePrice: 820 }, { roomTypeId: 'suite', status: 'on_sale', basePrice: 1299, salePrice: 1490 }] },
  { id: '103-2026-04-06-meituan', hotelId: 103, date: '2026-04-06', channel: 'meituan', roomInputs: [{ roomTypeId: 'queen', status: 'sold_out', basePrice: 699, salePrice: 799 }, { roomTypeId: 'suite', status: 'on_sale', basePrice: 1299, salePrice: 1620 }] },

  { id: '104-2026-04-07-ctrip', hotelId: 104, date: '2026-04-07', channel: 'ctrip', roomInputs: [{ roomTypeId: 'theme', status: 'on_sale', basePrice: 999, salePrice: 1290 }] },

  { id: '105-2026-04-08-ctrip', hotelId: 105, date: '2026-04-08', channel: 'ctrip', presalePackageTitle: '亲子主题房+乐园门票+晚餐', roomInputs: [{ roomTypeId: 'queen', status: 'on_sale', basePrice: 860, salePrice: 1040 }, { roomTypeId: 'twin', status: 'on_sale', basePrice: 930, salePrice: 1110 }] },
  { id: '105-2026-04-09-wechat', hotelId: 105, date: '2026-04-09', channel: 'wechat', roomInputs: [{ roomTypeId: 'queen', status: 'on_sale', basePrice: 860, salePrice: 1100 }, { roomTypeId: 'twin', status: 'not_listed', basePrice: 930, salePrice: 0 }] },

  { id: '106-2026-04-10-ctrip', hotelId: 106, date: '2026-04-10', channel: 'ctrip', roomInputs: [{ roomTypeId: 'family', status: 'sold_out', basePrice: 980, salePrice: 1190 }] },
  { id: '106-2026-04-11-fliggy', hotelId: 106, date: '2026-04-11', channel: 'fliggy', roomInputs: [{ roomTypeId: 'family', status: 'on_sale', basePrice: 980, salePrice: 1260 }] },

  { id: '107-2026-04-12-ctrip', hotelId: 107, date: '2026-04-12', channel: 'ctrip', presalePackageTitle: '爱丽丝主题房+下午茶套餐', roomInputs: [{ roomTypeId: 'theme', status: 'on_sale', basePrice: 760, salePrice: 900 }] },

  { id: '108-2026-04-13-ctrip', hotelId: 108, date: '2026-04-13', channel: 'ctrip', roomInputs: [{ roomTypeId: 'queen', status: 'on_sale', basePrice: 820, salePrice: 1080 }] },
  { id: '108-2026-04-13-douyin', hotelId: 108, date: '2026-04-13', channel: 'douyin', roomInputs: [{ roomTypeId: 'queen', status: 'on_sale', basePrice: 820, salePrice: 950 }] },

  { id: '109-2026-04-14-ctrip', hotelId: 109, date: '2026-04-14', channel: 'ctrip', roomInputs: [{ roomTypeId: 'suite', status: 'sold_out', basePrice: 1499, salePrice: 1770 }] },
  { id: '109-2026-04-14-wechat', hotelId: 109, date: '2026-04-14', channel: 'wechat', roomInputs: [{ roomTypeId: 'suite', status: 'on_sale', basePrice: 1499, salePrice: 1900 }] },

  { id: '111-2026-04-15-ctrip', hotelId: 111, date: '2026-04-15', channel: 'ctrip', roomInputs: [{ roomTypeId: 'queen', status: 'on_sale', basePrice: 790, salePrice: 940 }, { roomTypeId: 'twin', status: 'on_sale', basePrice: 860, salePrice: 1010 }] },

  { id: '112-2026-04-15-ctrip', hotelId: 112, date: '2026-04-15', channel: 'ctrip', roomInputs: [{ roomTypeId: 'theme', status: 'unavailable', basePrice: 920, salePrice: 0 }] },

  { id: '113-2026-04-16-ctrip', hotelId: 113, date: '2026-04-16', channel: 'ctrip', roomInputs: [{ roomTypeId: 'family', status: 'on_sale', basePrice: 900, salePrice: 1020 }] },

  { id: '114-2026-04-16-douyin', hotelId: 114, date: '2026-04-16', channel: 'douyin', roomInputs: [{ roomTypeId: 'suite', status: 'on_sale', basePrice: 1699, salePrice: 2150 }] },

  { id: '115-2026-04-16-meituan', hotelId: 115, date: '2026-04-16', channel: 'meituan', roomInputs: [{ roomTypeId: 'queen', status: 'on_sale', basePrice: 740, salePrice: 880 }] },

  { id: '120-2026-04-17-ctrip', hotelId: 120, date: '2026-04-17', channel: 'ctrip', presalePackageTitle: '亲子套房+双人自助餐', roomInputs: [{ roomTypeId: 'theme', status: 'on_sale', basePrice: 1280, salePrice: 1540 }] },
  { id: '120-2026-04-18-douyin', hotelId: 120, date: '2026-04-18', channel: 'douyin', roomInputs: [{ roomTypeId: 'theme', status: 'sold_out', basePrice: 1280, salePrice: 1530 }] },

  { id: '121-2026-04-17-ctrip', hotelId: 121, date: '2026-04-17', channel: 'ctrip', roomInputs: [{ roomTypeId: 'theme', status: 'not_listed', basePrice: 1380, salePrice: 0 }] },
  { id: '121-2026-04-19-meituan', hotelId: 121, date: '2026-04-19', channel: 'meituan', roomInputs: [{ roomTypeId: 'theme', status: 'on_sale', basePrice: 1380, salePrice: 1710 }] },

  { id: '122-2026-04-18-ctrip', hotelId: 122, date: '2026-04-18', channel: 'ctrip', roomInputs: [{ roomTypeId: 'theme', status: 'on_sale', basePrice: 1880, salePrice: 2480 }] },
  { id: '122-2026-04-20-wechat', hotelId: 122, date: '2026-04-20', channel: 'wechat', roomInputs: [{ roomTypeId: 'theme', status: 'on_sale', basePrice: 1880, salePrice: 2360 }] },

  { id: '123-2026-04-18-ctrip', hotelId: 123, date: '2026-04-18', channel: 'ctrip', roomInputs: [{ roomTypeId: 'theme', status: 'sold_out', basePrice: 980, salePrice: 1160 }] },
  { id: '123-2026-04-19-meituan', hotelId: 123, date: '2026-04-19', channel: 'meituan', roomInputs: [{ roomTypeId: 'theme', status: 'on_sale', basePrice: 980, salePrice: 1120 }] },

  { id: '124-2026-04-19-ctrip', hotelId: 124, date: '2026-04-19', channel: 'ctrip', roomInputs: [{ roomTypeId: 'theme', status: 'on_sale', basePrice: 1320, salePrice: 1580 }] },
  { id: '124-2026-04-20-wechat', hotelId: 124, date: '2026-04-20', channel: 'wechat', roomInputs: [{ roomTypeId: 'theme', status: 'not_listed', basePrice: 1320, salePrice: 0 }] },

  { id: '126-2026-04-20-ctrip', hotelId: 126, date: '2026-04-20', channel: 'ctrip', roomInputs: [{ roomTypeId: 'theme', status: 'on_sale', basePrice: 920, salePrice: 1180 }] },
  { id: '126-2026-04-21-douyin', hotelId: 126, date: '2026-04-21', channel: 'douyin', roomInputs: [{ roomTypeId: 'theme', status: 'on_sale', basePrice: 920, salePrice: 1000 }] },

  { id: '127-2026-04-21-ctrip', hotelId: 127, date: '2026-04-21', channel: 'ctrip', roomInputs: [{ roomTypeId: 'theme', status: 'on_sale', basePrice: 840, salePrice: 980 }] },
  { id: '127-2026-04-22-meituan', hotelId: 127, date: '2026-04-22', channel: 'meituan', roomInputs: [{ roomTypeId: 'theme', status: 'on_sale', basePrice: 840, salePrice: 900 }] },

  { id: '130-2026-04-22-ctrip', hotelId: 130, date: '2026-04-22', channel: 'ctrip', roomInputs: [{ roomTypeId: 'theme', status: 'sold_out', basePrice: 860, salePrice: 980 }] },
  { id: '130-2026-04-23-douyin', hotelId: 130, date: '2026-04-23', channel: 'douyin', roomInputs: [{ roomTypeId: 'theme', status: 'not_listed', basePrice: 860, salePrice: 0 }] },

  { id: '132-2026-04-24-ctrip', hotelId: 132, date: '2026-04-24', channel: 'ctrip', roomInputs: [{ roomTypeId: 'theme', status: 'on_sale', basePrice: 930, salePrice: 1140 }] },
  { id: '133-2026-04-24-wechat', hotelId: 133, date: '2026-04-24', channel: 'wechat', roomInputs: [{ roomTypeId: 'theme', status: 'on_sale', basePrice: 940, salePrice: 1120 }] },

  { id: '135-2026-04-25-meituan', hotelId: 135, date: '2026-04-25', channel: 'meituan', roomInputs: [{ roomTypeId: 'theme', status: 'on_sale', basePrice: 1020, salePrice: 1230 }] },

  { id: '136-2026-04-25-ctrip', hotelId: 136, date: '2026-04-25', channel: 'ctrip', roomInputs: [{ roomTypeId: 'theme', status: 'on_sale', basePrice: 1760, salePrice: 2380 }] },
  { id: '136-2026-04-26-douyin', hotelId: 136, date: '2026-04-26', channel: 'douyin', roomInputs: [{ roomTypeId: 'theme', status: 'on_sale', basePrice: 1760, salePrice: 2100 }] },

  { id: '137-2026-04-26-ctrip', hotelId: 137, date: '2026-04-26', channel: 'ctrip', roomInputs: [{ roomTypeId: 'theme', status: 'not_listed', basePrice: 1580, salePrice: 0 }] },

  { id: '138-2026-04-27-meituan', hotelId: 138, date: '2026-04-27', channel: 'meituan', roomInputs: [{ roomTypeId: 'theme', status: 'on_sale', basePrice: 1360, salePrice: 1610 }] },
  { id: '138-2026-04-28-douyin', hotelId: 138, date: '2026-04-28', channel: 'douyin', roomInputs: [{ roomTypeId: 'theme', status: 'sold_out', basePrice: 1360, salePrice: 1590 }] },

  { id: '102-2026-04-21-ctrip', hotelId: 102, date: '2026-04-21', channel: 'ctrip', roomInputs: [{ roomTypeId: 'family', status: 'on_sale', basePrice: 1099, salePrice: 1300 }] },
  { id: '102-2026-04-21-wechat', hotelId: 102, date: '2026-04-21', channel: 'wechat', roomInputs: [{ roomTypeId: 'family', status: 'on_sale', basePrice: 1099, salePrice: 1310 }] },
  { id: '102-2026-04-21-fliggy', hotelId: 102, date: '2026-04-21', channel: 'fliggy', roomInputs: [{ roomTypeId: 'family', status: 'sold_out', basePrice: 1099, salePrice: 1290 }] },
  { id: '102-2026-04-23-ctrip', hotelId: 102, date: '2026-04-23', channel: 'ctrip', roomInputs: [{ roomTypeId: 'family', status: 'on_sale', basePrice: 1099, salePrice: 1320 }] },
  { id: '102-2026-04-23-wechat', hotelId: 102, date: '2026-04-23', channel: 'wechat', roomInputs: [{ roomTypeId: 'family', status: 'on_sale', basePrice: 1099, salePrice: 1330 }] },
  { id: '102-2026-04-23-fliggy', hotelId: 102, date: '2026-04-23', channel: 'fliggy', roomInputs: [{ roomTypeId: 'family', status: 'on_sale', basePrice: 1099, salePrice: 1310 }] },

  { id: '107-2026-04-21-ctrip', hotelId: 107, date: '2026-04-21', channel: 'ctrip', roomInputs: [{ roomTypeId: 'theme', status: 'on_sale', basePrice: 760, salePrice: 920 }] },
  { id: '107-2026-04-21-meituan', hotelId: 107, date: '2026-04-21', channel: 'meituan', roomInputs: [{ roomTypeId: 'theme', status: 'not_listed', basePrice: 760, salePrice: 0 }] },
  { id: '107-2026-04-21-douyin', hotelId: 107, date: '2026-04-21', channel: 'douyin', roomInputs: [{ roomTypeId: 'theme', status: 'on_sale', basePrice: 760, salePrice: 870 }] },
  { id: '107-2026-04-24-ctrip', hotelId: 107, date: '2026-04-24', channel: 'ctrip', roomInputs: [{ roomTypeId: 'theme', status: 'on_sale', basePrice: 760, salePrice: 920 }] },
  { id: '107-2026-04-24-meituan', hotelId: 107, date: '2026-04-24', channel: 'meituan', roomInputs: [{ roomTypeId: 'theme', status: 'not_listed', basePrice: 760, salePrice: 0 }] },
  { id: '107-2026-04-24-douyin', hotelId: 107, date: '2026-04-24', channel: 'douyin', roomInputs: [{ roomTypeId: 'theme', status: 'sold_out', basePrice: 760, salePrice: 860 }] },

  { id: '113-2026-04-21-ctrip', hotelId: 113, date: '2026-04-21', channel: 'ctrip', roomInputs: [{ roomTypeId: 'family', status: 'on_sale', basePrice: 900, salePrice: 1050 }] },
  { id: '113-2026-04-21-wechat', hotelId: 113, date: '2026-04-21', channel: 'wechat', roomInputs: [{ roomTypeId: 'family', status: 'on_sale', basePrice: 900, salePrice: 1060 }] },
  { id: '113-2026-04-23-ctrip', hotelId: 113, date: '2026-04-23', channel: 'ctrip', roomInputs: [{ roomTypeId: 'family', status: 'sold_out', basePrice: 900, salePrice: 1030 }] },
  { id: '113-2026-04-23-wechat', hotelId: 113, date: '2026-04-23', channel: 'wechat', roomInputs: [{ roomTypeId: 'family', status: 'on_sale', basePrice: 900, salePrice: 1040 }] },
  { id: '113-2026-04-25-ctrip', hotelId: 113, date: '2026-04-25', channel: 'ctrip', roomInputs: [{ roomTypeId: 'family', status: 'on_sale', basePrice: 900, salePrice: 1070 }] },
  { id: '113-2026-04-25-wechat', hotelId: 113, date: '2026-04-25', channel: 'wechat', roomInputs: [{ roomTypeId: 'family', status: 'on_sale', basePrice: 900, salePrice: 1060 }] },

  { id: '117-2026-04-22-ctrip', hotelId: 117, date: '2026-04-22', channel: 'ctrip', roomInputs: [{ roomTypeId: 'queen', status: 'on_sale', basePrice: 880, salePrice: 1000 }, { roomTypeId: 'suite', status: 'on_sale', basePrice: 1480, salePrice: 1740 }] },
  { id: '117-2026-04-22-wechat', hotelId: 117, date: '2026-04-22', channel: 'wechat', roomInputs: [{ roomTypeId: 'queen', status: 'sold_out', basePrice: 880, salePrice: 990 }, { roomTypeId: 'suite', status: 'on_sale', basePrice: 1480, salePrice: 1720 }] },
  { id: '117-2026-04-22-douyin', hotelId: 117, date: '2026-04-22', channel: 'douyin', roomInputs: [{ roomTypeId: 'queen', status: 'on_sale', basePrice: 880, salePrice: 1010 }, { roomTypeId: 'suite', status: 'sold_out', basePrice: 1480, salePrice: 1700 }] },
  { id: '117-2026-04-24-ctrip', hotelId: 117, date: '2026-04-24', channel: 'ctrip', roomInputs: [{ roomTypeId: 'queen', status: 'on_sale', basePrice: 880, salePrice: 1020 }, { roomTypeId: 'suite', status: 'on_sale', basePrice: 1480, salePrice: 1760 }] },
  { id: '117-2026-04-24-wechat', hotelId: 117, date: '2026-04-24', channel: 'wechat', roomInputs: [{ roomTypeId: 'queen', status: 'on_sale', basePrice: 880, salePrice: 1000 }, { roomTypeId: 'suite', status: 'on_sale', basePrice: 1480, salePrice: 1730 }] },
  { id: '117-2026-04-24-douyin', hotelId: 117, date: '2026-04-24', channel: 'douyin', roomInputs: [{ roomTypeId: 'queen', status: 'sold_out', basePrice: 880, salePrice: 980 }, { roomTypeId: 'suite', status: 'on_sale', basePrice: 1480, salePrice: 1710 }] },

  { id: '127-2026-04-23-ctrip', hotelId: 127, date: '2026-04-23', channel: 'ctrip', roomInputs: [{ roomTypeId: 'theme', status: 'on_sale', basePrice: 840, salePrice: 960 }] },
  { id: '127-2026-04-23-meituan', hotelId: 127, date: '2026-04-23', channel: 'meituan', roomInputs: [{ roomTypeId: 'theme', status: 'sold_out', basePrice: 840, salePrice: 940 }] },
  { id: '127-2026-04-24-ctrip', hotelId: 127, date: '2026-04-24', channel: 'ctrip', roomInputs: [{ roomTypeId: 'theme', status: 'on_sale', basePrice: 840, salePrice: 970 }] },
  { id: '127-2026-04-24-meituan', hotelId: 127, date: '2026-04-24', channel: 'meituan', roomInputs: [{ roomTypeId: 'theme', status: 'on_sale', basePrice: 840, salePrice: 950 }] },

  { id: '129-2026-04-22-ctrip', hotelId: 129, date: '2026-04-22', channel: 'ctrip', roomInputs: [{ roomTypeId: 'theme', status: 'on_sale', basePrice: 870, salePrice: 1000 }] },
  { id: '129-2026-04-22-wechat', hotelId: 129, date: '2026-04-22', channel: 'wechat', roomInputs: [{ roomTypeId: 'theme', status: 'on_sale', basePrice: 870, salePrice: 1010 }] },
  { id: '129-2026-04-24-ctrip', hotelId: 129, date: '2026-04-24', channel: 'ctrip', roomInputs: [{ roomTypeId: 'theme', status: 'sold_out', basePrice: 870, salePrice: 990 }] },
  { id: '129-2026-04-24-wechat', hotelId: 129, date: '2026-04-24', channel: 'wechat', roomInputs: [{ roomTypeId: 'theme', status: 'on_sale', basePrice: 870, salePrice: 1000 }] },
  { id: '129-2026-04-26-ctrip', hotelId: 129, date: '2026-04-26', channel: 'ctrip', roomInputs: [{ roomTypeId: 'theme', status: 'on_sale', basePrice: 870, salePrice: 980 }] },
  { id: '129-2026-04-26-wechat', hotelId: 129, date: '2026-04-26', channel: 'wechat', roomInputs: [{ roomTypeId: 'theme', status: 'on_sale', basePrice: 870, salePrice: 990 }] },

  { id: '132-2026-04-24-fliggy', hotelId: 132, date: '2026-04-24', channel: 'fliggy', roomInputs: [{ roomTypeId: 'theme', status: 'on_sale', basePrice: 930, salePrice: 1120 }] },
  { id: '132-2026-04-25-ctrip', hotelId: 132, date: '2026-04-25', channel: 'ctrip', roomInputs: [{ roomTypeId: 'theme', status: 'on_sale', basePrice: 930, salePrice: 1110 }] },
  { id: '132-2026-04-25-fliggy', hotelId: 132, date: '2026-04-25', channel: 'fliggy', roomInputs: [{ roomTypeId: 'theme', status: 'sold_out', basePrice: 930, salePrice: 1100 }] },

  { id: '135-2026-04-25-ctrip', hotelId: 135, date: '2026-04-25', channel: 'ctrip', roomInputs: [{ roomTypeId: 'theme', status: 'on_sale', basePrice: 1020, salePrice: 1220 }] },
  { id: '135-2026-04-25-wechat', hotelId: 135, date: '2026-04-25', channel: 'wechat', roomInputs: [{ roomTypeId: 'theme', status: 'on_sale', basePrice: 1020, salePrice: 1210 }] },
  { id: '135-2026-04-27-ctrip', hotelId: 135, date: '2026-04-27', channel: 'ctrip', roomInputs: [{ roomTypeId: 'theme', status: 'on_sale', basePrice: 1020, salePrice: 1230 }] },
  { id: '135-2026-04-27-wechat', hotelId: 135, date: '2026-04-27', channel: 'wechat', roomInputs: [{ roomTypeId: 'theme', status: 'sold_out', basePrice: 1020, salePrice: 1200 }] },
  { id: '135-2026-04-27-meituan', hotelId: 135, date: '2026-04-27', channel: 'meituan', roomInputs: [{ roomTypeId: 'theme', status: 'on_sale', basePrice: 1020, salePrice: 1210 }] },

  { id: '138-2026-04-27-ctrip', hotelId: 138, date: '2026-04-27', channel: 'ctrip', roomInputs: [{ roomTypeId: 'theme', status: 'on_sale', basePrice: 1360, salePrice: 1580 }] },
  { id: '138-2026-04-27-douyin', hotelId: 138, date: '2026-04-27', channel: 'douyin', roomInputs: [{ roomTypeId: 'theme', status: 'sold_out', basePrice: 1360, salePrice: 1570 }] },
  { id: '138-2026-04-28-ctrip', hotelId: 138, date: '2026-04-28', channel: 'ctrip', roomInputs: [{ roomTypeId: 'theme', status: 'on_sale', basePrice: 1360, salePrice: 1600 }] },
  { id: '138-2026-04-28-meituan', hotelId: 138, date: '2026-04-28', channel: 'meituan', roomInputs: [{ roomTypeId: 'theme', status: 'on_sale', basePrice: 1360, salePrice: 1580 }] },

  { id: '101-2026-04-29-ctrip', hotelId: 101, date: '2026-04-29', channel: 'ctrip', roomInputs: [{ roomTypeId: 'queen', status: 'on_sale', basePrice: 799, salePrice: 1060 }, { roomTypeId: 'twin', status: 'on_sale', basePrice: 899, salePrice: 1200 }] },
  { id: '101-2026-04-29-meituan', hotelId: 101, date: '2026-04-29', channel: 'meituan', roomInputs: [{ roomTypeId: 'queen', status: 'not_listed', basePrice: 799, salePrice: 0 }, { roomTypeId: 'twin', status: 'on_sale', basePrice: 899, salePrice: 1180 }] },
  { id: '101-2026-04-29-douyin', hotelId: 101, date: '2026-04-29', channel: 'douyin', roomInputs: [{ roomTypeId: 'queen', status: 'on_sale', basePrice: 799, salePrice: 940 }, { roomTypeId: 'twin', status: 'sold_out', basePrice: 899, salePrice: 1030 }] },
  { id: '101-2026-04-17-ctrip', hotelId: 101, date: '2026-04-17', channel: 'ctrip', roomInputs: [{ roomTypeId: 'queen', status: 'on_sale', basePrice: 799, salePrice: 1050 }, { roomTypeId: 'twin', status: 'on_sale', basePrice: 899, salePrice: 1200 }] },
  { id: '101-2026-04-17-meituan', hotelId: 101, date: '2026-04-17', channel: 'meituan', roomInputs: [{ roomTypeId: 'queen', status: 'not_listed', basePrice: 799, salePrice: 0 }, { roomTypeId: 'twin', status: 'on_sale', basePrice: 899, salePrice: 1180 }] },
  { id: '101-2026-04-17-douyin', hotelId: 101, date: '2026-04-17', channel: 'douyin', roomInputs: [{ roomTypeId: 'queen', status: 'sold_out', basePrice: 799, salePrice: 910 }, { roomTypeId: 'twin', status: 'on_sale', basePrice: 899, salePrice: 1035 }] },

  { id: '105-2026-04-29-ctrip', hotelId: 105, date: '2026-04-29', channel: 'ctrip', roomInputs: [{ roomTypeId: 'queen', status: 'on_sale', basePrice: 860, salePrice: 1000 }, { roomTypeId: 'twin', status: 'on_sale', basePrice: 930, salePrice: 1100 }] },
  { id: '105-2026-04-29-wechat', hotelId: 105, date: '2026-04-29', channel: 'wechat', roomInputs: [{ roomTypeId: 'queen', status: 'sold_out', basePrice: 860, salePrice: 980 }, { roomTypeId: 'twin', status: 'on_sale', basePrice: 930, salePrice: 1080 }] },
  { id: '105-2026-04-29-meituan', hotelId: 105, date: '2026-04-29', channel: 'meituan', roomInputs: [{ roomTypeId: 'queen', status: 'on_sale', basePrice: 860, salePrice: 990 }, { roomTypeId: 'twin', status: 'sold_out', basePrice: 930, salePrice: 1070 }] },
  { id: '105-2026-04-02-ctrip', hotelId: 105, date: '2026-04-02', channel: 'ctrip', roomInputs: [{ roomTypeId: 'queen', status: 'on_sale', basePrice: 860, salePrice: 1010 }, { roomTypeId: 'twin', status: 'on_sale', basePrice: 930, salePrice: 1090 }] },
  { id: '105-2026-04-02-wechat', hotelId: 105, date: '2026-04-02', channel: 'wechat', roomInputs: [{ roomTypeId: 'queen', status: 'on_sale', basePrice: 860, salePrice: 995 }, { roomTypeId: 'twin', status: 'sold_out', basePrice: 930, salePrice: 1060 }] },
  { id: '105-2026-04-02-meituan', hotelId: 105, date: '2026-04-02', channel: 'meituan', roomInputs: [{ roomTypeId: 'queen', status: 'sold_out', basePrice: 860, salePrice: 980 }, { roomTypeId: 'twin', status: 'on_sale', basePrice: 930, salePrice: 1085 }] },

  { id: '108-2026-04-30-ctrip', hotelId: 108, date: '2026-04-30', channel: 'ctrip', roomInputs: [{ roomTypeId: 'queen', status: 'on_sale', basePrice: 820, salePrice: 980 }] },
  { id: '108-2026-04-30-wechat', hotelId: 108, date: '2026-04-30', channel: 'wechat', roomInputs: [{ roomTypeId: 'queen', status: 'sold_out', basePrice: 820, salePrice: 960 }] },
  { id: '108-2026-04-30-douyin', hotelId: 108, date: '2026-04-30', channel: 'douyin', roomInputs: [{ roomTypeId: 'queen', status: 'on_sale', basePrice: 820, salePrice: 970 }] },
  { id: '108-2026-04-02-ctrip', hotelId: 108, date: '2026-04-02', channel: 'ctrip', roomInputs: [{ roomTypeId: 'queen', status: 'on_sale', basePrice: 820, salePrice: 990 }] },
  { id: '108-2026-04-02-wechat', hotelId: 108, date: '2026-04-02', channel: 'wechat', roomInputs: [{ roomTypeId: 'queen', status: 'on_sale', basePrice: 820, salePrice: 980 }] },
  { id: '108-2026-04-02-douyin', hotelId: 108, date: '2026-04-02', channel: 'douyin', roomInputs: [{ roomTypeId: 'queen', status: 'sold_out', basePrice: 820, salePrice: 965 }] },

  { id: '114-2026-04-30-ctrip', hotelId: 114, date: '2026-04-30', channel: 'ctrip', roomInputs: [{ roomTypeId: 'suite', status: 'on_sale', basePrice: 1699, salePrice: 2050 }] },
  { id: '114-2026-04-30-douyin', hotelId: 114, date: '2026-04-30', channel: 'douyin', roomInputs: [{ roomTypeId: 'suite', status: 'sold_out', basePrice: 1699, salePrice: 1980 }] },
  { id: '114-2026-04-03-ctrip', hotelId: 114, date: '2026-04-03', channel: 'ctrip', roomInputs: [{ roomTypeId: 'suite', status: 'on_sale', basePrice: 1699, salePrice: 2020 }] },
  { id: '114-2026-04-03-douyin', hotelId: 114, date: '2026-04-03', channel: 'douyin', roomInputs: [{ roomTypeId: 'suite', status: 'on_sale', basePrice: 1699, salePrice: 2000 }] },

  { id: '120-2026-04-30-ctrip', hotelId: 120, date: '2026-04-30', channel: 'ctrip', roomInputs: [{ roomTypeId: 'theme', status: 'on_sale', basePrice: 1280, salePrice: 1500 }] },
  { id: '120-2026-04-30-meituan', hotelId: 120, date: '2026-04-30', channel: 'meituan', roomInputs: [{ roomTypeId: 'theme', status: 'sold_out', basePrice: 1280, salePrice: 1480 }] },
  { id: '120-2026-04-30-douyin', hotelId: 120, date: '2026-04-30', channel: 'douyin', roomInputs: [{ roomTypeId: 'theme', status: 'on_sale', basePrice: 1280, salePrice: 1490 }] },
  { id: '120-2026-04-03-ctrip', hotelId: 120, date: '2026-04-03', channel: 'ctrip', roomInputs: [{ roomTypeId: 'theme', status: 'on_sale', basePrice: 1280, salePrice: 1510 }] },
  { id: '120-2026-04-03-meituan', hotelId: 120, date: '2026-04-03', channel: 'meituan', roomInputs: [{ roomTypeId: 'theme', status: 'on_sale', basePrice: 1280, salePrice: 1495 }] },
  { id: '120-2026-04-03-douyin', hotelId: 120, date: '2026-04-03', channel: 'douyin', roomInputs: [{ roomTypeId: 'theme', status: 'sold_out', basePrice: 1280, salePrice: 1470 }] },

  { id: '122-2026-04-01-ctrip', hotelId: 122, date: '2026-04-01', channel: 'ctrip', roomInputs: [{ roomTypeId: 'theme', status: 'on_sale', basePrice: 1880, salePrice: 2350 }] },
  { id: '122-2026-04-01-wechat', hotelId: 122, date: '2026-04-01', channel: 'wechat', roomInputs: [{ roomTypeId: 'theme', status: 'on_sale', basePrice: 1880, salePrice: 2330 }] },
  { id: '122-2026-04-01-fliggy', hotelId: 122, date: '2026-04-01', channel: 'fliggy', roomInputs: [{ roomTypeId: 'theme', status: 'sold_out', basePrice: 1880, salePrice: 2300 }] },
  { id: '122-2026-04-04-ctrip', hotelId: 122, date: '2026-04-04', channel: 'ctrip', roomInputs: [{ roomTypeId: 'theme', status: 'on_sale', basePrice: 1880, salePrice: 2360 }] },
  { id: '122-2026-04-04-wechat', hotelId: 122, date: '2026-04-04', channel: 'wechat', roomInputs: [{ roomTypeId: 'theme', status: 'on_sale', basePrice: 1880, salePrice: 2340 }] },
  { id: '122-2026-04-04-fliggy', hotelId: 122, date: '2026-04-04', channel: 'fliggy', roomInputs: [{ roomTypeId: 'theme', status: 'on_sale', basePrice: 1880, salePrice: 2320 }] },

  { id: '136-2026-04-01-ctrip', hotelId: 136, date: '2026-04-01', channel: 'ctrip', roomInputs: [{ roomTypeId: 'theme', status: 'on_sale', basePrice: 1760, salePrice: 2180 }] },
  { id: '136-2026-04-01-wechat', hotelId: 136, date: '2026-04-01', channel: 'wechat', roomInputs: [{ roomTypeId: 'theme', status: 'sold_out', basePrice: 1760, salePrice: 2150 }] },
  { id: '136-2026-04-01-douyin', hotelId: 136, date: '2026-04-01', channel: 'douyin', roomInputs: [{ roomTypeId: 'theme', status: 'on_sale', basePrice: 1760, salePrice: 2160 }] },
  { id: '136-2026-04-04-ctrip', hotelId: 136, date: '2026-04-04', channel: 'ctrip', roomInputs: [{ roomTypeId: 'theme', status: 'on_sale', basePrice: 1760, salePrice: 2190 }] },
  { id: '136-2026-04-04-wechat', hotelId: 136, date: '2026-04-04', channel: 'wechat', roomInputs: [{ roomTypeId: 'theme', status: 'on_sale', basePrice: 1760, salePrice: 2170 }] },
  { id: '136-2026-04-04-douyin', hotelId: 136, date: '2026-04-04', channel: 'douyin', roomInputs: [{ roomTypeId: 'theme', status: 'sold_out', basePrice: 1760, salePrice: 2140 }] },

  { id: '106-2026-04-05-ctrip', hotelId: 106, date: '2026-04-05', channel: 'ctrip', roomInputs: [{ roomTypeId: 'family', status: 'on_sale', basePrice: 980, salePrice: 1160 }] },
  { id: '106-2026-04-05-fliggy', hotelId: 106, date: '2026-04-05', channel: 'fliggy', roomInputs: [{ roomTypeId: 'family', status: 'sold_out', basePrice: 980, salePrice: 1140 }] },
  { id: '106-2026-04-07-ctrip', hotelId: 106, date: '2026-04-07', channel: 'ctrip', roomInputs: [{ roomTypeId: 'family', status: 'on_sale', basePrice: 980, salePrice: 1170 }] },
  { id: '106-2026-04-07-fliggy', hotelId: 106, date: '2026-04-07', channel: 'fliggy', roomInputs: [{ roomTypeId: 'family', status: 'on_sale', basePrice: 980, salePrice: 1150 }] },

  { id: '119-2026-04-06-ctrip', hotelId: 119, date: '2026-04-06', channel: 'ctrip', roomInputs: [{ roomTypeId: 'theme', status: 'on_sale', basePrice: 1150, salePrice: 1360 }] },
  { id: '119-2026-04-06-wechat', hotelId: 119, date: '2026-04-06', channel: 'wechat', roomInputs: [{ roomTypeId: 'theme', status: 'sold_out', basePrice: 1150, salePrice: 1340 }] },
  { id: '119-2026-04-06-meituan', hotelId: 119, date: '2026-04-06', channel: 'meituan', roomInputs: [{ roomTypeId: 'theme', status: 'on_sale', basePrice: 1150, salePrice: 1350 }] },
  { id: '119-2026-04-08-ctrip', hotelId: 119, date: '2026-04-08', channel: 'ctrip', roomInputs: [{ roomTypeId: 'theme', status: 'on_sale', basePrice: 1150, salePrice: 1370 }] },
  { id: '119-2026-04-08-wechat', hotelId: 119, date: '2026-04-08', channel: 'wechat', roomInputs: [{ roomTypeId: 'theme', status: 'on_sale', basePrice: 1150, salePrice: 1360 }] },
  { id: '119-2026-04-08-meituan', hotelId: 119, date: '2026-04-08', channel: 'meituan', roomInputs: [{ roomTypeId: 'theme', status: 'sold_out', basePrice: 1150, salePrice: 1330 }] },

  { id: '121-2026-04-06-ctrip', hotelId: 121, date: '2026-04-06', channel: 'ctrip', roomInputs: [{ roomTypeId: 'theme', status: 'on_sale', basePrice: 1380, salePrice: 1620 }] },
  { id: '121-2026-04-06-wechat', hotelId: 121, date: '2026-04-06', channel: 'wechat', roomInputs: [{ roomTypeId: 'theme', status: 'sold_out', basePrice: 1380, salePrice: 1600 }] },
  { id: '121-2026-04-06-meituan', hotelId: 121, date: '2026-04-06', channel: 'meituan', roomInputs: [{ roomTypeId: 'theme', status: 'on_sale', basePrice: 1380, salePrice: 1610 }] },
  { id: '121-2026-04-09-ctrip', hotelId: 121, date: '2026-04-09', channel: 'ctrip', roomInputs: [{ roomTypeId: 'theme', status: 'sold_out', basePrice: 1380, salePrice: 1580 }] },
  { id: '121-2026-04-09-wechat', hotelId: 121, date: '2026-04-09', channel: 'wechat', roomInputs: [{ roomTypeId: 'theme', status: 'on_sale', basePrice: 1380, salePrice: 1620 }] },
  { id: '121-2026-04-09-meituan', hotelId: 121, date: '2026-04-09', channel: 'meituan', roomInputs: [{ roomTypeId: 'theme', status: 'on_sale', basePrice: 1380, salePrice: 1605 }] },

  { id: '124-2026-04-05-ctrip', hotelId: 124, date: '2026-04-05', channel: 'ctrip', roomInputs: [{ roomTypeId: 'theme', status: 'on_sale', basePrice: 1320, salePrice: 1560 }] },
  { id: '124-2026-04-05-wechat', hotelId: 124, date: '2026-04-05', channel: 'wechat', roomInputs: [{ roomTypeId: 'theme', status: 'sold_out', basePrice: 1320, salePrice: 1540 }] },
  { id: '124-2026-04-08-ctrip', hotelId: 124, date: '2026-04-08', channel: 'ctrip', roomInputs: [{ roomTypeId: 'theme', status: 'on_sale', basePrice: 1320, salePrice: 1570 }] },
  { id: '124-2026-04-08-wechat', hotelId: 124, date: '2026-04-08', channel: 'wechat', roomInputs: [{ roomTypeId: 'theme', status: 'on_sale', basePrice: 1320, salePrice: 1550 }] },

  { id: '133-2026-04-06-ctrip', hotelId: 133, date: '2026-04-06', channel: 'ctrip', roomInputs: [{ roomTypeId: 'theme', status: 'on_sale', basePrice: 940, salePrice: 1110 }] },
  { id: '133-2026-04-06-wechat', hotelId: 133, date: '2026-04-06', channel: 'wechat', roomInputs: [{ roomTypeId: 'theme', status: 'sold_out', basePrice: 940, salePrice: 1090 }] },
  { id: '133-2026-04-06-douyin', hotelId: 133, date: '2026-04-06', channel: 'douyin', roomInputs: [{ roomTypeId: 'theme', status: 'on_sale', basePrice: 940, salePrice: 1100 }] },
  { id: '133-2026-04-09-ctrip', hotelId: 133, date: '2026-04-09', channel: 'ctrip', roomInputs: [{ roomTypeId: 'theme', status: 'on_sale', basePrice: 940, salePrice: 1120 }] },
  { id: '133-2026-04-09-wechat', hotelId: 133, date: '2026-04-09', channel: 'wechat', roomInputs: [{ roomTypeId: 'theme', status: 'on_sale', basePrice: 940, salePrice: 1100 }] },
  { id: '133-2026-04-09-douyin', hotelId: 133, date: '2026-04-09', channel: 'douyin', roomInputs: [{ roomTypeId: 'theme', status: 'sold_out', basePrice: 940, salePrice: 1080 }] },

  { id: '114-2026-04-11-ctrip', hotelId: 114, date: '2026-04-11', channel: 'ctrip', roomInputs: [{ roomTypeId: 'suite', status: 'on_sale', basePrice: 1699, salePrice: 2010 }] },
  { id: '114-2026-04-11-douyin', hotelId: 114, date: '2026-04-11', channel: 'douyin', roomInputs: [{ roomTypeId: 'suite', status: 'on_sale', basePrice: 1699, salePrice: 1990 }] },

  { id: '101-2026-04-12-ctrip', hotelId: 101, date: '2026-04-12', channel: 'ctrip', roomInputs: [{ roomTypeId: 'queen', status: 'on_sale', basePrice: 799, salePrice: 940 }, { roomTypeId: 'twin', status: 'on_sale', basePrice: 899, salePrice: 1050 }] },
  { id: '101-2026-04-12-meituan', hotelId: 101, date: '2026-04-12', channel: 'meituan', roomInputs: [{ roomTypeId: 'queen', status: 'sold_out', basePrice: 799, salePrice: 920 }, { roomTypeId: 'twin', status: 'on_sale', basePrice: 899, salePrice: 1030 }] },
  { id: '101-2026-04-12-douyin', hotelId: 101, date: '2026-04-12', channel: 'douyin', roomInputs: [{ roomTypeId: 'queen', status: 'on_sale', basePrice: 799, salePrice: 930 }, { roomTypeId: 'twin', status: 'sold_out', basePrice: 899, salePrice: 1020 }] },
  { id: '101-2026-04-14-ctrip', hotelId: 101, date: '2026-04-14', channel: 'ctrip', roomInputs: [{ roomTypeId: 'queen', status: 'on_sale', basePrice: 799, salePrice: 935 }, { roomTypeId: 'twin', status: 'on_sale', basePrice: 899, salePrice: 1045 }] },
  { id: '101-2026-04-14-meituan', hotelId: 101, date: '2026-04-14', channel: 'meituan', roomInputs: [{ roomTypeId: 'queen', status: 'on_sale', basePrice: 799, salePrice: 925 }, { roomTypeId: 'twin', status: 'sold_out', basePrice: 899, salePrice: 1015 }] },
  { id: '101-2026-04-14-douyin', hotelId: 101, date: '2026-04-14', channel: 'douyin', roomInputs: [{ roomTypeId: 'queen', status: 'sold_out', basePrice: 799, salePrice: 915 }, { roomTypeId: 'twin', status: 'on_sale', basePrice: 899, salePrice: 1030 }] },

  { id: '102-2026-04-12-ctrip', hotelId: 102, date: '2026-04-12', channel: 'ctrip', roomInputs: [{ roomTypeId: 'family', status: 'on_sale', basePrice: 1099, salePrice: 1320 }] },
  { id: '102-2026-04-12-wechat', hotelId: 102, date: '2026-04-12', channel: 'wechat', roomInputs: [{ roomTypeId: 'family', status: 'sold_out', basePrice: 1099, salePrice: 1290 }] },
  { id: '102-2026-04-12-fliggy', hotelId: 102, date: '2026-04-12', channel: 'fliggy', roomInputs: [{ roomTypeId: 'family', status: 'on_sale', basePrice: 1099, salePrice: 1300 }] },
  { id: '102-2026-04-15-ctrip', hotelId: 102, date: '2026-04-15', channel: 'ctrip', roomInputs: [{ roomTypeId: 'family', status: 'on_sale', basePrice: 1099, salePrice: 1310 }] },
  { id: '102-2026-04-15-wechat', hotelId: 102, date: '2026-04-15', channel: 'wechat', roomInputs: [{ roomTypeId: 'family', status: 'on_sale', basePrice: 1099, salePrice: 1305 }] },
  { id: '102-2026-04-15-fliggy', hotelId: 102, date: '2026-04-15', channel: 'fliggy', roomInputs: [{ roomTypeId: 'family', status: 'sold_out', basePrice: 1099, salePrice: 1285 }] },

  { id: '105-2026-04-13-ctrip', hotelId: 105, date: '2026-04-13', channel: 'ctrip', roomInputs: [{ roomTypeId: 'queen', status: 'on_sale', basePrice: 860, salePrice: 1000 }, { roomTypeId: 'twin', status: 'on_sale', basePrice: 930, salePrice: 1080 }] },
  { id: '105-2026-04-13-wechat', hotelId: 105, date: '2026-04-13', channel: 'wechat', roomInputs: [{ roomTypeId: 'queen', status: 'sold_out', basePrice: 860, salePrice: 980 }, { roomTypeId: 'twin', status: 'on_sale', basePrice: 930, salePrice: 1065 }] },
  { id: '105-2026-04-13-meituan', hotelId: 105, date: '2026-04-13', channel: 'meituan', roomInputs: [{ roomTypeId: 'queen', status: 'on_sale', basePrice: 860, salePrice: 990 }, { roomTypeId: 'twin', status: 'sold_out', basePrice: 930, salePrice: 1050 }] },
  { id: '105-2026-04-15-ctrip', hotelId: 105, date: '2026-04-15', channel: 'ctrip', roomInputs: [{ roomTypeId: 'queen', status: 'on_sale', basePrice: 860, salePrice: 1005 }, { roomTypeId: 'twin', status: 'on_sale', basePrice: 930, salePrice: 1085 }] },
  { id: '105-2026-04-15-wechat', hotelId: 105, date: '2026-04-15', channel: 'wechat', roomInputs: [{ roomTypeId: 'queen', status: 'on_sale', basePrice: 860, salePrice: 995 }, { roomTypeId: 'twin', status: 'sold_out', basePrice: 930, salePrice: 1060 }] },
  { id: '105-2026-04-15-meituan', hotelId: 105, date: '2026-04-15', channel: 'meituan', roomInputs: [{ roomTypeId: 'queen', status: 'sold_out', basePrice: 860, salePrice: 975 }, { roomTypeId: 'twin', status: 'on_sale', basePrice: 930, salePrice: 1070 }] },

  { id: '113-2026-04-12-ctrip', hotelId: 113, date: '2026-04-12', channel: 'ctrip', roomInputs: [{ roomTypeId: 'family', status: 'on_sale', basePrice: 900, salePrice: 1060 }] },
  { id: '113-2026-04-12-wechat', hotelId: 113, date: '2026-04-12', channel: 'wechat', roomInputs: [{ roomTypeId: 'family', status: 'sold_out', basePrice: 900, salePrice: 1030 }] },
  { id: '113-2026-04-14-ctrip', hotelId: 113, date: '2026-04-14', channel: 'ctrip', roomInputs: [{ roomTypeId: 'family', status: 'on_sale', basePrice: 900, salePrice: 1050 }] },
  { id: '113-2026-04-14-wechat', hotelId: 113, date: '2026-04-14', channel: 'wechat', roomInputs: [{ roomTypeId: 'family', status: 'on_sale', basePrice: 900, salePrice: 1040 }] },

  { id: '117-2026-04-13-ctrip', hotelId: 117, date: '2026-04-13', channel: 'ctrip', roomInputs: [{ roomTypeId: 'queen', status: 'on_sale', basePrice: 880, salePrice: 1020 }, { roomTypeId: 'suite', status: 'on_sale', basePrice: 1480, salePrice: 1740 }] },
  { id: '117-2026-04-13-wechat', hotelId: 117, date: '2026-04-13', channel: 'wechat', roomInputs: [{ roomTypeId: 'queen', status: 'sold_out', basePrice: 880, salePrice: 1000 }, { roomTypeId: 'suite', status: 'on_sale', basePrice: 1480, salePrice: 1710 }] },
  { id: '117-2026-04-13-douyin', hotelId: 117, date: '2026-04-13', channel: 'douyin', roomInputs: [{ roomTypeId: 'queen', status: 'on_sale', basePrice: 880, salePrice: 1015 }, { roomTypeId: 'suite', status: 'sold_out', basePrice: 1480, salePrice: 1700 }] },
  { id: '117-2026-04-16-ctrip', hotelId: 117, date: '2026-04-16', channel: 'ctrip', roomInputs: [{ roomTypeId: 'queen', status: 'on_sale', basePrice: 880, salePrice: 1030 }, { roomTypeId: 'suite', status: 'on_sale', basePrice: 1480, salePrice: 1750 }] },
  { id: '117-2026-04-16-wechat', hotelId: 117, date: '2026-04-16', channel: 'wechat', roomInputs: [{ roomTypeId: 'queen', status: 'on_sale', basePrice: 880, salePrice: 1010 }, { roomTypeId: 'suite', status: 'on_sale', basePrice: 1480, salePrice: 1720 }] },
  { id: '117-2026-04-16-douyin', hotelId: 117, date: '2026-04-16', channel: 'douyin', roomInputs: [{ roomTypeId: 'queen', status: 'sold_out', basePrice: 880, salePrice: 995 }, { roomTypeId: 'suite', status: 'on_sale', basePrice: 1480, salePrice: 1705 }] },

  { id: '120-2026-04-12-ctrip', hotelId: 120, date: '2026-04-12', channel: 'ctrip', roomInputs: [{ roomTypeId: 'theme', status: 'on_sale', basePrice: 1280, salePrice: 1500 }] },
  { id: '120-2026-04-12-meituan', hotelId: 120, date: '2026-04-12', channel: 'meituan', roomInputs: [{ roomTypeId: 'theme', status: 'sold_out', basePrice: 1280, salePrice: 1480 }] },
  { id: '120-2026-04-12-douyin', hotelId: 120, date: '2026-04-12', channel: 'douyin', roomInputs: [{ roomTypeId: 'theme', status: 'on_sale', basePrice: 1280, salePrice: 1490 }] },
  { id: '120-2026-04-15-ctrip', hotelId: 120, date: '2026-04-15', channel: 'ctrip', roomInputs: [{ roomTypeId: 'theme', status: 'on_sale', basePrice: 1280, salePrice: 1510 }] },
  { id: '120-2026-04-15-meituan', hotelId: 120, date: '2026-04-15', channel: 'meituan', roomInputs: [{ roomTypeId: 'theme', status: 'on_sale', basePrice: 1280, salePrice: 1495 }] },
  { id: '120-2026-04-15-douyin', hotelId: 120, date: '2026-04-15', channel: 'douyin', roomInputs: [{ roomTypeId: 'theme', status: 'sold_out', basePrice: 1280, salePrice: 1475 }] },

  { id: '102-2026-04-10-ctrip', hotelId: 102, date: '2026-04-10', channel: 'ctrip', roomInputs: [{ roomTypeId: 'family', status: 'on_sale', basePrice: 1099, salePrice: 1310 }] },
  { id: '102-2026-04-17-ctrip', hotelId: 102, date: '2026-04-17', channel: 'ctrip', roomInputs: [{ roomTypeId: 'family', status: 'sold_out', basePrice: 1099, salePrice: 1290 }] },
  { id: '102-2026-04-28-ctrip', hotelId: 102, date: '2026-04-28', channel: 'ctrip', roomInputs: [{ roomTypeId: 'family', status: 'on_sale', basePrice: 1099, salePrice: 1305 }] },
  { id: '102-2026-04-30-ctrip', hotelId: 102, date: '2026-04-30', channel: 'ctrip', roomInputs: [{ roomTypeId: 'family', status: 'on_sale', basePrice: 1099, salePrice: 1320 }] },

  { id: '105-2026-04-04-ctrip', hotelId: 105, date: '2026-04-04', channel: 'ctrip', roomInputs: [{ roomTypeId: 'queen', status: 'on_sale', basePrice: 860, salePrice: 995 }, { roomTypeId: 'twin', status: 'sold_out', basePrice: 930, salePrice: 1070 }] },
  { id: '105-2026-04-22-ctrip', hotelId: 105, date: '2026-04-22', channel: 'ctrip', roomInputs: [{ roomTypeId: 'queen', status: 'on_sale', basePrice: 860, salePrice: 1000 }, { roomTypeId: 'twin', status: 'on_sale', basePrice: 930, salePrice: 1080 }] },
  { id: '105-2026-04-24-ctrip', hotelId: 105, date: '2026-04-24', channel: 'ctrip', roomInputs: [{ roomTypeId: 'queen', status: 'sold_out', basePrice: 860, salePrice: 980 }, { roomTypeId: 'twin', status: 'on_sale', basePrice: 930, salePrice: 1060 }] },
  { id: '105-2026-04-30-ctrip', hotelId: 105, date: '2026-04-30', channel: 'ctrip', roomInputs: [{ roomTypeId: 'queen', status: 'on_sale', basePrice: 860, salePrice: 1005 }, { roomTypeId: 'twin', status: 'on_sale', basePrice: 930, salePrice: 1085 }] },

  { id: '107-2026-04-02-ctrip', hotelId: 107, date: '2026-04-02', channel: 'ctrip', roomInputs: [{ roomTypeId: 'theme', status: 'on_sale', basePrice: 760, salePrice: 880 }] },
  { id: '107-2026-04-04-meituan', hotelId: 107, date: '2026-04-04', channel: 'meituan', roomInputs: [{ roomTypeId: 'theme', status: 'sold_out', basePrice: 760, salePrice: 860 }] },
  { id: '107-2026-04-10-ctrip', hotelId: 107, date: '2026-04-10', channel: 'ctrip', roomInputs: [{ roomTypeId: 'theme', status: 'on_sale', basePrice: 760, salePrice: 890 }] },
  { id: '107-2026-04-14-ctrip', hotelId: 107, date: '2026-04-14', channel: 'ctrip', roomInputs: [{ roomTypeId: 'theme', status: 'on_sale', basePrice: 760, salePrice: 885 }] },
  { id: '107-2026-04-16-meituan', hotelId: 107, date: '2026-04-16', channel: 'meituan', roomInputs: [{ roomTypeId: 'theme', status: 'sold_out', basePrice: 760, salePrice: 850 }] },
  { id: '107-2026-04-28-ctrip', hotelId: 107, date: '2026-04-28', channel: 'ctrip', roomInputs: [{ roomTypeId: 'theme', status: 'on_sale', basePrice: 760, salePrice: 880 }] },
  { id: '107-2026-04-30-douyin', hotelId: 107, date: '2026-04-30', channel: 'douyin', roomInputs: [{ roomTypeId: 'theme', status: 'on_sale', basePrice: 760, salePrice: 870 }] },

  { id: '113-2026-04-02-ctrip', hotelId: 113, date: '2026-04-02', channel: 'ctrip', roomInputs: [{ roomTypeId: 'family', status: 'on_sale', basePrice: 900, salePrice: 1040 }] },
  { id: '113-2026-04-04-wechat', hotelId: 113, date: '2026-04-04', channel: 'wechat', roomInputs: [{ roomTypeId: 'family', status: 'sold_out', basePrice: 900, salePrice: 1020 }] },
  { id: '113-2026-04-10-ctrip', hotelId: 113, date: '2026-04-10', channel: 'ctrip', roomInputs: [{ roomTypeId: 'family', status: 'on_sale', basePrice: 900, salePrice: 1050 }] },
  { id: '113-2026-04-28-ctrip', hotelId: 113, date: '2026-04-28', channel: 'ctrip', roomInputs: [{ roomTypeId: 'family', status: 'on_sale', basePrice: 900, salePrice: 1060 }] },
  { id: '113-2026-04-30-wechat', hotelId: 113, date: '2026-04-30', channel: 'wechat', roomInputs: [{ roomTypeId: 'family', status: 'on_sale', basePrice: 900, salePrice: 1040 }] },

  { id: '117-2026-04-02-ctrip', hotelId: 117, date: '2026-04-02', channel: 'ctrip', roomInputs: [{ roomTypeId: 'queen', status: 'on_sale', basePrice: 880, salePrice: 1010 }, { roomTypeId: 'suite', status: 'on_sale', basePrice: 1480, salePrice: 1720 }] },
  { id: '117-2026-04-04-wechat', hotelId: 117, date: '2026-04-04', channel: 'wechat', roomInputs: [{ roomTypeId: 'queen', status: 'sold_out', basePrice: 880, salePrice: 990 }, { roomTypeId: 'suite', status: 'on_sale', basePrice: 1480, salePrice: 1700 }] },
  { id: '117-2026-04-10-ctrip', hotelId: 117, date: '2026-04-10', channel: 'ctrip', roomInputs: [{ roomTypeId: 'queen', status: 'on_sale', basePrice: 880, salePrice: 1020 }, { roomTypeId: 'suite', status: 'sold_out', basePrice: 1480, salePrice: 1690 }] },
  { id: '117-2026-04-12-douyin', hotelId: 117, date: '2026-04-12', channel: 'douyin', roomInputs: [{ roomTypeId: 'queen', status: 'on_sale', basePrice: 880, salePrice: 1005 }, { roomTypeId: 'suite', status: 'on_sale', basePrice: 1480, salePrice: 1710 }] },
  { id: '117-2026-04-28-ctrip', hotelId: 117, date: '2026-04-28', channel: 'ctrip', roomInputs: [{ roomTypeId: 'queen', status: 'on_sale', basePrice: 880, salePrice: 1030 }, { roomTypeId: 'suite', status: 'on_sale', basePrice: 1480, salePrice: 1730 }] },
  { id: '117-2026-04-30-wechat', hotelId: 117, date: '2026-04-30', channel: 'wechat', roomInputs: [{ roomTypeId: 'queen', status: 'sold_out', basePrice: 880, salePrice: 995 }, { roomTypeId: 'suite', status: 'on_sale', basePrice: 1480, salePrice: 1700 }] },

  { id: '120-2026-04-05-ctrip', hotelId: 120, date: '2026-04-05', channel: 'ctrip', roomInputs: [{ roomTypeId: 'theme', status: 'on_sale', basePrice: 1280, salePrice: 1500 }] },
  { id: '120-2026-04-10-ctrip', hotelId: 120, date: '2026-04-10', channel: 'ctrip', roomInputs: [{ roomTypeId: 'theme', status: 'on_sale', basePrice: 1280, salePrice: 1510 }] },
  { id: '120-2026-04-22-ctrip', hotelId: 120, date: '2026-04-22', channel: 'ctrip', roomInputs: [{ roomTypeId: 'theme', status: 'on_sale', basePrice: 1280, salePrice: 1505 }] },
  { id: '120-2026-04-24-meituan', hotelId: 120, date: '2026-04-24', channel: 'meituan', roomInputs: [{ roomTypeId: 'theme', status: 'sold_out', basePrice: 1280, salePrice: 1480 }] },
  { id: '120-2026-04-28-ctrip', hotelId: 120, date: '2026-04-28', channel: 'ctrip', roomInputs: [{ roomTypeId: 'theme', status: 'on_sale', basePrice: 1280, salePrice: 1510 }] },

  { id: '101-2026-05-01-ctrip-morning', hotelId: 101, date: '2026-05-01', channel: 'ctrip', inspectionAt: '2026-05-01T02:00:00.000Z', presalePackageTitle: '上午复核·爱丽丝主题房+早餐', roomInputs: [{ roomTypeId: 'queen', status: 'on_sale', basePrice: 799, salePrice: 1000 }, { roomTypeId: 'twin', status: 'on_sale', basePrice: 899, salePrice: 1100 }] },
  { id: '101-2026-05-01-ctrip-afternoon', hotelId: 101, date: '2026-05-01', channel: 'ctrip', inspectionAt: '2026-05-01T10:00:00.000Z', presalePackageTitle: '', roomInputs: [{ roomTypeId: 'queen', status: 'on_sale', basePrice: 799, salePrice: 1020 }, { roomTypeId: 'twin', status: 'on_sale', basePrice: 899, salePrice: 1110 }] }
];
