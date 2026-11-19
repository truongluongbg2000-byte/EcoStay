export type CategoryType = 'all' | 'fashion' | 'food' | 'tree' | 'hotdeal' | 'service' | 'other';

export type DestinationCategory = 'all' | 'food' | 'hotel' | 'activity' | 'transport' | 'shopping';

export interface GreenDestination {
  id: string;
  name: string;
  category: DestinationCategory;
  categoryName: string;
  location: string; // e.g. 'Hội An', 'Ninh Bình', 'Cúc Phương', 'Đà Lạt', 'Nam Cát Tiên'
  title: string;
  image: string;
  description: string;
  greenBadge: string; // e.g. '100% Xanh', 'Zero Plastic Waste', 'Organic Farm'
  pointsReward: number; // e.g. 300, 50, 150
  priceEstimate?: string;
  address?: string;
  lat?: number;
  lng?: number;
}

export interface DetailedMission {
  id: string;
  category: 'room' | 'food' | 'transport' | 'experience' | 'app';
  categoryName: string;
  title: string;
  subtitle?: string;
  points: number; // e.g. +10, +20, -5
  isPenalty?: boolean;
  completed: boolean;
  completedDate?: string; // local YYYY-MM-DD; missions reset daily
  actionType: 'qr';
  qrInstruction?: string;
  qrSampleCode?: string;
  iconName?: string;
}

export interface UserProfile {
  name: string;
  avatar: string;
  carbonPoints: number;
  expiryDate: string;
  co2Saved: number; // in kg
  waterSaved: number; // in Liters
  energySaved: number; // in kWh
  treesPlanted: number;
  rank: string;
  roomNumber: string;
  hotelName: string;
  memberCode: string;
}

export interface RewardItem {
  id: string;
  title: string;
  category: CategoryType;
  categoryName: string;
  points: number;
  originalPriceVnd: number;
  image: string;
  description: string;
  partner: string;
  location: string;
  badge?: string;
  treeDetails?: {
    forestName: string;
    treeType: string;
    gpsCoords: string;
  };
}

export interface Voucher {
  id: string;
  rewardId: string;
  title: string;
  code: string;
  category: string;
  image: string;
  pointsUsed: number;
  issueDate: string;
  expiryDate: string;
  isUsed: boolean;
  partner: string;
  description: string;
  qrValue: string;
}

export interface ImpactLog {
  id: string;
  date: string;
  title: string;
  points: number;
  type: 'earn' | 'redeem';
  co2DeltaKg?: number;
  waterDeltaL?: number;
  energyDeltaKwh?: number;
  detail: string;
}

export interface MockAccount {
  id: string;
  email: string;
  phone: string;
  roleBadge: string;
  roleBadgeEn: string;
  profile: UserProfile;
  initialVouchers: Voucher[];
  initialLogs: ImpactLog[];
}

export interface AppNotification {
  id: string;
  title: string;
  titleEn: string;
  desc: string;
  descEn: string;
  detail: string;
  detailEn: string;
  time: string;
  timeEn: string;
  category: 'points' | 'welcome' | 'event' | 'reward';
  isRead: boolean;
}
