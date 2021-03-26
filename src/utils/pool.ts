export const getRemainingTimeStr = (time: number): string => {
  return [
    { value: Math.floor(time / 60 / 60 / 24), unit: "d" },
    { value: Math.floor((time / 60 / 60) % 24), unit: "h" },
    { value: Math.floor((time / 60) % 60), unit: "m" },
    { value: Math.floor(time % 60), unit: "s" },
  ]
    .filter((e) => e.value)
    .map((e) => `${e.value}${e.unit}`)
    .join(" : ");
};
