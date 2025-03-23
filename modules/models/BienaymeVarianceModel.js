export class BienaymeVarianceModel {
    async calculateProfitRange (essences, quantityBought, totalInvestment, expectedProfit, greaterEssenceDropChance, averageValueGreater, averageValueLesser) {
        const totalTrades = new window.Decimal(quantityBought).dividedBy(3);

        const lesserEssences = essences.filter(essence => !essence.isGreater);
        const greaterEssences = essences.filter(essence => essence.isGreater);

        const lesserEssenceDropChance = new window.Decimal("1").minus(greaterEssenceDropChance);

        const averageLesserSquared = lesserEssences.reduce((total, curr) => {
            const val = new window.Decimal(curr.inputPrice);
            return total.plus(val.toPower(2));
        }, new window.Decimal("0")).dividedBy(lesserEssences.length);

        const averageGreaterSquared = greaterEssences.reduce((total, curr) => {
            const val = new window.Decimal(curr.inputPrice);
            return total.plus(val.toPower(2));
        }, new window.Decimal("0")).dividedBy(greaterEssences.length);

        const expectedValuePerTrade = averageValueGreater.times(greaterEssenceDropChance)
            .plus(averageValueLesser.times(lesserEssenceDropChance));
        const expectedValueSquaredPerTrade = averageGreaterSquared.times(greaterEssenceDropChance)
            .plus(averageLesserSquared.times(lesserEssenceDropChance));

        const variancePerTrade = expectedValueSquaredPerTrade.minus(expectedValuePerTrade.toPower(2));

        const totalVariance = variancePerTrade.times(totalTrades);
        const standardDeviation = totalVariance.squareRoot();

        const stdDev = new window.Decimal(standardDeviation);

        let minProfit = expectedProfit.minus(stdDev.times(2));
        let maxProfit = expectedProfit.plus(stdDev.times(2));

        if (minProfit.lessThan(totalInvestment.negated())) {
            minProfit = totalInvestment.negated();
        }

        const fluctuationPercentage = totalInvestment.equals(0)
            ? "0.000"
            : standardDeviation.dividedBy(totalInvestment).times(100).toDecimalPlaces(3).toString();

        return {
            minProfit: minProfit.toDecimalPlaces(3).toString(),
            maxProfit: maxProfit.toDecimalPlaces(3).toString(),
            variance: totalVariance.toDecimalPlaces(3).toString(),
            fluctuationPercentage: fluctuationPercentage,
            standardDeviation: standardDeviation.toDecimalPlaces(3).toString()
        };
    }
}