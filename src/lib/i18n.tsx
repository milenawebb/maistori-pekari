import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "bg" | "en";

const dict = {
  bg: {
    nav: { home: "Начало", menu: "Меню", catering: "За офиса", contacts: "Контакти" },
    call: "Обади се", order: "Поръчай", cart: "Количка",
    open: "Отворено сега", closed: "Затворено", fresh: "Пресни мекици излязоха в", freshShort: "пресни в",
    allergens: { label: "Алергени", gluten: "Глутен", eggs: "Яйца", milk: "Мляко", nuts: "Ядки", sesame: "Сусам" },
    tags: { gf: "Без глутен", vegan: "Веган", seasonal: "Сезонен" },
    hero: { kicker: "Закусвалня · Младост 4", title: "Горещи мекици, всяка сутрин", sub: "Пържим ги пред вас от ранни зори – хрупкави отвън, пухкави отвътре. Със сладко, сирене и пудра захар.", cta: "Вземи без опашка", cta2: "Закуска за офиса" },
    trust: ["Приготвено на място", "Без добавки и консерванти", "Вземи без опашка", "Срещу Бизнес Парк София"],
    story: { k: "За нас", t: "Вкусът на детството и закуската при мама и баба", p: "Специализирани сме в приготвянето на едновремешни мекици, пирожки и понички – занаят, който изчезва. Нашите пекари и сладкари приготвят всичко на място, с качествени продукти и много любов – само пресни изделия, без добавки и консерванти. Съчетаваме традиционни рецепти със съвременни техники, а екипът ни винаги ще ви помогне да изберете най-доброто за вас и семейството ви. Намираме се в оживения Младост 4, бл. 459, срещу Бизнес Парк – чудесно място за кратка вкусна почивка." },
    menu: { title: "Менюто", sub: "Всичко се приготвя на място от нашите пекари и сладкари – само пресни продукти, без добавки и консерванти.", add: "Добави", all: "Всички", search: "Търси в менюто…", none: "Няма намерени продукти.", onRequest: "По запитване", gallery: "Галерия", loved: "Най-обичани", full: "Цялото меню" },
    reviewsPlaceholder: "Примерни отзиви – ще бъдат заменени с истински",
    visit: "Заповядайте",
    hours: { title: "Работно време", days: ["Неделя", "Понеделник", "Вторник", "Сряда", "Четвъртък", "Петък", "Събота"] },
    pre: {
      title: "Предварителна поръчка", badge: "Вземи без опашка", lead: "Поръчай сега, мини през гишето и вземи горещата си поръчка – без чакане.",
      yours: "Твоята поръчка", empty: "Още нищо не си избрал.", total: "Общо", day: "Ден", time: "Час за вземане", name: "Име", phone: "Телефон", notes: "Бележки",
      today: "Днес", tomorrow: "Утре", submit: "Поръчай за вземане", sending: "Изпращане…", noSlots: "Няма свободни часове",
      thanks: "Готово,", ready: "Поръчката ти ще е гореща и готова в", on: "за", payAtPickup: "Плащаш при вземане.", another: "Нова поръчка",
      stampTitle: "Карта за печати", stampOf: "печата от 10", freeNow: "Тази поръчка е 10-та – получаваш безплатна мекица!", stampHint: "Всяка поръчка за вземане = 1 печат. 10-тата поръчка носи безплатна мекица.",
      errors: { name: "Въведете име", phone: "Невалиден телефон", time: "Изберете час", slot: "Този час вече не е свободен – изберете друг.", generic: "Нещо се обърка. Опитайте пак или ни се обадете." },
    },
    office: {
      kicker: "Точно до Бизнес Парк София", title: "Петъчна закуска за офиса", sub: "Всяка седмица горещи мекици и пирожки за целия екип – доставени до офиса, без да мислите за това.",
      formTitle: "Абонамент за седмична закуска", company: "Фирма", contact: "Лице за контакт", phone: "Телефон", email: "Имейл", people: "Брой хора", day: "Ден за доставка", address: "Адрес в Бизнес Парк София", notes: "Бележки",
      days: { monday: "Понеделник", tuesday: "Вторник", wednesday: "Сряда", thursday: "Четвъртък", friday: "Петък" },
      submit: "Заяви абонамент", sent: "Абонаментът е заявен!", sentSub: "Ще се свържем с вас, за да уточним менюто и часа.",
      perks: ["Доставка до офиса всяка седмица", "Пресни, пържени същата сутрин", "Фактура за фирмата", "Спирате, когато пожелаете"],
      err: "Проверете полетата", addrPh: "напр. Сграда 8, ет. 3",
    },
    contacts: { title: "Контакти", viber: "Пишете ни във Viber" },
    footer: "Едновремешни мекици, пирожки и бухти – пържени всяка сутрин.",
  },
  en: {
    nav: { home: "Home", menu: "Menu", catering: "For offices", contacts: "Contact" },
    call: "Call", order: "Order", cart: "Cart",
    open: "Open now", closed: "Closed", fresh: "Fresh mekitsi out at", freshShort: "fresh at",
    allergens: { label: "Allergens", gluten: "Gluten", eggs: "Eggs", milk: "Milk", nuts: "Nuts", sesame: "Sesame" },
    tags: { gf: "Gluten-free", vegan: "Vegan", seasonal: "Seasonal" },
    hero: { kicker: "Breakfast bar · Mladost 4", title: "Hot mekitsi, every morning", sub: "Fried in front of you from dawn – crispy outside, fluffy inside. With jam, white cheese and powdered sugar.", cta: "Skip the queue", cta2: "Office breakfast" },
    trust: ["Made on site", "No additives or preservatives", "Skip the queue", "Opposite Business Park Sofia"],
    story: { k: "About us", t: "The taste of childhood and breakfast at mum's and grandma's", p: "We specialise in old-fashioned mekitsi, pirozhki and doughnuts – a craft that is disappearing. Our bakers and pastry chefs make everything on site, with quality ingredients and a lot of love – only fresh products, no additives or preservatives. We combine traditional recipes with modern techniques, and our team is always happy to help you choose the best for you and your family. Find us in busy Mladost 4, bl. 459, opposite Business Park – a great spot for a short, tasty break." },
    menu: { title: "The menu", sub: "Everything is made on site by our bakers and pastry chefs – only fresh products, no additives or preservatives.", add: "Add", all: "All", search: "Search the menu…", none: "No products found.", onRequest: "On request", gallery: "Gallery", loved: "Most loved", full: "Full menu" },
    reviewsPlaceholder: "Sample reviews – to be replaced with real ones",
    visit: "Come by",
    hours: { title: "Opening hours", days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
    pre: {
      title: "Pre-order", badge: "Skip the queue", lead: "Order now, stop by the counter and grab your hot order – no waiting.",
      yours: "Your order", empty: "Nothing picked yet.", total: "Total", day: "Day", time: "Pickup time", name: "Name", phone: "Phone", notes: "Notes",
      today: "Today", tomorrow: "Tomorrow", submit: "Order for pickup", sending: "Sending…", noSlots: "No slots available",
      thanks: "Done,", ready: "Your order will be hot and ready at", on: "·", payAtPickup: "Pay at pickup.", another: "New order",
      stampTitle: "Stamp card", stampOf: "of 10 stamps", freeNow: "This is your 10th order – you get a free mekitsa!", stampHint: "Every pickup order = 1 stamp. Your 10th order comes with a free mekitsa.",
      errors: { name: "Enter your name", phone: "Invalid phone", time: "Pick a time", slot: "That time is no longer available – pick another.", generic: "Something went wrong. Try again or give us a call." },
    },
    office: {
      kicker: "Right next to Business Park Sofia", title: "Friday office breakfast", sub: "Hot mekitsi and pirozhki for the whole team every week – delivered to your office, no thinking required.",
      formTitle: "Weekly breakfast subscription", company: "Company", contact: "Contact person", phone: "Phone", email: "Email", people: "Number of people", day: "Delivery day", address: "Address in Business Park Sofia", notes: "Notes",
      days: { monday: "Monday", tuesday: "Tuesday", wednesday: "Wednesday", thursday: "Thursday", friday: "Friday" },
      submit: "Request subscription", sent: "Subscription requested!", sentSub: "We'll get in touch to agree on the menu and time.",
      perks: ["Weekly delivery to your office", "Fresh, fried the same morning", "Company invoice", "Stop any time"],
      err: "Please check the fields", addrPh: "e.g. Building 8, floor 3",
    },
    contacts: { title: "Contact", viber: "Message us on Viber" },
    footer: "Old-school mekitsi, pirozhki and buhti – fried every morning.",
  },
};

export type Dict = (typeof dict)["bg"];
const Ctx = createContext<{ lang: Lang; t: Dict; setLang: (l: Lang) => void }>({ lang: "bg", t: dict.bg, setLang: () => {} });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("bg");
  useEffect(() => {
    const s = localStorage.getItem("mp-lang");
    if (s === "en" || s === "bg") setLangState(s);
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  const setLang = (l: Lang) => {
    localStorage.setItem("mp-lang", l);
    setLangState(l);
  };
  return <Ctx.Provider value={{ lang, t: dict[lang] as Dict, setLang }}>{children}</Ctx.Provider>;
}

export const useI18n = () => useContext(Ctx);
