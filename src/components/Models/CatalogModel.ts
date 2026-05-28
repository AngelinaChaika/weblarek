import { EventEmitter } from '../base/Events';
import { IProduct } from '../../types/index';
export class CatalogModel {
  private products: IProduct[] = [];
  private selectedProduct: IProduct | undefined = undefined;

  constructor(private events: EventEmitter) {}

  setProducts(products: IProduct[]): void {
    this.products = products;
    this.events.emit('catalog:changed', {
      products: this.products
    });
  }

  getProducts(): IProduct[] {
    return this.products;
  }

  getProductById(id: string): IProduct | undefined {
    return this.products.find(i => i.id === id);
  }

  setSelectedProduct(id: string): void {
    const product = this.getProductById(id);

    if (!product) return;

    this.selectedProduct = product;
    this.events.emit('product:selected', {
      product: this.selectedProduct
    });
  }

  getSelectedProduct(): IProduct | undefined {
    return this.selectedProduct;
  }
}
