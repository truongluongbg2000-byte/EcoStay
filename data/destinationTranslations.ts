/**
 * English copy for the green destinations in data/greenDestinations.ts.
 * Each entry is [title, details]; the full description is `${title}; ${details}`.
 * Proper nouns (venue names, street addresses) intentionally stay in Vietnamese.
 */
const EN: Record<string, [string, string]> = {
  'ha-f1': ['Local plant-based cuisine with natural seasonings', 'vegan chicken made from mushrooms and organic tofu, rice cooked in fresh coconut water and pandan leaves, no preservatives.'],
  'ha-f2': ['A tranquil tea space celebrating local culture and community', 'highland organic tea, hand-roasted coffee and traditional mung bean cakes served by hearing-impaired staff.'],
  'ha-f3': ['Sustainably caught seafood paired with organic Trà Quế village vegetables', 'ingredients caught the same day with traditional gear, with no plastic bags or plastic straws.'],
  'ha-h1': ['An eco homestay tucked away in a cool vegetable garden', 'bamboo construction, solar-heated water and open spaces close to nature.'],
  'ha-h2': ['A tropical garden resort with a circular water recycling system', 'rooms feature recycled-wood furniture, in-room glass water filters and organic herbal toiletries.'],
  'ha-h3': ['A green community stay for young eco-minded travelers', 'weekly Hoài River clean-ups, free purified water refills and minimal plastic waste.'],
  'ha-t1': ['Silent transport through the heart of the old town', 'solar-assisted electric bikes for effortless rides along narrow lanes.'],
  'ha-t2': ['A smoke-free electric shuttle linking the old town and An Bàng beach', 'quiet 8–12 seat electric cars that cut carbon emissions along the coastal tourist road.'],
  'ha-a1': ['An eco-friendly handicraft experience', 'make your own lantern from a bamboo frame and recycled dó paper, a meaningful keepsake to take home.'],
  'ha-a2': ['Clean farming alongside local villagers', 'learn to use natural seaweed fertilizer, water with coconut shells and harvest organic herbs in the garden.'],
  'ha-a3': ['Water sports combined with marine ecosystem protection', 'paddleboard at sunrise on the estuary and help collect plastic waste washed onto the sandbanks.'],
  'ha-s1': ['Sustainable fashion dyed with local plant leaves', 'raw linen clothing without harmful bleaching chemicals, packed in recycled paper bags.'],
  'ha-s2': ['Creative souvenirs made from Hội An tailors’ fabric offcuts', 'handmade patchwork tote bags, clutches and plush toys that reduce textile waste.'],
  'dl-f1': ['Fresh vegetable buffet harvested directly from a VietGAP farm', 'enjoy vegetable hotpot with over 20 kinds of lush greens grown organically on Robin Hill.'],
  'dl-f2': ['Serene vegetarian cuisine from wild mushrooms and highland produce', 'a fully plant-based menu with natural seasonings, no MSG and no foam takeaway boxes.'],
  'dl-f3': ['Cầu Đất Arabica coffee, naturally roasted and grown sustainably under forest canopy', 'cherries picked 100% ripe, water-saving wet processing and coffee grounds reused as organic fertilizer.'],
  'dl-h1': ['A pine-wood resort immersed in primeval pine forest', 'recycled timber materials, a natural water filtration system and on-site circular farming.'],
  'dl-h2': ['An eco resort on Tuyền Lâm Lake that preserves its native vegetation', 'architecture follows the pine-hill terrain, no trees are cut, with clean energy and closed-loop waste treatment.'],
  'dl-t1': ['Smoke-free sightseeing in the city of flowers', 'explore the Xuân Hương Lake loop and old villas in eco-friendly electric cars.'],
  'dl-t2': ['Smooth rides over Da Lat’s hills with no harmful exhaust', 'battery-swap stations across the center, strong motors for climbing and cleaner mountain air.'],
  'dl-t3': ['Active green travel in the cool highland weather', 'regularly serviced bicycles encourage short trips without an engine.'],
  'dl-a1': ['Eco-tourism experiences linked to nature protection', 'trek pine forest trails, learn about the ecosystem and plant a young pine tree with your name tag.'],
  'dl-a2': ['Discover the quiet lake without noise that disturbs wildlife', 'paddle through narrow inlets, observe native vegetation and follow the “Leave No Trace” principle.'],
  'dl-s1': ['Dried specialties, fruit preserves and herbal teas without chemicals', 'naturally grown products in eco-friendly paper packaging that support local farmers.'],
  'dl-s2': ['Handmade warm goods that preserve traditional local crafts', 'hand-woven shawls, sweaters and brocade bags from natural cotton and wool, creating sustainable livelihoods for ethnic communities.'],
  'dl-s3': ['Green gifts that bring nature into your living space', 'succulents and cacti in self-decomposing pressed coconut-fiber pots instead of plastic ones.'],
  'cp-f1': ['Traditional cuisine from the national park buffer zone with clean ingredients', 'dishes made from village pork, free-range hill chicken and sustainably foraged forest greens, cooked in the traditional Mường style.'],
  'cp-f2': ['Rustic meals wrapped in bamboo tubes and fresh banana leaves, with no plastic waste', 'upland sticky rice grilled in fresh bamboo with sesame salt, and boiled wild ferns dipped in fermented rice sauce.'],
  'cp-h1': ['An eco stilt house hidden under the primeval forest canopy', 'a local stilt-house design combined with solar power and complete tranquility in nature.'],
  'cp-h2': ['An eco stay with the Mường people of the buffer zone', 'wooden stilt houses with traditional palm-leaf roofs, naturally filtered spring water and direct contributions to the village conservation fund.'],
  'cp-h3': ['A night in the deep old forest with no phone signal, immersed in nature', 'solar power with limited hours to protect the biological rhythms of nocturnal wildlife.'],
  'cp-t1': ['A safe way to explore the primeval flora and fauna', 'rent dedicated mountain bikes to ride the forest trails without engine noise.'],
  'cp-t2': ['A shuttle from the park gate to the center that cuts petrol-vehicle emissions', 'quiet electric cars along a 20 km forest road, minimizing noise and dust that disturb primates.'],
  'cp-t3': ['On foot along the designated trails to protect the vegetation', 'discover the Thousand-Year Chò tree and the Cave of Prehistoric Man without trampling saplings or littering.'],
  'cp-a1': ['Nature education and wildlife conservation experiences', 'visit the Endangered Primate Rescue Center and join a guided night walk with rangers to see nocturnal animals.'],
  'cp-a2': ['Hands-on tropical forest restoration', 'germinate and plant native timber trees in the restoration area under the guidance of park rangers.'],
  'cp-a3': ['Observe biodiversity without hunting or harming any creature', 'learn about hundreds of endemic butterfly and insect species with a biologist and practice responsible nature photography.'],
  'cp-s1': ['Handicrafts made from legally grown wood, rattan and bamboo', 'handmade by local Mường artisans, with proceeds contributing to the forest conservation fund.'],
  'cp-s2': ['Sustainably harvested natural specialties without destroying bee nests', 'pure wild-flower honey in reusable glass bottles, giving buffer-zone residents a steady income instead of logging.'],
  'nb-f1': ['Simple countryside cuisine from sticky rice and local produce', 'specialties such as crispy rice, lotus stem salad and clay-pot mushrooms prepared in a healthy macrobiotic style.'],
  'nb-f2': ['Local specialties in an old house among the rice fields', 'organic vegetables grown in the family garden, with no plastic straws or single-use wet wipes.'],
  'nb-f3': ['Traditional lotus-scented tea from Vân Long lagoon', 'green tea scented in fresh lotus blossoms picked at dawn, wrapped in natural lotus leaves.'],
  'nb-h1': ['An eco resort full of the spirit of the old northern countryside', 'traditional tiled-roof architecture, an organic waste treatment system and eco-friendly materials.'],
  'nb-h2': ['A resort certified for green tourism with energy-saving systems', 'in-room glass water filters and organic waste recycled into fertilizer for the landscaped grounds.'],
  'nb-t1': ['Green travel on land and water to protect the heritage landscape', 'traditional hand-rowed boats operated by locals and zero-emission electric carts within the site.'],
  'nb-t2': ['Cycle through rice fields and peaceful village roads', 'classic wicker-basket bicycles let you explore Múa Cave and Bích Động at leisure, with no engine noise.'],
  'nb-a1': ['A gentle eco experience viewing the wetland landscape', 'paddle a kayak across the calm water and watch the rare white-rumped langur from a safe distance.'],
  'nb-a2': ['Join the rhythm of nature-friendly farming in the low-lying paddy region', 'learn to transplant rice, scoop water with a traditional bucket and explore a paddy ecosystem free of chemical pesticides.'],
  'nb-a3': ['Watch tens of thousands of wild birds in an intact habitat', 'travel by unmotorized wooden boat into the core of the bird sanctuary, staying completely quiet to avoid disturbing the birds.'],
  'nb-s1': ['Long-established traditional handicrafts', 'meticulously hand-embroidered scarves with natural thread and baskets and bags made from eco-friendly sedge and reed.'],
  'nb-s2': ['Household items and fashion accessories woven from natural sedge', 'sleeping mats, handbags, hats and boxes 100% hand-woven, sun-dried and fully biodegradable.'],
  'nb-s3': ['Wellness products from native medicinal plants', 'herbal balm, foot-soak salts and herbal-leaf soap made by a local cooperative, packed in recycled kraft paper.'],
  'nct-f1': ['Rustic dining beside the Đạ Huoai and Đồng Nai rivers', 'natural river fish caught legally and clean wild greens foraged in the biosphere buffer zone.'],
  'nct-f2': ['Traditional cuisine of the Mạ and S’tiêng communities in the buffer zone', 'soup cooked in lồ ô bamboo tubes, upland rice and fresh wild fern shoots with no industrial seasoning.'],
  'nct-h1': ['An eco lodge in the heart of the tropical rainforest', 'open-plan rooms blend into nature, with minimal grid power and solar lamps.'],
  'nct-h2': ['Traditional longhouse architecture built entirely from bamboo, tầm vông and rattan leaves', 'a sustainable community tourism project that creates jobs for ethnic minorities and protects the Nam Cát Tiên National Park buffer zone.'],
  'nct-h3': ['An eco resort on the Đồng Nai riverbank with a closed-loop water treatment system', 'household water is reused to irrigate the organic vegetable garden, and no single-use plastic bottles are used anywhere on the grounds.'],
  'nct-t1': ['Transport with no engine noise inside the national park', 'rent a bicycle to explore the ancient Cây Tung and Bầu Sấu trails safely while protecting the ecosystem.'],
  'nct-t2': ['A shuttle from the gate pier to the park center with no oil pollution', 'a quiet 5-minute river crossing that protects the water of rare aquatic species.'],
  'nct-t3': ['A fully human-powered trek to reach the Ramsar wetland', 'motor vehicles are strictly banned to keep the habitat of Siamese crocodiles and waterbirds intact.'],
  'nct-a1': ['A unique biology experience of nocturnal wildlife', 'watch night-active animals (deer, wild boar, civets) guided by rangers and learn about the old-growth forest ecosystem.'],
  'nct-a2': ['Learn about animal rescue and release back into the wild', 'see yellow-cheeked gibbons and black-shanked douc langurs in a semi-wild setting and contribute to the animals’ food fund.'],
  'nct-s1': ['Handmade souvenirs supporting nature conservation', 'organic cotton T-shirts printed with rare animals, recycled-paper notebooks and research publications about Nam Cát Tiên.'],
  'nct-s2': ['Traditional handicrafts by Mạ and S’tiêng women', 'hand-woven cotton scarves dyed with forest bark and sturdy rattan-and-bamboo baskets that replace plastic shopping bags.'],
  'nct-s3': ['Sustainable farm specialties without chemical pesticides', 'cashews and black pepper grown to organic standards by Tân Phú farmers, packed in eco-friendly zip paper bags.'],
  'sp-f1': ['Northwest dishes made from the villages’ organic ingredients', 'vegetarian thắng cố from wild mushrooms and salmon hotpot from cold natural spring water with local organic Mông mustard greens.'],
  'sp-f2': ['A local family-style meal with produce harvested from the fields', 'fresh wild bamboo shoots, flowering mustard greens, handmade tofu and red upland sticky rice, with a no-plastic-waste commitment.'],
  'sp-f3': ['A social enterprise supporting education for ethnic minority children', 'locally roasted coffee, hawthorn tea and wild-honey ginger tea served in reusable ceramic cups.'],
  'sp-h1': ['A mountaintop eco resort overlooking the Mường Hoa valley', 'built from local natural granite with an advanced biological wastewater system and no single-use plastics.'],
  'sp-h2': ['Bungalows made of natural materials facing the Hoàng Liên Sơn range', 'palm-leaf roofs, rammed-earth and bamboo walls that stay warm in winter and cool in summer, powered by solar energy.'],
  'sp-h3': ['An eco stay by the Mường Hoa stream with a Dao herbal bath experience', 'used herbal bath water is filtered through aquatic plants before returning to the environment.'],
  'sp-t1': ['Green travel to discover the H’Mông and Red Dao villages', 'electric shuttles combined with trekking through terraced fields to reduce dust and pollution.'],
  'sp-t2': ['Smooth urban shuttles that reduce congestion and highland emissions', 'zero direct-emission electric cars take visitors to the Stone Church, Hàm Rồng and Cát Cát village.'],
  'sp-a1': ['A sustainable local craft culture experience', 'learn how flax is spun, beeswax is painted and natural indigo is dyed from indigo leaves into unique fabrics.'],
  'sp-a2': ['Conquer majestic nature while protecting the headwater forest', 'hike through ancient rhododendron forest and clear trail waste together with local guides.'],
  'sp-a3': ['Discover indigenous medicinal knowledge tied to forest herb conservation', 'follow local villagers into the forest to pick medicinal leaves, cutting only branches and never uprooting so plants regrow naturally.'],
  'sp-s1': ['Traditional handicrafts and herbal bath ingredients of the Red Dao', 'brocade bags and clothing in natural fibers and safe, gentle organic herbal bath remedies.'],
  'sp-s2': ['Contemporary designs from hand-woven linen and H’Mông beeswax-batik patterns', 'dyed entirely with natural indigo, tubers and tree bark, with no industrial chemicals, packed in reusable cloth bags.'],
};

