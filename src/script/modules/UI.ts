import { Data } from './Data.ts';
import { Calculator } from './Calculator.ts';
import { MonteCarloSimulationModel } from './models/MonteCarloSimulationModel.ts';
import { BienaymeVarianceModel } from './models/BienaymeVarianceModel.ts';

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
        this.data = new Data('data.json');
        const bienamye = new BienaymeVarianceModel();
        const montecarlo = new MonteCarloSimulationModel();

        this.models.push(bienamye, montecarlo);

        this.calc = new Calculator({
            essences: this.data.essences,
            model: this.models[1],
        });
    }
    async init(): Promise<void> {
        this.addListeners();

        await this.data.fetchData();
    }

    addListeners(): void {
        document.querySelector('[data-submit]')?.addEventListener('mouseup', async () => {
            UI.showError('');

            await this.calculate();
        });
    }

    async calculate(): Promise<void> {
        const selected = document.querySelector('[data-buy-type]') as HTMLSelectElement;
        const quantityInput = document.querySelector('[data-amount]') as HTMLInputElement;
        const quantity = parseInt(quantityInput.value, 10);

        if (!selected.value || isNaN(quantity)) {
            return UI.showError('U dun goofed');
        }
        // Calculate investment and profit details
        const profit = this.calc.calculatePredictedProfit(selected.value, quantity);
        const varianceObj = await this.calc.calculateProfitRange(selected.value, quantity);
        if (!varianceObj) {
            UI.showError('something went wrong');
            return;
        }

        const { minProfit, maxProfit, fluctuationPercentage } = varianceObj;
        const invest = this.calc.getTotalInvestment(selected.value, quantity).toString();
        const boughtEssence = this.calc.getBoughtEssence(selected.value);

        this.showResult({
            invest,
            quantity,
            type: boughtEssence.name,
            singlePrice: boughtEssence.inputPrice.toString(),
            profit,
            fluctuationPercentage,
            minProfit,
            maxProfit,
        });
    }

    static showError(error: string): void {
        document.querySelector('[data-errors]')!.innerHTML = error;
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
        document.querySelector('[data-invest]')!.innerHTML = invest + ' Exalted Orbs';
        document.querySelector('[data-quantity]')!.innerHTML = quantity.toString();
        document.querySelector('[data-type]')!.innerHTML = type;
        document.querySelector('[data-single-price]')!.innerHTML = singlePrice + ' Exalted Orbs';
        document.querySelector('[data-profit]')!.innerHTML = profit + ' Exalted Orbs';
        document.querySelector('[data-result-container]')!.classList.add('show');
        document.querySelector('[data-variance]')!.innerHTML = fluctuationPercentage + '%';
        document.querySelector('[data-variance-min]')!.innerHTML = minProfit + ' Exalted Orbs';
        document.querySelector('[data-variance-max]')!.innerHTML = maxProfit + ' Exalted Orbs';
    }
}
