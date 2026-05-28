import { EventEmitter } from '../base/Events';
import { IBuyer, TValidationResult } from '../../types/index';

export class BuyerModel {
  private buyerData: IBuyer = {
    payment: null,
    email: "",
    phone: "",
    address: ""
  };

  constructor(private events: EventEmitter) {}

  private emitChanges(): void {
    this.events.emit('buyer:changed', {
      buyer: this.getData(),
      orderErrors: this.validateOrderData(),
      contactsErrors: this.validateContactsData()
    });
  }

  setData(data: Partial<IBuyer>): void {
    this.buyerData = {...this.buyerData, ...data};
    this.emitChanges();
  }

  getData(): IBuyer {
    return {...this.buyerData};
  }

  clear(): void {
    this.buyerData = {
      payment: null,
      email: "",
      phone: "",
      address: ""
    };

    this.emitChanges();
  }

  validateOrderData(): TValidationResult {
    const errors: TValidationResult = {};
    if(this.buyerData.payment === null) {
      errors['payment'] = 'Не выбран вид оплаты';
    }
    if(this.buyerData.address.trim() === "") {
      errors['address'] = 'Укажите адрес доставки';
    }
    return errors;
  }

  validateContactsData(): TValidationResult {
    const errors: TValidationResult = {};
    if(this.buyerData.email.trim() === "") {
      errors['email'] = 'Укажите емэйл';
    }
    if(this.buyerData.phone.trim() === "") {
      errors['phone'] = 'Укажите номер телефона';
    }
    return errors;
  }
}
