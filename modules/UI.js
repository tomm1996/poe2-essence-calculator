import {Data} from "./Data.js";
import {Calculator} from "./Calculator.js";

export class UI {
    async init () {
        this.addListeners();
        this.data = new Data('data.php');

        await this.data.fetchData();

        this.calc = new Calculator(this.data.essences);
    }

    addListeners () {
        document.querySelector('[data-submit]').addEventListener('mouseup', () => {
            UI.showError('');

            this.calculate();
        });
    }

    calculate () {

        const selected = document.querySelector('[data-buy-type]');
        const quantity = document.querySelector('[data-amount]');

        if (!selected.value || isNaN(parseInt(quantity.value))) {
            return UI.showError('U dun goofed');
        }

        this.calc.calculatePredictedProfit(selected.value, parseInt(quantity.value));
        this.showResult(
            this.calc.getTotalInvestment(selected.value, quantity.value),
            quantity.value,
            this.calc.getBoughtEssence(selected.value).name,
            this.calc.getBoughtEssence(selected.value).inputPrice,
            this.calc.calculatePredictedProfit(selected.value, parseInt(quantity.value)),
            this.calc.calculateVariance(this.data.essences)
        )
    }

    static showError (error) {
        document.querySelector('[data-errors]').innerHTML = error;
    }
    showResult (
        invest,
        quantity,
        type,
        singlePrice,
        profit,
        variance
    ) {
        document.querySelector('[data-invest]').innerHTML = invest + ' Exalted Orbs';
        document.querySelector('[data-quantity]').innerHTML = quantity;
        document.querySelector('[data-type]').innerHTML = type;
        document.querySelector('[data-single-price]').innerHTML = singlePrice + ' Exalted Orbs';
        document.querySelector('[data-profit]').innerHTML = profit + ' Exalted Orbs';
        document.querySelector('[data-result-container]').classList.add('show')
        document.querySelector('[data-variance]').innerHTML = variance.variance+ '%'
        document.querySelector('[data-variance-min]').innerHTML = variance.minProfit + ' Exalted Orbs'
        document.querySelector('[data-variance-max]').innerHTML = variance.maxProfit + ' Exalted Orbs'
    }
}