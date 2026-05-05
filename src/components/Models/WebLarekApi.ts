import { IApi, IProductListResponse, IOrderRequest, IOrderResponse } from '../../types/index';

export class WebLarekApi {
  constructor(private _api: IApi) {
    this._api = _api;
  }

  getProducts(): Promise<IProductListResponse> {
    return this._api.get('/product/');
  }

  postOrder(order: IOrderRequest): Promise<IOrderResponse> {
    return this._api.post('/order/', order)
  }
}
