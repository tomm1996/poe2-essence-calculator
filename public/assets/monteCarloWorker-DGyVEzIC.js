(function () {
    'use strict';
    onmessage = function (c) {
        const d = c.data,
            o = [],
            {
                numSimulations: a,
                totalTrades: f,
                totalInvestment: n,
                expectedProfit: l,
                greaterEssenceDropChance: u,
                averageValueGreater: m,
                averageValueLesser: x,
            } = d;
        for (let e = 0; e < a; e++) {
            let t = 0;
            for (let i = 0; i < f; i++) Math.random() < u ? (t += m) : (t += x);
            (t -= n), o.push(t);
        }
        o.sort((e, t) => e - t);
        const h = o[Math.floor(0.025 * a)],
            v = o[Math.floor(0.975 * a)],
            r = o.reduce((e, t) => e + Math.pow(t - l, 2), 0) / a,
            s = Math.sqrt(r),
            P = n === 0 ? '0.000' : ((s / n) * 100).toFixed(3);
        postMessage({
            minProfit: h.toFixed(3),
            maxProfit: v.toFixed(3),
            variance: r.toFixed(3),
            fluctuationPercentage: P,
            standardDeviation: s.toFixed(3),
        });
    };
})();
