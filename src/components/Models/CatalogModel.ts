import { IProduct } from '../../types/index';

export class CatalogModel {
  private products: IProduct[] = [];
  private selectedProduct: IProduct | undefined = undefined;

  setProducts(products: IProduct[]): void {
    this.products = products;
  }

  getProducts(): IProduct[] {
    return this.products;
  }

  getProductById(id: string): IProduct | undefined {
    return this.products.find(i => i.id === id);
  }

  setSelectedProduct(id: string): void {
    this.selectedProduct = this.getProductById(id);
  }

  getSelectedProduct(): IProduct | undefined {
    return this.selectedProduct;
  }
}