export interface DestinationTextEn {
  title: string;
  desc: string;
}

export const destinationTextEn: Record<string, DestinationTextEn> = Object.fromEntries(
  Object.entries(EN).map(([id, [title, details]]) => [id, { title, desc: `${title}; ${details}` }])
);

/** Badges that were left in Vietnamese in the source data. */
export const destinationBadgeEn: Record<string, string> = {
  'ha-a1': 'Craft Heritage Preservation',
};

const PRICE_UNITS: Record<string, string> = {
  món: 'dish',
  đêm: 'night',
  lượt: 'ride',
  chậu: 'pot',
  nhóm: 'group',
  chuyến: 'trip',
  ngày: 'day',
  vé: 'ticket',
  chai: 'bottle',
  người: 'person',
  gói: 'pack',
  'sản phẩm': 'item',
  giờ: 'hour',
  tuyến: 'route',
  suất: 'session',
  ly: 'cup',
};

/** Localize Vietnamese price strings such as "Từ 45.000đ/món" for non-Vietnamese UIs. */
export function localizePrice(price: string | undefined, isVietnamese: boolean): string | undefined {
  if (!price || isVietnamese) return price;
  const m = price.match(/^(Từ )?([\d.,]+)đ\/(.+)$/);
  if (m) {
    const amount = m[2].replace(/\./g, ',');
    const unit = PRICE_UNITS[m[3].trim()] || m[3].trim();
    return `${m[1] ? 'From ' : ''}${amount} VND / ${unit}`;
  }
  if (price === 'Miễn phí tuyến đường bộ') return 'Free on road routes';
  if (price === 'Theo giá niêm yết vé thuyền') return 'Per posted boat ticket price';
  if (price === 'Đã bao gồm trong vé tham quan') return 'Included in admission ticket';
  const free = price.match(/^Miễn phí (\d+h) đầu cho khách đặt EcoStay$/);
  if (free) return `Free first ${free[1]} for EcoStay guests`;
  return price;
}
