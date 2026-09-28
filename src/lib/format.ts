/** Format a naira amount, e.g. 18500 -> "₦18,500" */
export function ngn(amount: number): string {
  const rounded = Math.round(amount);
  return "₦" + rounded.toLocaleString("en-NG");
}
