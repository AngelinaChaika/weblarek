import { EventEmitter } from '../base/Events';

import { CDN_URL } from '../../utils/constants';
import { WebLarekApi } from '../Models/WebLarekApi';
import { CatalogModel } from '../Models/CatalogModel';
import { BasketModel } from '../Models/BasketModel';
import { BuyerModel } from '../Models/BuyerModel';

import { Header } from '../View/Header';
import { Catalog } from '../View/Catalog';
import { Modal } from '../View/Modal';
import { Basket } from '../View/Basket';
import { CatalogCard } from '../View/CatalogCard';
import { BasketCard } from '../View/BasketCard';
import { PreviewCard } from '../View/PreviewCard';
import { OrderForm } from '../View/OrderForm';
import { ContactsForm } from '../View/ContactsForm';
import { Success } from '../View/Success';

import { IProduct, TPayment } from '../../types/index';


export class AppPresenter {
  constructor(
    private events: EventEmitter,

    private api: WebLarekApi,

    private catalogModel: CatalogModel,
    private cartModel: BasketModel,
    private buyerModel: BuyerModel,

    private header: Header,
    private catalog: Catalog,
    private modal: Modal,
    private basket: Basket,
    private catalogCardTemplate: HTMLTemplateElement,
    private basketCardTemplate: HTMLTemplateElement,
    private previewCard: PreviewCard,
    private orderForm: OrderForm,
    private contactsForm: ContactsForm,
    private success: Success
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
      this.renderBasket();
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
      const cardContainer = this.catalogCardTemplate.content
            .querySelector('.card')!
            .cloneNode(true) as HTMLButtonElement;
      const card = new CatalogCard(cardContainer, {
        onClick: () => {
          this.events.emit('product:open', { id: product.id });
        }
      })
      return card.render({
        ...product,
        image: CDN_URL + product.image.replace('svg', 'png')
      });
    })
    this.catalog.render({
      catalog: cards
    });
  }

  private renderSelectedProduct(product: IProduct): void {
    this.previewCard.buttonText = product.price === null
      ? "Недоступно"
      : this.cartModel.hasItemById(product.id)
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
    if(this.cartModel.hasItemById(item.id)) {
      this.cartModel.removeItem(item.id);
    } else {
      this.cartModel.addItem(item);
    }
    this.previewCard.buttonText = this.cartModel.hasItemById(item.id)
      ? "Удалить из корзины"
      : "Купить";
  }

  private createBasketCards(items: IProduct[]): HTMLElement[] {
  return items.map((product, index) => {
    const basketCardContainer = this.basketCardTemplate.content
      .querySelector('.card')!
      .cloneNode(true) as HTMLElement;

    const card = new BasketCard(basketCardContainer, {
      onDelete: () => {
        this.events.emit('basket:item-delete', { id: product.id });
      }
    });

    card.index = index + 1;

    return card.render({
      ...product
    });
  });
}

  private emitBasketChanges(items: IProduct[], total: number, count: number): void {
    this.header.counter = count;

    this.basket.totalPrice = total;

    this.basket.render({
      productList: this.createBasketCards(items)
    });
  }

  private renderBasket(): void {
    const basketItems = this.cartModel.getItems();

    this.basket.disabled = basketItems.length === 0;

    this.modal.render({
      content: this.basket.render({
        productList: this.createBasketCards(basketItems)
      })
    });

    this.modal.open();
  }

  private deleteBasketItem(id: string):void {
    this.cartModel.removeItem(id);
  }

  private closeModal(): void {
    this.modal.close();
  }

  private renderOrderForm(): void {
    this.modal.render({
      content: this.orderForm.render()
    });
    this.renderFormErrors();
  }

  private renderFormErrors(): void {
    const orderErrors = this.buyerModel.validateOrderData();
    this.orderForm.errors = orderErrors;
    this.orderForm.valid = Object.keys(orderErrors).length === 0;

    const contactsErrors = this.buyerModel.validateContactsData();
    this.contactsForm.errors = contactsErrors;
    this.contactsForm.valid = Object.keys(contactsErrors).length === 0;
  }

  private setOrderFormInput(field: string, value: string): void {
    this.buyerModel.setData({ [field]: value });
    this.orderForm.address = value;
  }

  private setPaymentData(payment: TPayment): void {
    this.buyerModel.setData({ payment: payment });
    this.orderForm.payment = payment;
  }

  private renderContactsForm(): void {
    this.modal.render({
      content: this.contactsForm.render()
    });
  }

  private setContactsFormInput(field: string, value: string): void {
    this.buyerModel.setData({ [field]: value });
    if(field === "email") {
      this.contactsForm.email = value;
    } else {
      this.contactsForm.phone = value;
    }
  }

  private postOrder(): void {
    this.api.postOrder({
      ...this.buyerModel.getData(),
      total: this.cartModel.getTotalPrice(),
      items: this.cartModel.getItems().map((item) => item.id)
    })
      .then(res => {
        if('total' in res) {
          this.success.totalPrice = res.total;
        }
      })
      .catch(err => console.log('Ошибка оформления заказа:', err));
  }

  private renderSuccess() {
    this.cartModel.clear();
    this.buyerModel.clear();
    this.orderForm.clearForm();
    this.contactsForm.clearForm();

    this.modal.render({
      content: this.success.render()
    });
  }
}
