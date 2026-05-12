import { IBuyer, IValidationResult } from '../../types/index';

export class BuyerModel {
  private buyerData: IBuyer = {
    payment: null,
    email: "",
    phone: "",
    address: ""
  }

  setData(data: Partial<IBuyer>): void {
    this.buyerData = {...this.buyerData, ...data};
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
  }

  validate(): IValidationResult {
    const errors: IValidationResult = {};
    if(this.buyerData.payment === null) {
      errors['payment'] = 'Не выбран вид оплаты'
    }
    if(this.buyerData.email.trim() === "") {
      errors['email'] = 'Укажите емэйл'
    }
    if(this.buyerData.phone.trim() === "") {
      errors['phone'] = 'Укажите номер телефона'
    }
    if(this.buyerData.address.trim() === "") {
      errors['address'] = 'Укажите адрес доставки'
    }
    return errors;
  }
}
