import Decimal from 'decimal.js-light';
import { Essence } from '../Essence.ts';

interface WorkerData {
    totalTrades: number;
    numSimulations: number;
    totalInvestment: number;
    expectedProfit: number;
    greaterEssenceDropChance: number;
    averageValueGreater: number;
    averageValueLesser: number;
}

interface ProfitRangeResult {
    minProfit: string;
    maxProfit: string;
    variance: string;
    fluctuationPercentage: string;
    standardDeviation: string;
}
/**
 * Estimates the profit range using Monte Carlo simulations.
 * It simulates a large number of trade sequences, randomly determining the outcome of each trade
 * based on the drop chances of greater and lesser essences, to model the distribution of potential profits.
 * The model computes the minimum and maximum profits, variance, and standard deviation from the simulation results.
 *
 * - Simulated Total Profit for a Sequence:
 *     totalProfit = Σ (outcome of each trade)
 * - Expected Profit:
 *     expectedProfit = (averageValueGreater * greaterEssenceDropChance * totalTrades) + (averageValueLesser * lesserEssenceDropChance * totalTrades) - totalInvestment
 * - Variance and Standard Deviation:
 *     Calculated based on the distribution of simulated total profits.
 * - Profit Range:
 *     minProfit = 2.5th percentile of simulated profits
 *     maxProfit = 97.5th percentile of simulated profits
 */
export class MonteCarloSimulationModel {
    private worker: Worker;
    public name = 'montecarlo';
    constructor() {
        this.worker = new Worker(new URL('./monteCarloWorker.ts', import.meta.url), { type: 'module' });
    }

    async calculateProfitRange(
        _essences: Essence[],
        quantityBought: number,
        totalInvestment: Decimal,
        expectedProfit: Decimal,
        greaterEssenceDropChance: Decimal,
        averageValueGreater: Decimal,
        averageValueLesser: Decimal,
    ): Promise<ProfitRangeResult> {
        const totalTrades = Math.floor(quantityBought / 3);
        const numSimulations = 10000;

        const totalInvestmentNum = totalInvestment.toNumber();
        const expectedProfitNum = expectedProfit.toNumber();
        const greaterEssenceDropChanceNum = greaterEssenceDropChance.toNumber();
        const averageValueGreaterNum = averageValueGreater.toNumber();
        const averageValueLesserNum = averageValueLesser.toNumber();

        const workerData: WorkerData = {
            totalTrades,
            numSimulations,
            totalInvestment: totalInvestmentNum,
            expectedProfit: expectedProfitNum,
            greaterEssenceDropChance: greaterEssenceDropChanceNum,
            averageValueGreater: averageValueGreaterNum,
            averageValueLesser: averageValueLesserNum,
        };

        return new Promise((resolve, reject) => {
            this.worker.onmessage = e => {
                const result: ProfitRangeResult = e.data;
                resolve(result);
            };

            this.worker.onerror = error => {
                console.error(error);
                reject(error);
            };

            this.worker.postMessage(workerData);
        });
    }
}
