export class MonteCarloSimulationModel {
    constructor() {
        this.worker = new Worker("./modules/models/monteCarloWorker.js");
    }

    async calculateProfitRange(essences, quantityBought, totalInvestment, expectedProfit, greaterEssenceDropChance, averageValueGreater, averageValueLesser) {
        const totalTrades = Math.floor(quantityBought / 3); // Adjust for trade count
        const numSimulations = 10000;

        // Convert Decimal values to numbers for communication with the worker
        totalInvestment = new window.Decimal(totalInvestment).toNumber();
        expectedProfit = new window.Decimal(expectedProfit).toNumber();
        greaterEssenceDropChance = new window.Decimal(greaterEssenceDropChance).toNumber();
        averageValueGreater = new window.Decimal(averageValueGreater).toNumber();
        averageValueLesser = new window.Decimal(averageValueLesser).toNumber();

        // Data to send to the worker
        const workerData = {
            essences,
            totalTrades,
            numSimulations,
            totalInvestment,
            expectedProfit,
            greaterEssenceDropChance,
            averageValueGreater,
            averageValueLesser,
        };

        return new Promise((resolve, reject) => {
            this.worker.onmessage = (e) => {
                const result = e.data;
                resolve(result);
            };

            this.worker.onerror = (error) => {
                console.error(error);
                reject(error);
            };

            // Send data to worker
            this.worker.postMessage(workerData);
        });
    }
}
