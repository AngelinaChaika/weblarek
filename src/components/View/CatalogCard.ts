import { categoryMap } from '../../utils/constants'
import { ICatalogCard, IOnClickAction, TCategory } from '../../types/index';
import { Card } from './Card';

export class CatalogCard extends Card<ICatalogCard> {
  private categoryElement: HTMLElement;
  private imageElement: HTMLImageElement;

  constructor (container: HTMLButtonElement, actions?: IOnClickAction) {
    super(container);

    this.categoryElement = container.querySelector<HTMLElement>('.card__category')!;
    this.imageElement = container.querySelector<HTMLImageElement>('.card__image')!;

    this.container.addEventListener('click', () => {
      actions?.onClick();
    })
  }

  set category (value: TCategory) {
    this.categoryElement.textContent = value;
    Object.values(categoryMap).forEach(className => {
      this.categoryElement.classList.remove(className);
    });
    this.categoryElement.classList.add(categoryMap[value]);
  }

  set image (value: string) {
    this.setImage(this.imageElement, value);
  }
}
