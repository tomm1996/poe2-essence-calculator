import { Essence } from './Essence.ts';

interface PriceData {
    items: Array<{
        type: string;
        latest_price: { price: string };
        id: string;
    }>;
}

export class Data {
    private readonly url: string;
    private priceData: PriceData | null = null;
    public essences: Essence[] = [];

    constructor(url: string) {
        this.url = url;
    }

    async fetchData(): Promise<void> {
        await this.fetchPrices();
        this.createEssences();
    }

    private async fetchPrices(): Promise<void> {
        try {
            const response = await fetch(this.url);
            if (!response.ok) {
                console.error(response);
                return;
            }

            this.priceData = await response.json();
        } catch (error: unknown) {
            let errorMessage = 'Error fetching Price Data';

            if (error instanceof Error) {
                errorMessage = error.message;
            }

            console.error(errorMessage);
        }
    }

    private createEssences(): void {
        if (this.priceData) {
            this.priceData.items.forEach(item => this.essences.push(new Essence(item)));
            this.essences = this.essences.sort((a, b) => a.id.localeCompare(b.id));

            this.essences.forEach(essence => essence.render());
        }
    }
}
