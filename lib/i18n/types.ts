export type Lang = 'vi' | 'en' | 'ko' | 'ja' | 'zh';

export interface LanguageMeta {
  code: Lang;
  flag: string;
  nativeName: string;
  englishName: string;
  subtitle: string;
  locale: string;
  aiLanguageName: string;
}

export const SUPPORTED_LANGUAGES: LanguageMeta[] = [
  {
    code: 'vi',
    flag: '🇻🇳',
    nativeName: 'Tiếng Việt',
    englishName: 'Vietnamese',
    subtitle: 'Việt Nam (Điểm Cacbon • CB)',
    locale: 'vi-VN',
    aiLanguageName: 'Vietnamese',
  },
  {
    code: 'en',
    flag: '🇬🇧',
    nativeName: 'English',
    englishName: 'English',
    subtitle: 'International (Carbon Points • CB)',
    locale: 'en-US',
    aiLanguageName: 'English',
  },
  {
    code: 'ko',
    flag: '🇰🇷',
    nativeName: '한국어',
    englishName: 'Korean',
    subtitle: '대한민국 (카본 포인트 • CB)',
    locale: 'ko-KR',
    aiLanguageName: 'Korean',
  },
  {
    code: 'ja',
    flag: '🇯🇵',
    nativeName: '日本語',
    englishName: 'Japanese',
    subtitle: '日本 (カーボンポイント • CB)',
    locale: 'ja-JP',
    aiLanguageName: 'Japanese',
  },
  {
    code: 'zh',
    flag: '🇨🇳',
    nativeName: '中文',
    englishName: 'Chinese (Simplified)',
    subtitle: '简体中文 (碳积分 • CB)',
    locale: 'zh-CN',
    aiLanguageName: 'Simplified Chinese',
  },
];

