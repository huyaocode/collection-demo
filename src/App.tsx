import React from "react";
import "./App.css";
import Basic from "./components/Basic";
import DragAble from "./components/DragAble";
import OptimizationScroll from "./components/OptimizationScroll";
import ScaleAble from "./components/ScaleAble";

function App() {
  return (
    <div className="App">
      <Basic />
      <DragAble />
      <OptimizationScroll />
      <ScaleAble />
    </div>
  );
}

export default App;
