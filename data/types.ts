export type CategoryType = 'all' | 'fashion' | 'food' | 'tree' | 'hotdeal' | 'service' | 'other';

export interface UserProfile {
  name: string;
  avatar: string;
  carbonPoints: number;
  avnPoints: number;
  expiryDate: string;
  co2Saved: number; // in kg
  waterSaved: number; // in Liters
  energySaved: number; // in kWh
  treesPlanted: number;
  rank: string;
  roomNumber: string;
  hotelName: string;
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

export interface GreenMission {
  id: string;
  title: string;
  subtitle: string;
  impactNote: string;
  points: number;
  co2Kg: number;
  waterL: number;
  energyKwh: number;
  isActive: boolean;
  completed: boolean;
  type: 'toggle' | 'action';
}
