'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  initialUserProfile,
  initialDestinations,
  initialRewards,
  initialVouchers,
  initialImpactLogs,
  initialMissions
} from '@/data/mockData';
import {
  UserProfile,
  GreenDestination,
  RewardItem,
  Voucher,
  ImpactLog,
  DetailedMission
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
import { triggerEcoConfetti } from '@/components/Confetti';
import { Sparkles, CheckCircle2, UserCheck } from 'lucide-react';
import { mockAccounts } from '@/data/mockData';
import { MockAccount } from '@/data/types';

const STORAGE_KEY_USER = 'ecostay_user_profile_v5';
const STORAGE_KEY_VOUCHERS = 'ecostay_vouchers_v5';
const STORAGE_KEY_LOGS = 'ecostay_logs_v5';
const STORAGE_KEY_MISSIONS = 'ecostay_missions_v5';
const STORAGE_KEY_LANG = 'ecostay_lang_v5';
const STORAGE_KEY_ACTIVE_ACCOUNT = 'ecostay_active_account_v5';

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
  const [currentLang, setCurrentLang] = useState<'vi' | 'en'>('vi');
  const [isLoaded, setIsLoaded] = useState(false);

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
      if (savedMissions) setMissions(JSON.parse(savedMissions));

      const savedLang = localStorage.getItem(STORAGE_KEY_LANG);
      if (savedLang === 'vi' || savedLang === 'en') setCurrentLang(savedLang);
    } catch (e) {
      console.warn('LocalStorage load failed', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

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
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [user, vouchers, logs, missions, currentLang, currentAccountId, isLoaded]);

  // Handler: Complete Mission in "Tích Điểm" via QR Scan
  const handleCompleteMission = (missionId: string) => {
    const mission = missions.find((m) => m.id === missionId);
    if (!mission) return;

    if (mission.completed) {
      showToast(
        currentLang === 'en'
          ? `Mission "${mission.title}" already verified!`
          : `Nhiệm vụ "${mission.title}" đã được xác nhận hoàn thành trước đó!`
      );
      return;
    }

    setMissions((prev) =>
      prev.map((m) => (m.id === missionId ? { ...m, completed: true } : m))
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
      date: currentLang === 'en' ? 'Just now' : 'Vừa xong',
      title: mission.title,
      points: pointsAdded,
      type: 'earn',
      detail:
        mission.subtitle ||
        `Quét mã QR hoàn thành nhiệm vụ ${mission.categoryName} (+${pointsAdded} CP)`,
    };

    setLogs((prev) => [newLog, ...prev]);

    showToast(
      currentLang === 'en'
        ? `+${pointsAdded} CP earned from "${mission.title}"!`
        : `+${pointsAdded} CP! Đã quét mã xác nhận "${mission.title}"`,
      <CheckCircle2 size={16} className="text-emerald-400" />
    );
  };

  // Handler: Book Service from Home Green Destination
  const handleBookService = (dest: GreenDestination) => {
    setUser((prev) => ({
      ...prev,
      carbonPoints: prev.carbonPoints + dest.pointsReward,
      co2Saved: Number((prev.co2Saved + 5.5).toFixed(1)),
    }));

    const newLog: ImpactLog = {
      id: `log-${Date.now()}`,
      date: currentLang === 'en' ? 'Just now' : 'Vừa xong',
      title: `Đặt dịch vụ xanh: ${dest.name}`,
      points: dest.pointsReward,
      type: 'earn',
      detail: `Check-in cơ sở xanh ${dest.location} (+${dest.pointsReward} CP)`,
    };

    setLogs((prev) => [newLog, ...prev]);

    showToast(
      currentLang === 'en'
        ? `Booked at ${dest.name}! +${dest.pointsReward} CP added.`
        : `Đã kết nối dịch vụ ${dest.name}! +${dest.pointsReward} CP`,
      <Sparkles size={16} className="text-amber-400" />
    );
  };

  // Handler: Redeem Reward into Green Cart
  const handleRedeemReward = (reward: RewardItem) => {
    if (user.carbonPoints < reward.points) {
      showToast(
        currentLang === 'en'
          ? 'Not enough Carbon Points to redeem this reward!'
          : 'Bạn chưa đủ điểm Cacbon để đổi quà tặng này!'
      );
      return;
    }

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
      title: reward.title,
      code: voucherCode,
      category: reward.categoryName,
      image: reward.image,
      pointsUsed: reward.points,
      issueDate: new Date().toLocaleDateString('vi-VN'),
      expiryDate: '31/12/2026',
      isUsed: false,
      partner: reward.partner,
      description: reward.description,
      qrValue: `ECOSTAY:VOUCHER:${voucherCode}:${reward.points}`,
    };

    setVouchers((prev) => [newVoucher, ...prev]);

    // Add log
    const newLog: ImpactLog = {
      id: `log-${Date.now()}`,
      date: currentLang === 'en' ? 'Just now' : 'Vừa xong',
      title: `Đổi quà: ${reward.title}`,
      points: -reward.points,
      type: 'redeem',
      detail: `Đã đổi quà thành công và lưu vào Giỏ hàng xanh (-${reward.points} CP)`,
    };

    setLogs((prev) => [newLog, ...prev]);

    showToast(
      currentLang === 'en'
        ? `Redeemed ${reward.title}! Saved to Green Cart.`
        : `Đã đổi thành công! Quà đã được chuyển vào "Giỏ hàng xanh".`,
      <Sparkles size={16} className="text-amber-400" />
    );
  };

  // Handler: Mark Voucher as Used
  const handleMarkVoucherUsed = (voucherId: string) => {
    setVouchers((prev) =>
      prev.map((v) => (v.id === voucherId ? { ...v, isUsed: true } : v))
    );
    showToast(
      currentLang === 'en'
        ? 'Voucher marked as redeemed at counter!'
        : 'Đã xác nhận sử dụng voucher tại quầy!'
    );
  };

  // Handler: Simulated QR Scan
  const handleSimulateQRScan = (type: 'room' | 'food' | 'transport') => {
    let earnedPoints = 10;
    let title = 'Tiết kiệm giặt là trong phòng';
    let targetMissionId = 'mis-r1';

    if (type === 'food') {
      earnedPoints = 15;
      title = 'Đặt bàn xanh & Zero Food Waste';
      targetMissionId = 'mis-f1';
    } else if (type === 'transport') {
      earnedPoints = 20;
      title = 'Di chuyển bằng Xe đạp điện / Xe công cộng';
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
      const invalidMsg =
        currentLang === 'en'
          ? 'Invalid QR code — not a certified EcoStay mission QR.'
          : 'Mã QR không hợp lệ — không thuộc hệ thống nhiệm vụ EcoStay.';
      showToast(invalidMsg);
      return { status: 'invalid', message: invalidMsg };
    }

    if (matchingMission.completed) {
      const alreadyMsg =
        currentLang === 'en'
          ? `Mission "${matchingMission.title}" was already completed!`
          : `Nhiệm vụ "${matchingMission.title}" đã được quét trước đó rồi!`;
      showToast(alreadyMsg);
      return {
        status: 'already_completed',
        message: alreadyMsg,
        missionTitle: matchingMission.title,
        categoryName: matchingMission.categoryName,
      };
    }

    handleCompleteMission(matchingMission.id);
    const successMsg =
      currentLang === 'en'
        ? `+${matchingMission.points} CP! Completed "${matchingMission.title}"`
        : `+${matchingMission.points} CP! Đã xác thực "${matchingMission.title}"`;
    return {
      status: 'success',
      message: successMsg,
      points: matchingMission.points,
      missionTitle: matchingMission.title,
      categoryName: matchingMission.categoryName,
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
      date: currentLang === 'en' ? 'Just now' : 'Vừa xong',
      title: 'Khảo sát ý kiến du khách sống xanh',
      points: pointsAwarded,
      type: 'earn',
      detail: `Đóng góp ${rating} sao giúp nâng cao chất lượng dịch vụ (+${pointsAwarded} CP)`,
    };

    setLogs((prev) => [newLog, ...prev]);

    showToast(
      currentLang === 'en'
        ? `Thank you for your review! +${pointsAwarded} CP.`
        : `Cảm ơn bạn đã đóng góp ý kiến! +${pointsAwarded} CP`,
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
      currentLang === 'en'
        ? `Signed in successfully! (${account.profile.name})`
        : `Đăng nhập thành công! (${account.profile.name})`,
      <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />,
      2000
    );
  };

  // Handler: Register New Account (+50 CP Bonus)
  const handleRegisterNewAccount = (data: {
    name: string;
    phone: string;
    email: string;
    hotel: string;
    room: string;
  }) => {
    const newId = `user-${Date.now()}`;
    const newProfile: UserProfile = {
      name: data.name,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      carbonPoints: 50,
      avnPoints: 0,
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

    const newLogs: ImpactLog[] = [
      {
        id: `log-${Date.now()}`,
        date: currentLang === 'en' ? 'Just now' : 'Vừa xong',
        title:
          currentLang === 'en'
            ? 'New Member Welcome Bonus (+50 CP)'
            : 'Thưởng chào mừng thành viên mới (+50 CP)',
        points: 50,
        type: 'earn',
        detail:
          currentLang === 'en'
            ? 'Welcome to EcoStay Net Zero travel community!'
            : 'Chào mừng bạn đến với cộng đồng du lịch Net Zero EcoStay!',
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
      currentLang === 'en'
        ? `Account created & signed in! (+50 CP)`
        : `Đăng ký & đăng nhập thành công! (+50 CP)`,
      <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />,
      2000
    );
  };

  // Handler: Logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    showToast(
      currentLang === 'en'
        ? 'Signed out successfully.'
        : 'Đã đăng xuất thành công.'
    );
  };

  // Handler: Reset Data to Default
  const handleResetData = () => {
    if (confirm('Bạn có chắc muốn đặt lại toàn bộ dữ liệu Demo ban đầu không?')) {
      localStorage.removeItem(STORAGE_KEY_ACTIVE_ACCOUNT);
      localStorage.removeItem(STORAGE_KEY_USER);
      localStorage.removeItem(STORAGE_KEY_VOUCHERS);
      localStorage.removeItem(STORAGE_KEY_LOGS);
      localStorage.removeItem(STORAGE_KEY_MISSIONS);
      localStorage.removeItem(STORAGE_KEY_LANG);
      setCurrentAccountId('user-1');
      setUser(initialUserProfile);
      setVouchers(initialVouchers);
      setLogs(initialImpactLogs);
      setMissions(initialMissions);
      setCurrentLang('vi');
      showToast('Đã khôi phục dữ liệu Demo thành công.');
    }
  };

  // If not logged in, show Login Screen first!
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-900/5 sm:bg-slate-900/20 flex items-center justify-center p-0 sm:p-4">
        <LoginScreen
          currentLang={currentLang}
          onChangeLang={setCurrentLang}
          onLoginSuccess={(acc) => {
            handleSelectAccount(acc);
            setIsLoggedIn(true);
          }}
          onRegisterSuccess={(data) => {
            handleRegisterNewAccount(data);
            setIsLoggedIn(true);
          }}
          onContinueAsGuest={() => {
            setIsLoggedIn(true);
            showToast(
              currentLang === 'en'
                ? 'Signed in as Guest!'
                : 'Đăng nhập thành công (Chế độ Khách)!',
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
    <div className="relative mx-auto w-full max-w-md min-h-screen bg-[#F8FAF8] text-[#1B3B2B] pb-24 shadow-2xl font-sans rounded-none sm:rounded-[40px] overflow-hidden border-0 sm:border-8 sm:border-slate-800 flex flex-col justify-between">
      {/* Top Header */}
      <Header
        user={user}
        currentLang={currentLang}
        onOpenNotifications={() => setIsNotificationOpen(true)}
        onOpenProfile={() => setActiveTab('more')}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Main Content Rendered by Tab */}
      <main className="flex-1 overflow-y-auto">
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
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-2xl bg-slate-900/90 px-4 py-2.5 text-xs font-semibold text-white shadow-2xl backdrop-blur-md animate-fadeIn max-w-[90%] text-center">
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
  );
}
