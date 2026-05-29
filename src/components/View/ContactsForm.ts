import { IContactsForm, IFormActions } from '../../types/index';
import { Form } from './Form';

export class ContactsForm extends Form<IContactsForm> {
  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;

  constructor (container: HTMLFormElement, actions?: IFormActions) {
    super(container, actions);

    this.emailInput = container.querySelector<HTMLInputElement>('input[name="email"]')!;
    this.phoneInput = container.querySelector<HTMLInputElement>('input[name="phone"]')!;
  }

  set email (value: string) {
    this.emailInput.value = value;
  }

  set phone (value: string) {
    this.phoneInput.value = value;
  }
}
