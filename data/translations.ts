import type { Lang } from '@/lib/i18n';
export type { Lang };

export interface MissionTranslation {
  title: string;
  subtitle: string;
  categoryName: string;
  qrInstruction: string;
}

export const missionTranslations: Record<string, MissionTranslation> = {
  'mis-r1': {
    title: 'Decline daily towel and linen replacement',
    subtitle: 'Saves 35L of laundry water and detergent daily',
    categoryName: 'In-Room',
    qrInstruction: 'Scan QR code on the in-room card or bathroom notice',
  },
  'mis-r2': {
    title: 'Turn off AC, lights and appliances when leaving room',
    subtitle: 'Saves 1.5 kWh of unnecessary power consumption',
    categoryName: 'In-Room',
    qrInstruction: 'Scan QR code beside the master power switch near door',
  },
  'mis-f1': {
    title: 'Reserve dining table in advance via app',
    subtitle: 'Helps kitchen prepare precise portions, eliminating food waste',
    categoryName: 'Dining',
    qrInstruction: 'Scan reservation QR code at dining table or host counter',
  },
  'mis-f2': {
    title: 'Finish meal with zero food waste (Clean Plate)',
    subtitle: 'Staff verifies clean plate (Warning: -5 CB penalty if wasted)',
    categoryName: 'Dining',
    qrInstruction: 'Scan QR code on bill or payment receipt for clean plate',
  },
  'mis-t1': {
    title: 'Ride bicycle or electric scooter / E-Bike',
    subtitle: 'Scan QR code on bike handlebar or frame before ride',
    categoryName: 'Transit',
    qrInstruction: 'Scan QR code on vehicle frame or solar charging dock',
  },
  'mis-t2': {
    title: 'Travel via public bus, electric shuttle or train',
    subtitle: 'Choose low-emission shared public transportation',
    categoryName: 'Transit',
    qrInstruction: 'Scan QR code on transit e-ticket or eco bus station',
  },
  'mis-e1': {
    title: 'Join traditional artisan craft workshop',
    subtitle: 'Pottery, weaving, bamboo crafts with master craftsmen',
    categoryName: 'Eco-Tours',
    qrInstruction: 'Scan QR code at the artisan craft workshop desk',
  },
  'mis-e2': {
    title: 'Buy handmade crafts & local organic specialties',
    subtitle: 'Supports sustainable livelihoods for indigenous communities',
    categoryName: 'Eco-Tours',
    qrInstruction: 'Scan QR code on product tag or village checkout counter',
  },
  'mis-e3': {
    title: 'Visit certified organic farm & craft village',
    subtitle: 'Discover natural farming practices and permaculture',
    categoryName: 'Eco-Tours',
    qrInstruction: 'Scan QR code at farm entrance or guided tour checkpoint',
  },
  'mis-e4': {
    title: 'Join beach, river or hiking trail cleanup',
    subtitle: 'Direct environmental stewardship action at destination',
    categoryName: 'Eco-Tours',
    qrInstruction: 'Scan QR code at waste collection station or recycling bag',
  },
  'mis-e5': {
    title: 'Plant 1 native tree in conservation forest',
    subtitle: 'Contributes to reforesting mangroves and protected nature reserves',
    categoryName: 'Eco-Tours',
    qrInstruction: 'Scan tree identification tag (Tree QR) at nursery',
  },
  'mis-a1': {
    title: 'Check-in at certified green partner venue',
    subtitle: 'Scan QR code at lobby or partner welcome station',
    categoryName: 'App Tasks',
    qrInstruction: 'Scan QR code at partner Green Check-in board',
  },
  'mis-a2': {
    title: 'Share Green Passport on social media',
    subtitle: 'Inspire friends on Facebook / Story / Instagram / Zalo',
    categoryName: 'App Tasks',
    qrInstruction: 'Scan QR code on interactive screen after sharing',
  },
  'mis-a3': {
    title: 'Submit authentic review with real photo',
    subtitle: 'Helps community identify genuine eco-friendly practices',
    categoryName: 'App Tasks',
    qrInstruction: 'Scan bill receipt QR to activate photo review submission',
  },
  'mis-a4': {
    title: 'Refer friends to download and use EcoStay',
    subtitle: 'Get 50 CB for each friend who registers successfully',
    categoryName: 'App Tasks',
    qrInstruction: 'Let friends scan your personal referral code from My QR Code',
  },
};

