import React, { useState } from "react";

import { SUPPORTED_PROTOCOLS } from "../constants";

export interface IAssetStrategy {
  aave: number;
  compound: number;
  convex: number;
}

interface IStrategyRow {
  asset: string;
  onChange: (a: IAssetStrategy) => void;
}

const StrategyTableRow = ({ asset, onChange }: IStrategyRow) => {
  const [simulationDetails, setSimulationDetails] = useState<IAssetStrategy>({
    aave: 0,
    compound: 0,
    convex: 0,
  });

  const handleInputChange = (newValue: number, protocol: string) => {
    const displayData = {
      ...simulationDetails,
      [protocol]: newValue,
    };
    setSimulationDetails(displayData);
    onChange(displayData);
  };

  return (
    <tr>
      <td>{asset.toUpperCase()}</td>

      {SUPPORTED_PROTOCOLS.map((protocol, index) => (
        <td key={`${asset}-${protocol}`}>
          <input
            name={`${asset}-${protocol}`}
            type="number"
            min="0"
            max="100"
            step="1"
            defaultValue={0}
            onChange={(e) => handleInputChange(parseFloat(e.target.value), protocol)}
          />
        </td>
      ))}
    </tr>
  );
};

export default StrategyTableRow;
