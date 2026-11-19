'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  initialUserProfile,
  initialDestinations,
  initialRewards,
  initialVouchers,
  initialImpactLogs,
  initialMissions,
  initialNotifications
} from '@/data/mockData';
import {
  UserProfile,
  GreenDestination,
  RewardItem,
  Voucher,
  ImpactLog,
  DetailedMission,
  AppNotification
} from '@/data/types';
import { Header } from '@/components/Header';
import { BottomNav, TabId } from '@/components/BottomNav';
import { TabHome } from '@/components/TabHome';
import { TabRewards } from '@/components/TabRewards';
import { TabScanner } from '@/components/TabScanner';
import { TabEarnPoints } from '@/components/TabEarnPoints';
import { TabMore } from '@/components/TabMore';
import { EcoImpactModal } from '@/components/EcoImpactModal';
import { VoucherDetailModal } from '@/components/VoucherDetailModal';
import { NotificationModal } from '@/components/NotificationModal';
import { HandbookModal } from '@/components/HandbookModal';
import { HistoryModal } from '@/components/HistoryModal';
import { FeedbackModal } from '@/components/FeedbackModal';
import { AboutModal } from '@/components/AboutModal';
import { AIChatModal } from '@/components/AIChatModal';
import { MissionQRModal } from '@/components/MissionQRModal';
import { AuthModal } from '@/components/AuthModal';
import { LoginScreen } from '@/components/LoginScreen';
import { SideNav } from '@/components/SideNav';
import { DesktopRail, DesktopBrandPanel } from '@/components/DesktopRail';
import { triggerEcoConfetti } from '@/components/Confetti';
import { Sparkles, CheckCircle2, UserCheck } from 'lucide-react';
import { mockAccounts } from '@/data/mockData';
import { MockAccount } from '@/data/types';
import { LocalAccount } from '@/lib/auth/localAccounts';
import { getDictionary, getLanguageMeta, isValidLang, formatText, Lang } from '@/lib/i18n';

const STORAGE_KEY_USER = 'ecostay_user_profile_v5';
const STORAGE_KEY_VOUCHERS = 'ecostay_vouchers_v5';
const STORAGE_KEY_LOGS = 'ecostay_logs_v5';
const STORAGE_KEY_MISSIONS = 'ecostay_missions_v5';
const STORAGE_KEY_LANG = 'ecostay_lang_v5';
const STORAGE_KEY_ACTIVE_ACCOUNT = 'ecostay_active_account_v5';
const STORAGE_KEY_NOTIFICATIONS = 'ecostay_notifications_v5';
const STORAGE_KEY_LOGGED_IN = 'ecostay_logged_in_v5';

const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

// A mission completed on a previous day becomes available again.
const resetStaleMissions = (list: DetailedMission[]): DetailedMission[] => {
  const today = todayKey();
  return list.map((m) =>
    m.completed && m.completedDate !== today ? { ...m, completed: false, completedDate: undefined } : m
  );
};

