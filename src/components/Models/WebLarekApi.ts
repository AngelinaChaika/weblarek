import { IApi, IProductListSuccessResponse, IOrderRequest, IOrderSuccessResponse } from '../../types/index';

export class WebLarekApi {
  constructor(private api: IApi) {
    this.api = api;
  }

  getProducts(): Promise<IProductListSuccessResponse> {
    return this.api.get('/product/');
  }

  postOrder(order: IOrderRequest): Promise<IOrderSuccessResponse> {
    return this.api.post('/order/', order)
  }
}
