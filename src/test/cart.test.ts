import { describe, expect, it } from "vitest";
import { cartTotal } from "@/lib/cart";
import { PRODUCTS } from "@/lib/bakery";
import { isFreeOrder, isOpenAt, slotsFor, sofiaToIso } from "@/lib/hours";

const p = (id: string) => PRODUCTS.find((x) => x.id === id)!;

describe("real menu prices", () => {
  it("has exactly the five real products with EUR and BGN prices", () => {
    expect(PRODUCTS.map((x) => [x.id, x.price, x.bgn])).toEqual([
      ["mekitsa1", 1.38, 2.7],
      ["mekitsi3", 5.36, 10.48],
      ["mekitsi20", 27.6, 53.98],
      ["pirozhki3", 5.87, 11.48],
      ["buhti", 5.11, 9.99],
    ]);
  });
  it("sums 2× мекици 20 бр. and 1× солени бухти", () => {
    expect(cartTotal([{ product: p("mekitsi20"), qty: 2 }, { product: p("buhti"), qty: 1 }])).toBe(60.31);
  });
});

describe("pickup slots", () => {
  it("offers 15-minute slots within Monday hours 06:30–19:00", () => {
    const s = slotsFor("2030-01-07", new Date("2029-12-31T00:00:00Z"));
    expect(s[0]).toBe("06:30");
    expect(s[1]).toBe("06:45");
    expect(s.at(-1)).toBe("18:45");
  });
  it("only offers today's slots at least 15 minutes ahead", () => {
    // 10:05 Sofia time (UTC+2 in winter) on Monday 2030-01-07
    const s = slotsFor("2030-01-07", new Date("2030-01-07T08:05:00Z"));
    expect(s[0]).toBe("10:30");
  });
  it("converts Sofia time to UTC", () => {
    expect(sofiaToIso("2030-01-07", "07:00")).toBe("2030-01-07T05:00:00.000Z");
  });
});

describe("open status", () => {
  it("is open Sunday 08:00 and closed Sunday 13:30 Sofia time", () => {
    expect(isOpenAt(new Date("2030-01-06T06:00:00Z"))).toBe(true);
    expect(isOpenAt(new Date("2030-01-06T11:30:00Z"))).toBe(false);
  });
});

describe("stamp card", () => {
  it("gives a free мекица on every 10th order only", () => {
    expect(isFreeOrder(9)).toBe(false);
    expect(isFreeOrder(10)).toBe(true);
    expect(isFreeOrder(20)).toBe(true);
  });
});
