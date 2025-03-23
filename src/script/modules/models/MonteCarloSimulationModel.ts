import Decimal from 'decimal.js-light';
import { Essence } from '../Essence.ts';

interface WorkerData {
    essences: Essence[];
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

export class MonteCarloSimulationModel {
    private worker: Worker;
    public name = 'montecarlo';
    constructor() {
        this.worker = new Worker(new URL('./monteCarloWorker.ts', import.meta.url), { type: 'module' });
    }

    async calculateProfitRange(
        essences: Essence[],
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

        // Data to send to the worker
        const workerData: WorkerData = {
            essences,
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

            // Send data to worker
            this.worker.postMessage(workerData);
        });
    }
}
