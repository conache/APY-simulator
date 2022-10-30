import React from "react";
import classes from "./App.module.css";
import OptimalAllocationSimulator from "./components/OptimalAllocationSimulator";
import AllocationSimulator from "./components/AllocationSimulator";

const App = () => (
  <div className={classes.appContainer}>
    <AllocationSimulator />
    <OptimalAllocationSimulator />
  </div>
);

export default App;
