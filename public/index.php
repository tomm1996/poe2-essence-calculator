<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Essence Calculator</title>

 <!-- Vite dev server -->
  <script type="module" crossorigin src="/assets/index.php-B9xsiO_0.js"></script>
  <link rel="stylesheet" crossorigin href="/assets/index-BL9K78Uo.css">
</head>
<body>
<div class="modal">
    <div class="essences" data-essences></div>
</div>
<div class="calculator">
    <div class="input-container">
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
            Therefor, your estimated profit will range between <strong data-variance-min></strong> and <strong data-variance-max></strong>
        </p>
    </div>
</div>

</body>
</html>