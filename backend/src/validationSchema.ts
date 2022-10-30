import Joi from "joi";

const percentageValidator = Joi.number().min(0).max(100);

const strategyDetailsValidator = Joi.object({
  aave: percentageValidator,
  compound: percentageValidator,
  convex: percentageValidator,
})
  .required()
  .custom((value: { aave: number; compound: number; convex: number }, helpers) => {
    if (value.aave + value.compound + value.convex !== 100) {
      return helpers.error("custom.invalidPercentagesSum");
    }
    return value;
  })
  .messages({
    "custom.invalidPercentagesSum": "Sum of allocations percentages must be 100 for each strategy.",
    "any.required": "Allocations must be specified for each supported asset.",
  });

const allocationProposalValidatior = Joi.object({
  dai: strategyDetailsValidator,
  usdc: strategyDetailsValidator,
  usdt: strategyDetailsValidator,
});

export default {
  allocationProposalValidatior,
};
