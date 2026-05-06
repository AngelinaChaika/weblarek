import { IProduct } from '../../types/index';

export class CartModel {
  private products: IProduct[] = [];

  getItems(): IProduct[] {
    return [...this.products];
  }

  addItem(item: IProduct): void {
    if(!this.hasItemById(item.id)) {
      this.products.push(item);
    }
  }

  removeItem(id: string): void {
    this.products = this.products.filter(i => i.id !== id);
  }

  clear(): void {
    this.products = [];
  }

  getTotalPrice(): number {
    return this.products.reduce((acc, item) => acc + (item.price ?? 0), 0);
  }

  getTotalCount(): number {
    return this.products.length;
  }

  hasItemById(id: string): boolean {
    return this.products.some(i => i.id === id);
  }
}
