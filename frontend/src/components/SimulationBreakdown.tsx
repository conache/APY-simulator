import React from "react";

import { formattedPercentage, formattedUsdAmount } from "../utils";
import classes from "./SimulationBreakdown.module.css";

interface IBreakdownItem {
  strategyToken: string;
  allocation: number;
  amount: number;
  apy: number;
  boostedAPY: number;
  weightedAPY: number;
}

export interface ISimualtionBreakdown {
  projectedAPY: number;
  simulationBreakdown: IBreakdownItem[];
}

const SimulationBreakdown = ({ projectedAPY, simulationBreakdown }: ISimualtionBreakdown) => (
  <div className={classes.containter}>
    <table className={classes.breakdownTable}>
      <thead>
        <tr>
          <th>Strategy</th>
          <th>% allocation</th>
          <th>Amount</th>
          <th>APY</th>
          <th>Base APY</th>
          <th>Weighted APY</th>
        </tr>
      </thead>
      <tbody>
        {simulationBreakdown.map((strategyBreakdown: IBreakdownItem) => (
          <tr key={strategyBreakdown.strategyToken}>
            <td>{strategyBreakdown.strategyToken}</td>
            <td>{formattedPercentage(strategyBreakdown.allocation)}</td>
            <td>{formattedUsdAmount(strategyBreakdown.amount)}</td>
            <td>{formattedPercentage(strategyBreakdown.apy)}</td>
            <td>{formattedPercentage(strategyBreakdown.boostedAPY)}</td>
            <td>{formattedPercentage(strategyBreakdown.weightedAPY)}</td>
          </tr>
        ))}
      </tbody>
    </table>
    <div className={classes.projectedApy}>Projected APY: {formattedPercentage(projectedAPY)}</div>
  </div>
);

export default SimulationBreakdown;
