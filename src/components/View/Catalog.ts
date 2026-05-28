import { ICatalog } from '../../types/index';
import { Component } from '../base/Component';

export class Catalog extends Component<ICatalog> {

  private catalogElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.catalogElement = container;
  }

  set catalog (items: HTMLElement[]) {
    this.catalogElement.replaceChildren(...items)
  }
}
