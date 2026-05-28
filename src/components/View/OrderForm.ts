import { TPayment, IOrderForm, IOrderFormActions } from '../../types/index';
import { Form } from './Form';

export class OrderForm extends Form<IOrderForm> {
  private cardButton: HTMLButtonElement;
  private cashButton: HTMLButtonElement;
  private addressInput: HTMLInputElement;

  constructor (container: HTMLFormElement, actions?: IOrderFormActions) {
    super(container, actions);

    this.cardButton = container.querySelector<HTMLButtonElement>('button[name="card"]')!;
    this.cashButton = container.querySelector<HTMLButtonElement>('button[name="cash"]')!;
    this.addressInput = container.querySelector<HTMLInputElement>('.form__input')!;

    this.cardButton.addEventListener('click', () => {
      actions?.onPaymentSelect('card');
    })
    this.cashButton.addEventListener('click', () => {
      actions?.onPaymentSelect('cash');
    })
  }

  set payment (value: TPayment | null) {
    this.cashButton.classList.remove('button_alt-active');
    this.cardButton.classList.remove('button_alt-active');

    if (value === 'card') {
      this.cardButton.classList.add('button_alt-active');
    } else if (value === 'cash'){
      this.cashButton.classList.add('button_alt-active');
    }
  }

  set address (value: string) {
    this.addressInput.value = value;
  }

  clearForm(): void {
    this.cashButton.classList.remove('button_alt-active');
    this.cardButton.classList.remove('button_alt-active');
    this.address = "";
  }
}
