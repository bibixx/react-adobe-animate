const getCompositionByCompositionId = (
  searchedName: string,
  externalCompositionId: string,
) => {
  if (
    window.AdobeAn.compositions?.[externalCompositionId]?.getLibrary()[
      searchedName
    ]
  ) {
    return externalCompositionId;
  }

  return null;
};

export const getCompositionId = (
  searchedName: string,
  externalCompositionId?: string,
): string | null => {
  const { compositions } = window.AdobeAn;
  if (compositions === undefined) {
    return null;
  }

  const compositionIds = Object.keys(compositions);

  if (externalCompositionId) {
    return getCompositionByCompositionId(searchedName, externalCompositionId);
  }

  const foundComposition = compositionIds.find((id) => {
    const library = compositions[id]?.getLibrary();

    if (!library) {
      return false;
    }

    const symbolNames = Object.keys(library);

    return symbolNames.some((symbolName) => {
      const symbol = library[symbolName];
      const symbolPrototype = symbol.prototype as { mode?: string } | undefined;

      if (symbolPrototype?.mode !== 'independent') {
        return false;
      }

      return symbolName === searchedName;
    });
  });

  return foundComposition ?? null;
};
