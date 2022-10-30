import React, { useState } from "react";

import classes from "./OptimalAllocationSimulator.module.css";

import { requestSimulation } from "../api/simulation";
import { IAllocationProposal } from "../types";

import ProposalBreakdown from "./ProposalBreakdown";
import SimulationBreakdown, { ISimualtionBreakdown } from "./SimulationBreakdown";

type OptimalAllocation = ISimualtionBreakdown & { proposal: IAllocationProposal };

const OptimalAllocationSimulator = () => {
  const [optimalAllocation, setOptimalAllocation] = useState<OptimalAllocation | null>(null);

  const handleButtonClick = async () => {
    const result = await requestSimulation();
    setOptimalAllocation(result);
  };

  return (
    <>
      <h2>Optimal strategy</h2>
      <button className={classes.requestBtn} onClick={handleButtonClick}>
        Get optimal strategy
      </button>
      {optimalAllocation && (
        <div className={classes.breakdownContainer}>
          <ProposalBreakdown proposal={optimalAllocation.proposal} />
          <SimulationBreakdown projectedAPY={optimalAllocation.projectedAPY} simulationBreakdown={optimalAllocation.simulationBreakdown} />
        </div>
      )}
    </>
  );
};

export default OptimalAllocationSimulator;
