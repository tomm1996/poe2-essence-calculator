interface LatestPrice {
    price: string;
}

export interface EssenceObject {
    type: string;
    latest_price: LatestPrice;
    id: string;
    simpleMode: boolean;
}

export class Essence {
    public name: string;
    public fetchedPrice: number;
    public inputPrice: number;
    public id: string;
    public hide: boolean = false;
    private priceText: Text | undefined;
    public simpleMode: boolean;
    private input: HTMLInputElement | undefined;

    constructor({ type, latest_price, id, simpleMode }: EssenceObject) {
        this.name = type;
        this.fetchedPrice = parseFloat(latest_price.price);
        this.id = id;
        this.inputPrice = this.getPriceFromCookies() ?? this.fetchedPrice;
        this.simpleMode = simpleMode;
    }

    get isGreater(): boolean {
        return this.id.includes('greater');
    }

    async render(): Promise<void> {
        this.inputPrice = this.getPriceFromCookies() ?? this.fetchedPrice;
        const essenceContainer = document.querySelector('[data-essences]');
        const essencePreviewContainer = document.querySelector('[data-preview-essences]');
        const buyTypeSelect = document.querySelector('[data-buy-type]');

        if (essenceContainer && buyTypeSelect && essencePreviewContainer) {
            const label = this.createEssenceLabel();
            essenceContainer.appendChild(label);

            const preview = this.createPreviewElement();
            essencePreviewContainer.appendChild(preview);

            if (this.simpleMode) {
                return;
            }

            const option = this.createBuyTypeOption();
            buyTypeSelect.appendChild(option);
        }
    }
    private createPreviewElement(): HTMLElement {
        const container = document.createElement('div');
        container.classList.add('preview-element');
        container.setAttribute('data-preview-essence', this.id);
        container.setAttribute('title', 'Average Price');

        const imageElement = this.createImageElement();
        container.appendChild(imageElement);

        const nameElement = document.createElement('span');
        const nameText = document.createTextNode(this.name + ': ');
        nameElement.appendChild(nameText);
        container.appendChild(nameElement);

        const priceElement = document.createElement('span');
        this.priceText = document.createTextNode(this.inputPrice.toString());
        const priceImageElement = this.createImageElement('exalted-orb');

        priceElement.appendChild(this.priceText);
        priceElement.appendChild(priceImageElement);

        container.appendChild(priceElement);

        return container;
    }
    private createEssenceLabel(): HTMLElement {
        const label = document.createElement('label');
        label.classList.add('essence');
        label.setAttribute('data-essence', this.id);

        const nameElement = document.createElement('span');
        const nameText = document.createTextNode(this.name);
        nameElement.classList.add('title');
        nameElement.appendChild(nameText);
        label.appendChild(nameElement);

        const imageElement = this.createImageElement();
        label.appendChild(imageElement);

        this.input = this.createInputElement();
        label.appendChild(this.input);

        return label;
    }

    private createImageElement(imageName?: string): HTMLImageElement {
        const imageElement = document.createElement('img');
        imageElement.alt = this.name;
        imageElement.loading = 'lazy';

        this.loadImage(imageElement, imageName);

        return imageElement;
    }

    private async loadImage(imageElement: HTMLImageElement, imageName?: string): Promise<void> {
        try {
            const imageModule = await import(`../../img/${imageName ? imageName : this.id}.png`);
            imageElement.src = imageModule.default;
        } catch (error) {
            console.error(`Error loading image ${this.id}:`, error);
        }
    }

    private createInputElement(): HTMLInputElement {
        const input = document.createElement('input');
        input.type = 'number';
        input.name = this.id;
        input.value = this.inputPrice.toString();
        input.addEventListener('change', this.handleInputChange.bind(this));

        return input;
    }

    private handleInputChange(ev: Event): void {
        const target = ev.target as HTMLInputElement;
        this.inputPrice = parseFloat(target.value);
        if (this.priceText) {
            this.priceText.textContent = parseFloat(target.value).toString();
        }
        this.updatePriceInCookies();
    }

    private createBuyTypeOption(): HTMLOptionElement {
        const option = document.createElement('option');
        option.value = this.id;
        option.textContent = this.name;

        return option;
    }
    private getPriceFromCookies(): number | null {
        const cookieValue = document.cookie
            .split('; ')
            .find(row => row.startsWith(`essence_price_${this.id}=`))
            ?.split('=')[1];
        return cookieValue ? parseFloat(cookieValue) : null;
    }

    private setPriceInCookies(): void {
        document.cookie = `essence_price_${this.id}=${this.inputPrice}; path=/`;
    }

    private updatePriceInCookies(): void {
        this.setPriceInCookies();
    }

    public resetPrice(): void {
        this.inputPrice = this.fetchedPrice;
        if (this.priceText) {
            this.priceText.textContent = this.fetchedPrice.toString();
        }
        if (this.input) {
            this.input.value = this.fetchedPrice.toString();
        }
        this.updatePriceInCookies();
    }
}
