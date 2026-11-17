'use client';

import React, { useState, useEffect } from 'react';
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
import { triggerEcoConfetti } from '@/components/Confetti';
import { Sparkles, CheckCircle2 } from 'lucide-react';

const STORAGE_KEY_USER = 'ecostay_user_profile_v4';
const STORAGE_KEY_VOUCHERS = 'ecostay_vouchers_v4';
const STORAGE_KEY_LOGS = 'ecostay_logs_v4';
const STORAGE_KEY_MISSIONS = 'ecostay_missions_v4';
const STORAGE_KEY_LANG = 'ecostay_lang_v4';

export default function EcoStayApp() {
  const [activeTab, setActiveTab] = useState<TabId>('home');

  // Application Data States (Hydrated with LocalStorage v4)
  const [user, setUser] = useState<UserProfile>(initialUserProfile);
  const [destinations] = useState<GreenDestination[]>(initialDestinations);
  const [rewards] = useState<RewardItem[]>(initialRewards);
  const [vouchers, setVouchers] = useState<Voucher[]>(initialVouchers);
  const [logs, setLogs] = useState<ImpactLog[]>(initialImpactLogs);
  const [missions, setMissions] = useState<DetailedMission[]>(initialMissions);
  const [currentLang, setCurrentLang] = useState<'vi' | 'en'>('vi');
  const [isLoaded, setIsLoaded] = useState(false);

  // Modals
  const [isEcoImpactOpen, setIsEcoImpactOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isHandbookOpen, setIsHandbookOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyTab, setHistoryTab] = useState<'points' | 'orders'>('points');
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);

  // Toast System
  const [toastMessage, setToastMessage] = useState<{ text: string; icon?: React.ReactNode } | null>(null);

  const showToast = (text: string, icon?: React.ReactNode) => {
    setToastMessage({ text, icon });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Load from LocalStorage
  useEffect(() => {
    try {
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
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEY_VOUCHERS, JSON.stringify(vouchers));
      localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(logs));
      localStorage.setItem(STORAGE_KEY_MISSIONS, JSON.stringify(missions));
      localStorage.setItem(STORAGE_KEY_LANG, currentLang);
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [user, vouchers, logs, missions, currentLang, isLoaded]);

  // Handler: Complete Mission in "Tích Điểm"
  const handleCompleteMission = (missionId: string) => {
    const mission = missions.find((m) => m.id === missionId);
    if (!mission) return;

    const willComplete = !mission.completed;

    setMissions((prev) =>
      prev.map((m) => (m.id === missionId ? { ...m, completed: willComplete } : m))
    );

    if (willComplete) {
      triggerEcoConfetti();
      const pointsAdded = mission.points;

      setUser((prev) => ({
        ...prev,
        carbonPoints: prev.carbonPoints + pointsAdded,
      }));

      const newLog: ImpactLog = {
        id: `log-${Date.now()}`,
        date: 'Vừa xong',
        title: mission.title,
        points: pointsAdded,
        type: 'earn',
        detail: mission.subtitle || `Nhận ${pointsAdded} CP từ nhiệm vụ ${mission.categoryName}`,
      };
      setLogs((prev) => [newLog, ...prev]);

      showToast(
        `Chúc mừng! Bạn nhận được +${pointsAdded} CP từ "${mission.title}"`,
        <Sparkles size={16} className="text-amber-400" />
      );
    } else {
      // Revert if toggled off
      setUser((prev) => ({
        ...prev,
        carbonPoints: Math.max(0, prev.carbonPoints - mission.points),
      }));
      showToast(`Đã hủy hoàn thành nhiệm vụ (-${mission.points} CP).`);
    }
  };

  // Handler: Book Service in Green Destination Directory
  const handleBookService = (destination: GreenDestination) => {
    const pointsAdded = destination.pointsReward;

    setUser((prev) => ({
      ...prev,
      carbonPoints: prev.carbonPoints + pointsAdded,
    }));

    const newLog: ImpactLog = {
      id: `log-${Date.now()}`,
      date: 'Vừa xong',
      title: `Đặt dịch vụ: ${destination.name}`,
      points: pointsAdded,
      type: 'earn',
      detail: `Cơ sở xanh: ${destination.location} (${destination.greenBadge})`,
    };
    setLogs((prev) => [newLog, ...prev]);

    showToast(
      `Đặt thành công ${destination.name}! Nhận ngay +${pointsAdded} CP!`,
      <CheckCircle2 size={16} className="text-emerald-400" />
    );
  };

  // Handler: Live QR Scan (Camera jsQR)
  const handleLiveQRScan = (decodedData: string) => {
    const upper = decodedData.toUpperCase();
    let title = '';
    let points = 25;
    let detail = `Mã: ${decodedData.slice(0, 30)}${decodedData.length > 30 ? '...' : ''}`;

    if (upper.includes('ROOM') || upper.includes('SUITE') || upper.includes('HOTEL')) {
      title = 'Quét mã Buồng phòng xanh';
      points = 50;
      detail = 'Xác nhận không thay ga/khăn hằng ngày.';
    } else if (upper.includes('FOOD') || upper.includes('TABLE') || upper.includes('ZERO_WASTE') || upper.includes('BUFFET')) {
      title = 'Quét mã Zero Food Waste';
      points = 30;
      detail = 'Xác nhận ăn sạch đĩa không lãng phí thức ăn.';
    } else if (upper.includes('XANH_SM') || upper.includes('VINFAST') || upper.includes('TNGO') || upper.includes('BIKE') || upper.includes('BUS')) {
      title = 'Quét mã Di chuyển xanh';
      points = 20;
      detail = 'Di chuyển bằng xe điện hoặc xe đạp công cộng.';
    } else {
      title = 'Quét mã Tiêu dùng xanh đối tác';
      points = 25;
      detail = `Nhận diện mã: ${decodedData.slice(0, 26)}...`;
    }

    setUser((prev) => ({
      ...prev,
      carbonPoints: prev.carbonPoints + points,
    }));

    const newLog: ImpactLog = {
      id: `log-${Date.now()}`,
      date: 'Vừa xong',
      title,
      points,
      type: 'earn',
      detail,
    };
    setLogs((prev) => [newLog, ...prev]);

    showToast(
      `Camera nhận diện thành công: +${points} CP!`,
      <CheckCircle2 size={16} className="text-emerald-400" />
    );
  };

  // Handler: Fallback Simulator QR Scan
  const handleSimulateQRScan = (type: 'room' | 'food' | 'transport') => {
    let title = '';
    let points = 0;
    let detail = '';

    if (type === 'room') {
      title = 'Quét mã Buồng phòng xanh';
      points = 50;
      detail = 'Từ chối thay ga/khăn hằng ngày tại phòng 402.';
    } else if (type === 'food') {
      title = 'Quét mã Zero Food Waste';
      points = 30;
      detail = 'Hoàn thành suất ăn sạch đĩa tại nhà hàng.';
    } else {
      title = 'Quét mã Xe điện Xanh SM';
      points = 20;
      detail = 'Di chuyển bằng taxi điện thuần 100%.';
    }

    setUser((prev) => ({
      ...prev,
      carbonPoints: prev.carbonPoints + points,
    }));

    const newLog: ImpactLog = {
      id: `log-${Date.now()}`,
      date: 'Vừa xong',
      title,
      points,
      type: 'earn',
      detail,
    };
    setLogs((prev) => [newLog, ...prev]);

    showToast(
      `Quét mã thành công! Bạn nhận được +${points} CP`,
      <CheckCircle2 size={16} className="text-emerald-400" />
    );
  };

  // Handler: Redeem Reward into "Giỏ hàng xanh"
  const handleRedeemReward = (reward: RewardItem) => {
    if (user.carbonPoints < reward.points) return;

    const newBalance = user.carbonPoints - reward.points;
    const isTree = reward.category === 'tree';

    setUser((prev) => ({
      ...prev,
      carbonPoints: newBalance,
      treesPlanted: isTree ? prev.treesPlanted + 1 : prev.treesPlanted,
    }));

    const randomCode = `ECO-${Math.floor(100000 + Math.random() * 900000)}`;
    const newVoucher: Voucher = {
      id: `vouch-${Date.now()}`,
      rewardId: reward.id,
      title: reward.title,
      code: randomCode,
      category: reward.categoryName,
      image: reward.image,
      pointsUsed: reward.points,
      issueDate: new Date().toLocaleDateString('vi-VN'),
      expiryDate: '30/12/2026',
      isUsed: false,
      partner: reward.partner,
      description: reward.description,
      qrValue: `ECOSTAY_${randomCode}_VAL_${reward.points}CP`,
    };

    setVouchers((prev) => [newVoucher, ...prev]);

    const newLog: ImpactLog = {
      id: `log-${Date.now()}`,
      date: 'Vừa xong',
      title: `Đổi phần quà: ${reward.title}`,
      points: -reward.points,
      type: 'redeem',
      detail: `Tạo thành công voucher ${randomCode} trong Giỏ hàng xanh`,
    };
    setLogs((prev) => [newLog, ...prev]);

    showToast(
      `Đổi quà thành công! Đã thêm vào Giỏ hàng xanh`,
      <CheckCircle2 size={16} className="text-emerald-400" />
    );
  };

  // Handler: Mark Voucher Used
  const handleMarkVoucherUsed = (voucherId: string) => {
    setVouchers((prev) =>
      prev.map((v) => (v.id === voucherId ? { ...v, isUsed: true } : v))
    );
    showToast('Voucher đã được đánh dấu sử dụng.');
  };

  // Handler: Submit Feedback
  const handleSubmitFeedback = (comment: string, rating: number) => {
    triggerEcoConfetti();
    setUser((prev) => ({
      ...prev,
      carbonPoints: prev.carbonPoints + 15,
    }));

    const newLog: ImpactLog = {
      id: `log-${Date.now()}`,
      date: 'Vừa xong',
      title: 'Đánh giá & Khảo sát dịch vụ',
      points: 15,
      type: 'earn',
      detail: `Đánh giá ${rating} sao: "${comment.slice(0, 30)}..."`,
    };
    setLogs((prev) => [newLog, ...prev]);

    showToast(
      'Cảm ơn đánh giá quý báu! Bạn nhận được +15 CP',
      <Sparkles size={16} className="text-amber-400" />
    );
  };

  // Handler: Reset Data to Default
  const handleResetData = () => {
    if (confirm('Bạn có chắc muốn đặt lại toàn bộ dữ liệu Demo ban đầu không?')) {
      localStorage.removeItem(STORAGE_KEY_USER);
      localStorage.removeItem(STORAGE_KEY_VOUCHERS);
      localStorage.removeItem(STORAGE_KEY_LOGS);
      localStorage.removeItem(STORAGE_KEY_MISSIONS);
      localStorage.removeItem(STORAGE_KEY_LANG);
      setUser(initialUserProfile);
      setVouchers(initialVouchers);
      setLogs(initialImpactLogs);
      setMissions(initialMissions);
      setCurrentLang('vi');
      showToast('Đã khôi phục dữ liệu Demo thành công.');
    }
  };

  return (
    <div className="relative mx-auto w-full max-w-md min-h-screen bg-[#F8FAF8] text-[#1B3B2B] pb-24 shadow-2xl font-sans rounded-none sm:rounded-[40px] overflow-hidden border-0 sm:border-8 sm:border-slate-800 flex flex-col justify-between">
      
      {/* Top Header */}
      <Header
        user={user}
        onOpenNotifications={() => setIsNotificationOpen(true)}
        onOpenProfile={() => setActiveTab('more')}
      />

      {/* Main Content Rendered by Tab */}
      <main className="flex-1 overflow-y-auto">
        {activeTab === 'home' && (
          <TabHome
            user={user}
            destinations={destinations}
            onBookService={handleBookService}
            onNavigateToEarn={() => setActiveTab('earn')}
          />
        )}

        {activeTab === 'rewards' && (
          <TabRewards
            userPoints={user.carbonPoints}
            rewards={rewards}
            vouchers={vouchers}
            onRedeemReward={handleRedeemReward}
            onSelectVoucher={setSelectedVoucher}
            onNavigateToEarn={() => setActiveTab('earn')}
          />
        )}

        {activeTab === 'scanner' && (
          <TabScanner
            user={user}
            onSimulateQRScan={handleSimulateQRScan}
            onLiveQRScan={handleLiveQRScan}
          />
        )}

        {activeTab === 'earn' && (
          <TabEarnPoints
            user={user}
            missions={missions}
            onCompleteMission={handleCompleteMission}
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
          />
        )}
      </main>

      {/* Bottom Navigation Bar (5 tabs: Trang chủ, Quà tặng, Quét mã, Tích điểm, Khác) */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        cartCount={vouchers.filter((v) => !v.isUsed).length}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-2xl bg-slate-900/90 px-4 py-2.5 text-xs font-semibold text-white shadow-2xl backdrop-blur-md animate-fadeIn max-w-[90%] text-center">
          {toastMessage.icon}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Shared Modals */}
      <EcoImpactModal
        isOpen={isEcoImpactOpen}
        onClose={() => setIsEcoImpactOpen(false)}
        user={user}
      />

      <VoucherDetailModal
        voucher={selectedVoucher}
        onClose={() => setSelectedVoucher(null)}
        onMarkUsed={handleMarkVoucherUsed}
      />

      <NotificationModal
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />

      <HandbookModal
        isOpen={isHandbookOpen}
        onClose={() => setIsHandbookOpen(false)}
      />

      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        logs={logs}
        vouchers={vouchers}
        initialTab={historyTab}
      />

      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        onSubmitFeedback={handleSubmitFeedback}
      />

      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

    </div>
  );
}
