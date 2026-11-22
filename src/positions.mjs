// The fixed structure of a rugby union XV: which unit each shirt number
// belongs to, and how units are laid out on the page (pitch order).

export const UNITS = [
  { name: 'Front row', layout: [1, 2, 3] },
  { name: 'Second row', layout: [4, 5] },
  { name: 'Back row', layout: [6, 8, 7] },
  { name: 'Half-backs', layout: [9, 10] },
  { name: 'Centres', layout: [12, 13] },
  { name: 'Back three', layout: [11, 15, 14] },
];

export const UNIT_FOR_NUMBER = Object.fromEntries(
  UNITS.flatMap((u) => u.layout.map((n) => [n, u.name])),
);
