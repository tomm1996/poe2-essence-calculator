<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="apple-touch-icon" sizes="180x180" href="./src/img/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="./src/img/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="./src/img/favicon-16x16.png">
    <link rel="manifest" href="./src/img/site.webmanifest">
    <title>PoE2 Essence Calculator</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap" rel="stylesheet">

    <script type="module" src="./src/script/app.ts"></script>
</head>
<body>
    <main class="page-wrapper">
        <section class="page-inner">
            <header>
                <h1>Path of Exile 2 — Essence Calculator</h1>
            </header>

            <div class="intro">
                Essence Trading Profit Calculator — a tool to help you estimate potential profits from 3 to 1 trading essences at the reforging bench. Here's how it works:
                <ul>
                    <li><strong>Input Your Data:</strong> Enter details such as the types of essences you're trading, the quantity purchased, your total investment, and expected profit.</li>
                    <li><strong>Simulation:</strong> The calculator employs one out of two prediction models that mimic real trading conditions to simulate potential outcomes, considering factors such as drop chances and average values</li>
                    <li><strong>Results:</strong> You'll receive a collection of predictions, including a range of potential profits, helping you understand possible outcomes and make informed investment decisions.</li>
                </ul>
            </div>
        </section>
        <div class="essence-prices">
            <section class="page-inner">
                <div class="toggle-container">
                    <label class="toggle-label" for="toggle-switch">Enable detailed Prices:</label>

                    <label class="switch">
                        <input type="checkbox" id="toggle-switch" value="">
                        <span class="slider"></span>
                    </label>
                </div>
                <small>Essence Prices are from the PoE2 trade Website. Fetching ingame currency exchange prices is not possible at the moment. Adjust the prices to your needs/market as needed by clicking on "Edit Essence Values".</small>
                <div class="loading-container">
                    <div class="spinner"></div>
                </div>


                <div class="essence-preview" data-preview-essences>
                </div>
                <button class="edit" data-edit>Edit Essence Values</button>
            </section>
        </div>
        <section class="page-inner">
            <section class="calculator">
                <div class="input-container">
                    <div class="error" data-errors></div>

                    <div class="manual-inputs">
                        <label for="buy-type" class="buy-type">
                            Essence Type
                            <select name="buy-type" data-buy-type>
                                <option value="" disabled selected>Choose which Essence you bought</option>
                            </select>
                        </label>
                        <label for="price-per-essence" class="price-per-essence">
                            Price per Essence
                            <input name="price-per-essence" type="number" data-price-per-essence>
                        </label>
                        <label for="buy-amount" class="buy-amount">
                            Essence Amount
                            <input name="buy-amount" type="number" data-amount>
                        </label>
                    </div>
                    <div class="model">
                        <h3>Pick a prediction Model</h3>
                        <p>Monte Carlo is more accurate, especially on low amounts and Bienaymé is less resource-intensive. The predictions will converge the higher the bought Amount is.</p>
                        <label for="montecarlo">
                            <input id="montecarlo" name="model" type="radio" value="montecarlo" data-model><span title="O(n × f(Number of Essences, Amount of Trades))">Monte Carlo method</span>
                        </label>
                        <label for="bienayme">
                            <input id="bienayme" name="model" type="radio" value="bienayme" data-model><span title="O(n)">Bienaymé's identity</span>
                        </label>
                    </div>
                    <button class="confirm" data-submit>Calculate</button>
                </div>
            </section>
        </section>
        <section>
            <div class="page-inner">
                <div class="result-container" data-result-container>
                    <div class="loading-result-container">
                        <div class="spinner"></div>
                    </div>
                    <p class="result">
                        Your average Profit if you invest <strong data-invest></strong><br>
                        to buy <strong data-quantity></strong> <strong data-type></strong><br> at
                        <strong data-single-price></strong> a piece <br>is <strong data-profit></strong><br>
                        with a predicted fluctuation of <strong data-variance>WIP %</strong> in profit margin.<br>
                        Therefore, your estimated profit will range between <strong data-variance-min></strong> and <strong data-variance-max></strong>
                    </p>
                </div>
            </div>
        </section>
        <footer class="page-inner">
            <a href="https://github.com/tomm1996/poe2-essence-calculator">Github</a>
            <p>
                <small><strong>Tom's disclaimer:</strong> I'm by no means a mathematician/statistician and kind of vibecoded the models with an LLM, so don't sue me if you lose ingame currency when relying on these calculations thx</small>
            </p>
        </footer>

        <div class="modal-wrapper hide">
            <div class="input-modal">
                <div class="fixed-bar">
                    <button class="delete" data-reset>Reset to estimated market malues</button>
                    <button class="ghost" data-close>x</button>
                </div>
                <div class="essences" data-essences></div>
            </div>
        </div>
    </main>
</body>
</html>