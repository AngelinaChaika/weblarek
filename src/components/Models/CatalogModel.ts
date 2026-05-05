import { IProduct } from '../../types/index';

export class CatalogModel {
  private _products: IProduct[] = [];
  private _selectedProduct: IProduct | null = null;

  setProducts(products: IProduct[]): void {
    this._products = products;
  }

  getProducts(): IProduct[] {
    return this._products;
  }

  getProductById(id: string): IProduct | null {
    const product = this._products.find(i => i.id === id);
    if(product) {
      return product;
    }
    return null;
    }

  setSelectedProduct(id: string): void {
    this._selectedProduct = this.getProductById(id);
  }

  getSelectedProduct(): IProduct | null {
    return this._selectedProduct;
  }
}