export default function EcoStayApp() {
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Application Data States (Hydrated with LocalStorage v5)
  const [user, setUser] = useState<UserProfile>(initialUserProfile);
  const [currentAccountId, setCurrentAccountId] = useState<string>('user-1');
  const [destinations] = useState<GreenDestination[]>(initialDestinations);
  const [rewards] = useState<RewardItem[]>(initialRewards);
  const [vouchers, setVouchers] = useState<Voucher[]>(initialVouchers);
  const [logs, setLogs] = useState<ImpactLog[]>(initialImpactLogs);
  const [missions, setMissions] = useState<DetailedMission[]>(initialMissions);
  const [notifications, setNotifications] = useState<AppNotification[]>(initialNotifications);
  const [currentLang, setCurrentLang] = useState<Lang>('vi');
  const [isLoaded, setIsLoaded] = useState(false);

  const t = getDictionary(currentLang);
  const langMeta = getLanguageMeta(currentLang);

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isEcoImpactOpen, setIsEcoImpactOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isHandbookOpen, setIsHandbookOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyTab, setHistoryTab] = useState<'points' | 'orders'>('points');
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [selectedMissionForQR, setSelectedMissionForQR] = useState<DetailedMission | null>(null);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);

  // Toast System
  const [toastMessage, setToastMessage] = useState<{ text: string; icon?: React.ReactNode } | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (text: string, icon?: React.ReactNode, durationMs = 3500) => {
    setToastMessage({ text, icon });
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
      toastTimerRef.current = null;
    }, durationMs);
  };

  // Load from LocalStorage
  useEffect(() => {
    try {
      const savedAccount = localStorage.getItem(STORAGE_KEY_ACTIVE_ACCOUNT);
      if (savedAccount) setCurrentAccountId(savedAccount);

      const savedUser = localStorage.getItem(STORAGE_KEY_USER);
      if (savedUser) setUser(JSON.parse(savedUser));

      const savedVouchers = localStorage.getItem(STORAGE_KEY_VOUCHERS);
      if (savedVouchers) setVouchers(JSON.parse(savedVouchers));

      const savedLogs = localStorage.getItem(STORAGE_KEY_LOGS);
      if (savedLogs) setLogs(JSON.parse(savedLogs));

      const savedMissions = localStorage.getItem(STORAGE_KEY_MISSIONS);
      if (savedMissions) setMissions(resetStaleMissions(JSON.parse(savedMissions)));

      if (localStorage.getItem(STORAGE_KEY_LOGGED_IN) === '1') setIsLoggedIn(true);

      const savedLang = localStorage.getItem(STORAGE_KEY_LANG);
      if (isValidLang(savedLang)) setCurrentLang(savedLang);

      const savedNotifs = localStorage.getItem(STORAGE_KEY_NOTIFICATIONS);
      if (savedNotifs) setNotifications(JSON.parse(savedNotifs));
    } catch (e) {
      console.warn('LocalStorage load failed', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Sync HTML lang attribute for typography & screen readers
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = currentLang;
    }
  }, [currentLang]);

  // Save to LocalStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVE_ACCOUNT, currentAccountId);
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEY_VOUCHERS, JSON.stringify(vouchers));
      localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(logs));
      localStorage.setItem(STORAGE_KEY_MISSIONS, JSON.stringify(missions));
      localStorage.setItem(STORAGE_KEY_LANG, currentLang);
      localStorage.setItem(STORAGE_KEY_LOGGED_IN, isLoggedIn ? '1' : '0');
      localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(notifications));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [user, vouchers, logs, missions, notifications, currentLang, currentAccountId, isLoggedIn, isLoaded]);

  const handleMarkNotificationRead = (notifId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    showToast(
      t.toasts.readAllSuccess,
      <CheckCircle2 size={16} className="text-emerald-400" />,
      2000
    );
  };

  // Handler: Complete Mission in "Tích Điểm" via QR Scan
  const handleCompleteMission = (missionId: string) => {
    const mission = missions.find((m) => m.id === missionId);
    if (!mission) return;

    const mTrans = t.data.missions[mission.id];
    const mTitle = mTrans?.title || mission.title;
    const mSubtitle = mTrans?.subtitle || mission.subtitle;
    const mCategory = mTrans?.categoryName || mission.categoryName;

    if (mission.completed) {
      showToast(formatText(t.toasts.missionAlreadyDone, { title: mTitle }));
      return;
    }

    setMissions((prev) =>
      prev.map((m) => (m.id === missionId ? { ...m, completed: true, completedDate: todayKey() } : m))
    );

    triggerEcoConfetti();
    const pointsAdded = mission.points;

    setUser((prev) => ({
      ...prev,
      carbonPoints: prev.carbonPoints + pointsAdded,
      co2Saved: Number((prev.co2Saved + pointsAdded * 0.12).toFixed(1)),
      waterSaved: mission.id === 'mis-r1' ? prev.waterSaved + 35 : prev.waterSaved,
      energySaved:
        mission.id === 'mis-r2'
          ? Number((prev.energySaved + 1.5).toFixed(1))
          : prev.energySaved,
      treesPlanted:
        mission.id === 'mis-e5' ? prev.treesPlanted + 1 : prev.treesPlanted,
    }));

    const newLog: ImpactLog = {
      id: `log-${Date.now()}`,
      date: t.common.justNow,
      title: mTitle,
      points: pointsAdded,
      type: 'earn',
      detail: mSubtitle || `${mCategory} (+${pointsAdded} CB)`,
    };

    setLogs((prev) => [newLog, ...prev]);

    const earnedMsg = formatText(t.toasts.missionEarned, {
      points: pointsAdded,
      title: mTitle,
    });

    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: `+${pointsAdded} CB • ${mCategory}`,
      titleEn: `+${pointsAdded} CB • ${mCategory}`,
      desc: mTitle,
      descEn: mTitle,
      detail: earnedMsg,
      detailEn: earnedMsg,
      time: t.common.justNow,
      timeEn: t.common.justNow,
      category: 'points',
      isRead: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    showToast(
      earnedMsg,
      <CheckCircle2 size={16} className="text-emerald-400" />
    );
  };

  // Handler: Book Service from Home Green Destination
  const handleBookService = (dest: GreenDestination) => {
    const dTrans = t.data.destinations[dest.id];
    const dName = dTrans?.name || dest.name;
    const dLoc = t.data.locations[dest.location] || dest.location;

    setUser((prev) => ({
      ...prev,
      carbonPoints: prev.carbonPoints + dest.pointsReward,
      co2Saved: Number((prev.co2Saved + 5.5).toFixed(1)),
    }));

    const newLog: ImpactLog = {
      id: `log-${Date.now()}`,
      date: t.common.justNow,
      title: dName,
      points: dest.pointsReward,
      type: 'earn',
      detail: `${dLoc} (+${dest.pointsReward} CB)`,
    };

    setLogs((prev) => [newLog, ...prev]);

    showToast(
      formatText(t.toasts.bookSuccess, { name: dName, points: dest.pointsReward }),
      <Sparkles size={16} className="text-amber-400" />
    );
  };

  // Handler: Redeem Reward into Green Cart
  const handleRedeemReward = (reward: RewardItem) => {
    if (user.carbonPoints < reward.points) {
      showToast(t.toasts.redeemNotEnough);
      return;
    }

    const rTrans = t.data.rewards[reward.id];
    const rTitle = rTrans?.title || reward.title;

    // Deduct points
    setUser((prev) => ({
      ...prev,
      carbonPoints: prev.carbonPoints - reward.points,
      treesPlanted: reward.category === 'tree' ? prev.treesPlanted + 1 : prev.treesPlanted,
    }));

    // Create unique voucher
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const voucherCode = `ECO-${reward.category.toUpperCase().slice(0, 3)}-${randomSuffix}`;

    const newVoucher: Voucher = {
      id: `voucher-${Date.now()}`,
      rewardId: reward.id,
      title: rTitle,
      code: voucherCode,
      category: rTrans?.categoryName || reward.categoryName,
      image: reward.image,
      pointsUsed: reward.points,
      issueDate: new Date().toLocaleDateString(langMeta.locale),
      expiryDate: '31/12/2026',
      isUsed: false,
      partner: rTrans?.partner || reward.partner,
      description: rTrans?.desc || reward.description,
      qrValue: `ECOSTAY:VOUCHER:${voucherCode}:${reward.points}`,
    };

    setVouchers((prev) => [newVoucher, ...prev]);

    // Add log
    const newLog: ImpactLog = {
      id: `log-${Date.now()}`,
      date: t.common.justNow,
      title: rTitle,
      points: -reward.points,
      type: 'redeem',
      detail: `-${reward.points} CB • ${t.rewards.cartTab}`,
    };

    setLogs((prev) => [newLog, ...prev]);

    showToast(
      formatText(t.toasts.redeemSuccess, { title: rTitle }),
      <Sparkles size={16} className="text-amber-400" />
    );
  };

  // Handler: Mark Voucher as Used
  const handleMarkVoucherUsed = (voucherId: string) => {
    setVouchers((prev) =>
      prev.map((v) => (v.id === voucherId ? { ...v, isUsed: true } : v))
    );
    showToast(t.toasts.voucherUsed);
  };

  // Handler: Simulated QR Scan
  const handleSimulateQRScan = (type: 'room' | 'food' | 'transport') => {
    let targetMissionId = 'mis-r1';
    if (type === 'food') {
      targetMissionId = 'mis-f1';
    } else if (type === 'transport') {
      targetMissionId = 'mis-t1';
    }
    handleCompleteMission(targetMissionId);
  };

  // Handler: Live Camera QR Scan (Strict verification against all 15 EcoStay missions)
  const handleLiveQRScan = (
    decodedData: string
  ): {
    status: 'success' | 'already_completed' | 'invalid';
    message: string;
    points?: number;
    missionTitle?: string;
    categoryName?: string;
  } => {
    const cleaned = decodedData.trim();

    const matchingMission = missions.find(
      (m) => m.qrSampleCode && (cleaned === m.qrSampleCode || cleaned.includes(m.qrSampleCode))
    );

    if (!matchingMission) {
      const invalidMsg = t.toasts.invalidQr;
      showToast(invalidMsg);
      return { status: 'invalid', message: invalidMsg };
    }

    const mTrans = t.data.missions[matchingMission.id];
    const mTitle = mTrans?.title || matchingMission.title;
    const mCategory = mTrans?.categoryName || matchingMission.categoryName;

    if (matchingMission.completed) {
      const alreadyMsg = formatText(t.toasts.alreadyCompletedQr, { title: mTitle });
      showToast(alreadyMsg);
      return {
        status: 'already_completed',
        message: alreadyMsg,
        missionTitle: mTitle,
        categoryName: mCategory,
      };
    }

    handleCompleteMission(matchingMission.id);
    const successMsg = formatText(t.toasts.missionEarned, {
      points: matchingMission.points,
      title: mTitle,
    });
    return {
      status: 'success',
      message: successMsg,
      points: matchingMission.points,
      missionTitle: mTitle,
      categoryName: mCategory,
    };
  };

  // Handler: Feedback Submit
  const handleSubmitFeedback = (feedbackText: string, rating: number) => {
    const pointsAwarded = 15;
    setUser((prev) => ({
      ...prev,
      carbonPoints: prev.carbonPoints + pointsAwarded,
    }));

    const newLog: ImpactLog = {
      id: `log-${Date.now()}`,
      date: t.common.justNow,
      title: t.modals.feedback.title,
      points: pointsAwarded,
      type: 'earn',
      detail: `${rating}★ • +${pointsAwarded} CB`,
    };

    setLogs((prev) => [newLog, ...prev]);

    showToast(
      formatText(t.toasts.feedbackThanks, { points: pointsAwarded }),
      <Sparkles size={16} className="text-amber-400" />
    );
  };

  // Handler: Select Mock Account
  const handleSelectAccount = (account: MockAccount) => {
    setCurrentAccountId(account.id);
    setUser(account.profile);
    setVouchers(account.initialVouchers);
    setLogs(account.initialLogs);
    setMissions(initialMissions);

    try {
      localStorage.setItem(STORAGE_KEY_ACTIVE_ACCOUNT, account.id);
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(account.profile));
      localStorage.setItem(STORAGE_KEY_VOUCHERS, JSON.stringify(account.initialVouchers));
      localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(account.initialLogs));
      localStorage.setItem(STORAGE_KEY_MISSIONS, JSON.stringify(initialMissions));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }

    showToast(
      formatText(t.toasts.loginSuccess, { name: account.profile.name }),
      <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />,
      2000
    );
  };

  // Handler: Register New Account (+50 CB Bonus)
  const handleRegisterNewAccount = (data: {
    id?: string;
    welcomeBonus?: boolean;
    name: string;
    phone: string;
    email: string;
    hotel: string;
    room: string;
  }) => {
    const grantBonus = data.welcomeBonus !== false;
    const newId = data.id || `user-${Date.now()}`;
    const newProfile: UserProfile = {
      name: data.name,
      avatar: '/logo.jpg',
      carbonPoints: grantBonus ? 50 : 0,
      expiryDate: '31/12/2027',
      co2Saved: 0.0,
      waterSaved: 0,
      energySaved: 0.0,
      treesPlanted: 0,
      rank: 'Thành viên Khởi Động',
      roomNumber: data.room || 'Room Eco-101',
      hotelName: data.hotel,
      memberCode: `ECO-NW-${Math.floor(100000 + Math.random() * 900000)}`,
    };

    const newLogs: ImpactLog[] = !grantBonus ? [] : [
      {
        id: `log-${Date.now()}`,
        date: t.common.justNow,
        title: t.login.welcomeBonus,
        points: 50,
        type: 'earn',
        detail: 'EcoStay (+50 CB)',
      },
    ];

    setCurrentAccountId(newId);
    setUser(newProfile);
    setVouchers([]);
    setLogs(newLogs);

    try {
      localStorage.setItem(STORAGE_KEY_ACTIVE_ACCOUNT, newId);
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(newProfile));
      localStorage.setItem(STORAGE_KEY_VOUCHERS, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(newLogs));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }

    showToast(
      t.toasts.registerSuccess,
      <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />,
      2000
    );
  };

  // Handler: Login with a locally registered account
  const handleLocalLogin = (account: LocalAccount) => {
    if (account.id === currentAccountId) {
      // Same browser profile as the saved state: keep points/missions.
      setIsLoggedIn(true);
      showToast(
        formatText(t.toasts.loginSuccess, { name: account.name }),
        <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />,
        2000
      );
      return;
    }
    // Different profile was active: demo storage keeps a single profile slot.
    handleRegisterNewAccount({
      id: account.id,
      welcomeBonus: false,
      name: account.name,
      phone: account.phone,
      email: account.email,
      hotel: account.hotel,
      room: account.room,
    });
    setIsLoggedIn(true);
  };

  // Handler: Logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    showToast(t.toasts.logoutSuccess);
  };

  // Handler: Reset Data to Default
  const handleResetData = () => {
    if (confirm(t.toasts.resetConfirm)) {
      localStorage.removeItem(STORAGE_KEY_ACTIVE_ACCOUNT);
      localStorage.removeItem(STORAGE_KEY_USER);
      localStorage.removeItem(STORAGE_KEY_VOUCHERS);
      localStorage.removeItem(STORAGE_KEY_LOGS);
      localStorage.removeItem(STORAGE_KEY_MISSIONS);
      localStorage.removeItem(STORAGE_KEY_LANG);
      localStorage.removeItem(STORAGE_KEY_NOTIFICATIONS);
      setCurrentAccountId('user-1');
      setUser(initialUserProfile);
      setVouchers(initialVouchers);
      setLogs(initialImpactLogs);
      setMissions(initialMissions);
      setNotifications(initialNotifications);
      setCurrentLang('vi');
      showToast(t.toasts.resetSuccess);
    }
  };

  // If not logged in, show Login Screen first!
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-900/5 sm:bg-slate-900/20 flex items-center justify-center p-0 sm:p-4 lg:grid lg:w-full lg:grid-cols-[1.1fr_1fr] lg:items-center lg:p-0 lg:bg-[#F1F5F2]">
        <DesktopBrandPanel currentLang={currentLang} />
        <LoginScreen
          currentLang={currentLang}
          onChangeLang={setCurrentLang}
          onLoginSuccess={(acc) => {
            handleSelectAccount(acc);
            setIsLoggedIn(true);
          }}
          onLocalLogin={handleLocalLogin}
          onRegisterSuccess={(data) => {
            handleRegisterNewAccount(data);
            setIsLoggedIn(true);
          }}
          onContinueAsGuest={() => {
            setIsLoggedIn(true);
            showToast(
              formatText(t.toasts.loginSuccess, { name: user.name }),
              <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />,
              2000
            );
          }}
        />

        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-2xl bg-slate-900/90 px-4 py-2.5 text-xs font-semibold text-white shadow-2xl backdrop-blur-md animate-fadeIn max-w-[90%] text-center">
            {toastMessage.icon}
            <span>{toastMessage.text}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="contents lg:flex lg:min-h-screen lg:w-full">
    <SideNav
      activeTab={activeTab}
      onSelectTab={setActiveTab}
      onOpenAIChat={() => setIsAIChatOpen(true)}
      cartCount={vouchers.filter((v) => !v.isUsed).length}
      currentLang={currentLang}
      user={user}
    />
    <div className="relative mx-auto w-full max-w-md min-h-screen bg-[#F8FAF8] text-[#1B3B2B] pb-24 shadow-2xl font-sans rounded-none sm:rounded-[40px] overflow-hidden border-0 sm:border-8 sm:border-slate-800 flex flex-col justify-between lg:mx-0 lg:max-w-none lg:min-w-0 lg:flex-1 lg:justify-start lg:rounded-none lg:border-0 lg:shadow-none lg:pb-8 lg:overflow-visible">
      {/* Top Header */}
      <Header
        user={user}
        currentLang={currentLang}
        unreadNotificationsCount={notifications.filter((n) => !n.isRead).length}
        onOpenNotifications={() => setIsNotificationOpen(true)}
        onOpenProfile={() => setActiveTab('more')}
      />

      {/* Main Content Rendered by Tab */}
      <main className="flex-1 overflow-y-auto lg:overflow-visible lg:mx-auto lg:w-full lg:max-w-5xl lg:px-4 lg:pt-2">
        {activeTab === 'home' && (
          <TabHome
            user={user}
            destinations={destinations}
            currentLang={currentLang}
            onBookService={handleBookService}
            onNavigateToEarn={() => setActiveTab('earn')}
            onOpenAIChat={() => setIsAIChatOpen(true)}
          />
        )}

        {activeTab === 'rewards' && (
          <TabRewards
            userPoints={user.carbonPoints}
            rewards={rewards}
            vouchers={vouchers}
            currentLang={currentLang}
            onRedeemReward={handleRedeemReward}
            onSelectVoucher={setSelectedVoucher}
            onNavigateToEarn={() => setActiveTab('earn')}
          />
        )}

        {activeTab === 'scanner' && (
          <TabScanner
            user={user}
            currentLang={currentLang}
            onSimulateQRScan={handleSimulateQRScan}
            onLiveQRScan={handleLiveQRScan}
            onNavigateHome={() => setActiveTab('home')}
          />
        )}

        {activeTab === 'earn' && (
          <TabEarnPoints
            user={user}
            missions={missions}
            currentLang={currentLang}
            onOpenMissionQR={(mission) => setSelectedMissionForQR(mission)}
            onNavigateToScanner={() => setActiveTab('scanner')}
            onOpenEcoImpact={() => setIsEcoImpactOpen(true)}
          />
        )}

        {activeTab === 'more' && (
          <TabMore
            user={user}
            currentLang={currentLang}
            onChangeLang={setCurrentLang}
            onOpenEcoImpact={() => setIsEcoImpactOpen(true)}
            onOpenHandbook={() => setIsHandbookOpen(true)}
            onOpenHistory={(tab) => {
              setHistoryTab(tab || 'points');
              setIsHistoryOpen(true);
            }}
            onOpenFeedback={() => setIsFeedbackOpen(true)}
            onOpenAbout={() => setIsAboutOpen(true)}
            onResetData={handleResetData}
            onOpenAuth={() => setIsAuthOpen(true)}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* Bottom Navigation Bar (5 tabs: Trang chủ, Quà tặng, Quét mã, Tích điểm, Khác) */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        cartCount={vouchers.filter((v) => !v.isUsed).length}
        currentLang={currentLang}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 lg:bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-2xl bg-slate-900/90 px-4 py-2.5 text-xs font-semibold text-white shadow-2xl backdrop-blur-md animate-fadeIn max-w-[90%] text-center">
          {toastMessage.icon}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Mission QR Modal (100% Real Live Camera QR Scanner for missions) */}
      <MissionQRModal
        mission={selectedMissionForQR}
        userPoints={user.carbonPoints}
        currentLang={currentLang}
        onClose={() => setSelectedMissionForQR(null)}
        onSuccess={(missionId) => handleCompleteMission(missionId)}
        onScanNext={() => {
          setSelectedMissionForQR(null);
          setActiveTab('scanner');
        }}
        onNavigateHome={() => {
          setSelectedMissionForQR(null);
          setActiveTab('home');
        }}
      />

      {/* EcoBot AI Chatbot Modal */}
      <AIChatModal
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
        user={user}
        currentLang={currentLang}
      />

      {/* Auth & Account Switcher Modal (4 Mock Accounts) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUserId={currentAccountId}
        currentLang={currentLang}
        onSelectAccount={handleSelectAccount}
        onRegisterNewAccount={handleRegisterNewAccount}
      />

      {/* Shared Modals */}
      <EcoImpactModal
        isOpen={isEcoImpactOpen}
        onClose={() => setIsEcoImpactOpen(false)}
        user={user}
        currentLang={currentLang}
      />

      <VoucherDetailModal
        voucher={selectedVoucher}
        currentLang={currentLang}
        onClose={() => setSelectedVoucher(null)}
        onMarkUsed={handleMarkVoucherUsed}
      />

      <NotificationModal
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        notifications={notifications}
        onMarkRead={handleMarkNotificationRead}
        onMarkAllRead={handleMarkAllNotificationsRead}
        currentLang={currentLang}
      />

      <HandbookModal
        isOpen={isHandbookOpen}
        onClose={() => setIsHandbookOpen(false)}
        currentLang={currentLang}
      />

      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        logs={logs}
        vouchers={vouchers}
        initialTab={historyTab}
        currentLang={currentLang}
      />

      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        onSubmitFeedback={handleSubmitFeedback}
        currentLang={currentLang}
      />

      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        currentLang={currentLang}
      />
    </div>
    <DesktopRail
      user={user}
      missions={missions}
      currentLang={currentLang}
      onNavigate={setActiveTab}
    />
    </div>
  );
}
