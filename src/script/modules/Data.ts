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
    private blacklist: string[] = [
        'essence-of-insanity',
        'essence-of-delirium',
        'essence-of-horror',
        'essence-of-hysteria',
    ];
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

        return this.priceData.items
            .filter(item => !this.blacklist.includes(item.apiId))
            .map(item => new Essence(item))
            .sort((a, b) => {
                return a.id.localeCompare(b.id);
            });
    }
    private createSimpleEssences(): Essence[] {
        const calc = new Calculator({ model: this.model, essences: this.extendedModeEssences });

        const { averageValueLesser, averageValueGreater } = calc.getAverageEssenceValues();

        return [
            new Essence({
                text: 'Average Lesser Essence',
                apiId: 'essence-of-sorcery',
                currentPrice: averageValueLesser.toFixed(3).toString(),
                simpleMode: this.simpleMode,
            }),
            new Essence({
                text: 'Average Greater Essence',
                apiId: 'greater-essence-of-ruin',
                currentPrice: averageValueGreater.toFixed(3).toString(),
                simpleMode: this.simpleMode,
            }),
        ];
    }
}
