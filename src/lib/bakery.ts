import fallbackSweet from "@/assets/office-breakfast.jpg";

// Real business data (from majstori-pekari.com).
export const BUSINESS = {
  name: "Майстори Пекари",
  company: "Майстори пекари ЕООД",
  eik: "208068667",
  phone: "0897 825 208",
  phoneE164: "+359897825208",
  phoneHref: "tel:+359897825208",
  viber: "viber://chat?number=%2B359897825208",
  // Leave empty to hide. Fill in when the real email / Facebook page are known.
  email: "",
  facebook: "",
  address: {
    bg: "ж.к. Младост 4, бл. 459, срещу Бизнес Парк, 1715 София",
    en: "Mladost 4, bl. 459, opposite Business Park, 1715 Sofia",
  },
  mapSrc:
    "https://www.google.com/maps?q=%D0%9C%D0%BB%D0%B0%D0%B4%D0%BE%D1%81%D1%82+4+%D0%B1%D0%BB.+459+%D0%A1%D0%BE%D1%84%D0%B8%D1%8F&output=embed",
};

/** Hero video slot: drop a 5–8 s muted clip at public/videos/mekitsi-frying.mp4 and set this path. */
export const HERO_VIDEO_SRC = "";

// Client's own photos, served from the asset CDN. Key = lowercase filename without extension.
const pointers = import.meta.glob<{ url: string }>("../assets/menu/*.asset.json", { eager: true, import: "default" });
const IMG: Record<string, string> = Object.fromEntries(
  Object.entries(pointers).map(([path, p]) => [path.split("/").pop()!.replace(".jpg.asset.json", ""), p.url]),
);
const img = (k: string) => IMG[k] ?? fallbackSweet;

type L = { bg: string; en: string };
export type Allergen = "gluten" | "eggs" | "milk" | "nuts" | "sesame";
export type Tag = "gf" | "vegan" | "seasonal";
export type Variant = { id: string; name: L; price?: number; bgn?: number };

export type Category = { id: string; name: L; note?: L };
export const CATEGORIES: Category[] = [
  { id: "fried", name: { bg: "Деликатеси от пържено тесто", en: "Fried dough classics" } },
  { id: "pogachi", name: { bg: "Погачи", en: "Pogachi (celebration loaves)" } },
  { id: "bread", name: { bg: "Ръчен селски хляб", en: "Hand-made village bread" } },
  { id: "banitsi", name: { bg: "Баници", en: "Banitsa" } },
  { id: "solenki", name: { bg: "Соленки", en: "Savoury bakes" } },
  { id: "pizza", name: { bg: "Пици", en: "Pizza" } },
  { id: "kozunak", name: { bg: "Козунаци", en: "Kozunak (sweet bread)" } },
  { id: "zakuski", name: { bg: "Закуски", en: "Breakfast pastries" } },
  { id: "sweets", name: { bg: "Сладки изкушения", en: "Sweet treats" } },
  { id: "grissini", name: { bg: "Гризини", en: "Grissini" }, note: { bg: "Замесват се с вино и масло", en: "Kneaded with wine and butter" } },
  { id: "drinks", name: { bg: "Напитки", en: "Drinks" } },
];

export type Product = {
  id: string;
  cat: string;
  name: L;
  desc?: L;
  /** EUR per piece (or per kg when unit = "kg"). null = price on request. */
  price: number | null;
  bgn: number | null;
  unit: "pc" | "kg";
  image: string;
  gallery?: string[];
  weight?: L;
  tags?: Tag[];
  allergens: Allergen[];
  /** Size options (with own price) or filling options (same price). */
  variants?: Variant[];
  variantKind?: "size" | "filling";
  extra?: L; // e.g. "+ украса"
};

const G: Allergen[] = ["gluten"];
const GM: Allergen[] = ["gluten", "milk"];
const GEM: Allergen[] = ["gluten", "eggs", "milk"];
const l = (bg: string, en: string): L => ({ bg, en });

type Def = Omit<Product, "unit" | "image" | "bgn" | "price"> & { p: [number, number] | null; kg?: boolean; img: string };
const P = (d: Def): Product => {
  const { p, kg, img: i, ...rest } = d;
  return { ...rest, price: p ? p[0] : null, bgn: p ? p[1] : null, unit: kg ? "kg" : "pc", image: img(i) };
};

