onmessage = function (e) {
    const data = e.data;
    const profits = [];
    const { numSimulations, totalTrades, totalInvestment, expectedProfit, greaterEssenceDropChance, averageValueGreater, averageValueLesser } = data;

    for (let i = 0; i < numSimulations; i++) {
        let totalProfit = 0;

        for (let j = 0; j < totalTrades; j++) {
            if (Math.random() < greaterEssenceDropChance) {
                totalProfit += averageValueGreater;
            } else {
                totalProfit += averageValueLesser;
            }
        }

        totalProfit -= totalInvestment;
        profits.push(totalProfit);
    }

    profits.sort((a, b) => a - b);

    const minProfit = profits[Math.floor(0.025 * numSimulations)];
    const maxProfit = profits[Math.floor(0.975 * numSimulations)];
    const variance = profits.reduce((acc, val) => acc + Math.pow(val - expectedProfit, 2), 0) / numSimulations;
    const standardDeviation = Math.sqrt(variance);

    const fluctuationPercentage = totalInvestment === 0
        ? "0.000"
        : ((standardDeviation / totalInvestment) * 100).toFixed(3);

    postMessage({
        minProfit: minProfit.toFixed(3),
        maxProfit: maxProfit.toFixed(3),
        variance: variance.toFixed(3),
        fluctuationPercentage: fluctuationPercentage,
        standardDeviation: standardDeviation.toFixed(3)
    });
};
