import { ValidationObserver } from "vee-validate";
import BInputValidations from "./../../../inputs/BInputValidations";
import BSelectValidations from "./../../../inputs/BSelectValidations";
import BOptionValidations from "./../../../inputs/BOptionValidations";
import BTagValidations from "./../../../inputs/BTagValidations";
import BCheckboxesValidations from "./../../../inputs/BCheckboxesValidations";

export default {
    components: {
        BInputValidations,
        ValidationObserver,
        BSelectValidations,
        BOptionValidations,
        BCheckboxesValidations,
        BTagValidations,

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
            formFungsi: {
                id: "",
                nama: "",
                fungsi: []
            },
            formRole: {
                id: "",
                nama: "",
                menu: []
            },

            index: "",
            indexFungsi: "",
            isCardModalActive: false,
            isFungsiModalActive: false,
            isFungsiEditModalActive: false,

            dataMenu: [],
            dataMenuForm: [],
            dataFungsi: ["read", "update", "delete", "create"],
            dataRoleMenu: [],
            data: [],
            dataMenuAplikasi: [],


            checkedRows: [],

            tambahFungsiFlag: false,

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
    computed: {
        getMenuVuex() {

            const menu = this.$store.getters.menu
            var nomor = 0;

            for (let i = 0; i < menu.length; i++) {
                this.dataMenuAplikasi[nomor] = {
                    id: menu[i].id,
                    value: menu[i].nama,

                }
                nomor++;
                for (let j = 0; j < menu[i].anak.length; j++) {
                    this.dataMenuAplikasi[nomor] = {
                        id: menu[i].anak[j].id,
                        value: menu[i].anak[j].nama,

                    }
                    nomor++;
                }
            }

            console.log(this.dataMenuAplikasi)

            return this.dataMenuAplikasi
        },
    },

    methods: {

        beforeAdding(tag) {
            for (let i = 0; i < this.dataMenu.length; i++) {
                if (this.dataMenu[i].userFungsi.nama === tag.value) {
                    return null;
                }
            }

            return tag


        },
        resetForm() {
            requestAnimationFrame(() => {
                this.$refs.observer.reset();
            });
        },
        editFungsidanMenuView(id) {

            this.dataMenu = [];
            this.data[id].roleFungsi.forEach((item) => {
                this.dataMenu.push(item);
            });

            this.form.nama = this.data[id].nama;
            this.index = id;
            this.isFungsiModalActive = true


        },
        editFungsiView(id) {
            this.indexFungsi = id;
            this.formFungsi.id = this.dataMenu[id].id
            this.formFungsi.fungsi = this.dataMenu[id].fungsi
            this.formFungsi.nama = this.dataMenu[id].nama
            this.isFungsiEditModalActive = true
            this.tambahFungsiFlag = false

        },

        tambahFungsiView() {

            this.formRole.id = this.data[this.index].id
            this.formRole.nama = this.data[this.index].nama
            this.formRole.menu = [];
            this.tambahFungsiFlag = true
            this.isFungsiEditModalActive = true

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
        tambahMenuSubmit() {
            this.loading = true;
            this.$http
                .post("fungsi/createFungsi", { data: this.formRole })
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
                        this.isFungsiEditModalActive = false
                        this.isFungsiModalActive = false
                        this.$buefy.toast.open({
                            message: "Berhasil menambah menu ! ",
                            type: "is-success",
                        });
                        this.$buefy.dialog.alert('Berhasil menambah Menu! ')
                        this.loadAsyncData();
                    }
                })
                .catch((error) => {
                    this.loading = false;
                    throw error;
                });
        },
        editFungsiSubmit() {
            this.loading = true;
            this.$http
                .patch("fungsi/editFungsi", { data: this.formFungsi })
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
                        this.dataFungsi[this.indexFungsi].fungsi = []
                        this.data[this.index].roleFungsi[this.indexFungsi].fungsi = []
                        this.loading = false;

                        this.$buefy.toast.open({
                            message: "Berhasil mengedit menu ! ",
                            type: "is-success",
                        });
                        this.$buefy.dialog.alert('Berhasil Edit Menu! ')
                        this.dataFungsi[this.indexFungsi].fungsi.push(this.formFungsi.fungsi)
                        this.data[this.index].roleFungsi[this.indexFungsi].fungsi.push(this.formFungsi.fungsi)
                    }
                })
                .catch((error) => {
                    this.loading = false;
                    throw error;
                });
        },
        hapusFungsi(id) {
            this.formFungsi.id = this.dataMenu[id].id
            this.$buefy.dialog.confirm({
                title: 'Menghapus menu',
                message: 'Apakah anda yakin ingin menghapus menu ' + this.dataMenu[id].userFungsi.nama + ' ini pada role ' + this.form.nama + ' ?',
                cancelText: 'Kembali',
                confirmText: 'Hapus Menu',
                type: 'is-danger',
                hasIcon: true,
                onConfirm: () => {

                    this.loading = true;
                    this.$http
                        .delete(`fungsi/hapusFungsi/${this.formFungsi.id}`)
                        .then(() => {

                            this.loading = false;
                            this.$buefy.dialog.alert('Berhasil Hapus Menu!')
                            this.dataMenu.splice(id, 1);
                            this.data[this.index].roleFungsi.splice(id, 1);

                            // this.dataMenu[index].aktif = 0;
                            // this.$buefy.toast.open(
                            //     this.dataMenu[index].nama + " berhasil di non aktifkan"
                            // );
                        })
                        .catch((error) => {
                            this.loading = false;
                            throw error;
                        });
                }
            })
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
                    this.dataMenuAplikasi = [];

                    this.total = data.totalPage;
                    data.data.rows.forEach((item) => {
                        this.data.push(item);
                    });
                    data.menu.forEach((item) => {
                        this.dataMenuForm.push(item);
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

