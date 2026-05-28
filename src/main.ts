import './scss/styles.scss';

import { EventEmitter } from './components/base/Events';
import { CatalogModel } from './components/Models/CatalogModel';
import { BuyerModel } from './components/Models/BuyerModel';
import { BasketModel } from './components/Models/BasketModel';
import { API_URL } from './utils/constants';
import { Api } from './components/base/Api';
import { WebLarekApi } from './components/Models/WebLarekApi';

import { Header } from './components/View/Header';
import { Catalog } from './components/View/Catalog';
import { Modal } from './components/View/Modal';
import { Basket } from './components/View/Basket';
import { PreviewCard } from './components/View/PreviewCard';
import { OrderForm } from './components/View/OrderForm';
import { ContactsForm } from './components/View/ContactsForm';
import { Success } from './components/View/Success';

import { AppPresenter } from './components/Presenter/AppPresenter';

const events = new EventEmitter();

const catalogModel = new CatalogModel(events);
const buyerModel = new BuyerModel(events);
const basketModel = new BasketModel(events);
const api = new Api(API_URL);
const weblarekApi = new WebLarekApi(api);

// СОЗДАНИЕ HEADER
const headerContainer = document.querySelector('.header') as HTMLElement;
const header = new Header(headerContainer, {
  onClick: () => {
    events.emit('basket:open');
  }
});

// СОЗДАНИЕ CATALOG
const catalogContainer = document.querySelector('.gallery') as HTMLElement;
const catalog = new Catalog(catalogContainer);

// СОЗДАНИЕ MODAL
const modalContainer = document.querySelector('.modal') as HTMLElement;
const modal = new Modal(modalContainer, {
  onClose: () => {
    events.emit('modal:close')
  }
});

// СОЗДАНИЕ BASKET
const basketTemplate = document.querySelector<HTMLTemplateElement>('#basket')!;
const basketContainer = basketTemplate.content.querySelector('.basket')!.cloneNode(true) as HTMLElement;
const basket = new Basket(basketContainer, {
  onOrder: () => {
    events.emit('order:open')
  }
});

// СОЗДАНИЕ CARDS TEMPLATES
const catalogCardTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;

const previewCardTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const previewCardContainer = previewCardTemplate.content
      .querySelector('.card')!
      .cloneNode(true) as HTMLElement;
const previewCard = new PreviewCard(previewCardContainer, {
  onToggleBasket: () => {
    events.emit('product:toggle', { product: catalogModel.getSelectedProduct() });
  }
})
const basketCardTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;

// СОЗДАНИЕ ORDER FORM
const orderFormTemplate = document.querySelector('#order') as HTMLTemplateElement;

const orderFormContainer = orderFormTemplate.content
      .querySelector('form[name="order"]')!
      .cloneNode(true) as HTMLFormElement;

const orderForm = new OrderForm(orderFormContainer, {
  onInput: (field, value) => {
    events.emit('order:input', { field, value })
  },
  onPaymentSelect: (payment) => {
    events.emit('order.payment:select', { payment })
  },
  onSubmit: () => {
    events.emit('order:submit')
  }
});

// СОЗДАНИЕ CONTACTS FORM
const contactsFormTemplate = document.querySelector('#contacts') as HTMLTemplateElement;

const contactsFormContainer = contactsFormTemplate.content
      .querySelector('form[name="contacts"]')!
      .cloneNode(true) as HTMLFormElement;

const contactsForm = new ContactsForm(contactsFormContainer, {
  onInput: (field, value) => {
    events.emit('contacts:input', { field, value })
  },
  onSubmit: () => {
    events.emit('contacts:submit')
  }
});

// СОЗДАНИЕ SUCCESS
const successTemplate = document.querySelector('#success') as HTMLTemplateElement;

const successContainer = successTemplate.content
      .querySelector('.order-success')!
      .cloneNode(true) as HTMLElement;

const success = new Success(successContainer, {
  onClose: () => {
    events.emit('modal:close')
  }
});

const presenter = new AppPresenter(
  events,

  weblarekApi,

  catalogModel,
  basketModel,
  buyerModel,

  header,
  catalog,
  modal,
  basket,
  catalogCardTemplate,
  basketCardTemplate,
  previewCard,
  orderForm,
  contactsForm,
  success
);

presenter.init();
