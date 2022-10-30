import { AssetSupply, EAsset, ECollateralStrategy, Strategy, StrategyAPYData } from "./types";
import { getStrategyTokenName, requestXPathData } from "./helpers";
import { ASSETS, URLS } from "./constants";
import axios from "axios";

export let totalSupply = 0;

export let boostMultiplier = 0;

export let assetSupply: AssetSupply = {
  [EAsset.DAI]: {
    amount: 0,
    allocation: 0,
  },
  [EAsset.USDC]: {
    amount: 0,
    allocation: 0,
  },
  [EAsset.USDT]: {
    amount: 0,
    allocation: 0,
  },
};

export let apyPerStrategy: { [key in Strategy]: StrategyAPYData } = {
  adai: {
    baseAPY: 0,
    rewardAPY: 0,
    totalAPY: 0,
  },
  ausdc: {
    baseAPY: 0,
    rewardAPY: 0,
    totalAPY: 0,
  },
  ausdt: {
    baseAPY: 0,
    rewardAPY: 0,
    totalAPY: 0,
  },
  cdai: {
    baseAPY: 0.00859055820691312,
    rewardAPY: 0.00774358083848115,
    totalAPY: 0.01633413904539427,
  },
  cusdc: {
    baseAPY: 0.0082315940231349,
    rewardAPY: 0.00490967757739069,
    totalAPY: 0.01314127160052559,
  },
  cusdt: {
    baseAPY: 0.0169711055644192,
    rewardAPY: 0.00188733298448085,
    totalAPY: 0.01885843854890005,
  },
  convex3pool: {
    baseAPY: 0.0089,
    rewardAPY: 0.0084,
    totalAPY: 0.0173,
  },
};

export async function refreshStrategiesData() {
  console.log("🏗 Loading strategies data...");
  // GET BOOST MULTIPLIER
  const displayedBoostMultiplier = (await requestXPathData(URLS.ANALYTICS_APY_PAGE, ["/html/body/div[2]/table//tr[2]/td[3]"]))[0];
  boostMultiplier = parseFloat(displayedBoostMultiplier.slice(0, -1));

  // GET TOTAL SUPPLY
  totalSupply = (
    await requestXPathData(URLS.ANALYTICS_HOME_PAGE, [
      "/html/body/div[2]/div[3]/div[3]/div[2]/span",
      "/html/body/div[2]/div[3]/div[3]/div[4]/span",
      "/html/body/div[2]/div[3]/div[3]/div[3]/span",
      "/html/body/div[2]/div[3]/div[1]/div[2]/span",
      "/html/body/div[2]/div[3]/div[1]/div[4]/span",
      "/html/body/div[2]/div[3]/div[1]/div[3]/span",
      "/html/body/div[2]/div[2]/div[2]/div[3]/span",
    ])
  )
    .map((holdingAmountStr) => parseFloat(holdingAmountStr.split(",").join("")))
    .reduce((acc, curr) => acc + curr, 0);

  // GET ASSET SUPPLY DATA
  const queries = ASSETS.map((asset) => `/html/body/div[2]/div[2]/div[1]/div[contains(string(), "${asset.toUpperCase()}")]/span`);
  (await requestXPathData(URLS.ANALYTICS_HOME_PAGE, queries))
    .map((amountStr) => parseFloat(amountStr.split(",").join("")))
    .forEach((amount, idx) => {
      assetSupply[ASSETS[idx]] = {
        amount,
        allocation: amount / totalSupply,
      };
    });

  // GET STRATEGIES APY DATA
  const aaveData = await axios.get(URLS.AAVE_DATA_URL).then((res) => {
    return res.data;
  });

  for (let asset of ASSETS) {
    const aaveCollateralToken = getStrategyTokenName(ECollateralStrategy.AAVE, asset);
    const tokenData = aaveData.reserves.find((entry: any) => entry.symbol.toLowerCase() === aaveCollateralToken);

    apyPerStrategy[aaveCollateralToken] = {
      baseAPY: parseFloat(tokenData.liquidityRate),
      rewardAPY: parseFloat(tokenData.aIncentivesAPY),
      totalAPY: parseFloat(tokenData.liquidityRate) + parseFloat(tokenData.aIncentivesAPY),
    };
  }
}
