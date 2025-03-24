import { Essence } from './Essence.ts';
import { BienaymeVarianceModel } from './models/BienaymeVarianceModel.ts';
import { MonteCarloSimulationModel } from './models/MonteCarloSimulationModel.ts';
import Decimal from 'decimal.js-light';

interface CalculatorProps {
    essences: Essence[];
    model: BienaymeVarianceModel | MonteCarloSimulationModel;
}

export class Calculator {
    public model: BienaymeVarianceModel | MonteCarloSimulationModel;
    public essences: Essence[];
    private readonly greaterEssenceDropChance: Decimal;

    constructor({ essences, model }: CalculatorProps) {
        this.model = model;
        this.essences = essences;
        this.greaterEssenceDropChance = new Decimal('0.007');
    }

    calculatePredictedProfit(essencePrice: number, quantityBought: number): string {
        const totalInvestment = new Decimal(essencePrice).times(new Decimal(quantityBought));
        const totalTrades = new Decimal(quantityBought).dividedBy(3);

        const { averageValueLesser, averageValueGreater } = this.getAverageEssenceValues();

        const lesserEssenceDropChance = new Decimal('1').minus(this.greaterEssenceDropChance);
        const expectedValuePerTrade = averageValueGreater
            .times(this.greaterEssenceDropChance)
            .plus(averageValueLesser.times(lesserEssenceDropChance));

        const expectedTotalValue = totalTrades.times(expectedValuePerTrade);
        const expectedProfit = expectedTotalValue.minus(totalInvestment);

        return expectedProfit.toDecimalPlaces(3).toString();
    }

    async calculateProfitRange(
        essencePrice: number,
        quantityBought: number,
    ): Promise<
        | {
              minProfit: string;
              maxProfit: string;
              variance: string;
              fluctuationPercentage: string;
              standardDeviation: string;
          }
        | false
    > {
        const { averageValueLesser, averageValueGreater } = this.getAverageEssenceValues();
        const totalInvestment = new Decimal(this.getTotalInvestment(essencePrice, quantityBought));
        const expectedProfit = this.calculatePredictedProfit(essencePrice, quantityBought);

        try {
            return await this.model.calculateProfitRange(
                this.essences,
                quantityBought,
                totalInvestment,
                new Decimal(expectedProfit),
                this.greaterEssenceDropChance,
                averageValueGreater,
                averageValueLesser,
            );
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    getTotalInvestment(essencePrice: number, quantityBought: number): number {
        return essencePrice * quantityBought;
    }

    getAverageEssenceValues(): {
        averageValueLesser: Decimal;
        averageValueGreater: Decimal;
    } {
        const lesserEssences = this.essences.filter(essence => !essence.isGreater);
        const greaterEssences = this.essences.filter(essence => essence.isGreater);

        const averageValueLesser = lesserEssences
            .reduce((total, curr) => {
                return total.plus(new Decimal(curr.inputPrice));
            }, new Decimal('0'))
            .dividedBy(lesserEssences.length);

        const averageValueGreater = greaterEssences
            .reduce((total, curr) => {
                return total.plus(new Decimal(curr.inputPrice));
            }, new Decimal('0'))
            .dividedBy(greaterEssences.length);

        return { averageValueLesser, averageValueGreater };
    }
}
