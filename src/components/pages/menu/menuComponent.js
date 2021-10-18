import { ValidationObserver } from "vee-validate";
import BInputValidations from "./../../../inputs/BInputValidations";
import BSelectValidations from "./../../../inputs/BSelectValidations";
import BOptionValidations from "./../../../inputs/BOptionValidations";

export default {
    components: {
        BInputValidations,
        ValidationObserver,
        BSelectValidations,
        BOptionValidations,
    },
    data() {
        return {
            form: {
                id: "",
                idMenu: "",
                nama: "",
                keterangan: "",
                icon: "",
                statusMenu: "",
                role: []
            },
            isiMenuInduk: [
                {
                    label: "Menu Induk",
                    value: 0
                },
                {
                    label: "Sub Menu",
                    value: 1
                }
            ],


            cekMenu: "",
            cekMenuInduk: "",
            index: "",

            placeholderMenuInduk: "Pilih Menu",
            isCardModalActive: false,

            menuIndukAktif: false,
            menuSubIndukAktif: false,


            pilihMenu: "Pilih Menu",
            dataMenuInduk: [],
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
            idMenu: 28,
            perPage: 20,
        };
    },
    computed: {
        aksiRoleUser() {
            const menuUser = this.$store.getters.menuUser
            for (let i = 0; i < menuUser.length; i++) {
                if (menuUser[i].nama === 'menu') {
                    return menuUser[i].fungsi
                }
            }
        },

    },
    methods: {
        selectJenisMenu(value) {
            if (value.value === 0) {
                this.menuIndukAktif = false;
                this.menuSubIndukAktif = false;
                this.form.statusMenu = 0;
                this.form.idMenu = 0;

            } else if (value.value === 1) {
                this.menuIndukAktif = true;
                this.menuSubIndukAktif = false;
                this.form.statusMenu = 1;

            }

        },
        selectMenuInduk(value) {
            this.form.idMenu = value.value;
            this.dataMenuSubInduk = [];
            let dataTempMenuInduk = []
            if (parseInt(this.cekMenu.value) === 2) {
                for (let i = 0; i < this.data.length; i++) {
                    if (this.data[i].idMenu === value.value) {
                        dataTempMenuInduk[i] = {
                            label: this.data[i].nama,
                            value: this.data[i].id
                        }
                    }

                }
                dataTempMenuInduk.forEach((item) => {
                    this.dataMenuSubInduk.push(item);
                });

            }

        },

        resetForm() {
            this.username = "";
            this.password = "";
            this.confirmation = "";
            requestAnimationFrame(() => {
                this.$refs.observer.reset();
            });
        },
        update(id) {

            this.index = id;
            this.editMode = true;
            this.form.id = this.data[id].id;
            this.form.idMenu = this.data[id].idMenu;

            this.form.statusMenu = this.data[id].statusMenu;
            this.form.nama = this.data[id].nama;
            this.form.keterangan = this.data[id].keterangan;
            this.form.icon = this.data[id].icon;
            this.isCardModalActive = true;



            if (this.form.statusMenu === 0) {
                this.menuIndukAktif = false;
                this.menuSubIndukAktif = false;
                this.cekMenu = [{ label: this.isiMenuInduk[0].label, value: this.form.id }]
            } else if (this.form.statusMenu === 1) {
                for (let i = 0; i < this.dataMenuInduk.length; i++) {
                    if (this.dataMenuInduk[i].value === this.form.idMenu) {
                        this.menuIndukAktif = true;
                        this.menuSubIndukAktif = false;
                        this.cekMenu = [{ label: this.isiMenuInduk[1].label, value: this.form.id }]
                        this.cekMenuInduk = [{ label: this.dataMenuInduk[i].label, value: this.form.idMenu }]
                        break;
                    }
                }

            }

        },
        tambahView() {
            this.resetForm();
            this.editMode = false;
            this.cekMenu = "";
            this.cekMenuInduk = "";
            this.cekMenuSubInduk = "";
            this.menuIndukAktif = false;


            this.form.idMenu = "";

            this.form.nama = "";
            this.form.keterangan = "";
            this.form.url = "";
            this.form.url_component = "";
            this.form.icon = "";
            this.isCardModalActive = true;
        },
        createMenu() {
            if (this.editMode === true) {
                this.form.idMenu = this.data[this.index].idMenu;
                this.form.idMenu_sub = this.data[this.index].idMenu_sub;
                this.loading = true;
                this.$http
                    .patch("menus/editMenu", { data: this.form })
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
                                message: "Berhasil mengedit menu " + " " + this.form.nama + "! ",
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
                    .post("menus/createMenu", { data: this.form })
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
                                message: "Berhasil menambahkan menu " + this.form.nama + "! ",
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
        confirmAktifBanyak() {
            const dataId = [];
            for (var i = 0; i < this.checkedRows.length; i++) {
                dataId[i] = this.checkedRows[i].id;
            }
            console.log(dataId);
            this.$buefy.dialog.confirm({
                title: "Mengaktifkan menu",
                message: "Apakah anda yakin ingin meng<b>aktifkan</b> menu ini?.",
                confirmText: "Aktifkan Menu",
                type: "is-primary",
                hasIcon: true,
                onConfirm: () => {
                    this.loading = true;
                    this.$http
                        .post("menus/aktifMenuBanyak", {
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
                title: "Mengaktifkan menu",
                message: "Apakah anda yakin ingin meng<b>aktifkan</b> menu ini?.",
                confirmText: "Non Aktifkan Menu",
                type: "is-primary",
                hasIcon: true,
                onConfirm: () => {
                    this.loading = true;
                    this.$http
                        .post("menus/NonAktifMenuBanyak", {
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
                .post("menus/getMenu", {
                    cari: this.cariValue === "" ? "" : this.cariValue,
                    page: this.cariValue === "" ? this.page : 0,
                    size: this.perPage,
                    sortField: this.sortField,
                    sortOrder: this.sortOrder,
                })
                .then(({ data }) => {
                    this.data = [];
                    this.dataMenuInduk = [];
                    for (var i = 0; i < data.menuInduk.length; i++) {
                        this.dataMenuInduk[i] = {
                            label: data.menuInduk[i].nama,
                            value: data.menuInduk[i].id,
                            value2: data.menuInduk[i].idMenu
                        }
                    }
                    this.total = data.totalPage;
                    data.data.rows.forEach((item) => {
                        this.data.push(item);
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

