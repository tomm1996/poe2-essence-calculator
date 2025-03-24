# PoE2 Essence Calculator

At https://essences.mr9lives.tv

This project provides two models for estimating profit ranges in 3 to 1 trading scenarios at the Reforging Bench:

- Bienaymé Variance: 
  - Calculates profit ranges based on Bienaymé's variance formula, considering the average values and drop chances of lesser and greater essences.
  - Computes expected profit, variance, and standard deviation using Bienaymé's variance approach.
  - Utilizes average values and drop chances of essences to estimate profit ranges.
- Monte-Carlo Simulation: 
  - Employs Monte Carlo simulations to model potential profit distributions by simulating numerous trade sequences with varying outcomes.
  - Simulates a large number of trade sequences to model profit distributions.

## Contributing

### Setup 

    $ npm i
    $ npm run dev

- Please feel free to check my math and open an Issue or PR if you find any errors.
- Please Lint & format your code before creating a PR

## Planned features

- Market manipulation detection
- Calculate averages between the last x days instead of using latest price when fetching essence data
- Estimated ingame Currency Exchange prices