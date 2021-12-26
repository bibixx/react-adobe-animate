export const hexToRgba = (color: string, opacity: number) => {
  const r = Number.parseInt(color.substring(1, 3), 16);
  const g = Number.parseInt(color.substring(3, 5), 16);
  const b = Number.parseInt(color.substring(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};
