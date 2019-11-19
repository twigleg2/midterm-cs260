var app = new Vue({
    el: '#app',
    data: {
        items: [],
        cart: [],
    },
    created() {
        this.getItems();
    },
    computed: {
        sortedItems() {
            return this.items.sort((a, b) => (a.title > b.title) ? 1 : -1);
        }
    },
    methods: {
        async getItems() {
            try {
                let response = await axios.get("/api/items");
                this.items = response.data;
                return true;
            } catch (error) {
                console.log(error);
            }
        },
        submitPurchase() {
            this.cart = this.items.filter(item => {
                return item.selected;
            });
            for (item of this.cart) {
                this.incrementNumPurchased(item);
            }
        },
        async incrementNumPurchased(item) {
            try {
                console.log("incrementing", item.title);
                let response = await axios.put("/api/purchased/" + item._id);
                this.findItem = null;
                this.getItems();
                return true;
            } catch (error) {
                console.log(error);
            }
        },
    }
});