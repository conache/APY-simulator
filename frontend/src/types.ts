export interface IAssetAllocation {
  aave: number;
  compound: number;
  convex: number;
}

export enum EAsset {
  DAI = "dai",
  USDC = "usdc",
  USDT = "usdt",
}

export interface IAllocationProposal {
  [EAsset.DAI]: IAssetAllocation;
  [EAsset.USDC]: IAssetAllocation;
  [EAsset.USDT]: IAssetAllocation;
}
