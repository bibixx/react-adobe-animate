import * as React from 'react';
import { useState } from 'react';
import { AnimateCC, GetAnimationObjectParameter } from 'react-adobe-animate';

const App = () => {
  const [animationObject, getAnimationObject] =
    useState<GetAnimationObjectParameter | null>(null);
  const [paused, setPaused] = useState(false);
  const [animationName, setAnimationName] = useState('lishtml5');
  const [composition, setComposition] = useState<string>();

  console.log(animationObject);

  const onPausedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setPaused(value === 'true');
  };

  const onAnimationNameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setAnimationName(value);
  };

  const onCompositionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setComposition(value === '__NONE__' ? undefined : value);
  };

  return (
    <div>
      <div>
        <div>
          <p>Paused</p>
          <select onChange={onPausedChange} defaultValue="false">
            <option value="true">true</option>
            <option value="false">false</option>
          </select>
        </div>
        <div>
          <p>Animation Name</p>
          <select onChange={onAnimationNameChange}>
            <option value="lishtml5">lishtml5</option>
            <option value="image">image</option>
          </select>
        </div>
        <div>
          <p>Composition</p>
          <select onChange={onCompositionChange}>
            <option value="__NONE__">None</option>
            <option value="animation2">animation2 (lishtml5)</option>
            <option value="C1475B64B160904BB90B34246A5FF54B">
              C1475B64B160904BB90B34246A5FF54B (lishtml5)
            </option>
            <option value="B53961F14C504C6894FE5850DD59631A">
              B53961F14C504C6894FE5850DD59631A (image)
            </option>
          </select>
        </div>
      </div>
      <div style={{ width: '400px' }}>
        <AnimateCC
          animationName={animationName}
          composition={composition}
          getAnimationObject={getAnimationObject}
          onError={() => console.log('onError')}
          paused={paused}
        />
      </div>
    </div>
  );
};

export default App;
