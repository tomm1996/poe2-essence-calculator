import { Data } from './Data.ts';
import { Calculator } from './Calculator.ts';
import { MonteCarloSimulationModel } from './models/MonteCarloSimulationModel.ts';
import { BienaymeVarianceModel } from './models/BienaymeVarianceModel.ts';
import { Essence } from './Essence.ts';

interface ProfitResult {
    invest: string;
    quantity: number;
    type: string;
    singlePrice: string;
    profit: string;
    fluctuationPercentage: string;
    minProfit: string;
    maxProfit: string;
}

export class UI {
    private data: Data;
    private calc: Calculator;
    private models: Array<BienaymeVarianceModel | MonteCarloSimulationModel> = [];

    constructor() {
        const bienamye = new BienaymeVarianceModel();
        const montecarlo = new MonteCarloSimulationModel();

        this.data = new Data({ url: 'data.json', model: this.models[1] });

        this.models.push(bienamye, montecarlo);

        this.calc = new Calculator({
            essences: this.data.essences,
            model: this.models[1],
        });
    }
    async init(): Promise<void> {
        this.addListeners();

        await this.data.fetchData();
        this.calc.essences = this.data.essences;

        this.createEssences();
    }

    addListeners(): void {
        document.querySelector('[data-submit]')?.addEventListener('mouseup', async () => {
            UI.showError('');

            await this.calculate();
        });

        document.querySelectorAll('[data-model]')?.forEach(item =>
            item.addEventListener('change', ev => {
                const model = this.models.find(model => model.name === (ev.target as HTMLInputElement).value);
                if (model === undefined) {
                    return;
                }

                this.calc.model = model;
                this.data.model = model;
            }),
        );

        document.querySelector('#toggle-switch')?.addEventListener('change', (ev: Event) => {
            this.data.simpleMode = !(ev.target as HTMLInputElement).checked;
            this.createEssences();
            this.calc.essences = this.data.essences;
        });

        document.addEventListener('click', (ev: Event) => {
            const outsideClick = document.querySelector('.modal-wrapper')?.isSameNode(ev.target as HTMLElement);
            const close = document.querySelector('[data-close]')?.isSameNode(ev.target as HTMLElement);

            if (outsideClick || close) {
                document.querySelector('body')?.classList.remove('modal');
            }
        });

        document.querySelector('[data-edit]')?.addEventListener('click', () => {
            document.querySelector('body')?.classList.add('modal');
        });

        document.querySelector('[data-reset]')?.addEventListener('click', () => {
            this.data.essences.forEach(essence => essence.resetPrice());
            this.createEssences();
        });
    }
    createEssences() {
        const essenceContainer = document.querySelector('[data-preview-essences]');
        const essenceEditContainer = document.querySelector('[data-essences]');

        this.data.simpleMode = !(document.querySelector('#toggle-switch') as HTMLInputElement).checked;
        this.calc.essences = this.data.essences;

        document.querySelector('.buy-type')?.classList.remove('show');
        document.querySelector('.price-per-essence')?.classList.remove('show');

        document.querySelector(this.data.simpleMode ? '.price-per-essence' : '.buy-type')?.classList.add('show');

        if (essenceContainer) {
            essenceContainer.innerHTML = '';
        }
        if (essenceEditContainer) {
            essenceEditContainer.innerHTML = '';
        }

        Promise.all(
            this.data.essences.map(essence => {
                essence.simpleMode = this.data.simpleMode;
                return essence.render();
            }),
        ).then(() => {
            document.querySelector('.loading-container')?.classList.add('hide');
        });
    }
    async calculate(): Promise<void> {
        const selected = document.querySelector('[data-buy-type]') as HTMLSelectElement;
        const quantityInput = document.querySelector('[data-amount]') as HTMLInputElement;
        const quantity = quantityInput.value;
        const priceSimple = parseFloat((document.querySelector('[data-price-per-essence]') as HTMLInputElement)?.value);

        if (!this.validate(selected, priceSimple, quantity)) {
            return;
        }

        document.querySelector('[data-result-container]')?.classList.add('show');
        document.querySelector('.loading-result-container')?.classList.add('show');
        document.querySelector('.result')?.classList.remove('show');

        const price = this.data.simpleMode ? priceSimple : this.getBoughtEssence(selected.value)?.inputPrice;

        const profit = this.calc.calculatePredictedProfit(price, parseInt(quantity));
        const varianceObj = await this.calc.calculateProfitRange(price, parseInt(quantity));

        if (!varianceObj) {
            UI.showError('something went wrong');
            return;
        }

        const { minProfit, maxProfit, fluctuationPercentage } = varianceObj;
        const invest = this.calc.getTotalInvestment(price, parseInt(quantity)).toString();

        this.showResult({
            invest,
            quantity: parseInt(quantity),
            type: this.data.simpleMode ? 'Essences' : this.getBoughtEssence(selected.value).name,
            singlePrice: price?.toString(),
            profit,
            fluctuationPercentage,
            minProfit,
            maxProfit,
        });
    }

    static showError(error: string): void {
        if (error === '') {
            document.querySelector('[data-errors]')!.innerHTML = '';

            return;
        }

        document.querySelector('[data-errors]')!.innerHTML = '<p>' + error + '</p>';
    }

    getBoughtEssence(essenceId: string): Essence {
        const essence = this.data.essences.find(essence => essence.id === essenceId);
        if (!essence) {
            UI.showError('Something went wrong. Please reload the page');
            throw new Error('Essence not found in data somehow');
        }

        return essence;
    }

    validate(selected: HTMLSelectElement, priceSimple: number, quantity: string) {
        const parsedQuantity = parseInt(quantity);

        if (!quantity || quantity.length === 0 || isNaN(parseInt(quantity)) || parsedQuantity <= 0) {
            UI.showError('Please select a quantity');
            return false;
        }
        if (this.data.simpleMode && (isNaN(priceSimple) || !priceSimple)) {
            UI.showError('Please input a price');

            return false;
        }
        if (!this.data.simpleMode && (!selected.value || selected.value.length < 1)) {
            UI.showError('Please select an essence');

            return false;
        }
        return true;
    }
    showResult({
        invest,
        quantity,
        type,
        singlePrice,
        profit,
        fluctuationPercentage,
        minProfit,
        maxProfit,
    }: ProfitResult): void {
        document.querySelector('.loading-result-container')?.classList.remove('show');
        document.querySelector('.result')?.classList.add('show');

        document.querySelector('[data-invest]')!.innerHTML = invest + ' Exalted Orbs';
        document.querySelector('[data-quantity]')!.innerHTML = quantity.toString();
        document.querySelector('[data-type]')!.innerHTML = type;
        document.querySelector('[data-single-price]')!.innerHTML = singlePrice + ' Exalted Orbs';
        document.querySelector('[data-profit]')!.innerHTML = profit + ' Exalted Orbs';
        document.querySelector('[data-variance]')!.innerHTML = fluctuationPercentage + '%';
        document.querySelector('[data-variance-min]')!.innerHTML = minProfit + ' Exalted Orbs';
        document.querySelector('[data-variance-max]')!.innerHTML = maxProfit + ' Exalted Orbs';
    }
}
