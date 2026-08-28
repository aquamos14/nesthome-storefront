import { CURRENCY } from "./products";

/** 人民币格式化：¥1,299（整数不显示小数，更清爽） */
export function formatPrice(value: number): string {
  const n = Math.round(value);
  return (
    "¥" +
    n.toLocaleString("zh-CN", { maximumFractionDigits: 0 })
  );
}

export function formatPriceCents(value: number): string {
  return formatPrice(value);
}

export { CURRENCY };
