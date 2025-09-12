export interface ICategory {
  id: number;
  name: string;
  image: string;
}

export interface ICategoryResponse {
  data: ICategory[];
  success: boolean;
}
