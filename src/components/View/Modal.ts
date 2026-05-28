import { IModal, IOnCloseAction } from '../../types/index';
import { Component } from '../base/Component';


export class Modal extends Component<IModal> {
  private contentElement: HTMLElement;
  private closeButton: HTMLButtonElement;

  constructor (container: HTMLElement, actions?: IOnCloseAction) {
    super(container);

    this.contentElement = container.querySelector<HTMLElement>('.modal__content')!;
    this.closeButton = container.querySelector<HTMLButtonElement>('.modal__close')!;

    this.closeButton.addEventListener('click', () => {
      actions?.onClose();
    });

    this.container.addEventListener('click', (event) => {
      if (event.target === this.container) {
        actions?.onClose();
      }
    });
  }

  set content (item: HTMLElement) {
    this.contentElement.replaceChildren(item);
  }

  open(): void {
    this.container.classList.add('modal_active');
  }

  close(): void {
    this.container.classList.remove('modal_active');
  }
}

