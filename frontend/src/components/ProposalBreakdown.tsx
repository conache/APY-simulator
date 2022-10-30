import React from "react";

import { SUPPORTED_PROTOCOLS } from "../constants";
import { IAllocationProposal } from "../types";
import { formattedPercentage } from "../utils";
import classes from "./ProposalBreakdown.module.css";

interface IProposalBreakdown {
  proposal: IAllocationProposal;
}

const ProposalBreakdown = ({ proposal }: IProposalBreakdown) => (
  <table className={classes.breakdownTable}>
    <thead>
      <tr>
        <th>Strategy</th>
        {SUPPORTED_PROTOCOLS.map((protocol) => (
          <th>{protocol}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {Object.entries(proposal).map(([asset, allocation]) => (
        <tr>
          <td>{asset}</td>
          {Object.values(allocation).map((percent) => (
            <td>{formattedPercentage(percent as number)}</td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

export default ProposalBreakdown;
