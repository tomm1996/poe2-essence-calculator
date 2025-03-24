import { Essence, EssenceObject } from './Essence.ts';
import { Calculator } from './Calculator.ts';
import { BienaymeVarianceModel } from './models/BienaymeVarianceModel.ts';
import { MonteCarloSimulationModel } from './models/MonteCarloSimulationModel.ts';

interface PriceData {
    items: Array<EssenceObject>;
}

interface DataProps {
    url: string;
    model: BienaymeVarianceModel | MonteCarloSimulationModel;
}

export class Data {
    public model: BienaymeVarianceModel | MonteCarloSimulationModel;
    public simpleMode: boolean = true;

    private readonly url: string;
    private priceData: PriceData | null = null;
    private simpleModeEssences: Essence[] = [];
    private extendedModeEssences: Essence[] = [];

    constructor({ url, model }: DataProps) {
        this.url = url;
        this.model = model;
    }

    get essences() {
        return this.simpleMode ? this.simpleModeEssences : this.extendedModeEssences;
    }

    async fetchData(): Promise<void> {
        try {
            const response = await fetch(this.url);
            if (!response.ok) {
                console.error('Failed to fetch prices:', response.statusText);
                return;
            }
            this.priceData = await response.json();
        } catch (error) {
            console.error('Error fetching price data:', error);
        }

        this.extendedModeEssences = this.createEssencesFromFetchedData();
        this.simpleModeEssences = this.createSimpleEssences();
    }

    private createEssencesFromFetchedData(): Essence[] {
        if (!this.priceData) {
            return [];
        }

        return this.priceData.items.map(item => new Essence(item)).sort((a, b) => a.id.localeCompare(b.id));
    }

    private createSimpleEssences(): Essence[] {
        const calc = new Calculator({ model: this.model, essences: this.extendedModeEssences });

        const { averageValueLesser, averageValueGreater } = calc.getAverageEssenceValues();
        // const input = document.querySelector('[data-amount-input]') as HTMLInputElement;
        // const boughtPrice = input?.value && input.value.length > 0 ? input.value : '1';

        return [
            new Essence({
                type: 'Average Lesser Essence',
                id: 'essence-of-sorcery',
                latest_price: { price: averageValueLesser.toFixed(3).toString() },
            }),
            new Essence({
                type: 'Average Greater Essence',
                id: 'greater-essence-of-ruin',
                latest_price: { price: averageValueGreater.toFixed(3).toString() },
            }),
        ];
    }
}
