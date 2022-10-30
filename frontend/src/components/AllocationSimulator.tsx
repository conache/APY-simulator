import React, { useCallback, useEffect, useState } from "react";

import StrategyTableRow, { IAssetStrategy } from "./StrategyTableRow";
import SimulationBreakdown, { ISimualtionBreakdown } from "../components/SimulationBreakdown";
import { DEFAULT_ALLOCATION_PROPOSAL, SUPPORTED_ASSETS, SUPPORTED_PROTOCOLS } from "../constants";
import { IAllocationProposal } from "../types";
import { requestSimulation } from "../api/simulation";

import classes from "./AllocationSimulator.module.css";

function AllocationSimulator() {
  const [allocationProposal, setAllocationProposal] = useState<IAllocationProposal>(DEFAULT_ALLOCATION_PROPOSAL);
  const [simulationBreakdown, setSimulationBreakdown] = useState<ISimualtionBreakdown | null>(null);

  const shouldRunSimulation = useCallback(() => {
    for (let allocation of Object.values(allocationProposal)) {
      const totalPercentage = (Object.values(allocation) as Array<number>).reduce((acc, curr) => acc + curr, 0);
      if (totalPercentage !== 100) {
        return false;
      }
    }

    return true;
  }, [allocationProposal]);

  useEffect(() => {
    const runSimulation = async () => {
      const result = await requestSimulation(allocationProposal);
      setSimulationBreakdown(result);
    };

    if (shouldRunSimulation()) {
      runSimulation();
    }
  }, [allocationProposal, shouldRunSimulation]);

  return (
    <>
      <h2>Allocation proposal simulator</h2>
      <table className={classes.inputTable}>
        <thead>
          <tr>
            <th>Strategy</th>
            {SUPPORTED_PROTOCOLS.map((protocol) => (
              <th key={protocol}>{protocol}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {SUPPORTED_ASSETS.map((asset) => (
            <StrategyTableRow
              key={asset}
              asset={asset}
              onChange={(newStrategy: IAssetStrategy) =>
                setAllocationProposal({
                  ...allocationProposal,
                  [asset]: newStrategy,
                })
              }
            />
          ))}
        </tbody>
      </table>
      {simulationBreakdown && <SimulationBreakdown {...simulationBreakdown} />}
    </>
  );
}

export default AllocationSimulator;
