'use client';

import React, { useState, useEffect } from 'react';
import { initialUserProfile, initialRewards, initialVouchers, initialImpactLogs, initialMissions } from '@/data/mockData';
import { UserProfile, RewardItem, Voucher, ImpactLog, GreenMission } from '@/data/types';
import { Header } from '@/components/Header';
import { BottomNav, TabId } from '@/components/BottomNav';
import { TabHome } from '@/components/TabHome';
import { TabRewards } from '@/components/TabRewards';
import { TabScanner } from '@/components/TabScanner';
import { TabVoucher } from '@/components/TabVoucher';
import { TabMore } from '@/components/TabMore';
import { EcoImpactModal } from '@/components/EcoImpactModal';
import { VoucherDetailModal } from '@/components/VoucherDetailModal';
import { NotificationModal } from '@/components/NotificationModal';
import { DirectionsModal } from '@/components/DirectionsModal';
import { HandbookModal } from '@/components/HandbookModal';
import { HistoryModal } from '@/components/HistoryModal';
import { FeedbackModal } from '@/components/FeedbackModal';
import { PartnersModal } from '@/components/PartnersModal';
import { AboutModal } from '@/components/AboutModal';
import { triggerEcoConfetti } from '@/components/Confetti';
import { Sparkles, CheckCircle2, Wifi, Battery, Signal } from 'lucide-react';

const STORAGE_KEY_USER = 'ecostay_user_profile_v3';
const STORAGE_KEY_VOUCHERS = 'ecostay_vouchers_v3';
const STORAGE_KEY_LOGS = 'ecostay_logs_v3';
const STORAGE_KEY_MISSIONS = 'ecostay_missions_v3';

