import { ICard } from '../../types/index';
import { Component } from '../base/Component';

export class Card<T extends ICard> extends Component<T> {
  private titleElement: HTMLElement;
  private priceElement: HTMLElement;

  constructor (container: HTMLElement) {
    super(container);

    this.titleElement = container.querySelector<HTMLElement>('.card__title')!;
    this.priceElement = container.querySelector<HTMLElement>('.card__price')!;
  }

  set title (value: string) {
    this.titleElement.textContent = value;
  }

  set price (value: number | null) {
    if(value === null) {
      this.priceElement.textContent = 'Бесценно';
      return;
    }
    this.priceElement.textContent = `${value} синапсов`
  }
}
