var app = new Vue({
    el: '#admin',
    data: {
        title: "",
        price: 0,
        file: null,
        addItem: null,
        items: [],
        findTitle: "",
        findItem: null,
    },
    created() {
        this.getItems();
    },
    computed: {
        suggestions() {
            return this.items.filter(item => item.title.toLowerCase().startsWith(this.findTitle.toLowerCase()));
        }
    },
    methods: {
        fileChanged(event) {
            this.file = event.target.files[0]
        },
        async upload() {
            try {
                const formData = new FormData();
                formData.append('photo', this.file, this.file.name)
                let r1 = await axios.post('/api/photos', formData);
                let r2 = await axios.post('/api/items', {
                    title: this.title,
                    price: Number(this.price),
                    path: r1.data.path
                });
                this.addItem = r2.data;
            } catch (error) {
                console.log(error);
            }
        },
        async getItems() {
            try {
                let response = await axios.get("/api/items");
                this.items = response.data;
                return true;
            } catch (error) {
                console.log(error);
            }
        },
        selectItem(item) {
            this.findTitle = "";
            this.findItem = item;
        },
        async deleteItem(item) {
            try {
                let response = axios.delete("/api/items/" + item._id);
                this.findItem = null;
                this.getItems();
                return true;
            } catch (error) {
                console.log(error);
            }
        },
    }
});