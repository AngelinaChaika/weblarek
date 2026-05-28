import { categoryMap } from '../../utils/constants'
import { IPreviewCard, IPreviewCardAction, TCategory } from '../../types/index';
import { Card } from './Card';

export class PreviewCard extends Card<IPreviewCard> {
  private categoryElement: HTMLElement;
  private imageElement: HTMLImageElement;
  private descriptionElement: HTMLElement;
  private cardButton: HTMLButtonElement;

  constructor (container: HTMLElement, actions?: IPreviewCardAction) {
    super(container);

    this.categoryElement = container.querySelector<HTMLElement>('.card__category')!;
    this.imageElement = container.querySelector<HTMLImageElement>('.card__image')!;
    this.descriptionElement = container.querySelector<HTMLElement>('.card__text')!;
    this.cardButton = container.querySelector<HTMLButtonElement>('.card__button')!;

    this.cardButton.addEventListener('click', () => {
      actions?.onToggleBasket();
    });
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

  set description (value: string) {
    this.descriptionElement.textContent = value;
  }

  set buttonText(value: string) {
    this.cardButton.textContent = value;
  }

  set buttonDisabled(value: boolean) {
    this.cardButton.disabled = value;
  }
}