export const destinationCategoryTranslations: Record<string, string> = {
  all: 'All',
  food: 'Dining',
  hotel: 'Hotels',
  transport: 'Transit',
  activity: 'Activities',
  shopping: 'Shopping',
};

export const destinationTranslations: Record<
  string,
  { name?: string; title: string; desc: string; badge: string; categoryName: string }
> = {
  'dest-1': {
    name: 'Silk Sense Hoi An River Eco-Resort',
    title: 'Pioneering zero-plastic waste resort in Hoi An',
    desc: 'Features 3,000m² organic farm, 100% natural straw and renewable materials, strictly zero single-use plastic bottles.',
    badge: '100% Green • Zero Plastic Waste',
    categoryName: 'Hotels',
  },
  'dest-2': {
    name: 'An Lac Vegan & Macrobiotic Dining',
    title: 'Farm-to-table vegan & macrobiotic cuisine',
    desc: 'Daily harvest from Tra Que ecological farm, no MSG, 100% packaged in lotus leaves.',
    badge: 'Farm-to-Table • Zero Waste',
    categoryName: 'Dining',
  },
  'dest-3': {
    name: 'Bay Mau Eco-Coconut Basket Boat Tour',
    title: 'Eco-friendly water coconut forest boat tour',
    desc: 'Row traditional bamboo basket boats with local fishermen, join river cleanup along Thu Bon river.',
    badge: 'Indigenous Heritage • Zero Emission',
    categoryName: 'Activities',
  },
  'dest-4': {
    name: 'Ancient Town Public E-Bike Network',
    title: 'Public bicycles & solar electric charging network',
    desc: 'Easily unlock e-bikes to explore ancient town, automatically earn points based on kilometers traveled.',
    badge: 'Zero CO₂ Emission',
    categoryName: 'Transit',
  },
  'dest-5': {
    name: 'Emeralda Resort Ninh Binh',
    title: 'Northern rural ecological village resort',
    desc: 'Preserves natural lotus wetlands, utilizes internal electric shuttles and solar water heating.',
    badge: '5-Star Eco Resort',
    categoryName: 'Hotels',
  },
  'dest-6': {
    name: 'Van Long Wetland Eco-Kitchen',
    title: 'Organic specialties of Van Long wetland',
    desc: 'VietGAP certified vegetables, reusable ceramic ware and microbial composting of food waste.',
    badge: 'VietGAP Organic',
    categoryName: 'Dining',
  },
  'dest-7': {
    name: 'Topas Ecolodge Sa Pa',
    title: 'Eco-resort perched atop terraced rice hills',
    desc: 'Top 10 world eco-lodge by National Geographic, 100% local Hmong and Dao staff.',
    badge: 'National Geographic Eco Certified',
    categoryName: 'Hotels',
  },
  'dest-8': {
    name: 'Cuc Phuong National Park Trekking Tour',
    title: 'Cuc Phuong National Park trekking expedition',
    desc: 'Guided trek through ancient trees, committed to "take nothing but pictures, leave nothing but footprints".',
    badge: 'National Park Conservation',
    categoryName: 'Activities',
  },
  'dest-9': {
    name: 'Thanh Ha Terracotta Pottery Village',
    title: 'Chemical-free terracotta pottery workshop',
    desc: 'Natural clay pottery from a 500-year-old village, complimentary biodegradable jute bags for shoppers.',
    badge: 'Traditional Handmade Crafts',
    categoryName: 'Shopping',
  },
  'dest-10': {
    name: 'Terracotta Hotel & Resort Da Lat',
    title: 'Resort nestled in organic pine forest and mist',
    desc: '100% solar powered, organic strawberry & artichoke farm for self-harvesting experience.',
    badge: '100% Clean Energy',
    categoryName: 'Hotels',
  },
  'dest-11': {
    name: 'Cau Dat Farm Oolong Tea & Herbal Shop',
    title: 'Oolong tea and natural herbal farm specialties',
    desc: 'Cold-dried tea and artichoke packed in recyclable tin cans, free from artificial additives.',
    badge: 'Circular Agriculture',
    categoryName: 'Shopping',
  },
  'dest-12': {
    name: 'Cat Tien Jungle Lodge',
    title: 'Eco-lodge at the edge of Cat Tien National Park',
    desc: 'Natural bamboo architecture, closed-loop water treatment, wildlife conservation education.',
    badge: 'Biodiversity Conservation',
    categoryName: 'Hotels',
  },
  'dest-13': {
    name: 'Nam Cat Tien NP Night Wildlife Safari',
    title: 'Night safari animal spotting on electric tram',
    desc: 'Observe deer, wild boars and nocturnal birds with gentle infrared lights protecting wildlife.',
    badge: 'Humane Animal Tourism',
    categoryName: 'Activities',
  },
};

