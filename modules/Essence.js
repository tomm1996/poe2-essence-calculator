export class Essence {
    name = '';
    fetchedPrice = 0;
    inputPrice = 0;
    id = '';
    constructor({type, latest_price, id} = obj) {
        this.name = type;
        this.fetchedPrice = parseFloat(latest_price.price);
        this.id = id;
    }
    get isGreater () {
        return this.id.includes('greater')
    }
    addInput () {
        this.inputPrice = this.fetchedPrice;
        document.querySelector('[data-essences]').innerHTML += `
            <label class="essence" data-essence="${this.id}">
                ${this.name}
                <input type="number" name="${this.id}" value="${this.fetchedPrice}">
            </label>
        `;

        document.querySelector('[data-buy-type]').innerHTML += `
            <option value="${this.id}">${this.name}</option>
        `;
    }
    addInputListener () {
        document.querySelector(`[data-essence="${this.id}"]`).addEventListener('change', (ev) => {
            this.inputPrice = parseFloat(ev.target.value)
        });
    }
}