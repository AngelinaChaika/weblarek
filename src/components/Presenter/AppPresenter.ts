import { IEvents } from '../base/Events';

import { CDN_URL } from '../../utils/constants';

import {
  ICatalogModel,
  IBasketModel,
  IBuyerModel,
  IWebLarekApi,
  IHeader,
  ICatalog,
  IModal,
  IBasket,
  IPreviewCard,
  IOrderForm,
  IContactsForm,
  ISuccess,
  IProduct,
  TPayment,
  TValidationResult
  } from '../../types/index';


export class AppPresenter {
  constructor(
    private events: IEvents,

    private api: IWebLarekApi,

    private catalogModel: ICatalogModel,
    private basketModel: IBasketModel,
    private buyerModel: IBuyerModel,

    private header: IHeader,
    private catalog: ICatalog,
    private modal: IModal,
    private basket: IBasket,
    private createCatalogCard: (
      product: IProduct,
      onClick: () => void
    ) => HTMLElement,
    private createBasketCard: (
      product: IProduct,
      index: number,
      onClick: () => void
    ) => HTMLElement,
    private previewCard: IPreviewCard,
    private orderForm: IOrderForm,
    private contactsForm: IContactsForm,
    private success: ISuccess
  ) {}

  init() {
    this.bindEvents();
    this.loadCatalog();
  }

  private bindEvents(): void {
    this.events.on<{ products: IProduct[] }>('catalog:changed', (data) => {
      this.renderCatalog(data.products);
    });

    this.events.on<{ product: IProduct }>('product:selected', (data) => {
      this.renderSelectedProduct(data.product);
    });

    this.events.on<{ id: string }>('product:open', (data) => {
      this.setSelectedProduct(data.id);
    });

    this.events.on<{ product: IProduct }>('product:toggle', (data) => {
      this.toggleBasketItem(data.product);
    });

    this.events.on<{
      items: IProduct[];
      total: number;
      count: number }>
      ('basket:changed', (data) => {
        this.emitBasketChanges(data.items, data.total, data.count);
      });

    this.events.on('basket:open', () => {
      this.modal.render({
        content: this.basket.render()
      });
      this.modal.open();
    });

    this.events.on<{ id: string }>('basket:item-delete', (data) => {
      this.deleteBasketItem(data.id);
    });

    this.events.on('modal:close', () => {
      this.closeModal();
    });

    this.events.on('order:open', () => {
      this.renderOrderForm();
    });

    this.events.on('buyer:changed', () => {
      const buyer = this.buyerModel.getData();

      this.orderForm.address = buyer.address;
      this.orderForm.payment = buyer.payment;

      this.contactsForm.email = buyer.email;
      this.contactsForm.phone = buyer.phone;

      this.renderFormErrors();
    });

    this.events.on<{ field: string, value: string }>('order:input', (data) => {
      this.setOrderFormInput(data.field, data.value);
    });

    this.events.on<{ payment: TPayment }>('order.payment:select', (data) => {
      this.setPaymentData(data.payment);
    });

    this.events.on('order:submit', () => {
      this.renderContactsForm();
    });

    this.events.on<{ field: string, value: string }>('contacts:input', (data) => {
      this.setContactsFormInput(data.field, data.value);
    });

    this.events.on('contacts:submit', () => {
      this.postOrder();
      this.renderSuccess();
    });
  }

  private loadCatalog(): void {
    this.api.getProducts()
      .then(res => {
        if('items' in res) {
        this.catalogModel.setProducts(res.items)
        }
      })
      .catch(err => console.log('Ошибка получения данных каталога:', err))
  }

  private renderCatalog(products: IProduct[]): void {
    const cards = products.map((product) => {
      return this.createCatalogCard(product, () => {
        this.events.emit('product:open', { id: product.id });
      });
    });

    this.catalog.render({
      catalog: cards
    });
  }

  private renderSelectedProduct(product: IProduct): void {
    this.previewCard.buttonText = product.price === null
      ? "Недоступно"
      : this.basketModel.hasItemById(product.id)
      ? "Удалить из корзины"
      : "Купить";
    this.previewCard.buttonDisabled = product.price === null;
    this.modal.render({
      content: this.previewCard.render({
        ...product,
        category: product.category,
        image: CDN_URL + product.image.replace('svg', 'png'),
        description: product.description
      })
    })
    this.modal.open();
  }

  private setSelectedProduct(id: string): void {
    this.catalogModel.setSelectedProduct(id);
  }

  private toggleBasketItem(product: IProduct): void {
    const item = product;
    if(this.basketModel.hasItemById(item.id)) {
      this.basketModel.removeItem(item.id);
    } else {
      this.basketModel.addItem(item);
    }
    this.modal.close();
    this.previewCard.buttonText = this.basketModel.hasItemById(item.id)
      ? "Удалить из корзины"
      : "Купить";
  }

  private createBasketCards(items: IProduct[]): HTMLElement[] {
    return items.map((product, index) => {
      return this.createBasketCard(product, index + 1, () => {
          this.events.emit('basket:item-delete', { id: product.id });
        })
    });
  }

  private emitBasketChanges(items: IProduct[], total: number, count: number): void {
    const basketItems = this.basketModel.getItems();

    this.basket.disabled = basketItems.length === 0;

    this.header.counter = count;

    this.basket.totalPrice = total;

    this.basket.render({
      productList: this.createBasketCards(items)
    });
  }

  private deleteBasketItem(id: string):void {
    this.basketModel.removeItem(id);
  }

  private closeModal(): void {
    this.modal.close();
  }

  private renderOrderForm(): void {
    this.modal.render({
      content: this.orderForm.render()
    });
  }

  private renderFormErrors(): void {
    const errors = this.buyerModel.validate();

    const orderErrors: TValidationResult = {};
    if(errors.address) {
      orderErrors.address = errors.address;
    };
    if(errors.payment) {
      orderErrors.payment = errors.payment;
    };

    const contactsErrors: TValidationResult = {};
    if(errors.email) {
      contactsErrors.email = errors.email;
    };
    if(errors.phone) {
      contactsErrors.phone = errors.phone;
    };

    if(Object.keys(orderErrors).length >= 0) {
      this.orderForm.errors = orderErrors;
    };
    this.orderForm.valid = Object.keys(orderErrors).length === 0;

    if(Object.keys(contactsErrors).length >= 0) {
      this.contactsForm.errors = contactsErrors;
    };
    this.contactsForm.valid = Object.keys(contactsErrors).length === 0;
  }

  private setOrderFormInput(field: string, value: string): void {
    this.buyerModel.setData({ [field]: value });
  }

  private setPaymentData(payment: TPayment): void {
    this.buyerModel.setData({ payment: payment });
  }

  private renderContactsForm(): void {
    this.modal.render({
      content: this.contactsForm.render()
    });
  }

  private setContactsFormInput(field: string, value: string): void {
    this.buyerModel.setData({ [field]: value });
  }

  private postOrder(): void {
    this.api.postOrder({
      ...this.buyerModel.getData(),
      total: this.basketModel.getTotalPrice(),
      items: this.basketModel.getItems().map((item) => item.id)
    })
      .then(res => {
        if('total' in res) {
          this.success.totalPrice = res.total;
        }
      })
      .catch(err => console.log('Ошибка оформления заказа:', err));
  }

  private renderSuccess() {
    this.basketModel.clear();
    this.buyerModel.clear();

    this.modal.render({
      content: this.success.render()
    });
  }
}
