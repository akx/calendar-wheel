export interface PaletteColor {
  hex: string;
  name?: string;
  description?: string;
}

export interface Palette {
  monthColors: PaletteColor[];
}
