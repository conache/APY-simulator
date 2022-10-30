import { EAsset } from "./types";

export const SUPPORTED_ASSETS = ["dai", "usdc", "usdt"];

export const SUPPORTED_PROTOCOLS = ["aave", "compound", "convex"];

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

export const API_URL = {
  simulate: "http://localhost:8080/simulate",
};
