import Decimal from 'decimal.js-light';

import { Essence } from '../Essence.ts';

interface ProfitRangeResult {
    minProfit: string;
    maxProfit: string;
    variance: string;
    fluctuationPercentage: string;
    standardDeviation: string;
}

/**
 * Calculates the profit range based on Bienaymé's variance formula.
 * It models the total profit as the sum of individual profits from each trade,
 * considering the average values of lesser and greater essences, and their associated drop chances.
 * The model computes the expected profit, variance, and standard deviation to estimate the profit range.
 *
 * - Expected Value per Trade (E[X]):
 *     E[X] = (averageValueGreater * greaterEssenceDropChance) + (averageValueLesser * lesserEssenceDropChance)
 * - Variance per Trade (Var[X]):
 *     Var[X] = (averageValueGreater^2 * greaterEssenceDropChance) + (averageValueLesser^2 * lesserEssenceDropChance) - E[X]^2
 * - Total Variance (Var[Total]):
 *     Var[Total] = Var[X] * totalTrades
 * - Standard Deviation (SD):
 *     SD = √Var[Total]
 * - Profit Range:
 *     minProfit = expectedProfit - (2 * SD)
 *     maxProfit = expectedProfit + (2 * SD)
 */
export class BienaymeVarianceModel {
    public name = 'bienayme';

    async calculateProfitRange(
        essences: Essence[],
        quantityBought: number,
        totalInvestment: Decimal,
        expectedProfit: Decimal,
        greaterEssenceDropChance: Decimal,
        averageValueGreater: Decimal,
        averageValueLesser: Decimal,
    ): Promise<ProfitRangeResult> {
        const totalTrades = new Decimal(quantityBought).dividedBy(3);

        const lesserEssences = essences.filter(essence => !essence.isGreater);
        const greaterEssences = essences.filter(essence => essence.isGreater);

        const lesserEssenceDropChance = new Decimal('1').minus(greaterEssenceDropChance);

        const averageLesserSquared = lesserEssences
            .reduce((total, curr) => {
                const val = new Decimal(curr.inputPrice);
                return total.plus(val.toPower(2));
            }, new Decimal('0'))
            .dividedBy(lesserEssences.length);

        const averageGreaterSquared = greaterEssences
            .reduce((total, curr) => {
                const val = new Decimal(curr.inputPrice);
                return total.plus(val.toPower(2));
            }, new Decimal('0'))
            .dividedBy(greaterEssences.length);

        const expectedValuePerTrade = averageValueGreater
            .times(greaterEssenceDropChance)
            .plus(averageValueLesser.times(lesserEssenceDropChance));
        const expectedValueSquaredPerTrade = averageGreaterSquared
            .times(greaterEssenceDropChance)
            .plus(averageLesserSquared.times(lesserEssenceDropChance));

        const variancePerTrade = expectedValueSquaredPerTrade.minus(expectedValuePerTrade.toPower(2));

        const totalVariance = variancePerTrade.times(totalTrades);
        const standardDeviation = totalVariance.squareRoot();

        const stdDev = new Decimal(standardDeviation);

        let minProfit = expectedProfit.minus(stdDev.times(2));
        const maxProfit = expectedProfit.plus(stdDev.times(2));

        if (minProfit.lessThan(totalInvestment.negated())) {
            minProfit = totalInvestment.negated();
        }

        const fluctuationPercentage = totalInvestment.equals(0)
            ? '0.000'
            : standardDeviation.dividedBy(totalInvestment).times(100).toDecimalPlaces(3).toString();

        return {
            minProfit: minProfit.toDecimalPlaces(3).toString(),
            maxProfit: maxProfit.toDecimalPlaces(3).toString(),
            variance: totalVariance.toDecimalPlaces(3).toString(),
            fluctuationPercentage: fluctuationPercentage,
            standardDeviation: standardDeviation.toDecimalPlaces(3).toString(),
        };
    }
}