export interface AppDictionary {
  common: {
    close: string;
    cancel: string;
    confirm: string;
    save: string;
    done: string;
    back: string;
    all: string;
    justNow: string;
    memberId: string;
    active: string;
    select: string;
    copy: string;
    copied: string;
    free: string;
  };
  nav: {
    home: string;
    rewards: string;
    scanner: string;
    earn: string;
    more: string;
  };
  header: {
    hello: string;
    openProfile: string;
    notifications: string;
  };
  login: {
    tagline: string;
    signIn: string;
    signUp: string;
    or: string;
    emailOrPhone: string;
    password: string;
    forgotPassword: string;
    forgotHint: string;
    noAccount: string;
    hasAccount: string;
    createAccountBtn: string;
    welcomeBonus: string;
    fullName: string;
    phone: string;
    roomNumber: string;
    terms: string;
    signInDemoBtn: string;
    chooseDemoTitle: string;
    chooseDemoSubtitle: string;
    settingsLabel: string;
    devNoticeSocial: string; // uses {provider}
    devNoticeEmail: string;
    devNoticeRegister: string;
    authTitle: string;
    authSubtitle: string;
    demoAccountsTab: string;
    devNoticeAuthLogin: string;
    devNoticeAuthRegister: string;
    switchAction: string;
  };
  home: {
    availablePoints: string;
    expiryNotice: string; // uses {date}
    searchPlaceholder: string;
    categoriesTitle: string;
    certifiedVenues: string; // uses {count}
    noVenuesFound: string;
    resetFilter: string;
    greenBadge100: string;
    viewAndBook: string;
    addressLabel: string;
    priceEstimateLabel: string;
    earnRewardNote: string; // uses {points}
    bookAndEarnBtn: string; // uses {points}
    openGoogleMaps: string;
    ecoBotLabel: string;
  };
  map: {
    title: string;
    subtitle: string;
    streetMode: string;
    satelliteMode: string;
    recenterTitle: string;
    zoomInTitle: string;
    zoomOutTitle: string;
    regionPrefix: string;
    allVietnam: string;
    viewAndBook: string;
  };
  rewards: {
    storeTab: string;
    cartTab: string;
    availableBalance: string;
    redeemNow: string;
    insufficientBtn: string;
    confirmTitle: string;
    confirmDesc: string; // uses {points}, {title}
    confirmBtn: string;
    insufficientTitle: string;
    insufficientDesc: string; // uses {required}, {current}, {missing}
    earnMoreBtn: string;
    cartEmptyTitle: string;
    cartEmptyDesc: string;
    exploreStoreBtn: string;
    statusUsed: string;
    statusReady: string;
    expLabel: string;
    useNowBtn: string;
    categories: {
      all: string;
      food: string;
      fashion: string;
      tree: string;
      hotdeal: string;
      service: string;
      other: string;
    };
  };
  scanner: {
    cameraTab: string;
    myQrTab: string;
    title: string;
    subtitle: string;
    liveCamera: string;
    cameraReady: string;
    toggleFlash: string;
    flipCamera: string;
    startingCamera: string;
    tapToActivate: string;
    turnOnCamera: string;
    retryCamera: string;
    errHttps: string;
    errDenied: string;
    errNotFound: string;
    errGeneric: string;
    scanAny15Hint: string;
    scanFromImageBtn: string;
    noQrInImage: string;
    completedTitle: string;
    cameraClosedNotice: string;
    currentBalanceLabel: string;
    scanNextBtn: string;
    doneToHomeBtn: string;
    memberCardBadge: string;
    memberCodeLabel: string;
    copyCodeBtn: string;
    copiedBtn: string;
    showStaffHint: string;
    currentPointsLabel: string;
  };
  earn: {
    headerTitle: string;
    headerSubtitle: string;
    completedLabel: string;
    penaltyBadge: string;
    doneBadge: string;
    scanQrBtn: string;
    categories: {
      all: string;
      room: string;
      food: string;
      transport: string;
      experience: string;
      app: string;
    };
  };
  missionModal: {
    scanningTitle: string;
    completedTitle: string;
    penaltyNote: string;
    openingCamera: string;
    retryCamera: string;
    defaultInstruction: string;
    scanFromImageBtn: string;
    wrongMissionError: string;
    invalidQrError: string;
    noQrInImage: string;
    addedNotice: string; // uses {points}
    updatedBalanceLabel: string;
    scanNextBtn: string;
    doneBtn: string;
  };
  notifications: {
    title: string;
    detailTitle: string;
    unreadLabel: string; // uses {count}
    allCaughtUp: string;
    readAllBtn: string;
    confirmReadAllTitle: string;
    confirmReadAllDesc: string;
    markedAsRead: string;
    backToList: string;
    tapToRead: string;
    readCheck: string;
    initial: Record<
      string,
      {
        title: string;
        desc: string;
        detail: string;
        time: string;
      }
    >;
  };
  more: {
    viewImpactTitle: string;
    passportTitle: string;
    passportSubtitle: string;
    passportDesc: string; // uses {co2}
    createReportBtn: string;
    appSettings: string;
    contactHotline: string;
    aboutProgram: string;
    legalEsg: string;
    userGuide: string;
    orderHistory: string;
    displayLanguage: string;
    signOut: string;
    resetDemoData: string;
    developedBy: string;
    selectLangTitle: string;
    selectLangDesc: string;
    settingsNotifTitle: string;
    settingsNotifDesc: string;
    settingsCameraTitle: string;
    settingsCameraDesc: string;
    settingsOfflineTitle: string;
    settingsOfflineDesc: string;
    switchAccountTitle: string;
    switchAccountDesc: string;
    saveSettingsBtn: string;
  };
  chat: {
    subtitle: string;
    newChatTitle: string;
    welcomeText: string; // uses {name}, {points}
    suggestions: string[]; // uses {points} in 3rd item
    thinking: string;
    connectionNotice: string;
    retryBtn: string;
    inputPlaceholder: string;
    stopTitle: string;
    sendTitle: string;
    errMissingKey: string;
    errInvalidKey: string;
    errRateLimit: string;
    errModelNotFound: string;
    errEmpty: string;
    errNetwork: string;
  };
  modals: {
    ecoImpact: {
      title: string;
      subtitle: string;
      certifiedBadge: string;
      co2Label: string;
      waterLabel: string;
      energyLabel: string;
      treesLabel: string;
      treeUnit: string;
      quote: string;
      shareBtn: string;
      downloadBtn: string;
      copiedToast: string;
    };
    voucherDetail: {
      headerTitle: string;
      partnerLabel: string;
      codeLabel: string;
      issueDateLabel: string;
      expiryDateLabel: string;
      guideText: string;
      markUsedBtn: string;
      usedBadge: string;
    };
    history: {
      title: string;
      pointsTab: string;
      ordersTab: string;
      emptyPoints: string;
      emptyOrders: string;
      statusUsed: string;
      statusUnused: string;
    };
    handbook: {
      title: string;
      subtitle: string;
      steps: { title: string; desc: string }[];
    };
    about: {
      title: string;
      subtitle: string;
      missionHeading: string;
      missionDesc: string;
      pointRulePrefix: string;
      pointRuleDesc: string;
      esgHeading: string;
      esgItems: string[];
      footerTeam: string;
    };
    feedback: {
      title: string;
      subtitle: string;
      ratingLabel: string;
      placeholder: string;
      submitBtn: string;
      successTitle: string;
      successDesc: string;
      hotlineLabel: string;
    };
  };
  toasts: {
    loginSuccess: string; // uses {name}
    registerSuccess: string;
    logoutSuccess: string;
    resetConfirm: string;
    resetSuccess: string;
    missionAlreadyDone: string; // uses {title}
    missionEarned: string; // uses {points}, {title}
    bookSuccess: string; // uses {name}, {points}
    redeemNotEnough: string;
    redeemSuccess: string; // uses {title}
    voucherUsed: string;
    invalidQr: string;
    alreadyCompletedQr: string; // uses {title}
    feedbackThanks: string; // uses {points}
    readAllSuccess: string;
  };
  data: {
    missions: Record<
      string,
      { title: string; subtitle: string; categoryName: string; qrInstruction: string }
    >;
    destinations: Record<
      string,
      { name: string; title: string; desc: string; badge: string; categoryName: string }
    >;
    rewards: Record<
      string,
      { title: string; desc: string; partner: string; categoryName: string }
    >;
    ranks: Record<string, string>;
    locations: Record<string, string>;
    accountRoles: Record<string, string>;
    destinationCategories: Record<string, string>;
  };
}
