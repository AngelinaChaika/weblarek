import { IForm, TFormErrors, IFormActions } from '../../types/index';
import { Component } from '../base/Component';

export class Form<T> extends Component<IForm<T>> {
  private errorsElement: HTMLElement;
  private submitButton: HTMLButtonElement;

  constructor (container: HTMLFormElement, actions?: IFormActions) {
    super(container);

    this.errorsElement = container.querySelector<HTMLElement>('.form__errors')!;
    this.submitButton = container.querySelector<HTMLButtonElement>('button[type="submit"]')!;

    container.addEventListener('submit', (event) => {
      event.preventDefault();
      actions?.onSubmit();
    });

    container.addEventListener('input', (event) => {
      const target = event.target as HTMLInputElement;
      actions?.onInput(
        target.name,
        target.value
      );
    });
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  set errors(value: TFormErrors<T>) {
    this.errorsElement.textContent = Object.values(value).join('; ');
  }
}
