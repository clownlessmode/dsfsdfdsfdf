export interface IProduct {
  id: number;
  name: string;
  image: string;
  price: number;
  oldPrice: number | null;
  group: number[];
  subgroup: string[];
  types: IProductType[] | null;
  ingredients: IProductIngredient[] | null;
  information: IProductInformation | null;
  variant: "default" | "big";
}

export interface IProductType {
  id: number;
  name: string;
  price: number;
}

export interface IProductIngredient {
  id: number;
  name: string;
  description?: string;
  price?: number;
  image: string;
}

export interface IProductInformation {
  id: number;
  composition: string;
  description: string;
  fats: number;
  proteins: number;
  carbohydrates: number;
  calories: number;
}
