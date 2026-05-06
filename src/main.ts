import { CatalogModel } from './components/Models/CatalogModel';
import { BuyerModel } from './components/Models/BuyerModel';
import { CartModel } from './components/Models/CartModel';
import { WebLarekApi } from './components/Models/WebLarekApi';
import { API_URL } from './utils/constants'
import { Api } from './components/base/Api';
import { apiProducts } from './utils/data'
import './scss/styles.scss';

const cart = new CartModel;
const buyer = new BuyerModel;
const catalog = new CatalogModel;
const api = new Api(API_URL);
const weblarekApi = new WebLarekApi(api);

// ТЕСТЫ

// Класс CatalogModel
console.log(('Класс CatalogModel').toUpperCase())
console.log('..................................')

// - сохранение переданного массива товаров
catalog.setProducts(apiProducts.items);
// - сохранение товара по id как выбранного
catalog.setSelectedProduct('b06cde61-912f-4663-9751-09956c0eed67');
// - получение массива всех товаров
console.log('Массив товаров из каталога: ', catalog.getProducts());
// - поиск товара по его id (успешно)
console.log('Товар по ID найден: ', catalog.getProductById('b06cde61-912f-4663-9751-09956c0eed67'));
// - поиск товара по его id (отсутствует)
console.log('Товар по ID не найден: ', catalog.getProductById('aaa'));
// - получение выбранного товара (успешно)
console.log('Выбранный товар найден: ', catalog.getSelectedProduct());
// - получение выбранного товара (отсутствует)
catalog.setSelectedProduct('')
console.log('Выбранный товар отсутствует: ', catalog.getSelectedProduct());

console.log('..................................')

// Класс CartModel
console.log(('Класс CartModel').toUpperCase())
console.log('..................................')

// добавление товаров в массив корзины
const product1 = catalog.getProductById('854cef69-976d-4c2a-a18c-2aa45046c390');
const product2 = catalog.getProductById('c101ab44-ed99-4a54-990d-47aa2bb4e7d9');
if(product1) {
  cart.addItem(product1)
};
if(product2) {
  cart.addItem(product2)
};
// - получение массива товаров, которые находятся в корзине
console.log('Товары в корзине: ', cart.getItems());
// - получение стоимости всех товаров в корзине
console.log('Общая стоимость: ', cart.getTotalPrice());
// - получение количества товаров в корзине
console.log('Общее количество товаров: ', cart.getTotalCount());
// - проверка наличия товара в корзине по его id (успешно)
console.log('Товар есть в корзине: ', cart.hasItemById('854cef69-976d-4c2a-a18c-2aa45046c390'));
// - проверка наличия товара в корзине по его id (отсутствует)
console.log('Товар отсутствует в корзине: ', cart.hasItemById('b06cde61-912f-4663-9751-09956c0eed67'));
// - удаление товара из корзины
cart.removeItem('854cef69-976d-4c2a-a18c-2aa45046c390');
console.log('Товар "+1 час в сутках" удален из корзины: ', cart.getItems());
// - очистка корзины
cart.clear();
console.log('Корзина пуста: ', cart.getItems());

console.log('..................................')

// Класс BuyerModel
console.log(('Класс BuyerModel').toUpperCase())
console.log('..................................')

// - обновление данных покупателя
buyer.setData({
  payment: 'cash',
  email: "pete@gmail.com",
  phone: "+17035456700",
  address: "1400 Defense Pentagon, Washington, DC 20301, USA"
})
// - получение данных покупателя
console.log('Данные покупателя: ', buyer.getData());
// - валидация покупателя (успешно)
const errors1 = buyer.validate();
console.log(Object.keys(errors1).length === 0 ? 'Валидация покупателя прошла успешно: ' : 'Выявлены ошибки валидации: ',
  errors1);
// - очистка данных покупателя
buyer.clear();
console.log('Данные покупателя удалены: ', buyer.getData());
// console.log('Данные покупателя: ', buyer.getData());
// - валидация покупателя (ошибка)
const errors2 = buyer.validate();
console.log(Object.keys(errors2).length === 0 ? 'Валидация покупателя прошла успешно: ' : 'Выявлены ошибки валидации: ',
  errors2);


console.log('..................................')

// Класс WebLarekApi

console.log(('Класс WebLarekApi').toUpperCase())
console.log('..................................')

// - GET запрос на сервер
weblarekApi.getProducts()
  .then(res => {
    console.log('GET запрос на сервер: ', res)
    if('items' in res) {
    catalog.setProducts(res.items)
    console.log('Сохранение данных каталога в модели: ', catalog.getProducts())
    }
  })
  .catch(err => console.log('Ошибка получения данных каталога:', err))

// - оформление заказа: ответ сервера с подтверждением покупки
buyer.setData({
  payment: 'cash',
  email: "pete@gmail.com",
  phone: "+17035456700",
  address: "1400 Defense Pentagon, Washington, DC 20301, USA"
})

if(product1) {
  cart.addItem(product1)
};
if(product2) {
  cart.addItem(product2)
};

function getItemIds(): string[] {
  const products = cart.getItems();
  const ids = products.map(i => i.id);
  return ids;
}

const order1 = {
  ...buyer.getData(),
  total: cart.getTotalPrice(),
  items: getItemIds()
};

weblarekApi.postOrder(order1)
  .then(res => {
    console.log('Заказ оформлен: ', res)
  })
  .catch(err => {
    console.log('Ошибка при оформлении заказа: ', err)
  });

// - оформление заказа: ответ сервера с ошибкой
buyer.clear();

const order2 = {
  ...order1,
  ...buyer.getData()
};

weblarekApi.postOrder(order2)
  .then(res => {
    console.log('Заказ оформлен: ', res)
  })
  .catch(err => {
    console.log('Ошибка при оформлении заказа: ', err)
  });
