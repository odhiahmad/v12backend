import { ValidationObserver } from "vee-validate";
import BInputValidations from "./../../../inputs/BInputValidations";
import BOptionValidations from "./../../../inputs/BOptionValidations";
import BTagValidations from "./../../../inputs/BTagValidations";
import BSelectValidations from "./../../../inputs/BSelectValidations";
export default {
    components: {
        BInputValidations,
        ValidationObserver,
        BOptionValidations,
        BTagValidations,
        BSelectValidations,
    },
    data() {
        return {
            form: {
                id: "",
                id_menu: "",
                fungsi: [],
                keterangan: ""
            },
            data: [],

            dataFungsi: ["read", "update", "delete", "create"],
            index: "",
            isCardModalActive: false,

            dataMenu: [],
            checkedRows: [],

            cekMenu: [],
            editMode: false,
            aktifButton: true,

            cariValue: "",
            total: 0,
            loading: false,
            sortField: "keterangan",
            sortOrder: "desc",
            defaultSortOrder: "desc",
            page: 0,
            idFungsi: 28,
            perPage: 20,
        };
    },
    computed: {
        getMenuVuex() {

            const menu = this.$store.getters.menu
            var nomor = 0;

            for (let i = 0; i < menu.length; i++) {
                this.dataMenu[nomor] = {
                    label: menu[i].nama,
                    value: menu[i].id,

                }
                nomor++;
                for (let j = 0; j < menu[i].anak.length; j++) {
                    this.dataMenu[nomor] = {
                        label: menu[i].anak[j].nama,
                        value: menu[i].anak[j].id,

                    }
                    nomor++;
                }
            }

            return this.dataMenu
        },
    },

    methods: {
        selectMenu(value) {
            this.form.id_menu = value.value
        },
        getFilteredTags() {
            this.filteredTags = this.dataFungsi.filter((option) => {
                return option
            })
        },
        resetForm() {
            requestAnimationFrame(() => {
                this.$refs.observer.reset();
            });
        },
        editView(id) {
            this.index = id;
            this.editMode = true;
            console.log(this.getMenuVuex)

            for (let i = 0; i < this.dataMenu.length; i++) {
                if (parseInt(this.dataMenu[i].value) === parseInt(this.data[id].id_menu)) {
                    console.log(true)
                    this.cekMenu = [{ label: this.dataMenu[i].label, value: this.dataMenu[i].value }]
                    this.id_menu = this.data[id].id_menu
                }
            }


            this.form.id = this.data[id].id;
            this.form.fungsi = this.data[id].fungsi
            this.form.keterangan = this.data[id].keterangan;
            this.isCardModalActive = true;


        },
        tambahView() {
            this.resetForm();
            this.editMode = false;

            this.form.id_menu = "";
            this.form.fungsi = [];

            this.isCardModalActive = true;
        },
        createFungsi() {
            if (this.editMode === true) {
                this.loading = true;
                this.$http
                    .patch("fungsi/editFungsi", { data: this.form })
                    .then(({ data }) => {
                        if (data.berhasil === false) {
                            this.loading = false;
                            this.$buefy.dialog.alert({
                                title: "Pesan",
                                message: data.messages,
                                type: 'is-danger',
                                hasIcon: true,
                                icon: 'times-circle',
                                iconPack: 'fa',
                                ariaRole: 'alertdialog',
                                ariaModal: true
                            });
                        } else if (data.berhasil === true) {
                            console.log(data);
                            this.loading = false;
                            this.isCardModalActive = false;
                            this.$buefy.toast.open({
                                message: "Berhasil mengedit fungsi " + " " + this.form.keterangan + "! ",
                                type: "is-success",
                            });
                            this.resetForm();
                            this.loadAsyncData();
                        }
                    })
                    .catch((error) => {
                        this.loading = false;
                        throw error;
                    });
            } else {
                this.loading = true;
                this.$http
                    .post("fungsi/createFungsi", { data: this.form })
                    .then(({ data }) => {
                        if (data.berhasil === false) {
                            this.loading = false;
                            this.$buefy.dialog.alert({
                                title: "Pesan",
                                message: data.messages,
                                type: 'is-danger',
                                hasIcon: true,
                                icon: 'times-circle',
                                iconPack: 'fa',
                                ariaRole: 'alertdialog',
                                ariaModal: true
                            });
                        } else if (data.berhasil === true) {
                            console.log(data);
                            this.loading = false;
                            this.isCardModalActive = false;
                            this.$buefy.toast.open({
                                message: "Berhasil menambahkan fungsi " + this.form.nama + "! ",
                                type: "is-success",
                            });
                            this.resetForm();
                            this.loadAsyncData();
                        }

                    })
                    .catch((error) => {
                        this.loading = false;
                        throw error;
                    });
            }

        },


        loadAsyncData() {
            this.loading = true;

            this.$http
                .post("fungsi/getFungsi", {
                    cari: this.cariValue === "" ? "" : this.cariValue,
                    page: this.cariValue === "" ? this.page : 0,
                    size: this.perPage,
                    sortField: this.sortField,
                    sortOrder: this.sortOrder,
                })
                .then(({ data }) => {
                    this.data = [];
                    const dataPanjang = data.data.rows.length;
                    if (parseInt(dataPanjang) !== 0) {
                        this.total = data.totalPage;
                        data.data.rows.forEach((item) => {
                            this.data.push(item);
                        });
                    }

                    this.loading = false;
                })
                .catch((error) => {
                    this.data = [];
                    this.total = 0;
                    this.loading = false;
                    throw error;
                });
        },
        /*
         * Handle page-change event
         */
        onPageChange(page) {
            this.page = page;
            this.loadAsyncData();
        },
        /*
         * Handle sort event
         */
        onSort(field, order) {
            this.sortField = field;
            this.sortOrder = order;
            this.loadAsyncData();
        },
        /*
         * Type style in relation to the value
         */
        type(value) {
            const number = parseFloat(value);
            if (number < 6) {
                return "is-danger";
            } else if (number >= 6 && number < 8) {
                return "is-warning";
            } else if (number >= 8) {
                return "is-success";
            }
        },
    },
    filters: {
        /**
         * Filter to truncate string, accepts a length parameter
         */
        truncate(value, length) {
            return value.length > length ? value.substr(0, length) + "..." : value;
        },
    },
    mounted() {
        this.loadAsyncData();
    },
};

