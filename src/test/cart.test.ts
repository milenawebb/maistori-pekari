import { describe, expect, it } from "vitest";
import { cartTotal } from "@/lib/cart";
import { PRODUCTS } from "@/lib/bakery";
describe("cart total", () => {
  it("sums mekitsi 20 бр. (27,61 €) x2 and солени бухти (5,11 €)", () => {
    const m = PRODUCTS.find((p) => p.id === "mekitsi20")!;
    const b = PRODUCTS.find((p) => p.id === "buhti8")!;
    expect(cartTotal([{ product: m, qty: 2 }, { product: b, qty: 1 }])).toBe(60.33);
  });
});
