import {Essence} from './Essence.js';

export class Data {
    url = '';
    priceData;
    essences = [];

    constructor(url) {
        this.url = url;
    }

    async fetchData () {
        await this.fetchPrices();

        this.createEssences();
    }

    async fetchPrices() {
        try {
            const response = await fetch(this.url);
            if (!response.ok) {
                console.error(response)
            }

            this.priceData = await response.json();
        } catch (error) {
            console.error(error.message);
        }
    }

    createEssences () {
        this.priceData.items.forEach((item) => this.essences.push(new Essence(item)));
        this.essences = this.essences.sort((a, b) => a.id.localeCompare(b.id))

        this.essences.forEach((essence) => essence.addInput());
        this.essences.forEach((essence) => essence.addInputListener());
    }
}