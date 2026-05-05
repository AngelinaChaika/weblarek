import { IProduct } from '../../types/index';

export class CartModel {
  private _products: IProduct[] = [];

  getItems(): IProduct[] {
    return [...this._products];
  }

  addItem(item: IProduct): void {
    if(!this.hasItemById(item.id)) {
      this._products.push(item);
    }
  }

  removeItem(id: string): void {
    this._products = this._products.filter(i => i.id !== id);
  }

  clear(): void {
    this._products = [];
  }

  getTotalPrice(): number {
    return this._products.reduce((acc, item) => acc + (item.price ?? 0), 0);
  }

  getTotalCount(): number {
    return this._products.length;
  }

  hasItemById(id: string): boolean {
    return this._products.some(i => i.id === id);
  }
}
