import mekitsi from "@/assets/mekitsi.jpg";
import banitsa from "@/assets/banitsa.jpg";
import pirozhki from "@/assets/pirozhki.jpg";
import donuts from "@/assets/donuts.jpg";
import bread from "@/assets/bread.jpg";
import yogurt from "@/assets/yogurt.jpg";

export const BUSINESS = {
  name: "Майстори Пекари",
  phone: "+359 88 812 3456",
  phoneHref: "tel:+359888123456",
  viber: "viber://chat?number=%2B359888123456",
  email: "zdravei@maistoripekari.bg",
  address: "ж.к. Младост 4, бл. 459, София",
  facebook: "https://facebook.com/",
  hours: [
    ["Понеделник – Петък", "06:30 – 19:00"],
    ["Събота", "07:00 – 16:00"],
    ["Неделя", "07:30 – 13:00"],
  ],
  mapSrc:
    "https://www.google.com/maps?q=%D0%9C%D0%BB%D0%B0%D0%B4%D0%BE%D1%81%D1%82+4+%D0%B1%D0%BB.+459+%D0%A1%D0%BE%D1%84%D0%B8%D1%8F&output=embed",
};

export type Product = {
  id: string;
  name: string;
  desc: string;
  price: number;
  image: string;
  category: string;
  bestseller?: boolean;
};

export const CATEGORIES: string[] = [
  "Мекици и бухтички",
  "Баници",
  "Пирожки и закуски",
  "Понички и сладки",
  "Хляб",
  "Млечни продукти",
];

export const PRODUCTS: Product[] = [
  { id: "mekitsi20", name: "Мекици 20 бр.", desc: "Със сладко, сирене и пудра захар", price: 27.61, image: mekitsi, category: CATEGORIES[0]!, bestseller: true },
  { id: "buhti8", name: "Солени бухти 8 бр.", desc: "Пухкави, като от баба", price: 5.11, image: mekitsi, category: CATEGORIES[0]!, bestseller: true },
  { id: "mekitsi5", name: "Мекици 5 бр.", desc: "С пудра захар", price: 6.9, image: mekitsi, category: CATEGORIES[0]! },
  { id: "banitsa-cheese", name: "Баница със сирене", desc: "Точена, с фермерско сирене – тава 1 кг", price: 12.5, image: banitsa, category: CATEGORIES[1]!, bestseller: true },
  { id: "banitsa-spinach", name: "Баница със спанак", desc: "Със спанак и сирене – тава 1 кг", price: 13.2, image: banitsa, category: CATEGORIES[1]! },
  { id: "banitsa-slice", name: "Баница – парче", desc: "Прясна, всяка сутрин", price: 1.8, image: banitsa, category: CATEGORIES[1]! },
  { id: "pirozhki6", name: "Пирожки 6 бр.", desc: "С кайма, картофи или сирене", price: 7.4, image: pirozhki, category: CATEGORIES[2]!, bestseller: true },
  { id: "pirozhki-cheese", name: "Пирожка със сирене", desc: "Пържена, златиста", price: 1.4, image: pirozhki, category: CATEGORIES[2]! },
  { id: "ponichki10", name: "Понички 10 бр.", desc: "Едновремешни, със захар", price: 8.6, image: donuts, category: CATEGORIES[3]!, bestseller: true },
  { id: "ponichka-jam", name: "Поничка със сладко", desc: "С домашно сладко от вишни", price: 1.3, image: donuts, category: CATEGORIES[3]! },
  { id: "sourdough", name: "Хляб с квас", desc: "Био брашно, 24 ч ферментация – 800 г", price: 4.9, image: bread, category: CATEGORIES[4]!, bestseller: true },
  { id: "rye", name: "Ръжен хляб", desc: "Пълнозърнест, с квас – 600 г", price: 4.2, image: bread, category: CATEGORIES[4]! },
  { id: "yogurt", name: "Кисело мляко", desc: "С жива закваска, в глинено гърне – 500 г", price: 3.8, image: yogurt, category: CATEGORIES[5]! },
  { id: "cheese", name: "Фермерско сирене", desc: "Краве сирене от ферма – 400 г", price: 6.5, image: yogurt, category: CATEGORIES[5]! },
];

export const REVIEWS = [
  { name: "Мария П.", text: "Мекиците са точно като на баба ми! Всяка събота сме тук с децата." },
  { name: "Георги Д.", text: "Най-хубавата баница в Младост. Хрупкава и с истинско сирене." },
  { name: "Елена К.", text: "Поръчах закуски за офиса – всички питаха откъде са. Ще поръчаме пак." },
  { name: "Иван Т.", text: "Хлябът с квас е уникален. Личи си, че е с качествено брашно." },
  { name: "Десислава М.", text: "Топло, уютно и винаги усмихнати. Пирожките са любими!" },
];

export const fmt = (n: number) => n.toFixed(2).replace(".", ",") + " €";
