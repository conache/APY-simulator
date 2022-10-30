import axios from "axios";
import xpath from "xpath";
import xmldom from "xmldom";

import { Asset, CollateralStrategy, ECollateralStrategy, EPoolStrategy, PoolStrategy, Strategy } from "./types";

export async function requestXPathData(url: string, queries: string[]): Promise<string[]> {
  const response = await axios.get(url);
  const html = response.data;

  const document = new xmldom.DOMParser({
    locator: {},
    errorHandler: {
      warning: () => {},
      error: () => {},
      fatalError: function (e) {
        console.error(e);
      },
    },
  }).parseFromString(html, "application/xhtml+xml");

  return queries.map((xpathQuery) => {
    const nodes = xpath.select(xpathQuery, document);
    return (nodes[0] as any).firstChild.data;
  });
}

export function getStrategyTokenName(strategy: CollateralStrategy | PoolStrategy, asset: Asset): Strategy {
  switch (strategy) {
    case ECollateralStrategy.AAVE:
      return `a${asset}`;
    case ECollateralStrategy.COMPOUND:
      return `c${asset}`;
    case EPoolStrategy.CONVEX:
      return "convex3pool";
    default:
      throw new Error(`Collateral strategy '${strategy}' not supported`);
  }
}

export const toDisplayPercentage = (num: number) => parseFloat((num * 100).toFixed(2));
