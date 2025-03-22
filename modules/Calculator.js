export class Calculator {
    essences = [];

    constructor(essences) {
        this.essences = essences;
        this.greaterEssenceDropChance = new window.Decimal("0.007");
    }

    calculatePredictedProfit(essenceId, quantityBought) {
        const totalCost = new window.Decimal(this.getTotalInvestment(essenceId, quantityBought));

        const totalTrades = new window.Decimal(quantityBought).dividedBy(3);

        const lesserEssences = this.essences.filter(essence => !essence.isGreater);
        const greaterEssences = this.essences.filter(essence => essence.isGreater);

        const averageValueLesser = lesserEssences.reduce((totalValue, currentValue) => {
            return totalValue.plus(new window.Decimal(currentValue.inputPrice));
        }, new window.Decimal("0")).dividedBy(lesserEssences.length);

        const averageValueGreater = greaterEssences.reduce((totalValue, currentValue) => {
            return totalValue.plus(new window.Decimal(currentValue.inputPrice));
        }, new window.Decimal("0")).dividedBy(greaterEssences.length);

        const expectedGreaterValuePerTrade = averageValueGreater.times(this.greaterEssenceDropChance);
        const expectedLesserValuePerTrade = averageValueLesser.times(new window.Decimal("1").minus(this.greaterEssenceDropChance));

        const expectedValuePerTrade = expectedGreaterValuePerTrade.plus(expectedLesserValuePerTrade);
        const expectedTotalValue = totalTrades.times(expectedValuePerTrade);

        const expectedProfit = expectedTotalValue.minus(totalCost);

        return expectedProfit.toDecimalPlaces(3).toString(); // changed from .value to .toString()
    }

    calculateVariance(essences) {
        const totalEssencePrice = essences.reduce((sum, essence) => {
            return sum.plus(new window.Decimal(essence.fetchedPrice));
        }, new window.Decimal("0"));

        const averageEssencePrice = totalEssencePrice.dividedBy(essences.length);
        console.log(averageEssencePrice.toDecimalPlaces(3).toString())
        const averageVariance = essences.reduce((sum, essence) => {
            const difference = new window.Decimal(essence.fetchedPrice).minus(averageEssencePrice);
            return sum.plus(difference.toPower(2));
        }, new window.Decimal("0")).dividedBy(essences.length);
        console.log(averageVariance.toDecimalPlaces(3).toString());
        const tradeVariance = averageVariance.times(3);
        const tradeStandardDeviation = tradeVariance.squareRoot();

        const expectedProfitPerTrade = averageEssencePrice.times(3);

        const zScore = new window.Decimal("1.96");
        const errorMargin = zScore.times(tradeStandardDeviation);

        const minProfit = expectedProfitPerTrade.minus(errorMargin);
        const maxProfit = expectedProfitPerTrade.plus(errorMargin);

        return {
            variance: tradeVariance.toDecimalPlaces(3).toString(),
            minProfit: minProfit.toDecimalPlaces(3).toString(),
            maxProfit: maxProfit.toDecimalPlaces(3).toString(),
        };
    }

    getBoughtEssence(essenceId) {
        return this.essences.find(essence => essence.id === essenceId);
    }

    getTotalInvestment(essenceId, quantityBought) {
        return this.getBoughtEssence(essenceId).inputPrice * quantityBought;
    }
}