import { EventEmitter } from '../base/Events';
import { IBasketModel, IProduct } from '../../types/index';

export class BasketModel implements IBasketModel {
  private products: IProduct[] = [];

  constructor(private events: EventEmitter) {}

  private emitChanges(): void {
    this.events.emit('basket:changed', {
      items: this.getItems(),
      total: this.getTotalPrice(),
      count: this.getTotalCount()
    });
  }

  getItems(): IProduct[] {
    return [...this.products];
  }

  addItem(item: IProduct): void {
    if(!this.hasItemById(item.id)) {
      this.products.push(item);
      this.emitChanges();
    }
  }

  removeItem(id: string): void {
    if(this.hasItemById(id)) {
      this.products = this.products.filter(i => i.id !== id);
      this.emitChanges();
    }
  }

  clear(): void {
    if (this.products.length > 0) {
      this.products = [];
      this.emitChanges();
    }
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
