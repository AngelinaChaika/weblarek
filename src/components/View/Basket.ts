
import { IBasket, IOrderAction } from '../../types/index';
import { Component } from '../base/Component';


export class Basket extends Component<IBasket> {
  private productListElement: HTMLElement;
  private totalPriceElement: HTMLElement;
  private orderButton: HTMLButtonElement;

  constructor (container: HTMLElement, actions?: IOrderAction) {
    super(container);

    this.productListElement = container.querySelector<HTMLElement>('.basket__list')!;
    this.totalPriceElement = container.querySelector<HTMLElement>('.basket__price')!;
    this.orderButton = container.querySelector<HTMLButtonElement>('.basket__button')!;

    this.orderButton.addEventListener('click', () => {
      actions?.onOrder();
    })
  }

  set productList (items: HTMLElement[]) {
    this.productListElement.replaceChildren(...items);
  }

  set totalPrice (value: number) {
    this.totalPriceElement.textContent = `${value} синапсов`;
  }

  set disabled(value: boolean) {
    this.orderButton.disabled = value;
  }
}
