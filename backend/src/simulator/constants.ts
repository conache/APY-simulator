import { Asset, CollateralStrategy, EAsset, PoolStrategy } from "./types";

export const URLS = {
  ANALYTICS_APY_PAGE: "https://analytics.ousd.com/apy",
  ANALYTICS_HOME_PAGE: "https://analytics.ousd.com",
  AAVE_DATA_URL: "https://aave-api-v2.aave.com/data/markets-data",
  COMPOUND_DATA_URL: "https://api.compound.finance/api/v2/ctoken",
};

export const ASSETS: Array<Asset> = ["dai", "usdc", "usdt"];

export const SUPPORTED_PROTOCOLS: Array<CollateralStrategy | PoolStrategy> = ["aave", "compound", "convex"];

export const DEFAULT_ALLOCATION_PROPOSAL = {
  [EAsset.DAI]: {
    aave: 0,
    compound: 0,
    convex: 0,
  },
  [EAsset.USDC]: {
    aave: 0,
    compound: 0,
    convex: 0,
  },
  [EAsset.USDT]: {
    aave: 0,
    compound: 0,
    convex: 0,
  },
};