export const rewardTranslations: Record<
  string,
  {
    title: string;
    categoryName: string;
    description: string;
    partner: string;
    location: string;
    badge?: string;
    treeDetails?: {
      forestName: string;
      treeType: string;
    };
  }
> = {
  'rew-1': {
    title: 'Organic Detox Smoothie (Complimentary)',
    categoryName: 'Dining',
    description: 'Fresh organic farm vegetables from EcoFarm, 100% sugar-free, boosts immunity.',
    partner: 'Green Lounge & Cafe',
    location: 'Poolside Bar',
    badge: 'Popular',
  },
  'rew-2': {
    title: 'EcoStay Recycled Canvas Tote Bag',
    categoryName: 'Eco Fashion',
    description: '100% recycled botanical cotton tote bag with signature botanical leaf pattern.',
    partner: 'EcoStyle Fashion',
    location: 'Front Desk Gift Counter',
  },
  'rew-3': {
    title: 'Engraved Bamboo Thermal Bottle',
    categoryName: 'Eco Fashion',
    description: 'Solid natural bamboo casing with 304 food-grade stainless steel interior, retains hot/cold for 12h.',
    partner: 'Bamboo Green VN',
    location: 'Front Desk Gift Counter',
  },
  'rew-4': {
    title: '30% Off Herbal Spa Voucher',
    categoryName: 'Services',
    description: 'Acupressure massage for neck and shoulders using indigenous organic lemongrass essential oils.',
    partner: 'Eco Harmony Spa',
    location: '2nd Floor - Spa Pavilion',
    badge: 'Hot Deal',
  },
  'rew-5': {
    title: 'Behind-The-Scenes Green Operations Tour',
    categoryName: 'Services',
    description: 'Explore rooftop solar systems, biological wastewater treatment, and vermicomposting gardens.',
    partner: 'EcoStay Experience Hub',
    location: 'Main Lobby (Departs 9:00 AM)',
  },
  'rew-6': {
    title: '30% Off Next Night Stay (Hot Deal)',
    categoryName: 'Hot Deals',
    description: 'Valid across all room tiers at EcoStay Resorts nationwide for 6 months.',
    partner: 'EcoStay Hospitality Chain',
    location: 'Nationwide',
    badge: 'Best Value',
  },
  'rew-7': {
    title: 'Plant 1 Cypress Tree at Cuc Phuong National Park',
    categoryName: 'Plant Trees',
    description: 'Contribute 1 native forest tree tagged with your name. Includes digital certificate and GPS coords updated quarterly.',
    partner: 'Gaia Nature Conservation & Cuc Phuong NP',
    location: 'Cuc Phuong NP, Ninh Binh',
    badge: 'CSR Privilege',
    treeDetails: {
      forestName: 'Cuc Phuong National Park (Core Reserve)',
      treeType: 'Chinese Cypress (Calocedrus macrolepis)',
    },
  },
  'rew-8': {
    title: 'Plant 1 Mangrove Tree at Cat Tien National Park',
    categoryName: 'Plant Trees',
    description: 'Protects fresh water sources and prevents riverbank erosion along Dong Nai river. Track growth progress with QR code.',
    partner: 'WWF Vietnam & PanNature',
    location: 'Nam Cat Tien NP, Dong Nai',
    badge: 'Eco Conservation',
    treeDetails: {
      forestName: 'Nam Cat Tien NP - Wetland Division',
      treeType: 'Mangrove Apple Tree (Sonneratia caseolaris)',
    },
  },
};

