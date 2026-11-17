export type Lang = 'vi' | 'en';

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
    subtitle: 'Staff verifies clean plate (Warning: -5 CP penalty if wasted)',
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
    subtitle: 'Get 50 CP for each friend who registers successfully',
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

export const destinationTranslations: Record<string, { title: string; desc: string; badge: string; categoryName: string }> = {
  'dest-1': {
    title: 'Pioneering zero-plastic waste resort in Hoi An',
    desc: 'Features 3,000m² organic farm, 100% natural straw and renewable materials, strictly zero single-use plastic bottles.',
    badge: '100% Green • Zero Plastic Waste',
    categoryName: 'Hotels',
  },
  'dest-2': {
    title: 'Farm-to-table vegan & macrobiotic cuisine',
    desc: 'Daily harvest from Tra Que ecological farm, no MSG, 100% packaged in lotus leaves.',
    badge: 'Farm-to-Table • Zero Waste',
    categoryName: 'Dining',
  },
  'dest-3': {
    title: 'Eco-friendly water coconut forest boat tour',
    desc: 'Row traditional bamboo basket boats with local fishermen, join river cleanup along Thu Bon river.',
    badge: 'Indigenous Heritage • Zero Emission',
    categoryName: 'Activities',
  },
  'dest-4': {
    title: 'Public bicycles & solar electric charging network',
    desc: 'Easily unlock e-bikes to explore ancient town, automatically earn points based on kilometers traveled.',
    badge: 'Zero CO₂ Emission',
    categoryName: 'Transit',
  },
  'dest-5': {
    title: 'Northern rural ecological village resort',
    desc: 'Preserves natural lotus wetlands, utilizes internal electric shuttles and solar water heating.',
    badge: '5-Star Eco Resort',
    categoryName: 'Hotels',
  },
  'dest-6': {
    title: 'Organic specialties of Van Long wetland',
    desc: 'VietGAP certified vegetables, reusable ceramic ware and microbial composting of food waste.',
    badge: 'VietGAP Organic',
    categoryName: 'Dining',
  },
  'dest-7': {
    title: 'Eco-resort perched atop terraced rice hills',
    desc: 'Top 10 world eco-lodge by National Geographic, 100% local Hmong and Dao staff.',
    badge: 'National Geographic Eco Certified',
    categoryName: 'Hotels',
  },
  'dest-8': {
    title: 'Cuc Phuong National Park trekking expedition',
    desc: 'Guided trek through ancient trees, committed to "take nothing but pictures, leave nothing but footprints".',
    badge: 'National Park Conservation',
    categoryName: 'Activities',
  },
  'dest-9': {
    title: 'Chemical-free terracotta pottery workshop',
    desc: 'Natural clay pottery from a 500-year-old village, complimentary biodegradable jute bags for shoppers.',
    badge: 'Traditional Handmade Crafts',
    categoryName: 'Shopping',
  },
  'dest-10': {
    title: 'Resort nestled in organic pine forest and mist',
    desc: '100% solar powered, organic strawberry & artichoke farm for self-harvesting experience.',
    badge: '100% Clean Energy',
    categoryName: 'Hotels',
  },
  'dest-11': {
    title: 'Oolong tea and natural herbal farm specialties',
    desc: 'Cold-dried tea and artichoke packed in recyclable tin cans, free from artificial additives.',
    badge: 'Circular Agriculture',
    categoryName: 'Shopping',
  },
  'dest-12': {
    title: 'Eco-lodge at the edge of Cat Tien National Park',
    desc: 'Natural bamboo architecture, closed-loop water treatment, wildlife conservation education.',
    badge: 'Biodiversity Conservation',
    categoryName: 'Hotels',
  },
  'dest-13': {
    title: 'Night safari animal spotting on electric tram',
    desc: 'Observe deer, wild boars and nocturnal birds with gentle infrared lights protecting wildlife.',
    badge: 'Humane Animal Tourism',
    categoryName: 'Activities',
  },
};
