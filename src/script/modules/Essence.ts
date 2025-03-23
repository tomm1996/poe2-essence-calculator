interface LatestPrice {
    price: string;
}

interface EssenceObject {
    type: string;
    latest_price: LatestPrice;
    id: string;
}

export class Essence {
    public name: string = '';
    public fetchedPrice: number = 0;
    public inputPrice: number = 0;
    public id: string = '';

    constructor({ type, latest_price, id }: EssenceObject) {
        this.name = type;
        this.fetchedPrice = parseFloat(latest_price.price);
        this.id = id;
    }

    get isGreater(): boolean {
        return this.id.includes('greater');
    }

    async render(): Promise<void> {
        this.inputPrice = this.fetchedPrice;
        const essenceContainer = document.querySelector('[data-essences]');
        const buyTypeSelect = document.querySelector('[data-buy-type]');

        if (essenceContainer && buyTypeSelect) {
            const label = this.createEssenceLabel();
            essenceContainer.appendChild(label);

            const option = this.createBuyTypeOption();
            buyTypeSelect.appendChild(option);
        }
    }

    private createEssenceLabel(): HTMLElement {
        const label = document.createElement('label');
        label.classList.add('essence');
        label.setAttribute('data-essence', this.id);

        const nameText = document.createTextNode(this.name);
        label.appendChild(nameText);

        const imageElement = this.createImageElement();
        label.appendChild(imageElement);

        const input = this.createInputElement();
        label.appendChild(input);

        return label;
    }

    private createImageElement(): HTMLImageElement {
        const imageElement = document.createElement('img');
        imageElement.alt = this.name;
        imageElement.loading = 'lazy';

        this.loadImage(imageElement);

        return imageElement;
    }

    private async loadImage(imageElement: HTMLImageElement): Promise<void> {
        try {
            const imageModule = await import(`../../img/${this.id}.png`);
            imageElement.src = imageModule.default;
        } catch (error) {
            console.error(`Error loading image for essence ${this.id}:`, error);
            imageElement.src = '/path/to/fallback-image.png';
        }
    }

    private createInputElement(): HTMLInputElement {
        const input = document.createElement('input');
        input.type = 'number';
        input.name = this.id;
        input.value = this.fetchedPrice.toString();
        input.addEventListener('change', this.handleInputChange.bind(this));

        return input;
    }

    private handleInputChange(ev: Event): void {
        const target = ev.target as HTMLInputElement;
        this.inputPrice = parseFloat(target.value);
    }

    private createBuyTypeOption(): HTMLOptionElement {
        const option = document.createElement('option');
        option.value = this.id;
        option.textContent = this.name;

        return option;
    }
}
