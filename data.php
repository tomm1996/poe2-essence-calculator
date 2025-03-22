<?php
ini_set("allow_url_fopen", 1);

echo file_get_contents('https://poe2scout.com/api/items/essences?page=1&per_page=25&league=Standard');
