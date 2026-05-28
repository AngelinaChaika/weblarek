import { IBasketCard, IBasketCardAction } from '../../types/index';
import { Card } from './Card';

export class BasketCard extends Card<IBasketCard> {
  private indexElement: HTMLElement;
  private deleteButton: HTMLButtonElement;

  constructor (container: HTMLElement, actions?: IBasketCardAction) {
    super(container);

    this.indexElement = container.querySelector<HTMLElement>('.basket__item-index')!;
    this.deleteButton = container.querySelector<HTMLButtonElement>('.basket__item-delete')!;

    this.deleteButton.addEventListener('click', () => {
      actions?.onDelete();
    })
  }

  set index (value : number) {
    this.indexElement.textContent = String(value);
  }
}
