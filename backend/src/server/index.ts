import express, { Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";

import { getProjectedAPY } from "../simulator";
import { refreshStrategiesData } from "../simulator/dataLoader";

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(cors({ origin: "*" }));

// parse application/json
app.use(bodyParser.json());

app.post("/simulate", (req: Request, res: Response) => {
  try {
    return res.json(getProjectedAPY(req.body.allocationProposal));
  } catch (error: any) {
    return res.status(403).json({
      error: error.message,
    });
  }
});

// 404
app.use(function (req, res) {
  return res.status(404).send({ message: `Route ${req.url} not found.` });
});

// 500
app.use((err: any, req: Request, res: Response) => {
  console.log(JSON.parse(JSON.stringify(err, null, 2)));

  res.status(500).send({
    error: "Unexpected error",
  });
});

app.listen(port, async () => {
  // load data
  await refreshStrategiesData();

  // simulate cron job
  setInterval(async () => {
    // refresh data every 5 minutesO
    await refreshStrategiesData();
  }, 5 * 60 * 1000);

  console.log(`[🌈SERVER]: Server is running at https://localhost:${port}`);
});
