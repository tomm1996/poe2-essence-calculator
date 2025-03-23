<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="./vendor/normalize.min.css">
    <link rel="stylesheet" href="styles.css">
    <title>Essence Calculator</title>
</head>
<body>
<div class="calculator">
    <div class="input-container">
        <div class="essences" data-essences></div>
        <div class="manual-inputs">
            <div class="error" data-errors></div>
            <label for="buy-type">
                Essence Type
                <select name="buy-type" data-buy-type>
                    <option value="" disabled selected>Choose which Essence you bought</option>
                </select>
            </label>
            <label for="buy-amount">
                Essence Amount
                <input name="buy-amount" type="number" data-amount>
            </label>
            <button data-submit>Calculate</button>
        </div>
    </div>
    <div class="result-container" data-result-container>
        <p>
            Your average Profit if you invest <strong data-invest></strong><br>
            to buy <strong data-quantity></strong> <strong data-type></strong><br> at
            <strong data-single-price></strong> a piece <br>is <strong data-profit></strong><br>
            with a predicted fluctuation of <strong data-variance>WIP %</strong> in profit margin.<br>
            Therefore, your estimated profit will range between <strong data-variance-min></strong> and <strong data-variance-max></strong>
        </p>
    </div>
</div>

<script src="vendor/decimal.js"></script>
<script src="app.js" type="module"></script>
</body>
</html>