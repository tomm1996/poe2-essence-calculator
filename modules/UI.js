import {Data} from "./Data.js";
import {Calculator} from "./Calculator.js";
import {BienaymeVarianceModel} from "./models/BienaymeVarianceModel.js";
import {MonteCarloSimulationModel} from "./models/MonteCarloSimulationModel.js";

export class UI {
    async init () {
        this.addListeners();
        this.data = new Data('data.php');

        await this.data.fetchData();

        const model = new BienaymeVarianceModel()
        const model2 = new MonteCarloSimulationModel()
        this.calc = new Calculator({essences: this.data.essences, model: model2});
    }

    addListeners () {
        document.querySelector('[data-submit]').addEventListener('mouseup', async () => {
            UI.showError('');
            await this.calculate();
        });
    }

    async calculate () {
        const selected = document.querySelector('[data-buy-type]');
        const quantityInput = document.querySelector('[data-amount]');
        const quantity = parseInt(quantityInput.value);

        if (!selected.value || isNaN(quantity)) {
            return UI.showError('U dun goofed');
        }

        // Calculate investment and profit details
        const profit = await this.calc.calculatePredictedProfit(selected.value, quantity);
        const {minProfit, maxProfit, fluctuationPercentage} = await this.calc.calculateProfitRange(selected.value, quantity);
        const invest = this.calc.getTotalInvestment(selected.value, quantity);
        const boughtEssence = this.calc.getBoughtEssence(selected.value);

        this.showResult({
            invest,
            quantity: quantity,
            type: boughtEssence.name,
            singlePrice: boughtEssence.inputPrice,
            profit,
            fluctuationPercentage,
            minProfit,
            maxProfit
        });
    }

    static showError (error) {
        document.querySelector('[data-errors]').innerHTML = error;
    }

    showResult ({
        invest,
        quantity,
        type,
        singlePrice,
        profit,
        fluctuationPercentage,
        minProfit,
        maxProfit
    }) {
        document.querySelector('[data-invest]').innerHTML = invest + ' Exalted Orbs';
        document.querySelector('[data-quantity]').innerHTML = quantity;
        document.querySelector('[data-type]').innerHTML = type;
        document.querySelector('[data-single-price]').innerHTML = singlePrice + ' Exalted Orbs';
        document.querySelector('[data-profit]').innerHTML = profit + ' Exalted Orbs';
        document.querySelector('[data-result-container]').classList.add('show');
        document.querySelector('[data-variance]').innerHTML = fluctuationPercentage + '%';
        document.querySelector('[data-variance-min]').innerHTML = minProfit + ' Exalted Orbs';
        document.querySelector('[data-variance-max]').innerHTML = maxProfit + ' Exalted Orbs';
    }
}
