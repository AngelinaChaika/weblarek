import { IBuyer, IValidationResult } from '../../types/index';

export class BuyerModel {
  private _buyerData: IBuyer = {
    payment: null,
    email: "",
    phone: "",
    address: ""
  }

  private _errors: Partial<Record<keyof IBuyer, string>> = {}

  private _errorMessages: Record<keyof IBuyer, string> = {
    payment: 'Не выбран вид оплаты',
    email: 'Укажите емэйл',
    phone: 'Укажите номер телефона',
    address: 'Укажите адрес доставки'
  }

  setData(data: Partial<IBuyer>): void {
    this._buyerData = {...this._buyerData, ...data};
  }

  getData(): IBuyer {
    return {...this._buyerData};
  }

  clear(): void {
    this._buyerData = {
      payment: null,
      email: "",
      phone: "",
      address: ""
    };

    this._errors = {};
  }

  validateField(field: keyof IBuyer, value: string | null): string | null {
    if(value === null || value.trim() === "") {
      this._errors[field] = this._errorMessages[field];
      return this._errorMessages[field];
    }

    delete this._errors[field];
    return null;
  }

  validate(): IValidationResult {
    this._errors = {};

    this.validateField('payment', this._buyerData.payment);
    this.validateField('email', this._buyerData.email);
    this.validateField('phone', this._buyerData.phone);
    this.validateField('address', this._buyerData.address);

    const isValid = Object.keys(this._errors).length === 0;

    let validation = {
      isValid: isValid,
      errors: { ...this._errors }
    };

    return validation;
  }
}