export const voucherTranslations: Record<
  string,
  {
    title: string;
    category: string;
    partner: string;
    description: string;
  }
> = {
  'vouch-101': {
    title: 'Organic Detox Smoothie (Free)',
    category: 'Dining',
    partner: 'Green Lounge & Cafe',
    description: 'Applicable for 01 organic juice or smoothie of your choice at Green Lounge, 1st Floor.',
  },
  'vouch-102': {
    title: '30% Off Natural Herbal Spa Voucher',
    category: 'Services',
    partner: 'Eco Harmony Spa',
    description: '30% direct discount on full-body therapies of 60 minutes or longer.',
  },
  'rew-1': {
    title: 'Organic Detox Smoothie (Free)',
    category: 'Dining',
    partner: 'Green Lounge & Cafe',
    description: 'Applicable for 01 organic juice or smoothie of your choice at Green Lounge, 1st Floor.',
  },
  'rew-2': {
    title: 'EcoStay Recycled Canvas Tote Bag',
    category: 'Eco Fashion',
    partner: 'EcoStyle Fashion',
    description: 'Collect your complimentary tote bag at the Front Desk Gift Counter.',
  },
  'rew-3': {
    title: 'Engraved Bamboo Thermal Bottle',
    category: 'Eco Fashion',
    partner: 'Bamboo Green VN',
    description: 'Collect your engraved thermal bottle at the Front Desk Gift Counter.',
  },
  'rew-4': {
    title: '30% Off Natural Herbal Spa Voucher',
    category: 'Services',
    partner: 'Eco Harmony Spa',
    description: '30% direct discount on full-body therapies of 60 minutes or longer.',
  },
  'rew-5': {
    title: 'Behind-The-Scenes Green Operations Tour',
    category: 'Services',
    partner: 'EcoStay Experience Hub',
    description: 'Join the tour at the Main Lobby at 9:00 AM.',
  },
  'rew-6': {
    title: '30% Off Next Night Stay (Hot Deal)',
    category: 'Hot Deals',
    partner: 'EcoStay Hospitality Chain',
    description: 'Present this digital voucher when booking your next stay.',
  },
  'rew-7': {
    title: 'Plant 1 Cypress Tree Certificate',
    category: 'Plant Trees',
    partner: 'Gaia Nature Conservation & Cuc Phuong NP',
    description: 'Digital tree certificate with GPS coordinate: 20.3188° N, 105.6042° E.',
  },
  'rew-8': {
    title: 'Plant 1 Mangrove Tree Certificate',
    category: 'Plant Trees',
    partner: 'WWF Vietnam & PanNature',
    description: 'Digital tree certificate with GPS coordinate: 11.4258° N, 107.4286° E.',
  },
};

export const logTranslations: Record<
  string,
  {
    title: string;
    detail: string;
  }
> = {
  'log-1': {
    title: 'No towel/linen replacement commitment day 2',
    detail: 'Saved 35L of laundry water in Room 402.',
  },
  'log-2': {
    title: 'Zero Food Waste at Silk Sense Hoi An',
    detail: 'Scanned QR code confirming clean plate.',
  },
  'log-3': {
    title: 'E-Bike ride around ancient town',
    detail: 'Zero-emission transport with solar-powered bike.',
  },
};

export const mapLocationTranslations: Record<string, string> = {
  'Hội An': 'Hoi An',
  'Cúc Phương': 'Cuc Phuong',
  'Đà Lạt': 'Da Lat',
  'Nam Cát Tiên': 'Nam Cat Tien',
  'Ninh Bình': 'Ninh Binh',
  'Sa Pa': 'Sa Pa',
  'Toàn quốc': 'National',
  all: 'National',
};

export const rankTranslations: Record<string, string> = {
  'Thành viên Xanh • Hạng Mầm Xanh': 'Green Member • Sprout Tier',
  'Thành viên Cổ Thụ Xanh (VIP)': 'Ancient Tree VIP Member',
  'Thành viên Lá Non': 'Green Leaf Member',
  'Thành viên Khởi Động': 'Eco Starter Member',
};
