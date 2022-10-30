export const formattedPercentage = (value: number) => `${(value * 100).toFixed(2)}%`;

export const formattedUsdAmount = (value: number) =>
  Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