export default function EcoStayApp() {
  // Navigation
  const [activeTab, setActiveTab] = useState<TabId>('home');

  // Application Data States (Hydrated with LocalStorage)
  const [user, setUser] = useState<UserProfile>(initialUserProfile);
  const [vouchers, setVouchers] = useState<Voucher[]>(initialVouchers);
  const [logs, setLogs] = useState<ImpactLog[]>(initialImpactLogs);
  const [missions, setMissions] = useState<GreenMission[]>(initialMissions);
  const [isLoaded, setIsLoaded] = useState(false);

  // Modals
  const [isEcoImpactOpen, setIsEcoImpactOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isDirectionsOpen, setIsDirectionsOpen] = useState(false);
  const [isHandbookOpen, setIsHandbookOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyTab, setHistoryTab] = useState<'points' | 'orders'>('points');
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isPartnersOpen, setIsPartnersOpen] = useState(false);
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

  // Load state from localStorage on initial render
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
    } catch (e) {
      console.warn('LocalStorage load failed', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEY_VOUCHERS, JSON.stringify(vouchers));
      localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(logs));
      localStorage.setItem(STORAGE_KEY_MISSIONS, JSON.stringify(missions));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [user, vouchers, logs, missions, isLoaded]);

  // Handler: Toggle Green Mission
  const handleToggleMission = (missionId: string) => {
    const mission = missions.find((m) => m.id === missionId);
    if (!mission) return;

    const willComplete = !mission.completed;

    setMissions((prev) =>
      prev.map((m) => (m.id === missionId ? { ...m, completed: willComplete } : m))
    );

    if (willComplete) {
      triggerEcoConfetti();
      const pointsAdded = mission.points;
      const co2Added = mission.co2Kg;
      const waterAdded = mission.waterL;
      const energyAdded = mission.energyKwh;

      setUser((prev) => ({
        ...prev,
        carbonPoints: prev.carbonPoints + pointsAdded,
        co2Saved: Number((prev.co2Saved + co2Added).toFixed(1)),
        waterSaved: prev.waterSaved + waterAdded,
        energySaved: Number((prev.energySaved + energyAdded).toFixed(1)),
      }));

      const newLog: ImpactLog = {
        id: `log-${Date.now()}`,
        date: 'Vừa xong',
        title: mission.title,
        points: pointsAdded,
        type: 'earn',
        co2DeltaKg: co2Added,
        waterDeltaL: waterAdded,
        energyDeltaKwh: energyAdded,
        detail: mission.impactNote,
      };
      setLogs((prev) => [newLog, ...prev]);

      showToast(
        `Chúc mừng! Bạn nhận được +${pointsAdded} CB từ ${mission.title}`,
        <Sparkles size={16} className="text-amber-400" />
      );
    } else {
      // Revert if toggled off
      setUser((prev) => ({
        ...prev,
        carbonPoints: Math.max(0, prev.carbonPoints - mission.points),
        co2Saved: Number(Math.max(0, prev.co2Saved - mission.co2Kg).toFixed(1)),
        waterSaved: Math.max(0, prev.waterSaved - mission.waterL),
        energySaved: Number(Math.max(0, prev.energySaved - mission.energyKwh).toFixed(1)),
      }));
      showToast(`Đã thu hồi ${mission.points} CB.`);
    }
  };

  // Handler: Simulate QR Scan
  const handleSimulateQRScan = (type: 'room' | 'food' | 'transport') => {
    let title = '';
    let points = 0;
    let co2 = 0;
    let water = 0;
    let energy = 0;
    let detail = '';

    if (type === 'room') {
      title = 'Quét mã xác nhận Buồng phòng xanh';
      points = 50;
      co2 = 2.1;
      water = 35;
      energy = 1.5;
      detail = 'Từ chối thay ga/khăn hằng ngày tại phòng 402.';
    } else if (type === 'food') {
      title = 'Quét mã xác nhận Zero Food Waste';
      points = 30;
      co2 = 1.2;
      water = 15;
      energy = 0.8;
      detail = 'Hoàn thành suất ăn tại Nhà hàng Green Table.';
    } else {
      title = 'Quét mã sử dụng Xe điện Xanh SM';
      points = 20;
      co2 = 1.5;
      water = 0;
      energy = 0.5;
      detail = 'Di chuyển bằng phương tiện điện thuần 100%.';
    }

    setUser((prev) => ({
      ...prev,
      carbonPoints: prev.carbonPoints + points,
      co2Saved: Number((prev.co2Saved + co2).toFixed(1)),
      waterSaved: prev.waterSaved + water,
      energySaved: Number((prev.energySaved + energy).toFixed(1)),
    }));

    const newLog: ImpactLog = {
      id: `log-${Date.now()}`,
      date: 'Vừa xong',
      title,
      points,
      type: 'earn',
      co2DeltaKg: co2,
      waterDeltaL: water,
      energyDeltaKwh: energy,
      detail,
    };
    setLogs((prev) => [newLog, ...prev]);

    showToast(
      `Quét mã thành công! Bạn nhận được +${points} CACBON POINT`,
      <CheckCircle2 size={16} className="text-emerald-400" />
    );
  };

  // Handler: Redeem Reward
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
      qrValue: `ECOSTAY_${randomCode}_VAL_${reward.points}CB`,
    };

    setVouchers((prev) => [newVoucher, ...prev]);

    const newLog: ImpactLog = {
      id: `log-${Date.now()}`,
      date: 'Vừa xong',
      title: `Đổi phần quà: ${reward.title}`,
      points: -reward.points,
      type: 'redeem',
      detail: `Tạo thành công voucher ưu đãi ${randomCode}`,
    };
    setLogs((prev) => [newLog, ...prev]);

    showToast(
      `Đổi quà thành công! Đã thêm voucher ${randomCode} vào kho`,
      <CheckCircle2 size={16} className="text-emerald-400" />
    );
  };

  // Handler: Mark voucher used
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
      'Cảm ơn đánh giá quý báu! Bạn nhận được +15 CB',
      <Sparkles size={16} className="text-amber-400" />
    );
  };

  // Handler: Reset Data to Default
  const handleResetData = () => {
    if (confirm('Bạn có chắc muốn đặt lại toàn bộ dữ liệu mẫu ban đầu không?')) {
      localStorage.removeItem(STORAGE_KEY_USER);
      localStorage.removeItem(STORAGE_KEY_VOUCHERS);
      localStorage.removeItem(STORAGE_KEY_LOGS);
      localStorage.removeItem(STORAGE_KEY_MISSIONS);
      setUser(initialUserProfile);
      setVouchers(initialVouchers);
      setLogs(initialImpactLogs);
      setMissions(initialMissions);
      showToast('Đã khôi phục dữ liệu Demo thành công.');
    }
  };

  return (
    <div className="relative mx-auto w-full max-w-md min-h-screen bg-[#F8FAF8] text-[#1B3B2B] pb-24 shadow-2xl font-sans rounded-none sm:rounded-[40px] overflow-hidden border-0 sm:border-8 sm:border-slate-800 flex flex-col justify-between">
      
      {/* Smartphone Status Bar (For authentic preview on desktop/mobile) */}
      <div className="sticky top-0 z-40 bg-[#1E4D3E] px-6 pt-2 pb-1 text-white flex items-center justify-between text-[11px] select-none font-medium">
        <span>9:41</span>
        <div className="flex h-3 w-16 items-center justify-center rounded-full bg-black/30" />
        <div className="flex items-center gap-1.5">
          <Signal size={12} />
          <Wifi size={12} />
          <Battery size={13} />
        </div>
      </div>

      {/* Main Top Header */}
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
            onNavigate={setActiveTab}
            onOpenHandbook={() => setIsHandbookOpen(true)}
            onOpenDirections={() => setIsDirectionsOpen(true)}
            onOpenHistory={(tab) => {
              setHistoryTab(tab || 'points');
              setIsHistoryOpen(true);
            }}
            onOpenFeedback={() => setIsFeedbackOpen(true)}
            onOpenPartners={() => setIsPartnersOpen(true)}
          />
        )}

        {activeTab === 'rewards' && (
          <TabRewards
            userPoints={user.carbonPoints}
            rewards={initialRewards}
            onRedeemReward={handleRedeemReward}
            onNavigateToScanner={() => setActiveTab('scanner')}
          />
        )}

        {activeTab === 'scanner' && (
          <TabScanner
            missions={missions}
            onToggleMission={handleToggleMission}
            onSimulateQRScan={handleSimulateQRScan}
          />
        )}

        {activeTab === 'voucher' && (
          <TabVoucher
            user={user}
            vouchers={vouchers}
            onSelectVoucher={setSelectedVoucher}
            onNavigate={setActiveTab}
          />
        )}

        {activeTab === 'more' && (
          <TabMore
            user={user}
            onOpenEcoImpact={() => setIsEcoImpactOpen(true)}
            onOpenDirections={() => setIsDirectionsOpen(true)}
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

      {/* Fixed Bottom Navigation (5 tabs) */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        voucherCount={vouchers.filter((v) => !v.isUsed).length}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-2xl bg-slate-900/90 px-4 py-2.5 text-xs font-semibold text-white shadow-2xl backdrop-blur-md animate-fadeIn max-w-[90%] text-center">
          {toastMessage.icon}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Interactive Modals */}
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

      <DirectionsModal
        isOpen={isDirectionsOpen}
        onClose={() => setIsDirectionsOpen(false)}
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

      <PartnersModal
        isOpen={isPartnersOpen}
        onClose={() => setIsPartnersOpen(false)}
      />

      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

    </div>
  );
}
