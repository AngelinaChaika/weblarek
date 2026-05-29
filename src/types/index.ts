import { categoryMap } from '../utils/constants';

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export type TOrderRequest = IBuyer & {
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

export type TPayment = 'card' | 'cash';
export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: TCategory;
  price: number | null;
}

export interface IBuyer {
  payment: TPayment | null;
  email: string;
  phone: string;
  address: string;
}

export type TValidationResult = Partial<Record<keyof IBuyer, string>>;

export interface ICatalogModel {
  setProducts(products: IProduct[]): void;
  getProducts(): IProduct[];
  getProductById(id: string): IProduct | undefined;
  setSelectedProduct(id: string): void;
  getSelectedProduct(): IProduct | undefined;
}

export interface IBasketModel {
  getItems(): IProduct[];
  addItem(item: IProduct): void;
  removeItem(id: string): void;
  clear(): void;
  getTotalPrice(): number;
  getTotalCount(): number;
  hasItemById(id: string): boolean;
}

export interface IBuyerModel {
  setData(data: Partial<IBuyer>): void;
  getData(): IBuyer;
  clear(): void;
  validate(): TValidationResult;
}

export interface IWebLarekApi {
  getProducts(): Promise<IProductListSuccessResponse>;
  postOrder(order: TOrderRequest): Promise<IOrderSuccessResponse>;
}

export interface IComponent<T> {
  render(data?: Partial<T>): HTMLElement;
}

export interface IOnClickAction {
  onClick: () => void;
}

export interface IOnCloseAction {
  onClose: () => void;
}

export interface IOrderAction {
  onOrder: () => void;
}

export interface IBasketCardAction {
  onDelete: () => void;
}

export interface IPreviewCardAction {
  onToggleBasket: () => void;
}

export interface IFormActions {
  onSubmit: () => void;
  onInput: (field: string, value: string) => void;
}

export interface IOrderFormActions extends IFormActions {
  onPaymentSelect: (payment: TPayment) => void;
}

export interface IHeader extends IComponent<IHeader> {
  counter: number;
}

export interface ICatalog extends IComponent<ICatalog> {
  catalog: HTMLElement[];
}

export interface IModal extends IComponent<IModal> {
  content: HTMLElement;
  open(): void;
  close(): void;
}

export interface IBasket extends IComponent<IBasket> {
  productList: HTMLElement[];
  totalPrice: number;
  disabled: boolean;
}

export interface ICard {
  title: string;
  price: number | null;
}

export type TCategory = keyof typeof categoryMap;

export interface ICatalogCard extends ICard {
  category: TCategory;
  image: string;
}

export interface IBasketCard extends ICard {
  value: number;
}

export interface IPreviewCard extends IComponent<IPreviewCard> {
  category: TCategory;
  image: string;
  description: string;
  buttonText: string;
  buttonDisabled: boolean
}

export type TFormErrors<T> = Partial<Record<keyof T, string>>;

export interface IForm<T> extends IComponent<IForm<T>> {
  valid: boolean;
  errors: TFormErrors<T>;
}

export interface IOrderForm extends IForm<IOrderForm> {
  payment: TPayment | null;
  address: string;
}

export interface IContactsForm extends IForm<IContactsForm> {
  email: string;
  phone: string;
}

export interface ISuccess extends IComponent<ISuccess> {
  totalPrice: number;
}


