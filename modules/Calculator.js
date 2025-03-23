export class Calculator {
    constructor({essences, model}) {
        this.model = model;
        this.essences = essences;
        this.greaterEssenceDropChance = new window.Decimal("0.007");
    }

    calculatePredictedProfit(essenceId, quantityBought) {
        const totalCost = new window.Decimal(this.getTotalInvestment(essenceId, quantityBought));
        const totalTrades = new window.Decimal(quantityBought).dividedBy(3);


        const {averageValueLesser, averageValueGreater} = this.getAverageEssenceValues();

        const lesserEssenceDropChance = new window.Decimal("1").minus(this.greaterEssenceDropChance);
        const expectedValuePerTrade = averageValueGreater.times(this.greaterEssenceDropChance).plus(averageValueLesser.times(lesserEssenceDropChance));

        const expectedTotalValue = totalTrades.times(expectedValuePerTrade);
        const expectedProfit = expectedTotalValue.minus(totalCost);

        return expectedProfit.toDecimalPlaces(3).toString();
    }
    async calculateProfitRange(essenceId, quantityBought) {
        const {averageValueLesser, averageValueGreater} = this.getAverageEssenceValues();
        const totalInvestment = new window.Decimal(this.getTotalInvestment(essenceId, quantityBought));
        const expectedProfit = this.calculatePredictedProfit(essenceId, quantityBought)

        try {
            return await this.model.calculateProfitRange(
                this.essences,
                quantityBought,
                totalInvestment,
                new Decimal(expectedProfit),
                this.greaterEssenceDropChance,
                averageValueGreater,
                averageValueLesser
            )
        } catch (e) {
            console.error(e);

            return false;
        }
    }
    getBoughtEssence(essenceId) {
        return this.essences.find(essence => essence.id === essenceId);
    }

    getTotalInvestment(essenceId, quantityBought) {
        return this.getBoughtEssence(essenceId).inputPrice * quantityBought;
    }

    getAverageEssenceValues() {
        const lesserEssences = this.essences.filter(essence => !essence.isGreater);
        const greaterEssences = this.essences.filter(essence => essence.isGreater);

        const averageValueLesser = lesserEssences.reduce((total, curr) => {
            return total.plus(new window.Decimal(curr.inputPrice));
        }, new window.Decimal("0")).dividedBy(lesserEssences.length);

        const averageValueGreater = greaterEssences.reduce((total, curr) => {
            return total.plus(new window.Decimal(curr.inputPrice));
        }, new window.Decimal("0")).dividedBy(greaterEssences.length);
        return {averageValueLesser, averageValueGreater};
    }

}
