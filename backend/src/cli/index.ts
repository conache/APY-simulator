import fs from "fs";
import path from "path";
import { refreshStrategiesData } from "../simulator/dataLoader";
import yargs from "yargs";

import { getProjectedAPY } from "../simulator";
import { toDisplayPercentage } from "../simulator/helpers";

async function getInputProposalObject() {
  const argv = await yargs.argv;
  const insertedPath: string = `${argv["file"] || ""}`;

  if (!insertedPath.length) {
    return null;
  }

  const fullFilePath = path.resolve(process.env.PWD || "", insertedPath);

  return JSON.parse(fs.readFileSync(fullFilePath, "utf8"));
}

async function main() {
  const proposalObject = await getInputProposalObject();

  await refreshStrategiesData();
  try {
    const result = getProjectedAPY(proposalObject);
    console.log("\nProjected APY:", `${toDisplayPercentage(result.projectedAPY)}%`, "\n");

    return {
      code: 0,
      projectedAPY: result.projectedAPY,
    };
  } catch (error: any) {
    console.log(error.message);

    return {
      code: -1,
      error: error.message,
    };
  }
}

main();
