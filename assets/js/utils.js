const Utils = (() => {
  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
  };

  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return '-';
    const d = new Date(dateTimeStr);
    if (Number.isNaN(d.getTime())) return '-';
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const h = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${y}/${m}/${day} ${h}:${min}`;
  };

  const screenResultLabel = (result) => {
    const map = {
      qualified: '合格客户，推荐到店',
      nurture: '培育客户，线上跟进',
      invalid: '无效客户，停止投入'
    };
    return map[result] || '-';
  };

  const screenResultShort = (result) => {
    const map = { qualified: '合格客户', nurture: '培育客户', invalid: '无效客户' };
    return map[result] || '-';
  };

  const screenResultTag = (result) => {
    const map = { qualified: 'success', nurture: 'warning', invalid: 'danger' };
    return map[result] || 'info';
  };

  const classifyScore = (score) => {
    if (score >= 70) return 'qualified';
    if (score >= 50) return 'nurture';
    return 'invalid';
  };

  const detectCityTier = (address) => {
    if (!address) return '未知';
    for (const [city, tier] of Object.entries(CITY_TIER_MAP)) {
      if (address.includes(city)) return tier;
    }
    return '未知';
  };

  const getUrlParam = (key) => {
    const params = new URLSearchParams(window.location.search);
    return params.get(key);
  };

  // 规范线性流程：前置阶段未完成时，后续 completed 强制为 false
  const normalizeLinearFlow = (h) => {
    const sd = h.stageData;
    if (!sd) return h;
    if (!sd.screening?.completed) {
      if (sd.pitch)    sd.pitch.completed    = false;
      if (sd.negotiate) sd.negotiate.completed = false;
      if (sd.contract)  sd.contract.completed  = false;
      h.signedAt = null;
    } else if (!sd.pitch?.completed) {
      if (sd.negotiate) sd.negotiate.completed = false;
      if (sd.contract)  sd.contract.completed  = false;
      h.signedAt = null;
    } else if (!sd.negotiate?.completed) {
      if (sd.contract)  sd.contract.completed  = false;
      h.signedAt = null;
    }
    return h;
  };

  const getAllHotels = () => {
    const saved = localStorage.getItem('hotels_data');
    const hotels = saved ? JSON.parse(saved) : MOCK_HOTELS;
    return hotels.map(normalizeLinearFlow);
  };

  const getHotelById = (id) => {
    const numId = Number(id);
    return getAllHotels().find(h => h.id === numId) || null;
  };

  const saveHotels = (hotels) => {
    localStorage.setItem('hotels_data', JSON.stringify(hotels));
  };

  const saveHotel = (hotel) => {
    const hotels = getAllHotels();
    const idx = hotels.findIndex(h => h.id === hotel.id);
    hotel.updatedAt = new Date().toISOString().split('T')[0];
    if (idx >= 0) {
      hotels[idx] = hotel;
    } else {
      hotel.id = hotels.length ? Math.max(...hotels.map(h => h.id)) + 1 : 1;
      hotel.createdAt = hotel.updatedAt;
      hotels.push(hotel);
    }
    saveHotels(hotels);
    return hotel;
  };

  const OPS_ALLOWED_CHANNELS = ['ctrip', 'fliggy', 'meituan', 'douyin'];
  const BUSINESS_MODE_MAP = {
    yearly_guarantee: '全年保底',
    peak_guarantee: '旺季保底',
    buyout: '买断'
  };
  const AUDIT_STATUS_MAP = {
    pending_submit: { label: '待提交', tag: 'info' },
    pending_finance: { label: '待财务复审', tag: 'warning' },
    approved: { label: '审核通过', tag: 'success' }
  };
  const OTA_PATROL_STATUS_MAP = {
    normal: { label: '正常', tag: 'success' },
    processing: { label: '处理中', tag: 'danger' },
    pending_review: { label: '待验收', tag: 'warning' }
  };
  const OTA_PATROL_RESULT_MAP = {
    normal: { label: '正常', tag: 'success' },
    listing: { label: '上架异常', tag: 'danger' },
    premium: { label: '溢价异常', tag: 'warning' },
    both: { label: '上架+溢价异常', tag: 'danger' },
    unknown: { label: '待巡检', tag: 'info' }
  };
  const normalizeRecoveryApply = (payload) => {
    const source = payload || {};
    const images = Array.isArray(source.images) ? source.images : [];
    const normalizedImages = images
      .map((item) => {
        if (typeof item === 'string') {
          return { name: '截图', url: item };
        }
        if (!item || !item.url) return null;
        return { name: String(item.name || '截图'), url: String(item.url) };
      })
      .filter(Boolean)
      .slice(0, 5);
    return {
      content: String(source.content || '').trim(),
      images: normalizedImages,
      submittedAt: String(source.submittedAt || ''),
      submittedBy: String(source.submittedBy || '')
    };
  };

  const calcOpsRoomTotal = (roomTypes) => (roomTypes || [])
    .reduce((sum, item) => sum + (Number(item.cooperationRooms) || 0), 0);

  const normalizeOpsHotel = (hotel) => {
    const source = hotel || {};
    if (source.__opsNormalized) return source;
    const roomTypes = (source.roomTypes || []).map((room, idx) => ({
      id: room.id || `room_${idx + 1}`,
      name: String(room.name || '').trim(),
      basePrice: Number(room.basePrice) || 0,
      cooperationRooms: Math.max(Number(room.cooperationRooms) || 0, 0)
    }));
    const termsSource = source.businessTerms || {};
    const status = Object.prototype.hasOwnProperty.call(AUDIT_STATUS_MAP, source.auditStatus)
      ? source.auditStatus
      : 'pending_submit';

    const patrolSource = source.otaPatrol || {};
    const patrolStatus = Object.prototype.hasOwnProperty.call(OTA_PATROL_STATUS_MAP, patrolSource.processingStatus)
      ? patrolSource.processingStatus
      : 'normal';
    const patrolResult = Object.prototype.hasOwnProperty.call(OTA_PATROL_RESULT_MAP, patrolSource.lastResultType)
      ? patrolSource.lastResultType
      : 'unknown';
    const byChannelSource = patrolSource.byChannel || {};
    const byChannel = {};
    Object.keys(byChannelSource).forEach((ch) => {
      const entry = byChannelSource[ch] || {};
      const chStatus = Object.prototype.hasOwnProperty.call(OTA_PATROL_STATUS_MAP, entry.processingStatus)
        ? entry.processingStatus
        : 'normal';
      const chResult = Object.prototype.hasOwnProperty.call(OTA_PATROL_RESULT_MAP, entry.lastResultType)
        ? entry.lastResultType
        : 'unknown';
      byChannel[ch] = {
        processingStatus: chStatus,
        pendingApplyAt: String(entry.pendingApplyAt || ''),
        abnormalStartedAt: String(entry.abnormalStartedAt || ''),
        lastInspectionAt: String(entry.lastInspectionAt || ''),
        lastInspectionDate: String(entry.lastInspectionDate || ''),
        lastResultType: chResult,
        rankingPosition: parseRankingPosition(entry.rankingPosition),
        rankingStatus: calcRankingStatusByPosition(entry.rankingPosition),
        rankingScreenshot: String(entry.rankingScreenshot || ''),
        presalePackageTitle: String(entry.presalePackageTitle || ''),
        presaleScreenshot: String(entry.presaleScreenshot || ''),
        recoveryApply: normalizeRecoveryApply(entry.recoveryApply)
      };
    });

    return {
      ...source,
      __opsNormalized: true,
      id: Number(source.id) || source.id,
      name: String(source.name || '').trim(),
      province: String(source.province || '').trim(),
      city: String(source.city || '').trim(),
      ownerSales: String(source.ownerSales || '').trim(),
      ownerOps: String(source.ownerOps || '').trim(),
      themeName: String(source.themeName || '奇趣爱丽丝').trim(),
      launchDate: String(source.launchDate || ''),
      targetPremiumRate: Number(source.targetPremiumRate) || 0,
      channels: (source.channels || []).filter((item) => OPS_ALLOWED_CHANNELS.includes(item)),
      roomTypes,
      businessTerms: {
        mode: termsSource.mode || 'yearly_guarantee',
        yearlyGuaranteePrice: String(termsSource.yearlyGuaranteePrice || ''),
        peakGuaranteePrice: String(termsSource.peakGuaranteePrice || ''),
        buyoutUnitPrice: String(termsSource.buyoutUnitPrice || ''),
        cooperationPeriod: String(termsSource.cooperationPeriod || ''),
        commissionPolicy: String(termsSource.commissionPolicy || ''),
        maintenanceFee: String(termsSource.maintenanceFee || ''),
        buyoutTotalPrice: String(termsSource.buyoutTotalPrice || ''),
        buyoutTotalManual: !!termsSource.buyoutTotalManual,
        otherTerms: String(termsSource.otherTerms || '')
      },
      auditStatus: status,
      financeReview: {
        modifiedFields: Array.isArray(source.financeReview?.modifiedFields) ? source.financeReview.modifiedFields : [],
        modifiedAt: String(source.financeReview?.modifiedAt || ''),
        modifiedBy: String(source.financeReview?.modifiedBy || ''),
        note: String(source.financeReview?.note || '')
      },
      otaPatrol: {
        processingStatus: patrolStatus,
        pendingApplyAt: String(patrolSource.pendingApplyAt || ''),
        abnormalStartedAt: String(patrolSource.abnormalStartedAt || ''),
        lastInspectionAt: String(patrolSource.lastInspectionAt || ''),
        lastInspectionDate: String(patrolSource.lastInspectionDate || ''),
        lastChannel: String(patrolSource.lastChannel || ''),
        lastResultType: patrolResult,
        byChannel
      },
      totalCooperationRooms: calcOpsRoomTotal(roomTypes)
    };
  };

  const getAuditStatusMeta = (status) => AUDIT_STATUS_MAP[status] || AUDIT_STATUS_MAP.pending_submit;
  const getBusinessModeLabel = (mode) => BUSINESS_MODE_MAP[mode] || '-';
  const getOpsPatrolStatusMeta = (status) => OTA_PATROL_STATUS_MAP[status] || OTA_PATROL_STATUS_MAP.normal;
  const getOpsPatrolResultMeta = (result) => OTA_PATROL_RESULT_MAP[result] || OTA_PATROL_RESULT_MAP.unknown;

  const parseRankingPosition = (value) => {
    if (value === '' || value === null || typeof value === 'undefined') return '';
    const num = Number(value);
    if (!Number.isFinite(num) || num <= 0) return '';
    return Math.floor(num);
  };

  const calcRankingStatusByPosition = (rankingPosition) => {
    const num = parseRankingPosition(rankingPosition);
    if (!num) return 'unknown';
    return num <= 5 ? 'normal' : 'abnormal';
  };

  const OTA_PRESALE_TEMPLATES = [
    '爱丽丝主题房+双人自助餐',
    '爱丽丝主题房+双人早餐',
    '亲子主题房+乐园门票',
    '主题套房+双人下午茶',
    '爱丽丝家庭房+亲子自助餐',
    '主题双床房+自助晚餐'
  ];
  const clampDateToNow = (dateStr, nowDate) => {
    const source = String(dateStr || '').trim();
    if (!source) return '';
    const limit = `${nowDate.getFullYear()}-${String(nowDate.getMonth() + 1).padStart(2, '0')}-${String(nowDate.getDate()).padStart(2, '0')}`;
    return source > limit ? limit : source;
  };
  const clampInspectionAtToNow = (inspectionAt, nowMs) => {
    const source = String(inspectionAt || '').trim();
    if (!source) return '';
    const parsedMs = new Date(source).getTime();
    if (Number.isNaN(parsedMs)) return new Date(nowMs).toISOString();
    return parsedMs > nowMs ? new Date(nowMs).toISOString() : new Date(parsedMs).toISOString();
  };
  const autoPresaleTitleByRecord = (record) => {
    const hotelId = Number(record?.hotelId) || 0;
    const channel = String(record?.channel || '');
    if (!hotelId || !channel) return '';
    const channelScore = channel.split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
    const seed = hotelId * 7 + channelScore;
    if (seed % 3 !== 0) return '';
    return OTA_PRESALE_TEMPLATES[seed % OTA_PRESALE_TEMPLATES.length];
  };

  const calcOpsPatrolResultType = (hotel, record) => {
    const targetPremiumRate = Number(hotel?.targetPremiumRate) || 0;
    let listingAbnormal = false;
    let premiumAbnormal = false;
    (record?.roomInputs || []).forEach((room) => {
      if (room.status === 'not_listed' || room.status === 'unavailable') listingAbnormal = true;
      if (room.status !== 'not_listed' && room.status !== 'unavailable') {
        const premium = calcPremiumRate(room.salePrice, room.basePrice);
        if (premium > targetPremiumRate) premiumAbnormal = true;
      }
    });
    if (listingAbnormal && premiumAbnormal) return 'both';
    if (listingAbnormal) return 'listing';
    if (premiumAbnormal) return 'premium';
    return 'normal';
  };

  const calcOpsAbnormalDurationHours = (abnormalStartedAt) => {
    if (!abnormalStartedAt) return 0;
    const startedMs = new Date(abnormalStartedAt).getTime();
    if (Number.isNaN(startedMs)) return 0;
    return Math.max(Math.floor((Date.now() - startedMs) / 3600000), 0);
  };

  const normalizeOpsPatrolRecord = (record) => {
    const source = record || {};
    if (source.__opsRecordNormalized) return source;
    const nowDate = new Date();
    const nowMs = nowDate.getTime();
    const roomInputs = (source.roomInputs || []).map((room) => ({
      ...room,
      roomTypeId: String(room.roomTypeId || ''),
      status: String(room.status || 'on_sale'),
      basePrice: Number(room.basePrice) || 0,
      salePrice: Number(room.salePrice) || 0,
      imageNames: Array.isArray(room.imageNames) ? room.imageNames : [],
      imageItems: Array.isArray(room.imageItems) ? room.imageItems : []
    }));
    const rankingPosition = parseRankingPosition(source.rankingPosition);
    const date = clampDateToNow(source.date, nowDate);
    const inspectionAt = clampInspectionAtToNow(source.inspectionAt || (date ? `${date}T00:00:00` : ''), nowMs);
    const presalePackageTitle = String(source.presalePackageTitle ?? '').trim() || autoPresaleTitleByRecord(source);
    return {
      ...source,
      __opsRecordNormalized: true,
      date,
      inspectionAt,
      rankingPosition,
      rankingStatus: calcRankingStatusByPosition(rankingPosition),
      rankingScreenshot: String(source.rankingScreenshot || ''),
      presalePackageTitle,
      presaleScreenshot: String(source.presaleScreenshot || ''),
      roomInputs
    };
  };

  const aggregateHotelPatrolFromByChannel = (byChannel) => {
    const channels = Object.values(byChannel || {});
    if (!channels.length) {
      return {
        processingStatus: 'normal',
        pendingApplyAt: '',
        abnormalStartedAt: '',
        lastInspectionAt: '',
        lastInspectionDate: '',
        lastChannel: '',
        lastResultType: 'unknown'
      };
    }
    // 酒店级 lastInspection = 各渠道最近一次的最大值
    let latestChannelKey = '';
    let latestInspectionAt = '';
    Object.keys(byChannel).forEach((ch) => {
      const entry = byChannel[ch];
      if (entry.lastInspectionAt && entry.lastInspectionAt > latestInspectionAt) {
        latestInspectionAt = entry.lastInspectionAt;
        latestChannelKey = ch;
      }
    });
    // 酒店级 lastResultType：取最近一次的判定
    const lastResultType = latestChannelKey ? byChannel[latestChannelKey].lastResultType : 'unknown';
    // 处理状态优先级：processing > pending_review > normal
    let processingStatus = 'normal';
    channels.forEach((c) => {
      if (c.processingStatus === 'processing') processingStatus = 'processing';
      else if (c.processingStatus === 'pending_review' && processingStatus !== 'processing') processingStatus = 'pending_review';
    });
    // 异常开始时间：取各渠道里最早的那个非空值
    const abnormalStartedAt = channels
      .map((c) => c.abnormalStartedAt)
      .filter(Boolean)
      .sort()[0] || '';
    const lastInspectionDate = latestInspectionAt ? latestInspectionAt.split('T')[0] : '';
    return {
      processingStatus,
      pendingApplyAt: '',
      abnormalStartedAt,
      lastInspectionAt: latestInspectionAt,
      lastInspectionDate,
      lastChannel: latestChannelKey,
      lastResultType
    };
  };

  const deriveHotelPatrolFromRecords = (hotel, records) => {
    const hotelRecords = (records || [])
      .filter((item) => Number(item.hotelId) === Number(hotel.id))
      .slice();
    const base = normalizeOpsHotel(hotel).otaPatrol;
    if (!hotelRecords.length) return { ...base, byChannel: {} };

    const grouped = {};
    hotelRecords.forEach((r) => {
      if (!grouped[r.channel]) grouped[r.channel] = [];
      grouped[r.channel].push(r);
    });

    const byChannel = {};
    Object.keys(grouped).forEach((channel) => {
      const sorted = grouped[channel].slice().sort((a, b) => {
        const at = String(a.inspectionAt || `${a.date}T00:00:00`);
        const bt = String(b.inspectionAt || `${b.date}T00:00:00`);
        if (at !== bt) return at.localeCompare(bt);
        return String(a.id || '').localeCompare(String(b.id || ''));
      });
      let abnormalStartedAt = '';
      let processingStatus = 'normal';
      let lastResultType = 'unknown';
      let lastInspectionAt = '';
      let lastInspectionDate = '';
      let rankingPosition = '';
      let rankingStatus = 'unknown';
      let rankingScreenshot = '';
      let presalePackageTitle = '';
      let presaleScreenshot = '';
      sorted.forEach((record) => {
        const resultType = calcOpsPatrolResultType(hotel, record);
        const isAbnormal = resultType !== 'normal';
        const recordTime = String(record.inspectionAt || `${record.date}T00:00:00`);
        if (isAbnormal) {
          if (!abnormalStartedAt) abnormalStartedAt = recordTime;
          processingStatus = 'processing';
        } else {
          abnormalStartedAt = '';
          processingStatus = 'normal';
        }
        lastResultType = resultType;
        lastInspectionAt = recordTime;
        lastInspectionDate = record.date;
        rankingPosition = parseRankingPosition(record.rankingPosition);
        rankingStatus = calcRankingStatusByPosition(rankingPosition);
        rankingScreenshot = String(record.rankingScreenshot || '');
        presalePackageTitle = String(record.presalePackageTitle || '');
        presaleScreenshot = String(record.presaleScreenshot || '');
      });
      byChannel[channel] = {
        processingStatus,
        pendingApplyAt: '',
        abnormalStartedAt,
        lastInspectionAt,
        lastInspectionDate,
        lastResultType,
        rankingPosition,
        rankingStatus,
        rankingScreenshot,
        presalePackageTitle,
        presaleScreenshot,
        recoveryApply: normalizeRecoveryApply(base.byChannel?.[channel]?.recoveryApply)
      };
    });

    const aggregate = aggregateHotelPatrolFromByChannel(byChannel);
    return { ...aggregate, byChannel };
  };

  // —— 会话级缓存：避免单次渲染中反复 parse / normalize ——
  let __opsHotelsCache = null;
  let __opsRecordsCache = null;
  let __opsSeededOnce = false;
  const __invalidateOpsCache = () => {
    __opsHotelsCache = null;
    __opsRecordsCache = null;
  };

  const ensureOpsMockSeeded = () => {
    if (__opsSeededOnce) return;
    const mockVersion = typeof OTA_MOCK_VERSION !== 'undefined' ? OTA_MOCK_VERSION : 'default';
    const savedVersion = localStorage.getItem('ops_mock_version');
    const applyMiddleOtaDemoAdjustments = (hotels) => {
      const nowMs = Date.now();
      const toIso = (hoursAgo) => new Date(nowMs - hoursAgo * 3600000).toISOString();
      const forceSamples = [
        { hotelId: 101, channel: 'ctrip', processingStatus: 'pending_review', lastResultType: 'both', rankingPosition: 9, abnormalHours: 72, pendingHours: 4 },
        { hotelId: 107, channel: 'meituan', processingStatus: 'pending_review', lastResultType: 'listing', rankingPosition: 8, abnormalHours: 60, pendingHours: 5 },
        { hotelId: 120, channel: 'douyin', processingStatus: 'pending_review', lastResultType: 'premium', rankingPosition: 10, abnormalHours: 50, pendingHours: 6 },
        { hotelId: 136, channel: 'ctrip', processingStatus: 'pending_review', lastResultType: 'premium', rankingPosition: 7, abnormalHours: 36, pendingHours: 3 }
      ];
      forceSamples.forEach((sample) => {
        const hotel = hotels.find((h) => Number(h.id) === Number(sample.hotelId));
        if (!hotel) return;
        const patrol = hotel.otaPatrol || {};
        const byChannel = patrol.byChannel || {};
        const entry = byChannel[sample.channel] || {};
        const lastInspectionAt = entry.lastInspectionAt || toIso(2);
        byChannel[sample.channel] = {
          ...entry,
          processingStatus: sample.processingStatus,
          pendingApplyAt: toIso(sample.pendingHours),
          abnormalStartedAt: toIso(sample.abnormalHours),
          lastInspectionAt,
          lastInspectionDate: String(lastInspectionAt).split('T')[0] || '',
          lastResultType: sample.lastResultType,
          rankingPosition: sample.rankingPosition,
          rankingStatus: calcRankingStatusByPosition(sample.rankingPosition),
          presalePackageTitle: entry.presalePackageTitle || ''
        };
        const aggregate = aggregateHotelPatrolFromByChannel(byChannel);
        hotel.otaPatrol = { ...patrol, ...aggregate, byChannel };
      });
      return hotels;
    };
    const normalizeOpsRecords = (records) => (records || [])
      .filter((r) => (r.recordType || 'monitor') === 'monitor')
      .filter((r) => OPS_ALLOWED_CHANNELS.includes(r.channel))
      .map((r) => {
        const clean = normalizeOpsPatrolRecord(r);
        delete clean.recordType;
        delete clean.inspectionResult;
        return clean;
      });
    if (savedVersion !== mockVersion) {
      const hotels = applyMiddleOtaDemoAdjustments((typeof OTA_MOCK_HOTELS !== 'undefined' ? OTA_MOCK_HOTELS : []).map(normalizeOpsHotel));
      const records = normalizeOpsRecords(typeof OTA_MOCK_RECORDS !== 'undefined' ? OTA_MOCK_RECORDS : []);
      try { __safeSetItem('ops_hotels_data', JSON.stringify(hotels)); } catch (e) { console.warn('seed write hotels failed', e); }
      try { __safeSetItem('ops_records_data', JSON.stringify(records)); } catch (e) { console.warn('seed write records failed', e); }
      try { localStorage.setItem('ops_mock_version', mockVersion); } catch (e) { /* ignore */ }
      __opsSeededOnce = true;
      __invalidateOpsCache();
      return;
    }
    const savedRecords = localStorage.getItem('ops_records_data');
    if (!savedRecords) return;
    let parsed = [];
    try {
      parsed = JSON.parse(savedRecords) || [];
    } catch (e) {
      parsed = [];
    }
    const cleaned = normalizeOpsRecords(parsed);
    if (cleaned.length !== parsed.length || JSON.stringify(cleaned) !== JSON.stringify(parsed)) {
      try { __safeSetItem('ops_records_data', JSON.stringify(cleaned)); } catch (e) { console.warn('seed re-write records failed', e); }
    }
    const savedHotels = localStorage.getItem('ops_hotels_data');
    if (!savedHotels) return;
    let parsedHotels = [];
    try {
      parsedHotels = JSON.parse(savedHotels) || [];
    } catch (e) {
      parsedHotels = [];
    }
    const normalizedHotels = (parsedHotels || []).map((hotel) => {
      const normalized = normalizeOpsHotel(hotel);
      const nowDate = new Date();
      const nowMs = nowDate.getTime();
      const next = { ...normalized, otaPatrol: { ...(normalized.otaPatrol || {}) } };
      next.otaPatrol.lastInspectionDate = clampDateToNow(next.otaPatrol.lastInspectionDate, nowDate);
      next.otaPatrol.lastInspectionAt = clampInspectionAtToNow(next.otaPatrol.lastInspectionAt, nowMs);
      const byChannel = next.otaPatrol.byChannel || {};
      Object.keys(byChannel).forEach((key) => {
        const item = byChannel[key] || {};
        item.lastInspectionDate = clampDateToNow(item.lastInspectionDate, nowDate);
        item.lastInspectionAt = clampInspectionAtToNow(item.lastInspectionAt, nowMs);
      });
      next.otaPatrol.byChannel = byChannel;
      const hasByChannel = Object.keys(next.otaPatrol.byChannel || {}).length > 0;
      if (!hasByChannel) {
        next.otaPatrol = deriveHotelPatrolFromRecords(next, cleaned);
      }
      return next;
    });
    // 注意：不在此处再调用 applyMiddleOtaDemoAdjustments
    // 该函数仅用于 mock 首次注入（version 不匹配的 if 分支），用于强塞演示样本
    // 若此处再次调用，会把已被用户编辑过的酒店字段（如 ranking、abnormalStartedAt）反复覆盖回演示值
    if (JSON.stringify(parsedHotels) !== JSON.stringify(normalizedHotels)) {
      try { __safeSetItem('ops_hotels_data', JSON.stringify(normalizedHotels)); } catch (e) { console.warn('seed re-write hotels failed', e); }
    }
    __opsSeededOnce = true;
    __invalidateOpsCache();
  };

  const getOpsHotels = () => {
    ensureOpsMockSeeded();
    if (__opsHotelsCache) return __opsHotelsCache.slice();
    const saved = localStorage.getItem('ops_hotels_data');
    const list = saved ? JSON.parse(saved) : OTA_MOCK_HOTELS;
    __opsHotelsCache = (list || []).map(normalizeOpsHotel);
    return __opsHotelsCache.slice();
  };

  // —— 配额自愈工具：localStorage 写入失败时剥离历史 records 中的图片 base64 ——
  // 原因：图片 dataURL 单张可能 50KB-3MB，多次保存会快速吃满 ~5MB origin 配额；
  //       配额是所有 key 共享，所以 ops_records_data 撑大后会连带 ops_hotels_data 写入失败。
  //       自愈：剥离 imageItems[*].url / rankingScreenshot / presaleScreenshot，
  //             保留 imageNames 作为占位（详情页有文件名兜底显示）。
  const __isQuotaError = (err) => {
    if (!err) return false;
    const name = err.name || '';
    const code = err.code;
    return name === 'QuotaExceededError'
      || name === 'NS_ERROR_DOM_QUOTA_REACHED'
      || code === 22 || code === 1014;
  };
  const __purgeRecordImagesInPlace = () => {
    let raw = '';
    try { raw = localStorage.getItem('ops_records_data') || ''; } catch (e) { raw = ''; }
    if (!raw) return false;
    let list = [];
    try { list = JSON.parse(raw) || []; } catch (e) { return false; }
    let changed = false;
    list.forEach((r) => {
      if (r && r.rankingScreenshot) { r.rankingScreenshot = ''; changed = true; }
      if (r && r.presaleScreenshot) { r.presaleScreenshot = ''; changed = true; }
      const rooms = (r && r.roomInputs) || [];
      rooms.forEach((row) => {
        const items = (row && row.imageItems) || [];
        items.forEach((it) => {
          if (it && it.url) { it.url = ''; changed = true; }
        });
      });
    });
    if (!changed) return false;
    try {
      localStorage.setItem('ops_records_data', JSON.stringify(list));
      __invalidateOpsCache();
      return true;
    } catch (e) {
      return false;
    }
  };
  // 通用包装：写 localStorage 时遇到配额错误自动清旧图后重试一次
  const __safeSetItem = (key, value) => {
    try {
      localStorage.setItem(key, value);
      return;
    } catch (err) {
      if (!__isQuotaError(err)) throw err;
      const purged = __purgeRecordImagesInPlace();
      if (!purged) throw err;
      // 重试一次
      localStorage.setItem(key, value);
      console.warn(`[storage] 配额超限，已自动清理历史 records 中的图片 base64 后重试 setItem('${key}')`);
    }
  };

  const saveOpsHotels = (hotels) => {
    __safeSetItem('ops_hotels_data', JSON.stringify((hotels || []).map(normalizeOpsHotel)));
    __invalidateOpsCache();
  };

  const getOpsHotelById = (id) => {
    const numId = Number(id);
    return getOpsHotels().find(h => h.id === numId) || null;
  };

  const saveOpsHotel = (hotel) => {
    const hotels = getOpsHotels();
    const normalizedHotel = normalizeOpsHotel(hotel);
    const idx = hotels.findIndex(h => h.id === normalizedHotel.id);
    if (idx >= 0) {
      hotels[idx] = normalizedHotel;
    } else {
      const maxId = hotels.length ? Math.max(...hotels.map(h => Number(h.id) || 0)) : 100;
      normalizedHotel.id = maxId + 1;
      hotels.push(normalizedHotel);
    }
    saveOpsHotels(hotels);
    return normalizedHotel;
  };

  const getOpsRecords = () => {
    ensureOpsMockSeeded();
    if (__opsRecordsCache) return __opsRecordsCache.slice();
    const saved = localStorage.getItem('ops_records_data');
    if (!saved) {
      __opsRecordsCache = (OTA_MOCK_RECORDS || [])
        .filter((r) => (r.recordType || 'monitor') === 'monitor')
        .map(normalizeOpsPatrolRecord);
      return __opsRecordsCache.slice();
    }
    const records = JSON.parse(saved);
    __opsRecordsCache = (records || [])
      .filter((r) => (r.recordType || 'monitor') === 'monitor')
      .map(normalizeOpsPatrolRecord);
    return __opsRecordsCache.slice();
  };

  const saveOpsRecords = (records) => {
    const clean = (records || [])
      .filter((r) => (r.recordType || 'monitor') === 'monitor')
      .map((r) => {
        const copy = normalizeOpsPatrolRecord(r);
        delete copy.recordType;
        delete copy.inspectionResult;
        return copy;
      });
    __safeSetItem('ops_records_data', JSON.stringify(clean));
    __invalidateOpsCache();
  };

  const upsertOpsRecord = (record) => {
    const records = getOpsRecords();
    const nowIso = new Date().toISOString();
    const nextRecord = normalizeOpsPatrolRecord({
      ...record,
      inspectionAt: record?.inspectionAt || nowIso
    });
    const idx = nextRecord.id ? records.findIndex((r) => String(r.id) === String(nextRecord.id)) : -1;
    if (idx >= 0) {
      records[idx] = { ...nextRecord, id: records[idx].id };
    } else {
      records.push({ ...nextRecord, id: `${nextRecord.hotelId}-${nextRecord.date}-${nextRecord.channel}-${Date.now()}` });
    }
    saveOpsRecords(records);
  };

  const updateOpsPatrolAfterInspection = (hotelId) => {
    const hotel = getOpsHotelById(hotelId);
    if (!hotel) return null;
    const next = normalizeOpsHotel(hotel);
    const records = getOpsRecords();
    const patrol = deriveHotelPatrolFromRecords(next, records);
    next.otaPatrol = {
      ...next.otaPatrol,
      ...patrol
    };
    saveOpsHotel(next);
    return next;
  };

  const requestOpsPatrolResolved = (hotelId) => {
    const hotel = getOpsHotelById(hotelId);
    if (!hotel) return null;
    const next = normalizeOpsHotel(hotel);
    const byChannel = next.otaPatrol.byChannel || {};
    const nowIso = new Date().toISOString();
    let changed = false;
    Object.keys(byChannel).forEach((ch) => {
      const entry = byChannel[ch];
      if (entry.processingStatus === 'processing') {
        entry.processingStatus = 'pending_review';
        entry.pendingApplyAt = nowIso;
        changed = true;
      }
    });
    if (!changed) return next;
    const agg = aggregateHotelPatrolFromByChannel(byChannel);
    next.otaPatrol.processingStatus = agg.processingStatus;
    next.otaPatrol.abnormalStartedAt = agg.abnormalStartedAt;
    next.otaPatrol.lastInspectionAt = agg.lastInspectionAt;
    next.otaPatrol.lastInspectionDate = agg.lastInspectionDate;
    next.otaPatrol.lastChannel = agg.lastChannel;
    next.otaPatrol.lastResultType = agg.lastResultType;
    next.otaPatrol.pendingApplyAt = nowIso;
    saveOpsHotel(next);
    return next;
  };

  const submitOpsRecoveryApply = ({ hotelId, channel, content, images, submittedBy }) => {
    const hotel = getOpsHotelById(hotelId);
    if (!hotel) return null;
    const next = normalizeOpsHotel(hotel);
    const safeChannel = String(channel || '').trim();
    if (!safeChannel) return null;
    if (!next.otaPatrol.byChannel[safeChannel]) {
      next.otaPatrol.byChannel[safeChannel] = {
        processingStatus: 'processing',
        pendingApplyAt: '',
        abnormalStartedAt: '',
        lastInspectionAt: '',
        lastInspectionDate: '',
        lastResultType: 'unknown',
        rankingPosition: '',
        rankingStatus: 'unknown',
        rankingScreenshot: '',
        presalePackageTitle: '',
        presaleScreenshot: '',
        recoveryApply: normalizeRecoveryApply({})
      };
    }
    const nowIso = new Date().toISOString();
    const entry = next.otaPatrol.byChannel[safeChannel];
    entry.processingStatus = 'pending_review';
    entry.pendingApplyAt = nowIso;
    entry.recoveryApply = normalizeRecoveryApply({
      content,
      images,
      submittedAt: nowIso,
      submittedBy: submittedBy || 'ops'
    });
    const agg = aggregateHotelPatrolFromByChannel(next.otaPatrol.byChannel);
    next.otaPatrol.processingStatus = agg.processingStatus;
    next.otaPatrol.abnormalStartedAt = agg.abnormalStartedAt;
    next.otaPatrol.lastInspectionAt = agg.lastInspectionAt;
    next.otaPatrol.lastInspectionDate = agg.lastInspectionDate;
    next.otaPatrol.lastChannel = agg.lastChannel;
    next.otaPatrol.lastResultType = agg.lastResultType;
    next.otaPatrol.pendingApplyAt = nowIso;
    saveOpsHotel(next);
    return next;
  };

  const getOpsPatrolSummary = (hotel) => {
    const source = normalizeOpsHotel(hotel).otaPatrol;
    const byChannel = source.byChannel || {};
    const channelEntries = Object.values(byChannel);
    const listingAbnormal = channelEntries.some((c) => c.lastResultType === 'listing' || c.lastResultType === 'both');
    const premiumAbnormal = channelEntries.some((c) => c.lastResultType === 'premium' || c.lastResultType === 'both');
    const resultType = source.lastResultType || 'unknown';
    const hotelAbnormal = listingAbnormal || premiumAbnormal;
    // 异常时长：各渠道里 abnormalStartedAt 非空中最早那一个
    const earliestAbnormalStart = channelEntries
      .map((c) => c.abnormalStartedAt)
      .filter(Boolean)
      .sort()[0] || source.abnormalStartedAt || '';
    const durationHours = hotelAbnormal ? calcOpsAbnormalDurationHours(earliestAbnormalStart) : 0;
    return {
      processingStatus: source.processingStatus || 'normal',
      pendingApplyAt: source.pendingApplyAt || '',
      abnormalStartedAt: earliestAbnormalStart,
      lastInspectionAt: source.lastInspectionAt || '',
      lastInspectionDate: source.lastInspectionDate || '',
      lastChannel: source.lastChannel || '',
      lastResultType: resultType,
      isAbnormal: hotelAbnormal,
      abnormalDurationHours: durationHours,
      listingAbnormal,
      premiumAbnormal
    };
  };

  const getOpsPatrolSummaryByChannel = (hotel) => {
    const source = normalizeOpsHotel(hotel).otaPatrol;
    const byChannel = source.byChannel || {};
    const channelOrder = OPS_ALLOWED_CHANNELS.slice();
    const channelKeys = [...new Set([...(source.channels || []), ...Object.keys(byChannel)])];
    return channelKeys
      .slice()
      .sort((a, b) => channelOrder.indexOf(a) - channelOrder.indexOf(b))
      .map((channel) => {
        const entry = byChannel[channel] || {};
        const resultType = entry.lastResultType || 'unknown';
        const isAbnormal = resultType !== 'normal' && resultType !== 'unknown';
        const durationHours = isAbnormal ? calcOpsAbnormalDurationHours(entry.abnormalStartedAt) : 0;
        const recoveryApply = normalizeRecoveryApply(entry.recoveryApply);
        return {
          channel,
          processingStatus: entry.processingStatus || 'normal',
          pendingApplyAt: entry.pendingApplyAt || '',
          abnormalStartedAt: entry.abnormalStartedAt || '',
          lastInspectionAt: entry.lastInspectionAt || '',
          lastInspectionDate: entry.lastInspectionDate || '',
          lastResultType: resultType,
          rankingPosition: parseRankingPosition(entry.rankingPosition),
          rankingStatus: calcRankingStatusByPosition(entry.rankingPosition),
          rankingScreenshot: entry.rankingScreenshot || '',
          presalePackageTitle: entry.presalePackageTitle || '',
          presaleScreenshot: entry.presaleScreenshot || '',
          recoveryApply,
          hasRecoveryApply: !!(recoveryApply.submittedAt || recoveryApply.content || recoveryApply.images.length),
          isAbnormal,
          abnormalDurationHours: durationHours,
          listingAbnormal: resultType === 'listing' || resultType === 'both',
          premiumAbnormal: resultType === 'premium' || resultType === 'both'
        };
      });
  };

  const pickFinanceCooperationRooms = (idx) => 5 + (idx % 16);
  const pickFinanceLaunchDate = (idx) => {
    const list = [
      '2025-12-15', '2026-01-01', '2026-01-05', '2026-01-08', '2026-01-12', '2026-01-15', '2026-01-20',
      '2026-02-01', '2026-02-06', '2026-02-12', '2026-03-01', '2026-03-08', '2026-03-15', '2026-04-01'
    ];
    return list[idx % list.length];
  };

  const ensureFinanceHotelSeeded = () => {
    const saved = localStorage.getItem('finance_hotels_data');
    if (!saved) {
      const provinceLimit = 5;
      const allOpsHotels = getOpsHotels();
      const preferredProvinces = [...new Set(allOpsHotels.map((h) => h.province).filter(Boolean))].slice(0, provinceLimit);
      const seedSource = allOpsHotels.filter((h) => preferredProvinces.includes(h.province));
      const seeded = seedSource.map((h, idx) => ({
        id: String(h.id),
        hotelName: h.name || '',
        launchDate: pickFinanceLaunchDate(idx),
        cooperationRooms: pickFinanceCooperationRooms(idx),
        commissionPolicyText: '',
        province: h.province || '',
        ownerSales: h.ownerSales || '',
        ownerOps: h.ownerOps || ''
      }));
      localStorage.setItem('finance_hotels_data', JSON.stringify(seeded));
      return;
    }
    let parsed = [];
    try {
      parsed = JSON.parse(saved);
    } catch (err) {
      parsed = [];
    }
    const list = Array.isArray(parsed) ? parsed : [];
    if (!list.length) return;
    let changed = false;
    const janEligibleCount = list
      .slice(0, 14)
      .filter((item) => getEffectiveDaysInMonth(item.launchDate, '2026-01') > 0)
      .length;
    const normalized = list.map((item, idx) => {
      const rooms = Number(item.cooperationRooms) || 0;
      const next = { ...item };
      if (rooms < 5 || rooms > 20) {
        next.cooperationRooms = pickFinanceCooperationRooms(idx);
        changed = true;
      }
      // 若前14家里可覆盖 2026-01 的酒店不足一半，则自动注入验收用上线时间
      if (janEligibleCount < 7 && idx < 14) {
        const preferredLaunch = pickFinanceLaunchDate(idx);
        if (String(next.launchDate || '') !== preferredLaunch) {
          next.launchDate = preferredLaunch;
          changed = true;
        }
      }
      if (next.launchDate) return next;
      changed = true;
      next.launchDate = pickFinanceLaunchDate(idx);
      return next;
    });
    if (changed) localStorage.setItem('finance_hotels_data', JSON.stringify(normalized));
  };

  const getFinanceHotels = () => {
    ensureFinanceHotelSeeded();
    const saved = localStorage.getItem('finance_hotels_data');
    const list = saved ? JSON.parse(saved) : [];
    return Array.isArray(list) ? list : [];
  };

  const saveFinanceHotels = (hotels) => {
    localStorage.setItem('finance_hotels_data', JSON.stringify(hotels || []));
  };

  const getFinanceHotelById = (id) => {
    const target = String(id || '');
    return getFinanceHotels().find((x) => String(x.id) === target) || null;
  };

  const saveFinanceHotel = (hotel) => {
    const hotels = getFinanceHotels();
    const payload = {
      id: String(hotel.id || ''),
      hotelName: String(hotel.hotelName || '').trim(),
      launchDate: String(hotel.launchDate || ''),
      cooperationRooms: Number(hotel.cooperationRooms) || 0,
      commissionPolicyText: String(hotel.commissionPolicyText || '').trim(),
      province: String(hotel.province || '').trim(),
      ownerSales: String(hotel.ownerSales || '').trim(),
      ownerOps: String(hotel.ownerOps || '').trim()
    };
    if (!payload.id) payload.id = `f_${Date.now()}`;
    const idx = hotels.findIndex((x) => String(x.id) === payload.id);
    if (idx >= 0) {
      hotels[idx] = payload;
    } else {
      hotels.push(payload);
    }
    saveFinanceHotels(hotels);
    return payload;
  };

  const buildFinanceReconcileSeed = (hotels) => {
    const monthKeys = [];
    [2025, 2026].forEach((year) => {
      for (let m = 1; m <= 12; m += 1) {
        monthKeys.push(`${year}-${String(m).padStart(2, '0')}`);
      }
    });
    const sourceAll = (hotels || [])
      .slice()
      .sort((a, b) => {
        const aJan = getEffectiveDaysInMonth(a.launchDate, '2026-01') > 0 ? 1 : 0;
        const bJan = getEffectiveDaysInMonth(b.launchDate, '2026-01') > 0 ? 1 : 0;
        return bJan - aJan;
      });
    const provinceRank = [...new Set(sourceAll.map((h) => h.province).filter(Boolean))].slice(0, 5);
    const source = sourceAll
      .filter((h) => provinceRank.includes(h.province))
      .slice(0, 24);
    const mostlyCoveredCount = Math.max(Math.floor(source.length * 0.75), 1);
    return source.flatMap((hotel, idx) => {
      // 目标：2025-2026 两年都有记录，2026 年大部分月份有值
      const activeMonths = idx < mostlyCoveredCount
        ? monthKeys.filter((_, monthIdx) => (idx + monthIdx) % 13 !== 9)
        : monthKeys.filter((_, monthIdx) => (idx + monthIdx) % 6 !== 2);
      return monthKeys
        .filter((monthKey) => activeMonths.includes(monthKey))
        .map((monthKey, monthIdx) => {
          const cooperationRooms = Number(hotel.cooperationRooms) || 20;
          const effectiveDays = getEffectiveDaysInMonth(hotel.launchDate, monthKey);
          if (effectiveDays <= 0) return null;
          const capacity = Math.max(cooperationRooms * effectiveDays, 1);
          const isRareZero = (idx + monthIdx) % 19 === 0;
          const settledNights = isRareZero
            ? 0
            : Math.round(capacity * (0.42 + ((idx + monthIdx) % 5) * 0.08));
          const occupiedRooms = Math.round(cooperationRooms * (0.45 + ((idx + monthIdx) % 4) * 0.1));
          const settlementAmount = isRareZero
            ? 0
            : settledNights * (210 + ((idx + monthIdx) % 6) * 25);
          return {
            id: `${hotel.id}-${monthKey}`,
            hotelId: String(hotel.id),
            monthKey,
            occupiedRooms,
            settledNights,
            settlementAmount
          };
        })
        .filter(Boolean);
    });
  };

  const getFinanceReconcileRecords = () => {
    const ensureFinanceReconcileSeeded = () => {
      const hotels = getFinanceHotels();
      const defaultSeed = buildFinanceReconcileSeed(hotels);
      const savedRaw = localStorage.getItem('finance_reconcile_records');
      if (!savedRaw) {
        localStorage.setItem('finance_reconcile_records', JSON.stringify(defaultSeed));
        return;
      }
      let parsed = [];
      try {
        parsed = JSON.parse(savedRaw);
      } catch (err) {
        parsed = [];
      }
      const current = Array.isArray(parsed) ? parsed : [];
      const existingKeys = new Set(current.map((x) => `${String(x.hotelId || '')}-${String(x.monthKey || '')}`));
      const merged = [...current];
      defaultSeed.forEach((item) => {
        const key = `${item.hotelId}-${item.monthKey}`;
        if (!existingKeys.has(key)) merged.push(item);
      });
      localStorage.setItem('finance_reconcile_records', JSON.stringify(merged));
    };
    ensureFinanceReconcileSeeded();
    const saved = localStorage.getItem('finance_reconcile_records');
    if (!saved) return [];
    const list = JSON.parse(saved);
    return Array.isArray(list) ? list : [];
  };

  const saveFinanceReconcileRecords = (records) => {
    localStorage.setItem('finance_reconcile_records', JSON.stringify(records || []));
  };

  const upsertFinanceReconcileRecord = (record) => {
    const records = getFinanceReconcileRecords();
    const hotelId = String(record.hotelId || '');
    const monthKey = String(record.monthKey || '');
    const idx = records.findIndex((x) => String(x.hotelId) === hotelId && x.monthKey === monthKey);
    const payload = {
      id: idx >= 0 ? records[idx].id : `${hotelId}-${monthKey}`,
      hotelId,
      monthKey,
      occupiedRooms: Number(record.occupiedRooms) || 0,
      settledNights: Number(record.settledNights) || 0,
      settlementAmount: Number(record.settlementAmount) || 0
    };
    if (idx >= 0) {
      records[idx] = payload;
    } else {
      records.push(payload);
    }
    saveFinanceReconcileRecords(records);
    return payload;
  };

  const getFinanceRecordsByHotel = (hotelId) => {
    const target = String(hotelId || '');
    return getFinanceReconcileRecords().filter((x) => String(x.hotelId) === target);
  };

  const getDaysInMonth = (monthKey) => {
    const safe = String(monthKey || '');
    if (!/^\d{4}-\d{2}$/.test(safe)) return 0;
    const [year, month] = safe.split('-').map(Number);
    return new Date(year, month, 0).getDate();
  };

  const getEffectiveDaysInMonth = (launchDate, monthKey) => {
    const safeMonth = String(monthKey || '');
    if (!/^\d{4}-\d{2}$/.test(safeMonth)) return 0;
    const monthDays = getDaysInMonth(safeMonth);
    if (!launchDate) return monthDays;
    const launch = new Date(`${launchDate}T00:00:00`);
    if (Number.isNaN(launch.getTime())) return monthDays;
    const [year, month] = safeMonth.split('-').map(Number);
    const launchYear = launch.getFullYear();
    const launchMonth = launch.getMonth() + 1;
    if (year < launchYear || (year === launchYear && month < launchMonth)) return 0;
    if (year === launchYear && month === launchMonth) {
      return Math.max(monthDays - launch.getDate() + 1, 0);
    }
    return monthDays;
  };

  const calcFinanceOccupancyRate = (settledNights, cooperationRooms, effectiveDays) => {
    const nights = Number(settledNights) || 0;
    const rooms = Number(cooperationRooms) || 0;
    const days = Number(effectiveDays) || 0;
    const denominator = rooms * days;
    if (!denominator) return 0;
    return nights / denominator;
  };

  const calcFinanceAvgRevenue = (settlementAmount, cooperationRooms) => {
    const amount = Number(settlementAmount) || 0;
    const rooms = Number(cooperationRooms) || 0;
    if (!rooms) return 0;
    return amount / rooms;
  };

  // ============== 收益管理（Revenue）==============
  // mock 数据来自 finance_hotels（共用酒店主档），在此按需 seed 生成"周维度 + 月度官方"两份数据
  // 月份范围：2026-01 ~ 2026-04（仅 4 个月，原型聚焦展示）

  let __revenueWeeklyCache = null;
  let __revenueMonthlyCache = null;
  let __revenueHotelsCache = null;
  let __revenueSeededOnce = false;
  const __revenueHashLocal = (str) => {
    let h = 0;
    const text = String(str || '');
    for (let i = 0; i < text.length; i += 1) h = ((h * 31) + text.charCodeAt(i)) | 0;
    return Math.abs(h);
  };
  const __pickRevenueRooms = (hotelId, fallbackRooms) => {
    if (typeof pickRevenueCooperationRoomsByHotelId === 'function') {
      return Math.max(Number(pickRevenueCooperationRoomsByHotelId(hotelId)) || 0, 0);
    }
    const opts = [3, 5, 8, 10, 20];
    return opts[__revenueHashLocal(`${hotelId}|rooms`) % opts.length] || Math.max(Number(fallbackRooms) || 5, 3);
  };
  const __normalizeRevenueHotels = (hotels) => (hotels || []).map((h) => ({
    ...h,
    cooperationRooms: __pickRevenueRooms(h.id, h.cooperationRooms)
  }));
  const __enforceRevenueOccupancyExceededSamples = (monthlyRecords) => {
    const list = (monthlyRecords || []).map((item) => ({ ...item }));
    const fixedSampleIds = [...new Set(
      list
        .map((x) => String(x.hotelId || ''))
        .filter(Boolean)
    )]
      .sort((a, b) => (Number(a) || 0) - (Number(b) || 0))
      .slice(0, 3);
    const months = (typeof REVENUE_MONTH_KEYS !== 'undefined' ? REVENUE_MONTH_KEYS : []);
    months.forEach((monthKey) => {
      const rows = list
        .filter((x) => x.monthKey === monthKey);
      rows.forEach((row) => {
        const rowHotelId = String(row.hotelId || '');
        const occ = Math.max(Number(row.occupancyNights) || 0, 0);
        const deltaSeed = __revenueHashLocal(`${row.hotelId}|${monthKey}|contractDelta`);
        if (fixedSampleIds.includes(rowHotelId) && occ > 0) {
          // 仅 3 条超约定样本：合同值略小于占房（超出 1~3）
          const overBy = 1 + (deltaSeed % 3);
          row.contractOccupancyLimit = Math.max(occ - overBy, 0);
        } else {
          // 非样本都不超：合同值略大于等于占房
          const safeGap = 1 + (deltaSeed % 6);
          row.contractOccupancyLimit = occ + safeGap;
        }
        // 固定 3 家酒店制造“月报 vs 周累计”差异
        // 保证差异稳定可复现，且数值合理不为负
        if (fixedSampleIds.includes(rowHotelId)) {
          const sampleIndex = fixedSampleIds.indexOf(rowHotelId); // 0,1,2
          const sign = sampleIndex === 1 ? -1 : 1; // 中间那家做负差异，其余正差异
          const nightDelta = sign * (1 + (__revenueHashLocal(`${rowHotelId}|${monthKey}|nightDelta`) % 3)); // ±1~3
          const amountUnit = 160 + (__revenueHashLocal(`${rowHotelId}|${monthKey}|amountUnit`) % 90); // 160~249
          row.settledNights = Math.max((Number(row.settledNights) || 0) + nightDelta, 0);
          row.settlementAmount = Math.max((Number(row.settlementAmount) || 0) + nightDelta * amountUnit, 0);
        }
      });
    });
    return list;
  };
  const __invalidateRevenueCache = () => {
    __revenueWeeklyCache = null;
    __revenueMonthlyCache = null;
    __revenueHotelsCache = null;
  };

  const ensureRevenueSeeded = () => {
    if (__revenueSeededOnce) return;
    if (typeof REVENUE_MOCK_VERSION === 'undefined') return;
    const savedVersion = localStorage.getItem('revenue_mock_version');
    if (savedVersion === REVENUE_MOCK_VERSION
      && localStorage.getItem('revenue_weekly_data')
      && localStorage.getItem('revenue_monthly_data')) {
      __revenueSeededOnce = true;
      return;
    }
    const hotels = __normalizeRevenueHotels(getFinanceHotels());
    const allWeekly = [];
    const allMonthly = [];
    hotels.forEach((h) => {
      const weekly = buildRevenueWeeklyForHotel(h.id, h.cooperationRooms);
      const monthly = buildRevenueMonthlyForHotel(h.id, weekly, h.cooperationRooms);
      allWeekly.push(...weekly);
      allMonthly.push(...monthly);
    });
    const monthlyWithContractLimit = __enforceRevenueOccupancyExceededSamples(allMonthly);
    localStorage.setItem('revenue_weekly_data', JSON.stringify(allWeekly));
    localStorage.setItem('revenue_monthly_data', JSON.stringify(monthlyWithContractLimit));
    localStorage.setItem('revenue_mock_version', REVENUE_MOCK_VERSION);
    __revenueSeededOnce = true;
    __invalidateRevenueCache();
  };

  const getRevenueWeeklyRecords = () => {
    ensureRevenueSeeded();
    if (__revenueWeeklyCache) return __revenueWeeklyCache.slice();
    const saved = localStorage.getItem('revenue_weekly_data');
    __revenueWeeklyCache = saved ? (JSON.parse(saved) || []) : [];
    return __revenueWeeklyCache.slice();
  };

  const getRevenueMonthlyRecords = () => {
    ensureRevenueSeeded();
    if (__revenueMonthlyCache) return __revenueMonthlyCache.slice();
    const saved = localStorage.getItem('revenue_monthly_data');
    __revenueMonthlyCache = saved ? (JSON.parse(saved) || []) : [];
    return __revenueMonthlyCache.slice();
  };

  const getRevenueHotels = () => {
    if (__revenueHotelsCache) return __revenueHotelsCache.slice();
    __revenueHotelsCache = __normalizeRevenueHotels(getFinanceHotels());
    return __revenueHotelsCache.slice();
  };

  // 取单家酒店在指定月的"月度官方值"
  const getRevenueMonthlyForHotel = (hotelId, monthKey) => {
    const list = getRevenueMonthlyRecords();
    return list.find((x) => String(x.hotelId) === String(hotelId) && x.monthKey === monthKey) || null;
  };

  // 取单家酒店在指定月的所有周记录
  const getRevenueWeeklyForHotel = (hotelId, monthKey) => {
    const list = getRevenueWeeklyRecords();
    return list
      .filter((x) => String(x.hotelId) === String(hotelId) && x.monthKey === monthKey)
      .sort((a, b) => a.weekIndex - b.weekIndex);
  };

  // 计算单家酒店在指定月的展示指标（含与周累加的"出入"）
  // 返回：{ settledNights, occupancyNights, settlementAmount, weekSumNights, weekSumOccupancy, weekSumAmount, diffNights, diffOccupancy, diffAmount, occupancyRate, avgRevenue, hasData, isLaunched, monthDays, contractOccupancyLimit, occupancyExceeded, occupancyExceededBy }
  const calcRevenueMonthlyView = (hotel, monthKey) => {
    const monthlyOfficial = getRevenueMonthlyForHotel(hotel.id, monthKey);
    const weekly = getRevenueWeeklyForHotel(hotel.id, monthKey);
    const monthDays = getDaysInMonth(monthKey);
    const isLaunched = getEffectiveDaysInMonth(hotel.launchDate, monthKey) > 0;

    let weekSumOta = 0;
    let weekSumUpgrade = 0;
    let weekSumOther = 0;
    let weekSumOccupancy = 0;
    let weekSumAmount = 0;
    weekly.forEach((w) => {
      const n = w.nights || {};
      weekSumOta += (Number(n.ctrip) || 0) + (Number(n.douyin) || 0) + (Number(n.fliggy) || 0) + (Number(n.meituan) || 0);
      weekSumUpgrade += Number(n.upgradeCoupon) || 0;
      weekSumOther += Number(n.otherOffline) || 0;
      weekSumOccupancy += Number(n.occupancy) || 0;
      weekSumAmount += Number(w.settlementAmount) || 0;
    });
    const weekSumNights = weekSumOta + weekSumUpgrade + weekSumOther;

    const settledNights = monthlyOfficial ? monthlyOfficial.settledNights : weekSumNights;
    const occupancyNights = monthlyOfficial ? monthlyOfficial.occupancyNights : weekSumOccupancy;
    const settlementAmount = monthlyOfficial ? monthlyOfficial.settlementAmount : weekSumAmount;
    const contractOccupancyLimit = Math.max(Number(monthlyOfficial?.contractOccupancyLimit) || 0, 0);

    const cooperationRooms = Number(hotel.cooperationRooms) || 0;
    const occupancyRate = (cooperationRooms && monthDays)
      ? settledNights / (cooperationRooms * monthDays)
      : 0;
    const avgRevenue = cooperationRooms ? settlementAmount / cooperationRooms : 0;

    return {
      settledNights,
      occupancyNights,
      settlementAmount,
      weekSumNights,
      weekSumOccupancy,
      weekSumAmount,
      diffNights: settledNights - weekSumNights,
      diffOccupancy: occupancyNights - weekSumOccupancy,
      diffAmount: settlementAmount - weekSumAmount,
      occupancyRate,
      avgRevenue,
      hasData: weekly.length > 0,
      isLaunched,
      monthDays,
      contractOccupancyLimit,
      occupancyExceeded: contractOccupancyLimit > 0 && occupancyNights > contractOccupancyLimit,
      occupancyExceededBy: contractOccupancyLimit > 0 ? Math.max(occupancyNights - contractOccupancyLimit, 0) : 0
    };
  };

  // ============== 线下运营（Offline）==============
  // mock 数据范围：2026-01-01 ~ 今天；三大模块（升级券/好评/全员营销）按日颗粒度生成，按需 sum

  let __offlineCouponDailyCache = null;
  let __offlineReviewDailyCache = null;
  let __offlineActivityCache = null;
  let __offlineActivityDailyCache = null;
  let __offlineSeededOnce = false;
  const __invalidateOfflineCache = () => {
    __offlineCouponDailyCache = null;
    __offlineReviewDailyCache = null;
    __offlineActivityCache = null;
    __offlineActivityDailyCache = null;
    if (typeof __invalidateOfflineLifetime === 'function') __invalidateOfflineLifetime();
  };

  const ensureOfflineSeeded = () => {
    if (__offlineSeededOnce) return;
    if (typeof OFFLINE_MOCK_VERSION === 'undefined') return;
    const savedVersion = localStorage.getItem('offline_mock_version');
    const allKeysReady = localStorage.getItem('offline_coupon_daily')
      && localStorage.getItem('offline_review_daily')
      && localStorage.getItem('offline_activities')
      && localStorage.getItem('offline_activity_daily');
    if (savedVersion === OFFLINE_MOCK_VERSION && allKeysReady) {
      __offlineSeededOnce = true;
      return;
    }
    const hotels = getFinanceHotels();
    const couponDaily = (typeof buildOfflineCouponDaily === 'function') ? buildOfflineCouponDaily(hotels) : [];
    const reviewDaily = (typeof buildOfflineReviewDaily === 'function') ? buildOfflineReviewDaily(hotels) : [];
    const activities = (typeof buildOfflineActivities === 'function') ? buildOfflineActivities(hotels) : [];
    const activityDaily = (typeof buildOfflineActivityDaily === 'function') ? buildOfflineActivityDaily(activities) : [];
    localStorage.setItem('offline_coupon_daily', JSON.stringify(couponDaily));
    localStorage.setItem('offline_review_daily', JSON.stringify(reviewDaily));
    localStorage.setItem('offline_activities', JSON.stringify(activities));
    localStorage.setItem('offline_activity_daily', JSON.stringify(activityDaily));
    localStorage.setItem('offline_mock_version', OFFLINE_MOCK_VERSION);
    __offlineSeededOnce = true;
    __invalidateOfflineCache();
  };

  const getOfflineCouponDaily = () => {
    ensureOfflineSeeded();
    if (__offlineCouponDailyCache) return __offlineCouponDailyCache.slice();
    const saved = localStorage.getItem('offline_coupon_daily');
    __offlineCouponDailyCache = saved ? (JSON.parse(saved) || []) : [];
    return __offlineCouponDailyCache.slice();
  };
  const getOfflineReviewDaily = () => {
    ensureOfflineSeeded();
    if (__offlineReviewDailyCache) return __offlineReviewDailyCache.slice();
    const saved = localStorage.getItem('offline_review_daily');
    __offlineReviewDailyCache = saved ? (JSON.parse(saved) || []) : [];
    return __offlineReviewDailyCache.slice();
  };
  const getOfflineActivities = () => {
    ensureOfflineSeeded();
    if (__offlineActivityCache) return __offlineActivityCache.slice();
    const saved = localStorage.getItem('offline_activities');
    __offlineActivityCache = saved ? (JSON.parse(saved) || []) : [];
    return __offlineActivityCache.slice();
  };
  const getOfflineActivityDaily = () => {
    ensureOfflineSeeded();
    if (__offlineActivityDailyCache) return __offlineActivityDailyCache.slice();
    const saved = localStorage.getItem('offline_activity_daily');
    __offlineActivityDailyCache = saved ? (JSON.parse(saved) || []) : [];
    return __offlineActivityDailyCache.slice();
  };

  // 取静态 SKU 列表（含 title/price）
  const getOfflineCouponSkus = () => {
    return (typeof OFFLINE_COUPON_SKUS !== 'undefined' ? OFFLINE_COUPON_SKUS : []).slice();
  };
  // 取好评渠道列表与 label 映射
  const getOfflineReviewChannels = () => {
    return (typeof OFFLINE_REVIEW_CHANNELS !== 'undefined' ? OFFLINE_REVIEW_CHANNELS : []).slice();
  };
  const getOfflineReviewChannelLabel = (key) => {
    const map = (typeof OFFLINE_REVIEW_CHANNEL_LABELS !== 'undefined' ? OFFLINE_REVIEW_CHANNEL_LABELS : {});
    return map[key] || key;
  };

  // —— 时间范围工具：返回 { startDate, endDate }，闭区间，YYYY-MM-DD ——
  const getOfflineDateRangeByPeriod = (mode, anchor, customStart, customEnd) => {
    const todayStr = (() => {
      const d = new Date();
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    })();
    const minStart = (typeof OFFLINE_DATE_START !== 'undefined') ? OFFLINE_DATE_START : '2026-01-01';
    const clamp = (s) => {
      let val = String(s || '');
      if (val < minStart) val = minStart;
      if (val > todayStr) val = todayStr;
      return val;
    };
    const fmt = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const parse = (s) => {
      const str = String(s || '');
      if (!/^\d{4}-\d{2}-\d{2}$/.test(str)) return null;
      const [y, m, d] = str.split('-').map(Number);
      return new Date(y, m - 1, d);
    };
    if (mode === 'day') {
      const v = clamp(anchor || todayStr);
      return { startDate: v, endDate: v };
    }
    if (mode === 'week') {
      const a = parse(anchor || todayStr) || new Date();
      const dow = a.getDay() === 0 ? 7 : a.getDay(); // 1~7（周一为 1）
      const monday = new Date(a);
      monday.setDate(a.getDate() - (dow - 1));
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      return { startDate: clamp(fmt(monday)), endDate: clamp(fmt(sunday)) };
    }
    if (mode === 'month') {
      const a = parse(anchor || todayStr) || new Date();
      const start = new Date(a.getFullYear(), a.getMonth(), 1);
      const end = new Date(a.getFullYear(), a.getMonth() + 1, 0);
      return { startDate: clamp(fmt(start)), endDate: clamp(fmt(end)) };
    }
    if (mode === 'custom') {
      let s = clamp(customStart || todayStr);
      let e = clamp(customEnd || todayStr);
      if (s > e) { const tmp = s; s = e; e = tmp; }
      return { startDate: s, endDate: e };
    }
    return { startDate: todayStr, endDate: todayStr };
  };

  // —— 全周期累计索引（仅构建一次）——
  // couponLifetimeMap: Map<`${hotelId}|${couponId}`, soldCount>
  // reviewLifetimeMap: Map<hotelId, totalCount>
  // activityLifetimeOrderMap: Map<`${activityId}|${hotelId}`, orderCount>
  let __offlineCouponLifetimeMap = null;
  let __offlineReviewLifetimeMap = null;
  let __offlineActivityLifetimeOrderMap = null;
  const __buildOfflineLifetimeIndices = () => {
    if (__offlineCouponLifetimeMap && __offlineReviewLifetimeMap && __offlineActivityLifetimeOrderMap) return;
    const couponMap = new Map();
    getOfflineCouponDaily().forEach((r) => {
      const key = `${r.hotelId}|${r.couponId}`;
      couponMap.set(key, (couponMap.get(key) || 0) + (Number(r.count) || 0));
    });
    const reviewMap = new Map();
    getOfflineReviewDaily().forEach((r) => {
      const key = String(r.hotelId);
      reviewMap.set(key, (reviewMap.get(key) || 0) + (Number(r.count) || 0));
    });
    const activityOrderMap = new Map();
    getOfflineActivityDaily().forEach((r) => {
      const key = `${r.activityId}|${r.hotelId}`;
      activityOrderMap.set(key, (activityOrderMap.get(key) || 0) + (Number(r.orderCount) || 0));
    });
    __offlineCouponLifetimeMap = couponMap;
    __offlineReviewLifetimeMap = reviewMap;
    __offlineActivityLifetimeOrderMap = activityOrderMap;
  };
  // 重置索引（与 daily 缓存联动）
  const __invalidateOfflineLifetime = () => {
    __offlineCouponLifetimeMap = null;
    __offlineReviewLifetimeMap = null;
    __offlineActivityLifetimeOrderMap = null;
  };

  // 升级券聚合：按 (酒店 × SKU) 在时间范围内 sum 售卖数；并附带"全周期累计售卖"
  // 返回：[{ hotelId, hotelName, province, ownerOps, ownerSales, couponId, couponTitle, couponPrice, soldCount, soldAmount, lifetimeSoldCount }]
  const aggregateOfflineCoupons = ({ startDate, endDate, hotelIdSet }) => {
    __buildOfflineLifetimeIndices();
    const records = getOfflineCouponDaily()
      .filter((r) => r.date >= startDate && r.date <= endDate)
      .filter((r) => !hotelIdSet || hotelIdSet.has(String(r.hotelId)));
    const skuMap = new Map();
    getOfflineCouponSkus().forEach((sku) => skuMap.set(sku.id, sku));
    const hotelMap = new Map();
    getFinanceHotels().forEach((h) => hotelMap.set(String(h.id), h));
    const grouped = new Map();
    records.forEach((r) => {
      const key = `${r.hotelId}|${r.couponId}`;
      const sku = skuMap.get(r.couponId);
      const hotel = hotelMap.get(String(r.hotelId));
      if (!sku || !hotel) return;
      if (!grouped.has(key)) {
        grouped.set(key, {
          hotelId: String(r.hotelId),
          hotelName: hotel.hotelName || '',
          province: hotel.province || '',
          ownerOps: hotel.ownerOps || '',
          ownerSales: hotel.ownerSales || '',
          couponId: r.couponId,
          couponTitle: sku.title,
          couponPrice: sku.price,
          soldCount: 0,
          lifetimeSoldCount: __offlineCouponLifetimeMap.get(key) || 0
        });
      }
      grouped.get(key).soldCount += Number(r.count) || 0;
    });
    const list = [...grouped.values()].map((row) => ({
      ...row,
      soldAmount: row.soldCount * row.couponPrice
    }));
    return list;
  };

  // 好评聚合：按酒店 × 4 渠道 在时间范围内 sum；只返回"有好评的酒店"；并附带"全周期累计好评"
  // 返回：[{ hotelId, hotelName, ..., byChannel: {...}, total, lifetimeTotal }]
  const aggregateOfflineReviews = ({ startDate, endDate, hotelIdSet }) => {
    __buildOfflineLifetimeIndices();
    const records = getOfflineReviewDaily()
      .filter((r) => r.date >= startDate && r.date <= endDate)
      .filter((r) => !hotelIdSet || hotelIdSet.has(String(r.hotelId)));
    const hotelMap = new Map();
    getFinanceHotels().forEach((h) => hotelMap.set(String(h.id), h));
    const channels = getOfflineReviewChannels();
    const grouped = new Map();
    records.forEach((r) => {
      const hotel = hotelMap.get(String(r.hotelId));
      if (!hotel) return;
      const key = String(r.hotelId);
      if (!grouped.has(key)) {
        const byChannel = {};
        channels.forEach((c) => { byChannel[c] = 0; });
        grouped.set(key, {
          hotelId: key,
          hotelName: hotel.hotelName || '',
          province: hotel.province || '',
          ownerOps: hotel.ownerOps || '',
          ownerSales: hotel.ownerSales || '',
          byChannel,
          total: 0,
          lifetimeTotal: __offlineReviewLifetimeMap.get(key) || 0
        });
      }
      const row = grouped.get(key);
      if (Object.prototype.hasOwnProperty.call(row.byChannel, r.channel)) {
        row.byChannel[r.channel] += Number(r.count) || 0;
        row.total += Number(r.count) || 0;
      }
    });
    return [...grouped.values()].filter((row) => row.total > 0);
  };

  // 判断活动是否与时间范围有重叠（任一天落在 [startDate, endDate]）
  const isOfflineActivityActiveInRange = (activity, startDate, endDate) => {
    if (!activity || !activity.startDate || !activity.endDate) return false;
    return activity.startDate <= endDate && activity.endDate >= startDate;
  };

  // 营销活动聚合（新维度：酒店 × 活动）
  // 1. 仅保留与 [startDate, endDate] 有重叠的活动
  // 2. 对该活动的每个参与酒店（命中筛选 hotelIdSet），sum 时间范围内的日记录
  // 3. 仅返回"有数据"的行（qr/scan/order 至少一项 > 0）
  // 返回：[{ activityId, activityTitle, hotelId, hotelName, province, ownerOps, ownerSales,
  //         qrGenerated, scanCount, orderCount, lifetimeOrderCount, conversionRate }]
  const aggregateOfflineActivities = ({ startDate, endDate, hotelIdSet }) => {
    __buildOfflineLifetimeIndices();
    const activities = getOfflineActivities()
      .filter((act) => isOfflineActivityActiveInRange(act, startDate, endDate));
    const dailyAll = getOfflineActivityDaily()
      .filter((r) => r.date >= startDate && r.date <= endDate);
    // index by activityId|hotelId
    const dailyIdx = new Map();
    dailyAll.forEach((r) => {
      const key = `${r.activityId}|${r.hotelId}`;
      if (!dailyIdx.has(key)) dailyIdx.set(key, { qrGenerated: 0, scanCount: 0, orderCount: 0 });
      const acc = dailyIdx.get(key);
      acc.qrGenerated += Number(r.qrGenerated) || 0;
      acc.scanCount += Number(r.scanCount) || 0;
      acc.orderCount += Number(r.orderCount) || 0;
    });
    const hotelMap = new Map();
    getFinanceHotels().forEach((h) => hotelMap.set(String(h.id), h));
    const rows = [];
    activities.forEach((act) => {
      (act.participatingHotelIds || []).forEach((hid) => {
        const hotelId = String(hid);
        if (hotelIdSet && hotelIdSet.size > 0 && !hotelIdSet.has(hotelId)) return;
        const hotel = hotelMap.get(hotelId);
        if (!hotel) return;
        const key = `${act.id}|${hotelId}`;
        const sums = dailyIdx.get(key) || { qrGenerated: 0, scanCount: 0, orderCount: 0 };
        if (sums.qrGenerated <= 0 && sums.scanCount <= 0 && sums.orderCount <= 0) return;
        rows.push({
          activityId: act.id,
          activityTitle: act.title,
          activityStatus: act.status,
          activityStartDate: act.startDate,
          activityEndDate: act.endDate,
          hotelId,
          hotelName: hotel.hotelName || '',
          province: hotel.province || '',
          ownerOps: hotel.ownerOps || '',
          ownerSales: hotel.ownerSales || '',
          qrGenerated: sums.qrGenerated,
          scanCount: sums.scanCount,
          orderCount: sums.orderCount,
          lifetimeOrderCount: __offlineActivityLifetimeOrderMap.get(key) || 0,
          conversionRate: sums.scanCount ? sums.orderCount / sums.scanCount : 0
        });
      });
    });
    return rows;
  };

  // ========== 种草监控（Seed Monitor）==========
  let __seedAccountsCache = null;
  let __seedPostDailyCache = null;
  const getSeedMatrixTypes = () => {
    return (typeof SEED_MATRIX_TYPES !== 'undefined' ? SEED_MATRIX_TYPES : []).slice();
  };
  const getSeedMatrixTypeById = (id) => {
    return getSeedMatrixTypes().find((m) => m.id === id) || null;
  };
  const getSeedPlatforms = () => {
    return (typeof SEED_PLATFORMS !== 'undefined' ? SEED_PLATFORMS : []).slice();
  };
  const getSeedPlatformLabel = (id) => {
    const p = getSeedPlatforms().find((x) => x.id === id);
    return p ? p.label : id;
  };
  // 把账号昵称里带的平台后缀剥离（如 "体验官-红薯号" → "体验官"）
  // v5 拆账号后，单平台子表内已有"小红书"分组标题，再带后缀显得冗余
  const __stripPlatformSuffix = (nickname) => {
    return String(nickname || '').replace(/-(红薯号|抖音号|星球号|视频号)$/, '');
  };
  const getSeedMatrixPlatformMap = () => {
    return (typeof SEED_MATRIX_PLATFORM_MAP !== 'undefined' ? SEED_MATRIX_PLATFORM_MAP : {});
  };
  const getSeedAccounts = () => {
    if (!__seedAccountsCache) {
      __seedAccountsCache = (typeof buildSeedAccounts === 'function') ? buildSeedAccounts() : [];
    }
    return __seedAccountsCache;
  };
  const getSeedPostDaily = () => {
    if (!__seedPostDailyCache) {
      __seedPostDailyCache = (typeof buildSeedPostDaily === 'function')
        ? buildSeedPostDaily(getSeedAccounts())
        : [];
    }
    return __seedPostDailyCache;
  };
  // 酒店列表（用于种草监控按酒店统计）
  const getSeedHotels = () => {
    return (typeof OTA_MOCK_HOTELS !== 'undefined' && Array.isArray(OTA_MOCK_HOTELS))
      ? OTA_MOCK_HOTELS.slice() : [];
  };
  const getSeedHotelById = (hotelId) => {
    const id = Number(hotelId);
    return getSeedHotels().find((h) => h.id === id) || null;
  };
  // 提取所有"运营 / 销售 / 省份"选项（去重，按字母序）
  const getSeedFilterOptions = () => {
    const hotels = getSeedHotels();
    const opsSet = new Set();
    const salesSet = new Set();
    const provinceSet = new Set();
    hotels.forEach((h) => {
      if (h.ownerOps) opsSet.add(h.ownerOps);
      if (h.ownerSales) salesSet.add(h.ownerSales);
      if (h.province) provinceSet.add(h.province);
    });
    const sortFn = (a, b) => a.localeCompare(b, 'zh');
    return {
      ownerOps: [...opsSet].sort(sortFn),
      ownerSales: [...salesSet].sort(sortFn),
      province: [...provinceSet].sort(sortFn)
    };
  };
  // 时间范围工具：复用 offline 的逻辑
  const getSeedDateRangeByPeriod = (mode, anchor, customStart, customEnd) => {
    return getOfflineDateRangeByPeriod(mode, anchor, customStart, customEnd);
  };
  // 频次目标折算（按矩阵号基准 + 所选时段天数线性 pro-rate）
  // 返回 { targetMin, targetMax }（区间），周期天数会取 [start, end] 闭区间
  const calcSeedFrequencyTarget = (matrix, startDate, endDate) => {
    if (!matrix) return { targetMin: 0, targetMax: 0 };
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.max(1, Math.round((end - start) / 86400000) + 1);
    const perDayMin = matrix.freqMin / Math.max(matrix.freqWindowDays, 1);
    const perDayMax = matrix.freqMax / Math.max(matrix.freqWindowDays, 1);
    return {
      targetMin: Math.round(perDayMin * days * 100) / 100,
      targetMax: Math.round(perDayMax * days * 100) / 100,
      periodDays: days
    };
  };
  // 互动率 = (likes+comments+favorites+shares) / exposure
  const calcSeedEngagementRate = (sums) => {
    const exposure = Number(sums.exposure) || 0;
    if (!exposure) return 0;
    const inter = (Number(sums.likes) || 0) + (Number(sums.comments) || 0)
      + (Number(sums.favorites) || 0) + (Number(sums.shares) || 0);
    return inter / exposure;
  };
  // 频次达标级别：qualified | near | unqualified
  // 规则：实际 ≥ targetMin → qualified；实际 ≥ 0.8 × targetMin → near；否则 unqualified
  // 若 targetMin = 0（基准窗为 0），按 actual > 0 → qualified
  const judgeSeedFrequency = (actual, target) => {
    const a = Number(actual) || 0;
    const tMin = Number(target && target.targetMin) || 0;
    if (tMin <= 0) return a > 0 ? 'qualified' : 'unqualified';
    if (a >= tMin) return 'qualified';
    if (a >= tMin * 0.8) return 'near';
    return 'unqualified';
  };
  // 互动达标级别：qualified | near | unqualified
  // 规则：rate ≥ threshold → qualified；rate ≥ 0.8 × threshold → near；否则 unqualified
  const judgeSeedEngagement = (rate, threshold) => {
    const r = Number(rate) || 0;
    const t = Number(threshold) || 0;
    if (t <= 0) return r > 0 ? 'qualified' : 'unqualified';
    if (r >= t) return 'qualified';
    if (r >= t * 0.8) return 'near';
    return 'unqualified';
  };

  // 主聚合：按 (matrix × platform) 聚合时间范围内的发布/曝光/互动
  // 入参：{ startDate, endDate, platforms?: [platformId] }（platforms 为空表示全部）
  // 返回：{
  //   matrixRows: [{ matrixId, label, platforms: [...]，
  //                  byPlatform: { [pId]: { postCount, exposure, likes, comments, favorites, shares,
  //                                         interactTotal, engagementRate, target, freqStatus, engStatus } },
  //                  total:   { ...同上... } }],
  //   summary: { totalPosts, totalExposure, totalInteract, qualifiedMatrixCount, allMatrixCount }
  // }
  const aggregateSeedMonitor = ({ startDate, endDate, platforms } = {}) => {
    const matrixList = getSeedMatrixTypes();
    const allPlatforms = getSeedPlatforms().map((p) => p.id);
    const platformFilter = (platforms && platforms.length) ? platforms : allPlatforms;
    const records = getSeedPostDaily()
      .filter((r) => r.date >= startDate && r.date <= endDate)
      .filter((r) => platformFilter.includes(r.platform));

    // index by matrixId
    const matrixRows = matrixList.map((m) => {
      const supportedPlatforms = (getSeedMatrixPlatformMap()[m.id] || [])
        .filter((p) => platformFilter.includes(p));
      const byPlatform = {};
      supportedPlatforms.forEach((p) => {
        byPlatform[p] = { postCount: 0, exposure: 0, likes: 0, comments: 0, favorites: 0, shares: 0 };
      });
      const total = { postCount: 0, exposure: 0, likes: 0, comments: 0, favorites: 0, shares: 0 };
      return {
        matrixId: m.id, label: m.label, aliasShort: m.aliasShort, aliasFull: m.aliasFull,
        freqDesc: m.freqDesc, engagementThreshold: m.engagementThreshold,
        scoreOverall: m.scoreOverall, scoreTruth: m.scoreTruth, scoreContent: m.scoreContent,
        accountCount: m.accountCount, platforms: supportedPlatforms, byPlatform, total
      };
    });
    const matrixIdx = new Map(matrixRows.map((r) => [r.matrixId, r]));
    records.forEach((r) => {
      const row = matrixIdx.get(r.matrixId);
      if (!row) return;
      const bp = row.byPlatform[r.platform];
      if (bp) {
        bp.postCount += r.postCount; bp.exposure += r.exposure; bp.likes += r.likes;
        bp.comments += r.comments; bp.favorites += r.favorites; bp.shares += r.shares;
      }
      row.total.postCount += r.postCount; row.total.exposure += r.exposure;
      row.total.likes += r.likes; row.total.comments += r.comments;
      row.total.favorites += r.favorites; row.total.shares += r.shares;
    });

    // 计算互动率/达标
    matrixRows.forEach((row) => {
      const m = getSeedMatrixTypeById(row.matrixId);
      const target = calcSeedFrequencyTarget(m, startDate, endDate);
      Object.values(row.byPlatform).forEach((bp) => {
        bp.interactTotal = bp.likes + bp.comments + bp.favorites + bp.shares;
        bp.engagementRate = calcSeedEngagementRate(bp);
      });
      row.total.interactTotal = row.total.likes + row.total.comments + row.total.favorites + row.total.shares;
      row.total.engagementRate = calcSeedEngagementRate(row.total);
      row.target = target;
      row.freqStatus = judgeSeedFrequency(row.total.postCount, target);
      row.engStatus = judgeSeedEngagement(row.total.engagementRate, m && m.engagementThreshold);
    });

    // summary
    const totalPosts = matrixRows.reduce((s, r) => s + r.total.postCount, 0);
    const totalExposure = matrixRows.reduce((s, r) => s + r.total.exposure, 0);
    const totalInteract = matrixRows.reduce((s, r) => s + r.total.interactTotal, 0);
    const qualifiedMatrixCount = matrixRows.filter((r) => r.freqStatus === 'qualified').length;

    return {
      matrixRows,
      summary: {
        totalPosts, totalExposure, totalInteract,
        qualifiedMatrixCount, allMatrixCount: matrixRows.length
      }
    };
  };

  // ========== 按酒店聚合 ==========
  // 主聚合：按 hotel × platform 聚合时间范围内的发布/曝光/互动
  // 入参：{
  //   startDate, endDate,
  //   filters?: { ownerOps: [...], ownerSales: [...], province: [...] },
  //   keyword?: '酒店名搜索关键字',
  //   sortKey?: 'posts'|'exposure'|'interact'|'engRate'  默认 'exposure'
  //   sortOrder?: 'desc'|'asc'                            默认 'desc'
  // }
  // 返回：{
  //   hotels: [{ hotelId, hotelName, province, ownerOps, ownerSales, themeName, launchDate,
  //              total: { posts, exposure, interact, engRate, freqStatus, engStatus },
  //              byPlatform: { [pId]: { posts, exposure, interact, engRate } } }],
  //   summary: { totalPosts, totalExposure, totalInteract, qualifiedHotelCount,
  //              coveredHotelCount, allHotelCount }
  // }
  const aggregateSeedHotels = ({
    startDate, endDate, filters = {}, keyword = '',
    sortKey = 'exposure', sortOrder = 'desc'
  } = {}) => {
    const hotels = getSeedHotels();
    const platformIds = getSeedPlatforms().map((p) => p.id);
    const records = getSeedPostDaily()
      .filter((r) => r.date >= startDate && r.date <= endDate);

    // 应用 hotel 维度筛选
    const opsSet = new Set(filters.ownerOps || []);
    const salesSet = new Set(filters.ownerSales || []);
    const provSet = new Set(filters.province || []);
    const kw = String(keyword || '').trim().toLowerCase();
    const filterHotels = hotels.filter((h) => {
      if (opsSet.size && !opsSet.has(h.ownerOps)) return false;
      if (salesSet.size && !salesSet.has(h.ownerSales)) return false;
      if (provSet.size && !provSet.has(h.province)) return false;
      if (kw && !(h.name || '').toLowerCase().includes(kw)) return false;
      return true;
    });
    const allowedHotelIds = new Set(filterHotels.map((h) => h.id));

    // 初始化 hotel 聚合行
    const hotelRows = filterHotels.map((h) => {
      const byPlatform = {};
      platformIds.forEach((p) => {
        byPlatform[p] = { posts: 0, exposure: 0, interact: 0, engRate: 0 };
      });
      return {
        hotelId: h.id, hotelName: h.name, province: h.province,
        ownerOps: h.ownerOps, ownerSales: h.ownerSales,
        themeName: h.themeName, launchDate: h.launchDate,
        byPlatform,
        total: { posts: 0, exposure: 0, interact: 0, engRate: 0,
                 likes: 0, comments: 0, favorites: 0, shares: 0 }
      };
    });
    const hotelIdx = new Map(hotelRows.map((r) => [r.hotelId, r]));

    records.forEach((r) => {
      if (!allowedHotelIds.has(r.hotelId)) return;
      const row = hotelIdx.get(r.hotelId);
      if (!row) return;
      const interact = (r.likes || 0) + (r.comments || 0) + (r.favorites || 0) + (r.shares || 0);
      const bp = row.byPlatform[r.platform];
      if (bp) {
        bp.posts += r.postCount;
        bp.exposure += r.exposure;
        bp.interact += interact;
      }
      row.total.posts += r.postCount;
      row.total.exposure += r.exposure;
      row.total.interact += interact;
      row.total.likes += (r.likes || 0);
      row.total.comments += (r.comments || 0);
      row.total.favorites += (r.favorites || 0);
      row.total.shares += (r.shares || 0);
    });

    // 计算互动率 + 排序
    hotelRows.forEach((row) => {
      row.total.engRate = row.total.exposure > 0 ? row.total.interact / row.total.exposure : 0;
      Object.values(row.byPlatform).forEach((bp) => {
        bp.engRate = bp.exposure > 0 ? bp.interact / bp.exposure : 0;
      });
    });
    const validKey = ['posts', 'exposure', 'interact', 'engRate'].includes(sortKey) ? sortKey : 'exposure';
    const dir = sortOrder === 'asc' ? 1 : -1;
    hotelRows.sort((a, b) => {
      const va = a.total[validKey] || 0;
      const vb = b.total[validKey] || 0;
      if (va === vb) return a.hotelId - b.hotelId;
      return (va - vb) * dir;
    });

    // summary
    const totalPosts = hotelRows.reduce((s, r) => s + r.total.posts, 0);
    const totalExposure = hotelRows.reduce((s, r) => s + r.total.exposure, 0);
    const totalInteract = hotelRows.reduce((s, r) => s + r.total.interact, 0);
    const coveredHotelCount = hotelRows.filter((r) => r.total.posts > 0).length;
    // 达标率（按矩阵号维度，整个时段，仅参考全部酒店；与列表筛选无关）
    const matrixAgg = aggregateSeedMonitor({ startDate, endDate });
    const qualifiedMatrixCount = matrixAgg.summary.qualifiedMatrixCount;
    const allMatrixCount = matrixAgg.summary.allMatrixCount;

    return {
      hotels: hotelRows,
      summary: {
        totalPosts, totalExposure, totalInteract,
        coveredHotelCount, allHotelCount: hotelRows.length,
        qualifiedMatrixCount, allMatrixCount
      }
    };
  };

  // 酒店详情聚合：单酒店 [startDate,endDate] 内的全部数据，按「矩阵 → 平台 → 账号」二级分组
  // 入参：{ hotelId, startDate, endDate }
  // 返回：{
  //   hotel,
  //   summary: { posts, exposure, interact, engRate, byPlatform: {...} },
  //   byMatrix: [{
  //     matrixId, label, freqDesc, engagementThreshold,
  //     total: { posts, exposure, interact, engRate, ... }, engStatus,
  //     byPlatform: [{
  //       platform, platformLabel,
  //       subtotal: { posts, exposure, interact, engRate }, engStatus,
  //       accounts: [{ accountId, nickname, posts, exposure, interact, engRate, engStatus, ... }]
  //     }]
  //   }],
  //   posts: [...]
  // }
  const aggregateSeedHotelDetail = ({ hotelId, startDate, endDate }) => {
    const hotel = getSeedHotelById(hotelId);
    const id = Number(hotelId);
    const platformIds = getSeedPlatforms().map((p) => p.id);
    const records = getSeedPostDaily()
      .filter((r) => r.hotelId === id)
      .filter((r) => r.date >= startDate && r.date <= endDate);

    // 概览
    const summary = { posts: 0, exposure: 0, interact: 0, engRate: 0,
                      likes: 0, comments: 0, favorites: 0, shares: 0,
                      byPlatform: {} };
    platformIds.forEach((p) => {
      summary.byPlatform[p] = { posts: 0, exposure: 0, interact: 0, engRate: 0 };
    });

    // 按矩阵 × 平台 × 账号 聚合
    const matrixList = getSeedMatrixTypes();
    const accountMap = new Map(getSeedAccounts().map((a) => [a.id, a]));
    const byMatrix = matrixList.map((m) => ({
      matrixId: m.id, label: m.label, freqDesc: m.freqDesc,
      engagementThreshold: m.engagementThreshold,
      // 平台子分组：仅存放有发布的平台
      byPlatform: new Map(),
      total: { posts: 0, exposure: 0, interact: 0, engRate: 0,
               likes: 0, comments: 0, favorites: 0, shares: 0 }
    }));
    const matrixIdx = new Map(byMatrix.map((m) => [m.matrixId, m]));

    records.forEach((r) => {
      const inter = (r.likes || 0) + (r.comments || 0) + (r.favorites || 0) + (r.shares || 0);
      summary.posts += r.postCount; summary.exposure += r.exposure; summary.interact += inter;
      summary.likes += (r.likes || 0); summary.comments += (r.comments || 0);
      summary.favorites += (r.favorites || 0); summary.shares += (r.shares || 0);
      const bp = summary.byPlatform[r.platform];
      if (bp) { bp.posts += r.postCount; bp.exposure += r.exposure; bp.interact += inter; }

      const mGroup = matrixIdx.get(r.matrixId);
      if (!mGroup) return;
      mGroup.total.posts += r.postCount; mGroup.total.exposure += r.exposure;
      mGroup.total.interact += inter;
      mGroup.total.likes += (r.likes || 0); mGroup.total.comments += (r.comments || 0);
      mGroup.total.favorites += (r.favorites || 0); mGroup.total.shares += (r.shares || 0);

      // 平台子分组
      let pGroup = mGroup.byPlatform.get(r.platform);
      if (!pGroup) {
        pGroup = {
          platform: r.platform,
          platformLabel: getSeedPlatformLabel(r.platform),
          accounts: new Map(),
          subtotal: { posts: 0, exposure: 0, interact: 0, engRate: 0,
                      likes: 0, comments: 0, favorites: 0, shares: 0 }
        };
        mGroup.byPlatform.set(r.platform, pGroup);
      }
      pGroup.subtotal.posts += r.postCount; pGroup.subtotal.exposure += r.exposure;
      pGroup.subtotal.interact += inter;
      pGroup.subtotal.likes += (r.likes || 0); pGroup.subtotal.comments += (r.comments || 0);
      pGroup.subtotal.favorites += (r.favorites || 0); pGroup.subtotal.shares += (r.shares || 0);

      let accRow = pGroup.accounts.get(r.accountId);
      if (!accRow) {
        const acc = accountMap.get(r.accountId);
        accRow = {
          accountId: r.accountId,
          // 账号在平台子分组里展示，去掉昵称尾部的 "-红薯号" 等冗余后缀，更干净
          nickname: acc ? __stripPlatformSuffix(acc.nickname) : r.accountId,
          fullNickname: acc ? acc.nickname : r.accountId,
          posts: 0, exposure: 0, interact: 0, engRate: 0,
          likes: 0, comments: 0, favorites: 0, shares: 0
        };
        pGroup.accounts.set(r.accountId, accRow);
      }
      accRow.posts += r.postCount; accRow.exposure += r.exposure;
      accRow.interact += inter;
      accRow.likes += (r.likes || 0); accRow.comments += (r.comments || 0);
      accRow.favorites += (r.favorites || 0); accRow.shares += (r.shares || 0);
    });

    summary.engRate = summary.exposure > 0 ? summary.interact / summary.exposure : 0;
    Object.values(summary.byPlatform).forEach((bp) => {
      bp.engRate = bp.exposure > 0 ? bp.interact / bp.exposure : 0;
    });

    // 整理 matrix groups（汇总互动率 + 平台子分组按平台顺序展开）
    const platformOrder = platformIds; // 沿用 SEED_PLATFORMS 顺序
    const byMatrixOut = byMatrix.map((g) => {
      g.total.engRate = g.total.exposure > 0 ? g.total.interact / g.total.exposure : 0;
      const engStatus = judgeSeedEngagement(g.total.engRate, g.engagementThreshold);

      const platformGroups = platformOrder
        .map((pid) => g.byPlatform.get(pid))
        .filter(Boolean)
        .map((pg) => {
          pg.subtotal.engRate = pg.subtotal.exposure > 0
            ? pg.subtotal.interact / pg.subtotal.exposure : 0;
          const accountsArr = [...pg.accounts.values()].map((a) => {
            a.engRate = a.exposure > 0 ? a.interact / a.exposure : 0;
            a.engStatus = judgeSeedEngagement(a.engRate, g.engagementThreshold);
            return a;
          }).sort((a, b) => b.posts - a.posts);
          return {
            platform: pg.platform,
            platformLabel: pg.platformLabel,
            subtotal: pg.subtotal,
            engStatus: judgeSeedEngagement(pg.subtotal.engRate, g.engagementThreshold),
            accounts: accountsArr
          };
        });

      const accountCount = platformGroups.reduce((s, pg) => s + pg.accounts.length, 0);
      return {
        matrixId: g.matrixId, label: g.label, freqDesc: g.freqDesc,
        engagementThreshold: g.engagementThreshold,
        byPlatform: platformGroups,
        accountCount,
        total: g.total,
        engStatus
      };
    }).filter((g) => g.accountCount > 0 || g.total.posts > 0);

    // 发布记录展开
    const posts = [];
    records.forEach((r) => {
      const acc = accountMap.get(r.accountId);
      const m = getSeedMatrixTypeById(r.matrixId);
      const total = r.postCount || 0;
      const expPer = total > 0 ? Math.round(r.exposure / total) : 0;
      const interTotal = (r.likes || 0) + (r.comments || 0) + (r.favorites || 0) + (r.shares || 0);
      const interPer = total > 0 ? Math.round(interTotal / total) : 0;
      for (let i = 0; i < total; i += 1) {
        const title = (typeof buildSeedPostTitle === 'function')
          ? buildSeedPostTitle(r.matrixId, r.accountId, r.date, i)
          : '亲子房体验';
        const exposure = expPer;
        const interact = interPer;
        const engRate = exposure > 0 ? interact / exposure : 0;
        posts.push({
          date: r.date, accountId: r.accountId,
          accountNickname: acc ? acc.nickname : r.accountId,
          matrixId: r.matrixId, matrixLabel: m ? m.label : r.matrixId,
          platform: r.platform, title, exposure,
          likes: Math.round(interact * 0.6),
          comments: Math.round(interact * 0.15),
          favorites: Math.round(interact * 0.15),
          shares: Math.max(0, interact - Math.round(interact * 0.6) - Math.round(interact * 0.15) - Math.round(interact * 0.15)),
          engagementRate: engRate,
          engStatus: judgeSeedEngagement(engRate, m && m.engagementThreshold)
        });
      }
    });
    posts.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

    return { hotel, summary, byMatrix: byMatrixOut, posts };
  };

  // 下钻：取某矩阵号 × 某平台下，[startDate,endDate] 内的账号明细
  // 返回：[{ accountId, nickname, postCount, exposure, likes, comments, favorites, shares,
  //          interactTotal, engagementRate, engStatus }]
  const aggregateSeedAccountsByMatrixPlatform = ({ matrixId, platform, startDate, endDate }) => {
    const m = getSeedMatrixTypeById(matrixId);
    if (!m) return [];
    const accounts = getSeedAccounts().filter((a) => a.matrixId === matrixId
      && (!platform || a.platform === platform
          || (Array.isArray(a.platforms) && a.platforms.includes(platform))));
    const records = getSeedPostDaily()
      .filter((r) => r.matrixId === matrixId)
      .filter((r) => !platform || r.platform === platform)
      .filter((r) => r.date >= startDate && r.date <= endDate);
    const byAcc = new Map();
    accounts.forEach((a) => {
      byAcc.set(a.id, {
        accountId: a.id, nickname: a.nickname,
        postCount: 0, exposure: 0, likes: 0, comments: 0, favorites: 0, shares: 0
      });
    });
    records.forEach((r) => {
      const row = byAcc.get(r.accountId);
      if (!row) return;
      row.postCount += r.postCount; row.exposure += r.exposure; row.likes += r.likes;
      row.comments += r.comments; row.favorites += r.favorites; row.shares += r.shares;
    });
    const list = [...byAcc.values()].map((row) => {
      row.interactTotal = row.likes + row.comments + row.favorites + row.shares;
      row.engagementRate = calcSeedEngagementRate(row);
      row.engStatus = judgeSeedEngagement(row.engagementRate, m.engagementThreshold);
      return row;
    });
    return list;
  };

  // 下钻：单条发布列表（按日 × 账号展开成"虚拟发布记录"，便于详情页展示）
  // 一个 (account,platform,date,postCount) 会展开为 postCount 条
  const aggregateSeedPostsByMatrixPlatform = ({ matrixId, platform, startDate, endDate }) => {
    const accountMap = new Map(getSeedAccounts().map((a) => [a.id, a]));
    const m = getSeedMatrixTypeById(matrixId);
    if (!m) return [];
    const records = getSeedPostDaily()
      .filter((r) => r.matrixId === matrixId)
      .filter((r) => !platform || r.platform === platform)
      .filter((r) => r.date >= startDate && r.date <= endDate);
    const expanded = [];
    records.forEach((r) => {
      const acc = accountMap.get(r.accountId);
      const total = r.postCount || 0;
      // 单条发布的曝光/互动按平均拆分
      const expPer = total > 0 ? Math.round(r.exposure / total) : 0;
      const interTotal = r.likes + r.comments + r.favorites + r.shares;
      const interPer = total > 0 ? Math.round(interTotal / total) : 0;
      for (let i = 0; i < total; i += 1) {
        const title = (typeof buildSeedPostTitle === 'function')
          ? buildSeedPostTitle(matrixId, r.accountId, r.date, i)
          : '亲子房体验';
        const exposure = expPer;
        const interact = interPer;
        const engagementRate = exposure > 0 ? interact / exposure : 0;
        expanded.push({
          date: r.date, accountId: r.accountId,
          accountNickname: acc ? acc.nickname : r.accountId,
          platform: r.platform, title, exposure,
          likes: Math.round(interact * 0.6),
          comments: Math.round(interact * 0.15),
          favorites: Math.round(interact * 0.15),
          shares: Math.max(0, interact - Math.round(interact * 0.6) - Math.round(interact * 0.15) - Math.round(interact * 0.15)),
          engagementRate,
          engStatus: judgeSeedEngagement(engagementRate, m.engagementThreshold)
        });
      }
    });
    // 默认日期倒序
    expanded.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
    return expanded;
  };

  const channelLabel = (channelKey) => {
    const m = (typeof OTA_CHANNEL_OPTIONS !== 'undefined' ? OTA_CHANNEL_OPTIONS : [])
      .find(x => x.key === channelKey);
    return m ? m.label : channelKey;
  };

  const calcPremiumRate = (salePrice, basePrice) => {
    const sale = Number(salePrice) || 0;
    const base = Number(basePrice) || 0;
    if (!base) return 0;
    return (sale - base) / base;
  };

  const formatPercent = (num) => `${Math.round((Number(num) || 0) * 100)}%`;

  // 获取酒店进度摘要（哪些块已完成）
  const getHotelProgress = (h) => {
    const sd = h.stageData || {};
    return {
      screening: sd.screening?.completed || false,
      pitch: sd.pitch?.completed || false,
      negotiate: sd.negotiate?.completed || false,
      contract: h.signedAt ? true : (sd.contract?.completed || false),
      signed: !!h.signedAt,
      hasVisit: sd.visit?.hasVisit || false,
      score: sd.screening?.totalScore || 0,
      result: sd.screening?.result || ''
    };
  };

  // 生成商务条款显示文本
  const termsText = (terms) => {
    if (!terms || !terms.mode) return '-';
    if (terms.mode === '旺季保底') {
      return `旺季保底 ${terms.peakGuarantee || '-'} | ${terms.rooms || '-'}间 | ${terms.period || '-'} | 旺季抽成${terms.peakShare || '-'} 淡季抽成${terms.offShare || '-'}`;
    }
    if (terms.mode === '全年保底') {
      return `全年保底 ${terms.yearGuarantee || '-'} | ${terms.rooms || '-'}间 | ${terms.period || '-'} | 旺季抽成${terms.peakShare || '-'} 淡季抽成${terms.offShare || '-'}`;
    }
    if (terms.mode === '买断') {
      return `买断 ${terms.buyout || '-'} | ${terms.rooms || '-'}间 | ${terms.period || '-'} | 旺季抽成${terms.peakShare || '-'} 淡季抽成${terms.offShare || '-'}`;
    }
    return '-';
  };

  return {
    formatDate, formatDateTime, screenResultLabel, screenResultShort, screenResultTag,
    classifyScore, detectCityTier, getUrlParam,
    getAllHotels, getHotelById, saveHotels, saveHotel,
    getHotelProgress, termsText,
    calcOpsRoomTotal, getAuditStatusMeta, getBusinessModeLabel,
    getOpsPatrolStatusMeta, getOpsPatrolResultMeta, getOpsPatrolSummary, getOpsPatrolSummaryByChannel,
    getOpsHotels, getOpsHotelById, saveOpsHotels, saveOpsHotel,
    getOpsRecords, saveOpsRecords, upsertOpsRecord,
    calcOpsPatrolResultType, updateOpsPatrolAfterInspection, requestOpsPatrolResolved, submitOpsRecoveryApply,
    getFinanceHotels, saveFinanceHotels, getFinanceHotelById, saveFinanceHotel,
    getFinanceReconcileRecords, saveFinanceReconcileRecords, upsertFinanceReconcileRecord, getFinanceRecordsByHotel,
    getDaysInMonth, getEffectiveDaysInMonth, calcFinanceOccupancyRate, calcFinanceAvgRevenue,
    getRevenueHotels, getRevenueWeeklyRecords, getRevenueMonthlyRecords,
    getRevenueMonthlyForHotel, getRevenueWeeklyForHotel, calcRevenueMonthlyView,
    getOfflineCouponDaily, getOfflineReviewDaily, getOfflineActivities, getOfflineActivityDaily,
    getOfflineCouponSkus, getOfflineReviewChannels, getOfflineReviewChannelLabel,
    getOfflineDateRangeByPeriod, aggregateOfflineCoupons, aggregateOfflineReviews, aggregateOfflineActivities,
    isOfflineActivityActiveInRange,
    getSeedMatrixTypes, getSeedMatrixTypeById, getSeedPlatforms, getSeedPlatformLabel,
    getSeedMatrixPlatformMap, getSeedAccounts, getSeedPostDaily,
    getSeedHotels, getSeedHotelById, getSeedFilterOptions,
    getSeedDateRangeByPeriod, calcSeedFrequencyTarget, calcSeedEngagementRate,
    judgeSeedFrequency, judgeSeedEngagement,
    aggregateSeedMonitor, aggregateSeedHotels, aggregateSeedHotelDetail,
    aggregateSeedAccountsByMatrixPlatform, aggregateSeedPostsByMatrixPlatform,
    channelLabel, calcPremiumRate, formatPercent
  };
})();
