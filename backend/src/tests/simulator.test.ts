import { jest } from "@jest/globals";

import mockProperties from "./data/mockProperties.json";
import testingInputs from "./data/testingInputs.json";

import { getProjectedAPY } from "../simulator";
import { AllocationProposal } from "../simulator/types";

jest.mock("../simulator/dataLoader.ts", () => ({ ...mockProperties.dataLoader, refreshStrategiesData: async () => {} }));

const allocationProposal = {
  dai: {
    aave: 0,
    compound: 0,
    convex: 100,
  },
  usdc: {
    aave: 0,
    compound: 0,
    convex: 100,
  },
  usdt: {
    aave: 0,
    compound: 20,
    convex: 80,
  },
};

describe("Simulator tests", () => {
  describe("Invalid allocation proposals", () => {
    it("should not allow invalid percentage values", () => {
      expect(() => {
        getProjectedAPY({
          ...allocationProposal,
          dai: {
            ...allocationProposal.dai,
            convex: -21,
          },
        });
      }).toThrow('"dai.convex" must be greater than or equal to 0');

      expect(() => {
        getProjectedAPY({
          ...allocationProposal,
          dai: {
            ...allocationProposal.dai,
            convex: 200,
          },
        });
      }).toThrow('"dai.convex" must be less than or equal to 100');
    });

    it("should not allow alocations with invalid percentages sum", () => {
      expect(() => {
        getProjectedAPY({
          ...allocationProposal,
          dai: {
            ...allocationProposal.dai,
            convex: 32,
          },
        });
      }).toThrow("Sum of allocations percentages must be 100 for each strategy.");
    });

    it("should throw error if an asset allocation strategy is missing", () => {
      expect(() => {
        getProjectedAPY({
          dai: {
            aave: 0,
            compound: 0,
            convex: 100,
          },
        });
      }).toThrow("Allocations must be specified for each supported asset.");
    });
  });

  describe("Valid allocation proposals", () => {
    testingInputs.map((input: { proposal: AllocationProposal; expectedProjectedAPY: number }, idx: number) => {
      it(`[TESTING PROPOSAL ${idx}] should return the expected projected APY`, () => {
        const { projectedAPY } = getProjectedAPY(input.proposal);

        // allowed percentage difference is at most 0.015%
        expect(projectedAPY * 100).toBeCloseTo(input.expectedProjectedAPY, 1.5);
      });
    });

    it("should return a higher projected APY if no allocation proposal is provided", () => {
      const { projectedAPY: optimalAPY } = getProjectedAPY();
      const { projectedAPY: notOptimalAPY } = getProjectedAPY(allocationProposal);

      expect(optimalAPY).toBeGreaterThanOrEqual(notOptimalAPY);
    });
  });
});
