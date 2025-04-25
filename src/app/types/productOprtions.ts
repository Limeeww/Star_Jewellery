export const MATERIALS = ["gold", "silver", "steel"] as const;
export type Material = (typeof MATERIALS)[number];

export const INSERTS = ["diamond", "crystal", "pearl", "onyx", "none"] as const;
export type Insert = (typeof INSERTS)[number];

export const MATERIAL_COLORS: Record<Material, string[]> = {
  gold: ["yellow", "white", "rose"],
  silver: ["white", "pink"],
  steel: ["black", "gunmetal"],
};

export const INSERT_COLORS: Record<Insert, string[]> = {
  diamond: ["clear", "blue"],
  crystal: ["blue", "green"],
  pearl: ["white", "cream"],
  onyx: ["black", "grey"],
  none: [],
};

export const PURITIES: Record<Material, string[]> = {
  gold: ["585", "750"],
  silver: ["925"],
  steel: [],
};
