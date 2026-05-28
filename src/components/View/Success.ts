import { ISuccess, IOnCloseAction } from '../../types/index';
import { Component } from '../base/Component';

export class Success extends Component<ISuccess> {
  private successDescription: HTMLElement;
  private closeButton: HTMLButtonElement;

  constructor (container: HTMLElement, actions?: IOnCloseAction) {
    super(container);

    this.successDescription = container.querySelector<HTMLElement>('.order-success__description')!;
    this.closeButton = container.querySelector<HTMLButtonElement>('.order-success__close')!;

    this.closeButton.addEventListener('click', () => {
      actions?.onClose();
    })
  }

  set totalPrice (value: number) {
    this.successDescription.textContent = `Списано ${value} синапсов`;
  }
}
