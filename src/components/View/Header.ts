import { IHeader, IOnClickAction } from '../../types/index';
import { Component } from '../base/Component';

export class Header extends Component<IHeader> {
  private basketButton: HTMLButtonElement;
  private counterElement: HTMLElement;

  constructor(container: HTMLElement, actions?: IOnClickAction) {
    super(container);

    this.basketButton = container.querySelector<HTMLButtonElement>('.header__basket')!;
    this.counterElement = container.querySelector<HTMLElement>('.header__basket-counter')!;

    this.basketButton.addEventListener('click', () => {
      actions?.onClick();
    });
  }

  set counter(value: number) {
    this.counterElement.textContent =  String(value);
  }
}
