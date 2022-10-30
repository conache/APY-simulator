import inputValidationSchema from "../validationSchema";
import { getStrategyTokenName } from "./helpers";
import { AllocationProposal, Asset, CollateralStrategy, ECollateralStrategy, Strategy } from "./types";
import { ASSETS, DEFAULT_ALLOCATION_PROPOSAL, SUPPORTED_PROTOCOLS } from "./constants";
import { totalSupply, boostMultiplier, assetSupply, apyPerStrategy } from "./dataLoader";

function computeOptimalProposal() {
  const optimalProposal = DEFAULT_ALLOCATION_PROPOSAL;

  for (let asset of ASSETS) {
    const apySortedStrategies = SUPPORTED_PROTOCOLS.map((protocol) => {
      const strategyToken = getStrategyTokenName(protocol, asset);
      const { totalAPY } = apyPerStrategy[strategyToken];

      return {
        strategyToken,
        totalAPY,
        protocol,
      };
    }).sort((a, b) => b.totalAPY - a.totalAPY);
    const highestAPYOption = apySortedStrategies[0];

    optimalProposal[asset][highestAPYOption.protocol] = 1;
  }

  return optimalProposal;
}

function formatProposalObject(allocationProposal: Object): AllocationProposal {
  const formattedProposal: any = {};

  for (let [asset, proposalDetails] of Object.entries(allocationProposal)) {
    const formattedProposalDetails: any = {};
    for (let [protocol, percentage] of Object.entries(proposalDetails as { [key: string]: number })) {
      formattedProposalDetails[protocol] = percentage / 100;
    }
    formattedProposal[asset] = formattedProposalDetails;
  }

  return formattedProposal;
}

function getCollateralStrategyAPY(strategy: CollateralStrategy, proposal: AllocationProposal) {
  return ASSETS.map((asset: Asset) => {
    const strategyToken: Strategy = getStrategyTokenName(strategy, asset);
    const boostedAPY = apyPerStrategy[strategyToken].totalAPY * boostMultiplier;
    const strategyAllocation = proposal[asset][strategy] * assetSupply[asset].allocation;

    return {
      strategyToken: strategyToken,
      allocation: strategyAllocation,
      amount: strategyAllocation * assetSupply[asset].amount,
      apy: apyPerStrategy[strategyToken].baseAPY,
      boostedAPY: boostedAPY,
      weightedAPY: strategyAllocation * boostedAPY,
    };
  });
}

function getConvexAPY(proposal: AllocationProposal) {
  const strategyName: Strategy = "convex3pool";
  const boostedAPY = apyPerStrategy[strategyName].totalAPY * boostMultiplier;

  const allocatedAmount = ASSETS.map((asset) => proposal[asset].convex * assetSupply[asset].amount).reduce((acc, currentVal) => acc + currentVal, 0);
  const strategyAllocation = allocatedAmount / totalSupply;

  return {
    strategyToken: strategyName,
    allocation: strategyAllocation,
    amount: allocatedAmount,
    apy: apyPerStrategy[strategyName].totalAPY,
    boostedAPY: boostedAPY,
    weightedAPY: strategyAllocation * boostedAPY,
  };
}

function computeProjectedAPY(proposal: AllocationProposal) {
  const simulationBreakdown = [
    ...getCollateralStrategyAPY(ECollateralStrategy.AAVE, proposal),
    ...getCollateralStrategyAPY(ECollateralStrategy.COMPOUND, proposal),
    getConvexAPY(proposal),
  ];
  const projectedAPY = simulationBreakdown.map((item) => item.weightedAPY).reduce((acc, curr) => acc + curr, 0);

  return {
    projectedAPY,
    simulationBreakdown,
  };
}

export function getProjectedAPY(allocationProposal?: Object) {
  let proposal = DEFAULT_ALLOCATION_PROPOSAL;

  if (!allocationProposal) {
    proposal = computeOptimalProposal();
  } else {
    const { error } = inputValidationSchema.allocationProposalValidatior.validate(allocationProposal);

    if (error?.details.length) {
      throw new Error(error.details[0].message);
    }

    proposal = formatProposalObject(allocationProposal);
  }

  return {
    proposal,
    ...computeProjectedAPY(proposal),
  };
}
