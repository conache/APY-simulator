export type Asset = "dai" | "usdc" | "usdt";

export enum EAsset {
  DAI = "dai",
  USDC = "usdc",
  USDT = "usdt",
}

export type Strategy = "adai" | "ausdc" | "ausdt" | "cdai" | "cusdc" | "cusdt" | "convex3pool";

export type CollateralStrategy = "aave" | "compound";

export enum ECollateralStrategy {
  AAVE = "aave",
  COMPOUND = "compound",
}

export type PoolStrategy = "convex";

export enum EPoolStrategy {
  CONVEX = "convex",
}

export type AssetAllocation = {
  aave: number;
  compound: number;
  convex: number;
};

export type AllocationProposal = { [key in Asset]: AssetAllocation };

export type AssetSupply = {
  [key in Asset]: {
    amount: number;
    allocation: number;
  };
};

export type StrategyAPYData = {
  baseAPY?: number;
  rewardAPY?: number;
  totalAPY: number;
};