const size = (s: [number, number], b: [number, number]): Variant[] => [
  { id: "small", name: l("Малък", "Small"), price: s[0], bgn: s[1] },
  { id: "large", name: l("Голям", "Large"), price: b[0], bgn: b[1] },
];
const grissini = (id: string, bg: string, en: string, i: string) =>
  P({ id, cat: "grissini", name: l(bg, en), p: [18.46, 36], kg: true, img: i, allergens: G });

export const PRODUCTS: Product[] = [
  // Fried dough
  P({ id: "mekitsa", cat: "fried", name: l("Мекица", "Mekitsa"), desc: l("1 бр. – гореща, току-що изпържена", "1 pc – hot, freshly fried"), p: [0.77, 1.5], img: "parjeno1", allergens: GEM }),
  P({ id: "buhti-sweet", cat: "fried", name: l("Сладки бухти на баба", "Grandma's sweet buhti"), p: [12.82, 25], kg: true, img: "mekici1", allergens: GEM }),
  P({ id: "buhti-savoury", cat: "fried", name: l("Солени бухти", "Savoury buhti"), desc: l("С котидж сирене, сирене и кашкавал", "With cottage cheese, white cheese and kashkaval"), p: [15.38, 30], kg: true, img: "mekici2", allergens: GEM }),
  P({ id: "pirozhka", cat: "fried", name: l("Пирожка със сирене", "Pirozhka with white cheese"), p: [1.38, 2.7], img: "parjeno2", allergens: GEM }),
  P({ id: "ponichki", cat: "fried", name: l("Понички", "Doughnuts"), desc: l("С шоколад или сладко – по избор", "With chocolate or jam – your choice"), p: [1.28, 2.5], img: "parjeno3", allergens: GEM, variantKind: "filling",
    variants: [{ id: "chocolate", name: l("Шоколад", "Chocolate") }, { id: "jam", name: l("Сладко", "Jam") }] }),
  // Pogachi
  P({ id: "pogacha-balls", cat: "pogachi", name: l("Погача на топки", "Pull-apart pogacha"), desc: l("Хлебно тесто", "Bread dough"), p: [6.15, 12], kg: true, img: "pogacha1", allergens: G }),
  P({ id: "pogacha-festive", cat: "pogachi", name: l("Празнична погача", "Festive pogacha"), desc: l("Замесена с мляко, масло и яйца. Възможност за декорация със захарно тесто срещу доплащане.", "Kneaded with milk, butter and eggs. Sugar-paste decoration available at extra cost."), p: [15.38, 30], kg: true, extra: l("+ украса", "+ decoration"), img: "pogacha2", allergens: GEM,
    gallery: ["pogacha4", "pogacha5", "pogacha6", "pogacha12", "pogacha8", "pogacha9", "pogacha10", "pogacha13", "pogacha14", "pogacha15", "pogacha11"].map(img) }),
  P({ id: "gf-pitka", cat: "pogachi", name: l("Безглутенова питка", "Gluten-free flatbread"), p: [12.82, 25], kg: true, img: "pogacha3", tags: ["gf"], allergens: [] }),
  // Bread
  P({ id: "bread-white", cat: "bread", name: l("Бял хляб", "White bread"), p: [0.66, 1.3], img: "hlqb1", allergens: G, variantKind: "size", variants: size([0.66, 1.3], [1.28, 2.5]) }),
  P({ id: "bread-type", cat: "bread", name: l("Типов хляб", "Light wholemeal bread"), p: [0.66, 1.3], img: "hlqb1", allergens: G, variantKind: "size", variants: size([0.66, 1.3], [1.28, 2.5]) }),
  P({ id: "bread-seeds", cat: "bread", name: l("Черен хляб със семена", "Dark bread with seeds"), desc: l("Типово брашно, лен, сусам, тиквено и слънчогледово семе", "Light wholemeal flour, flax, sesame, pumpkin and sunflower seeds"), p: [0.77, 1.5], img: "hlqb3", allergens: ["gluten", "sesame"], variantKind: "size", variants: size([0.77, 1.5], [1.53, 3]) }),
  P({ id: "bread-wholegrain", cat: "bread", name: l("Пълнозърнест хляб", "Wholegrain bread"), desc: l("Пълнозърнесто и типово брашно", "Wholegrain and light wholemeal flour"), p: [0.77, 1.5], img: "hlqb4", allergens: G, variantKind: "size", variants: size([0.77, 1.5], [1.53, 3]) }),
  P({ id: "parlenka", cat: "bread", name: l("Пърленка", "Parlenka"), desc: l("Печена на камък", "Baked on stone"), p: null, img: "hlqb5", allergens: G }),
  P({ id: "franzela-white", cat: "bread", name: l("Франзела – бяла", "White baguette"), p: [0.92, 1.8], img: "hlqb6", allergens: G }),
  P({ id: "franzela-seeds", cat: "bread", name: l("Франзела със семена", "Seeded baguette"), desc: l("Типово брашно със семена", "Light wholemeal flour with seeds"), p: [1.12, 2.2], img: "hlqb7", allergens: ["gluten", "sesame"] }),
  P({ id: "burger-bun", cat: "bread", name: l("Питка за сандвич / бургер", "Sandwich / burger bun"), desc: l("По поръчка", "Made to order"), p: null, img: "hlqb9", allergens: G }),
  // Banitsi
  P({ id: "banitsa-bites", cat: "banitsi", name: l("Баница – хапки", "Banitsa bites"), desc: l("Сирене, масло, яйце", "White cheese, butter, egg"), p: [0.52, 1], img: "banica1", allergens: GEM }),
  P({ id: "banitsa-spinach", cat: "banitsi", name: l("Баница – хапки със спанак", "Spinach banitsa bites"), desc: l("Сирене, спанак, масло, кисело мляко", "White cheese, spinach, butter, yoghurt"), p: [0.61, 1.2], img: "banica2", allergens: GM }),
  P({ id: "banitsa-village", cat: "banitsi", name: l("Наложена селска баница", "Layered village banitsa"), desc: l("Сирене, кисело мляко, яйца, масло", "White cheese, yoghurt, eggs, butter"), p: [2.56, 5], img: "banica3", allergens: GEM }),
  // Solenki
  P({ id: "roll-cheese", cat: "solenki", name: l("Маслено рогче със сирене", "Butter croissant with white cheese"), p: [1.17, 2.3], img: "solenki1", allergens: GEM }),
  P({ id: "roll-kashkaval", cat: "solenki", name: l("Маслено рогче с кашкавал", "Butter croissant with kashkaval"), p: [1.38, 2.7], img: "solenki2", allergens: GEM }),
  P({ id: "solenki-cheese", cat: "solenki", name: l("Соленки със сирене", "Cheese crackers"), p: [0.82, 1.6], img: "solenki7", allergens: GM }),
  P({ id: "solenki-processed", cat: "solenki", name: l("Соленки с топено сирене", "Cream-cheese crackers"), p: [0.82, 1.6], img: "solenki8", allergens: GM }),
  P({ id: "cake-olive", cat: "solenki", name: l("Солен кекс с маслини", "Savoury olive cake"), desc: l("Със сирене, маслини и подправки", "With white cheese, olives and herbs"), p: [0.87, 1.7], img: "solenki4", allergens: GEM }),
  P({ id: "cake-pepper", cat: "solenki", name: l("Солен кекс с чушка", "Savoury pepper cake"), desc: l("Със сирене, чушка и подправки", "With white cheese, pepper and herbs"), p: [0.87, 1.7], img: "solenki5", allergens: GEM }),
  // Pizza
  P({ id: "pizza", cat: "pizza", name: l("Пица", "Pizza"), desc: l("С шунка, кашкавал и зеленчуци", "With ham, kashkaval and vegetables"), p: [2.05, 4], img: "pici1", allergens: GM }),
  P({ id: "pizza-slice", cat: "pizza", name: l("Пица на парче", "Pizza slice"), desc: l("С шунка, кашкавал и зеленчуци", "With ham, kashkaval and vegetables"), p: [1.94, 3.8], img: "pici2", allergens: GM }),
  // Kozunak
  P({ id: "kozunak", cat: "kozunak", name: l("Козунак (чист)", "Plain kozunak"), weight: l("500 г", "500 g"), p: [5, 9.75], img: "kozunakchist", allergens: GEM }),
  P({ id: "kozunak-small", cat: "kozunak", name: l("Козунак – малък", "Small kozunak"), weight: l("100 г", "100 g"), p: [1.4, 2.66], img: "kozunaci2", allergens: GEM }),
  P({ id: "kozunak-raisins", cat: "kozunak", name: l("Козунак със стафиди", "Kozunak with raisins"), weight: l("500 г", "500 g"), p: [7, 13.65], img: "kozunaci3", allergens: GEM }),
  P({ id: "kozunak-lokum", cat: "kozunak", name: l("Козунак с локум", "Kozunak with Turkish delight"), weight: l("500 г", "500 g"), p: [7, 13.65], img: "kozunaci4", allergens: GEM }),
  P({ id: "kozunak-jam", cat: "kozunak", name: l("Козунак с мармалад", "Kozunak with marmalade"), weight: l("500 г", "500 g"), p: [7, 13.65], img: "kozunaci5", allergens: GEM }),
  P({ id: "kozunak-walnut", cat: "kozunak", name: l("Козунак с орехи", "Kozunak with walnuts"), weight: l("500 г", "500 g"), p: [8.5, 16.57], img: "kozunaci6", allergens: ["gluten", "eggs", "milk", "nuts"] }),
  P({ id: "kozunak-choc", cat: "kozunak", name: l("Козунак с белгийски шоколад", "Kozunak with Belgian chocolate"), weight: l("500 г", "500 g"), p: [8.5, 16.57], img: "kozunaci7", allergens: GEM }),
  // Zakuski
  P({ id: "princess-ham", cat: "zakuski", name: l("Принцеса с шунка и кашкавал", "Printsesa with ham & kashkaval"), p: [2.05, 4], img: "zakuski1", allergens: GM }),
  P({ id: "princess-mince", cat: "zakuski", name: l("Принцеса с кайма и кашкавал", "Printsesa with mince & kashkaval"), p: [2.05, 4], img: "zakuski2", allergens: GM }),
  P({ id: "krenvirshka", cat: "zakuski", name: l("Кренвиршка", "Sausage roll"), desc: l("С кренвирш Деликатес Житница и кашкавал", "With Delikates Zhitnitsa frankfurter and kashkaval"), p: [1.02, 2], img: "zakuski3", allergens: GM }),
  P({ id: "rozichka", cat: "zakuski", name: l("Розичка", "Rozichka"), desc: l("Шунка, топено сирене, кашкавал", "Ham, cream cheese, kashkaval"), p: [2.15, 4.2], img: "zakuski4", allergens: GM }),
  P({ id: "salamka", cat: "zakuski", name: l("Саламка", "Salamka"), desc: l("Салам Деликатес Житница, кашкавал, кисела краставица", "Delikates Zhitnitsa salami, kashkaval, pickle"), p: [2.15, 4.2], img: "zakuski5", allergens: GM }),
  P({ id: "stefani", cat: "zakuski", name: l("Стефани", "Stefani"), desc: l("Шунка, кашкавал, цяло яйце", "Ham, kashkaval, whole egg"), p: [2.15, 4.2], img: "zakuski6", allergens: GEM }),
  P({ id: "toastie-olive", cat: "zakuski", name: l("Запечен сандвич с маслини", "Baked olive sandwich"), desc: l("Маслини каламата, пармезан и кашкавал", "Kalamata olives, parmesan and kashkaval"), p: [2.3, 4.5], img: "zakuski13", allergens: GM }),
  P({ id: "toastie-ham", cat: "zakuski", name: l("Запечен сандвич с шунка и гъби", "Baked ham & mushroom sandwich"), desc: l("Шунка, гъби, пармезан и кашкавал", "Ham, mushrooms, parmesan and kashkaval"), p: [2.3, 4.5], img: "zakuski12", allergens: GM }),
  P({ id: "nadenitsa", cat: "zakuski", name: l("Закуска с наденица", "Sausage pastry"), desc: l("С наденица Деликатес Житница и кашкавал", "With Delikates Zhitnitsa sausage and kashkaval"), p: [2.15, 4.2], img: "zakuski14", allergens: GM }),
  P({ id: "kifli-cheese", cat: "zakuski", name: l("Кифлички със сирене", "Cheese kifli"), p: [1.28, 2.5], img: "zakuski7", allergens: GEM }),
  P({ id: "kifli-sesame", cat: "zakuski", name: l("Кифлички с топено сирене и сусам", "Cream-cheese & sesame kifli"), p: [1.28, 2.5], img: "solenki6", allergens: ["gluten", "eggs", "milk", "sesame"] }),
  P({ id: "kifli-lokum", cat: "zakuski", name: l("Кифлички с локум", "Turkish-delight kifli"), p: [1.28, 2.5], img: "zakuski9", allergens: GEM }),
  P({ id: "kifla-jam", cat: "zakuski", name: l("Кифличка с мармалад", "Marmalade kifla"), p: [1.28, 2.5], img: "zakuski10", allergens: GEM }),
  P({ id: "kifla-choc", cat: "zakuski", name: l("Кифличка с белгийски млечен шоколад", "Belgian milk-chocolate kifla"), p: [1.53, 3], img: "zakuski11", allergens: GEM }),
  P({ id: "kifli-kashkaval", cat: "zakuski", name: l("Кифлички с кашкавал", "Kashkaval kifli"), p: [1.53, 3], img: "zakuski15", allergens: GEM }),
  P({ id: "kifli-4cheese", cat: "zakuski", name: l("Кифлички с 4 вида сирена", "Four-cheese kifli"), desc: l("С домашно бутер тесто", "With home-made puff pastry"), p: [1.74, 3.4], img: "zakuski16", allergens: GEM }),
  // Sweets
  P({ id: "butter-biscuits", cat: "sweets", name: l("Маслени бисквити", "Butter biscuits"), p: [0.77, 1.5], img: "sladki11", allergens: GEM }),
  P({ id: "lokumki", cat: "sweets", name: l("Локумки с масло", "Butter lokumki"), p: [0.92, 1.8], img: "sladki12", allergens: GEM }),
  P({ id: "medenki", cat: "sweets", name: l("Домашни меденки", "Home-made honey cookies"), desc: l("С натурален шоколад и домашен мед", "With dark chocolate and home-made honey"), p: [0.87, 1.7], img: "sladki22", allergens: GEM }),
  P({ id: "kurabii", cat: "sweets", name: l("Домашни курабии (чисти)", "Plain home-made kurabii"), p: [11.76, 23], kg: true, img: "sladki17", allergens: GEM }),
  P({ id: "kurabii-choc", cat: "sweets", name: l("Шоколадови курабийки", "Chocolate-chip kurabii"), desc: l("С парченца белгийски шоколад", "With Belgian chocolate chunks"), p: [13.29, 26], kg: true, img: "sladki15", allergens: GEM }),
  P({ id: "mini-muffins", cat: "sweets", name: l("Мини мъфини", "Mini muffins"), desc: l("С домашно сладко от вишни", "With home-made sour-cherry jam"), p: [0.92, 1.8], img: "", allergens: GEM }),
  P({ id: "keks", cat: "sweets", name: l("Кекс", "Marble cake"), desc: l("Домашен кекс с какао, стафиди, поръсен с орехи", "Home-made cocoa cake with raisins, topped with walnuts"), p: [1.79, 3.5], img: "sladki7", allergens: ["gluten", "eggs", "milk", "nuts"] }),
  P({ id: "brownie", cat: "sweets", name: l("Брауни", "Brownie"), desc: l("Белгийски шоколад, масло, кафява захар", "Belgian chocolate, butter, brown sugar"), p: [2.3, 4.5], img: "sladki21", allergens: GEM }),
  P({ id: "revane", cat: "sweets", name: l("Реване", "Revani"), desc: l("Пандишпаново тесто със сироп", "Sponge cake soaked in syrup"), p: [1.64, 3.2], img: "sladki8", allergens: ["gluten", "eggs"] }),
  P({ id: "baklava", cat: "sweets", name: l("Баклава с орехи", "Walnut baklava"), p: [16.41, 32], kg: true, img: "sladki9", allergens: ["gluten", "nuts", "milk"] }),
  P({ id: "vegan-bonbons", cat: "sweets", name: l("Веган бонбони", "Vegan energy bites"), desc: l("Фурми, кайсии, смокини, бадем, кашу, орехи, кокос, мед, тахан", "Dates, apricots, figs, almonds, cashews, walnuts, coconut, honey, tahini"), p: [0.61, 1.2], img: "sladki20", tags: ["vegan"], allergens: ["nuts", "sesame"] }),
  P({ id: "almond-cookies", cat: "sweets", name: l("Бадемови сладки", "Almond cookies"), p: [24.1, 47], kg: true, img: "", allergens: ["eggs", "nuts"] }),
  P({ id: "gf-kokoski", cat: "sweets", name: l("Безглутенови кокоски", "Gluten-free coconut macaroons"), p: [16.41, 32], kg: true, img: "", tags: ["gf"], allergens: ["eggs"] }),
  P({ id: "fruit-cake", cat: "sweets", name: l("Сладкиш с масло и плодове", "Butter & fruit cake"), p: [1.79, 3.5], img: "sladki13", allergens: GEM }),
  P({ id: "orange-cake", cat: "sweets", name: l("Сладкиш със стафиди и портокалов сироп", "Raisin cake with orange syrup"), p: [1.79, 3.5], img: "", allergens: GEM }),
  P({ id: "choc-cake", cat: "sweets", name: l("Кекс с два вида шоколад", "Double-chocolate cake"), desc: l("С шоколадов сироп", "With chocolate syrup"), p: [1.79, 3.5], img: "", allergens: GEM }),
  P({ id: "milk-banitsa", cat: "sweets", name: l("Млечна баница", "Milk banitsa"), p: [1.79, 3.5], img: "sladki14", allergens: GEM }),
  P({ id: "fruit-kurabii", cat: "sweets", name: l("Курабии с плодове", "Fruit kurabii"), p: [24.1, 47], kg: true, img: "", allergens: GEM }),
  P({ id: "strudel-apple", cat: "sweets", name: l("Щрудел с ябълка и орехи", "Apple & walnut strudel"), p: [2.05, 4], img: "shtrudeliabalki", allergens: ["gluten", "milk", "nuts"] }),
  P({ id: "strudel-pumpkin", cat: "sweets", name: l("Щрудел с тиква и орехи", "Pumpkin & walnut strudel"), p: [2.05, 4], img: "sladki16", tags: ["seasonal"], allergens: ["gluten", "milk", "nuts"] }),
  P({ id: "flapjack", cat: "sweets", name: l("Флапджак", "Flapjack"), p: [21.53, 42], kg: true, img: "sladki18", allergens: GM }),
  P({ id: "norwegian-crackers", cat: "sweets", name: l("Сладки норвежки крекери", "Sweet Norwegian crackers"), p: [24.61, 48], kg: true, img: "sladki19", allergens: GM }),
  // Grissini
  grissini("grissini-parmesan", "Гризини с пармезан", "Parmesan grissini", "grizini1"),
  grissini("grissini-spelt", "Гризини лимец с билки", "Einkorn & herb grissini", "grizini2"),
  grissini("grissini-wholegrain", "Гризини пълнозърнести със слънчогледови семки", "Wholegrain sunflower-seed grissini", "grizini3"),
  grissini("grissini-sesame", "Гризини бели със сусам", "White sesame grissini", "grizini4"),
  grissini("grissini-corn", "Царевични гризини", "Corn grissini", "grizini5"),
  // Drinks
  P({ id: "ayran", cat: "drinks", name: l("Домашен айрян", "Home-made ayran"), desc: l("С пробиотично мляко", "With probiotic yoghurt"), weight: l("390 г", "390 g"), p: [1.12, 2.2], img: "napitki1", allergens: ["milk"] }),
];

