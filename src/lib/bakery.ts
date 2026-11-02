import mekitsa1 from "@/assets/mekitsa-single.jpg";
import mekitsi3 from "@/assets/hero-mekitsi.jpg";
import mekitsi20 from "@/assets/mekitsi-plate.jpg";
import pirozhki from "@/assets/pirozhki-set.jpg";
import buhti from "@/assets/buhti.jpg";

// PLACEHOLDER contact details — replace with the real ones.
export const BUSINESS = {
  name: "Майстори Пекари",
  phone: "+359 88 812 3456",
  phoneHref: "tel:+359888123456",
  viber: "viber://chat?number=%2B359888123456",
  email: "zdravei@maistoripekari.bg",
  address: { bg: "ж.к. Младост 4, бл. 459, София", en: "Mladost 4, bl. 459, Sofia" },
  facebook: "https://facebook.com/",
  mapSrc:
    "https://www.google.com/maps?q=%D0%9C%D0%BB%D0%B0%D0%B4%D0%BE%D1%81%D1%82+4+%D0%B1%D0%BB.+459+%D0%A1%D0%BE%D1%84%D0%B8%D1%8F&output=embed",
};

/** Hero video slot: drop a 5–8 s muted clip at public/videos/mekitsi-frying.mp4 and set this path. */
export const HERO_VIDEO_SRC = "";

export type Product = {
  id: string;
  name: { bg: string; en: string };
  desc: { bg: string; en: string };
  price: number; // EUR
  bgn: number; // BGN shown smaller
  image: string;
  weight: { bg: string; en: string };
  allergens: ("gluten" | "eggs" | "milk")[];
  isMekitsa?: boolean;
};

export const PRODUCTS: Product[] = [
  { id: "mekitsa1", name: { bg: "Мекица 1 бр.", en: "Mekitsa ×1" }, desc: { bg: "Гореща, току-що изпържена", en: "Hot, freshly fried" }, price: 1.38, bgn: 2.7, image: mekitsa1, weight: { bg: "100 г.", en: "100 g" }, allergens: ["gluten", "eggs", "milk"], isMekitsa: true },
  { id: "mekitsi3", name: { bg: "Мекици 3 бр.", en: "Mekitsi ×3" }, desc: { bg: "Със сладко, сирене и пудра захар", en: "With jam, white cheese and powdered sugar" }, price: 5.36, bgn: 10.48, image: mekitsi3, weight: { bg: "500 г.", en: "500 g" }, allergens: ["gluten", "eggs", "milk"] },
  { id: "mekitsi20", name: { bg: "Мекици 20 бр.", en: "Mekitsi ×20" }, desc: { bg: "Със сладко, сирене и пудра захар", en: "With jam, white cheese and powdered sugar" }, price: 27.6, bgn: 53.98, image: mekitsi20, weight: { bg: "2,5 кг.", en: "2.5 kg" }, allergens: ["gluten", "eggs", "milk"] },
  { id: "pirozhki3", name: { bg: "Пирожки 3 бр.", en: "Pirozhki ×3" }, desc: { bg: "Със сирене. Съдържа: брашно, яйца, мляко, сирене", en: "With white cheese. Contains: flour, eggs, milk, cheese" }, price: 5.87, bgn: 11.48, image: pirozhki, weight: { bg: "450 г.", en: "450 g" }, allergens: ["gluten", "eggs", "milk"] },
  { id: "buhti", name: { bg: "Солени бухти", en: "Savoury buhti" }, desc: { bg: "С извара, сирене и кашкавал", en: "With curd cheese, white cheese and kashkaval" }, price: 5.11, bgn: 9.99, image: buhti, weight: { bg: "150 г.", en: "150 g" }, allergens: ["gluten", "eggs", "milk"] },
];

// PLACEHOLDER reviews — replace with real customer reviews.
export const REVIEWS = [
  { name: "Мария П.", text: { bg: "Мекиците са точно като на баба ми!", en: "The mekitsi taste just like my grandma's!" } },
  { name: "Георги Д.", text: { bg: "Горещи и хрупкави всяка сутрин.", en: "Hot and crispy every morning." } },
  { name: "Елена К.", text: { bg: "Поръчах за офиса – всички питаха откъде са.", en: "Ordered for the office – everyone asked where they were from." } },
];

export const fmt = (n: number) => n.toFixed(2).replace(".", ",") + " €";
export const fmtBgn = (n: number) => n.toFixed(2).replace(".", ",") + " лв.";
