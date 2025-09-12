export interface IProduct {
  id: number;
  name: string;
  image: string;
  variant: "default" | "big";
  color: string | null;
  oldPrice: number | null;
  groups: IProductGroup[];
  subgroup: string[];
  type: IProductType[] | null;
  extras: IProductExtras[] | null;
  information: IProductInformation | null;
  ingredients: string[];
}

export interface IProductGroup {
  id: number;
  name: string;
}

export interface IProductType {
  id: number;
  name: string;
  price: number;
  weight: number | null;
}

export interface IProductExtras {
  id: number;
  name: string | null;
  price: number;
  image: string;
  description: string;
}

export interface IProductInformation {
  id: number;
  composition: string;
  description: string;
  fats: number;
  proteins: number;
  carbohydrates: number;
  calories: number;
  gramm: string;
}
