# 💡 Project idea

This project implements an **OUSD strategies allocation simulator**.

**Context:**

- The OUSD Vault allocates its assets (DAI, USDC, USDT) into strategies
- Currently the protocol supports 3 strategies: Compound, Aave, Convex. See the ousd docs
- You can check out the current allocations on the analytics page at https://analytics.ousd.com
- On a periodic basis, the community analyzes the yields from the strategies and votes for updating the allocations - Essentially deciding what % of each stablecoin should go into what strategy.
- To help with those allocation decisions, we built a "simulator" as a spreadsheet
  - Notice how you can change values in the cells having a yellow background on the APYs sheet.
  - Notice how the APY from various protocols are dynamically fetched by calling APIs (see sheets Compound, Aave, …)

**What was implemented:**

- An OUSD assets allocation simulator as a cli script, modeled after the spreadsheet. Given the allocations (what % of stablecoins to allocate to each strategy), it calculates the projected APY of the OUSD protocol.
- A basic API to allow simulations to be triggered using HTTP calls.
- A basic React.js UI that allows the user to input the allocations and displays the calculated OUSD APY.
- Fetching most of the APYs from protocols APUs.
- Automatic calculation of the optimum allocation for the assets in the vault.

# 📦 Basic project setup

The projects is split into two separate modules:

- frontend - basic React.js UI implementation of the simulator
- backend - the business logic layer representic mainly by the simulator logic. It contans:
  - cli
  - server

For each project module setup, you'll need to run `yarn install` in each module directory.

**Frontend setup:**

```
cd frontend && yarn install
```

**Backend setup:**

In the `backend` directory, run:

- Install the dependencies:

  ```
  yarn install
  ```

- To test the simulator logic:

  ```
  yarn test
  ```

# 🚀 Running instructions

## Running the cli

In the `backend` directory, run:

```
yarn simulate --file=<relative path of json file with the allocation proposal>
```

Note: `file` property is optional. If it is not provided, the simulation will return the projected APY for the optimal allocation.

## Running the server

In the `backend` directory, run:

```
yarn start-server
```

## Running the frontend app

In the `frontend` directory, run:

```
yarn start
```
