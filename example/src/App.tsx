import * as React from "react";
import { useState } from "react";
import AnimateCC, { GetAnimationObjectParameter } from "react-adobe-animate";

const App = () => {
  const [paused, setPaused] = useState(false);
  const [animationObject, getAnimationObject] = useState<GetAnimationObjectParameter|null>(null);
  const onClick = () => setPaused(!paused);

  console.log(animationObject);

  return (
    <div style={{ width: "400px" }}>
      <AnimateCC
        animationName="lishtml5"
        getAnimationObject={getAnimationObject}
        paused={paused}
      />

      <AnimateCC
        animationName="lishtml5"
        composition="C1475B64B160904BB90B34246A5FF54B"
        paused={paused}
      />

      <button onClick={onClick}>{paused ? "Unpause" : "Pause"}</button><br />
    </div>
  );
};

export default App;
