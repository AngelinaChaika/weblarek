export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export type IProductListResponse = IProductListSuccessResponse | IErrorResponse;

export type IOrderResponse = IOrderSuccessResponse | IErrorResponse;

export type IOrderRequest = IBuyer & {
  total: number;
  items: string[];
}
export interface IProductListSuccessResponse {
  total: number;
  items: IProduct[];
}
export interface IOrderSuccessResponse {
  id: string;
  total: number;
}

export interface IErrorResponse {
  error: string;
}

export type TPayment = 'card' | 'cash';
export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IBuyer {
  payment: TPayment | null;
  email: string;
  phone: string;
  address: string;
}

export interface IValidationResult {
  isValid: boolean;
  errors: Partial<Record<keyof IBuyer, string>>;
}