/** Curated "most loved" selection for the home page. */
export const FEATURED = ["mekitsa", "pirozhka", "ponichki", "banitsa-bites", "buhti-savoury", "princess-ham"];

export const KG_STEP = 0.5;
export const findProduct = (id: string) => PRODUCTS.find((p) => p.id === id);

/** EUR unit price for a product + variant; null when the item can't be ordered online. */
export function unitPrice(p: Product, variant?: string): { eur: number; bgn: number } | null {
  if (p.variants) {
    const v = p.variants.find((x) => x.id === variant);
    if (!v) return null;
    if (v.price != null) return { eur: v.price, bgn: v.bgn! };
  }
  return p.price == null ? null : { eur: p.price, bgn: p.bgn! };
}

/** Valid quantity: whole pieces, or 0.5 kg steps for per-kg items. */
export function validQty(p: Product, qty: number) {
  if (p.unit === "kg") return qty >= KG_STEP && qty <= 20 && Number.isInteger(qty / KG_STEP);
  return Number.isInteger(qty) && qty >= 1 && qty <= 100;
}

// PLACEHOLDER reviews — replace with real customer reviews.
export const REVIEWS = [
  { name: "Мария П.", text: { bg: "Мекиците са точно като на баба ми!", en: "The mekitsi taste just like my grandma's!" } },
  { name: "Георги Д.", text: { bg: "Горещи и хрупкави всяка сутрин.", en: "Hot and crispy every morning." } },
  { name: "Елена К.", text: { bg: "Поръчах за офиса – всички питаха откъде са.", en: "Ordered for the office – everyone asked where they were from." } },
];

export const fmt = (n: number) => n.toFixed(2).replace(".", ",") + " €";
export const fmtBgn = (n: number) => n.toFixed(2).replace(".", ",") + " лв.";
export const fmtQty = (n: number, unit: "pc" | "kg") => (unit === "kg" ? `${String(n).replace(".", ",")} кг` : `${n}`);
