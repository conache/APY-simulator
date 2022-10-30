import axios from "axios";
import { API_URL } from "../constants";
import { IAllocationProposal } from "../types";

export const requestSimulation = async (allocationProposal?: IAllocationProposal) => {
  return axios.post(API_URL.simulate, { allocationProposal }).then((response) => response.data);
};
