export type ProductPreviewModel =
  | {
      kind: "cake";
      shape: string;
      size: string;
      sponge: string;
      frosting: string;
      filling: string;
      toppings: string[];
      inscription: string;
      gold: boolean;
    }
  | {
      kind: "donut";
      slots: string[];
      glaze: string;
      toppings: string[];
    }
  | {
      kind: "smoothie";
      size: string;
      baseSwatch: string;
      fruits: string[];
      extras: string[];
    };
