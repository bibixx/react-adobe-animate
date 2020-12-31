import createjs from "createjs-module";
import AdobeAn from "../AdobeAn";

const getCompositionId = (
  searchedName: string,
  composition?: string,
) => {
  if (composition !== undefined) {
    return composition;
  }

  const compositionIds = Object.keys(AdobeAn.compositions);

  const foundComposition = compositionIds.find(id => {
    const library = AdobeAn.compositions[id].getLibrary();
    const props = Object.keys(library);

    const independent = props.filter(prop => {
      const prototype = library[prop].prototype as createjs.MovieClip;
      if (
        prototype
        && prototype.mode
        && prototype.mode === "independent"
      ) {
        return true;
      }

      return false;
    });

    return independent.filter(name => name === searchedName).length > 0;
  });

  return foundComposition;
};

export default getCompositionId;
