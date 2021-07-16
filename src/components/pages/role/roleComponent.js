import { ValidationObserver } from "vee-validate";
import BInputValidations from "./../../../inputs/BInputValidations";
import BSelectValidations from "./../../../inputs/BSelectValidations";
import BOptionValidations from "./../../../inputs/BOptionValidations";

import BCheckboxesValidations from "./../../../inputs/BCheckboxesValidations";

export default {
    components: {
        BInputValidations,
        ValidationObserver,
        BSelectValidations,
        BOptionValidations,
        BCheckboxesValidations,

    },
    data() {
        return {
            form: {
                id: "",
                id_menu: [],
                id_menu_sub: [],
                id_fungsi: [],
                nama: "",
                keterangan: "",
            },

            index: "",
            isCardModalActive: false,

            dataMenu: [],
            dataFungsi: ["read", "update", "delete", "create"],

            data: [],

            checkedRows: [],

            editMode: false,
            aktifButton: true,

            cariValue: "",
            total: 0,
            loading: false,
            sortField: "nama",
            sortOrder: "desc",
            defaultSortOrder: "desc",
            page: 0,
            idRole: 28,
            perPage: 20,
        };
    },

    methods: {


        resetForm() {
            requestAnimationFrame(() => {
                this.$refs.observer.reset();
            });
        },
        editView(id) {



            this.index = id;
            this.editMode = true;
            this.form.id = this.data[id].id;
            this.form.id_menu = [];
            this.form.id_menu_sub = [];

            this.form.status_menu = this.data[id].status_menu;
            this.form.nama = this.data[id].nama;
            this.form.keterangan = this.data[id].keterangan;
            this.form.icon = this.data[id].icon;
            this.isCardModalActive = true;

            if (this.form.id_menu.length === 0) {
                this.data[id].id_menu.forEach((item) => {
                    this.form.id_menu.push(item);

                });
            }
            if (this.form.id_menu_sub.length === 0) {
                this.data[id].id_menu_sub.forEach((item) => {
                    this.form.id_menu_sub.push(item);

                });
            }

        },
        tambahView() {
            this.resetForm();
            this.editMode = false;
            this.form.id_menu = [];
            this.form.id_menu_sub = [];

            this.form.nama = "";
            this.form.keterangan = "";
            this.isCardModalActive = true;
        },
        createRole() {
            if (this.editMode === true) {
                this.loading = true;
                this.$http
                    .patch("roles/editRole", { data: this.form })
                    .then(({ data }) => {
                        if (data.berhasil === false) {
                            this.form.id_menu_sub = [];
                            this.form.id_menu = []
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

                            this.loading = false;
                            this.isCardModalActive = false;
                            this.$buefy.toast.open({
                                message: "Berhasil mengedit role " + " " + this.form.nama + "! ",
                                type: "is-success",
                            });
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
                    .post("roles/createRole", { data: this.form })
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

                            this.loading = false;
                            this.isCardModalActive = false;
                            this.$buefy.toast.open({
                                message: "Berhasil menambahkan role " + this.form.nama + "! ",
                                type: "is-success",
                            });

                            this.loadAsyncData();
                        }

                    })
                    .catch((error) => {
                        this.loading = false;
                        throw error;
                    });
            }

        },
        confirmAktifBanyak() {
            const dataId = [];
            for (var i = 0; i < this.checkedRows.length; i++) {
                dataId[i] = this.checkedRows[i].id;
            }

            this.$buefy.dialog.confirm({
                title: "Mengaktifkan role",
                message: "Apakah anda yakin ingin meng<b>aktifkan</b> role ini?.",
                confirmText: "Aktifkan Role",
                type: "is-primary",
                hasIcon: true,
                onConfirm: () => {
                    this.loading = true;
                    this.$http
                        .post("roles/aktifRoleBanyak", {
                            id: dataId,
                        })
                        .then(() => {
                            this.loading = false;
                            this.loadAsyncData();
                            this.checkedRows = [];
                            this.aktifButton = !this.aktifButton;
                        })
                        .catch((error) => {
                            this.loading = false;
                            throw error;
                        });
                },
            });
        },

        confirmNonAktifBanyak() {
            const dataId = [];

            for (var i = 0; i < this.checkedRows.length; i++) {
                dataId[i] = this.checkedRows[i].id;
            }

            this.$buefy.dialog.confirm({
                title: "Mengaktifkan role",
                message: "Apakah anda yakin ingin meng<b>aktifkan</b> role ini?.",
                confirmText: "Non Aktifkan Role",
                type: "is-primary",
                hasIcon: true,
                onConfirm: () => {
                    this.loading = true;
                    this.$http
                        .post("roles/NonAktifRoleBanyak", {
                            id: dataId,
                        })
                        .then(() => {
                            this.checkedRows = [];
                            this.aktifButton = !this.aktifButton;
                            this.loading = false;
                            this.loadAsyncData();
                        })
                        .catch((error) => {
                            this.loading = false;
                            throw error;
                        });
                },
            });
        },

        loadAsyncData() {
            this.loading = true;

            this.$http
                .post("roles/getRole", {
                    cari: this.cariValue === "" ? "" : this.cariValue,
                    page: this.cariValue === "" ? this.page : 0,
                    size: this.perPage,
                    sortField: this.sortField,
                    sortOrder: this.sortOrder,
                })
                .then(({ data }) => {
                    this.data = [];
                    this.dataMenu = [];

                    this.total = data.totalPage;
                    data.data.rows.forEach((item) => {
                        this.data.push(item);
                    });
                    data.menu.forEach((item) => {
                        this.dataMenu.push(item);
                    });
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

