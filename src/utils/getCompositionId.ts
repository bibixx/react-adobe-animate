import { AdobeAn } from './AdobeAn';

export const getCompositionId = (searchedName: string, composition?: string): string|null => {
  const compositionIds = Object.keys(AdobeAn.compositions);

  if (composition) {
    if (AdobeAn.compositions[composition].getLibrary()[searchedName]) {
      return composition;
    }

    return null;
  }

  const [foundComposition] = compositionIds.filter((id) => {
    const library = (AdobeAn.compositions[id].getLibrary() as any) as {
      [id: string]: { prototype?: { mode?: string } }
    };
    const props = Object.keys(library);

    const independent = props.filter((prop) => {
      if (library?.[prop]?.prototype?.mode === 'independent') {
        return true;
      }

      return false;
    });

    return independent.some((name) => name === searchedName);
  });

  return foundComposition;
};
