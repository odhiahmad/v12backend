import { ValidationObserver } from "vee-validate";
import BInputValidations from "./../../../inputs/BInputValidations";
import BSelectValidations from "./../../../inputs/BSelectValidations";

export default {
    components: {
        BInputValidations,
        ValidationObserver,
        BSelectValidations,
    },
    data() {
        return {
            form: {
                id: "",
                nama: "",
                username: "",
                password: "",
                passwordEdit: "",
                role: "",
                confirmation: "",
                gaji: "",
            },
            isCardModalActive: false,
            data: [],
            checkedRows: [],

            editMode: false,
            aktifButton: true,

            cariValue: "",
            total: 0,
            loading: false,
            sortField: "username",
            sortOrder: "desc",
            defaultSortOrder: "desc",
            page: 0,
            idUser: 28,
            perPage: 20,
        };
    },

    methods: {
        resetForm() {
            this.username = "";
            this.password = "";
            this.confirmation = "";
            requestAnimationFrame(() => {
                this.$refs.observer.reset();
            });
        },
        editView(id) {
            this.editMode = true;
            this.form.id = this.data[id].id;
            this.form.nama = this.data[id].pegawai.nama;
            this.form.username = this.data[id].username;
            this.form.role = this.data[id].role;
            this.form.gaji = this.data[id].pegawai.gaji;
            this.isCardModalActive = true;
        },
        tambahView() {
            this.resetForm();
            this.editMode = false;
            this.form.nama = "";
            this.form.username = "";
            this.form.role = "";
            this.form.gaji = "";
            this.isCardModalActive = true;
        },
        createUser() {
            if (this.editMode === true) {
                this.loading = true;
                this.$http
                    .patch("users/editUser", { data: this.form })
                    .then(({ data }) => {
                        console.log(data);
                        this.loading = false;
                        this.isCardModalActive = false;
                        this.$buefy.toast.open({
                            message: "Berhasil mengedit user " + " " + this.form.nama,
                            type: "is-success",
                        });
                        this.resetForm();
                        this.loadAsyncData();
                    })
                    .catch((error) => {
                        this.loading = false;
                        throw error;
                    });
            } else {
                this.loading = true;
                this.$http
                    .post("users/createUser", { data: this.form })
                    .then(({ data }) => {
                        console.log(data);
                        this.loading = false;
                        this.isCardModalActive = false;
                        this.$buefy.toast.open({
                            message: "Berhasil menambahkan user!" + this.form.nama,
                            type: "is-success",
                        });
                        this.resetForm();
                        this.loadAsyncData();
                    })
                    .catch((error) => {
                        this.loading = false;
                        throw error;
                    });
            }

        },
        confirmNonAktif(id, index) {
            this.$buefy.dialog.confirm({
                title: "Menonaktifkan Akun",
                message: "Apakah anda yakin ingin me<b>non aktifkan</b> akun ini?",
                confirmText: "Non Aktikfan Akun",
                type: "is-danger",
                hasIcon: true,
                onConfirm: () => {
                    console.log(id);
                    this.loading = true;
                    this.$http
                        .get(`users/nonAktifUser/${id}`)
                        .then(() => {
                            this.loading = false;
                            this.data[index].aktif = 0;
                            this.$buefy.toast.open(
                                this.data[index].nama + " berhasil di non aktifkan"
                            );
                        })
                        .catch((error) => {
                            this.loading = false;
                            throw error;
                        });
                },
            });
        },
        confirmAktif(id, index) {
            this.$buefy.dialog.confirm({
                title: "Mengaktifkan akun",
                message: "Apakah anda yakin ingin meng<b>aktifkan</b> akun ini?.",
                confirmText: "Aktifkan Akun",
                type: "is-primary",
                hasIcon: true,
                onConfirm: () => {
                    this.loading = true;
                    this.$http
                        .get(`users/nonAktifUser/${id}`)
                        .then(() => {
                            this.loading = false;
                            this.data[index].aktif = 1;
                            this.$buefy.toast.open(
                                this.data[index].nama + " berhasil di aktifkan"
                            );
                        })
                        .catch((error) => {
                            this.loading = false;
                            throw error;
                        });
                },
            });
        },
        confirmAktifBanyak() {
            const dataId = [];
            for (var i = 0; i < this.checkedRows.length; i++) {
                dataId[i] = this.checkedRows[i].id;
            }
            console.log(dataId);
            this.$buefy.dialog.confirm({
                title: "Mengaktifkan akun",
                message: "Apakah anda yakin ingin meng<b>aktifkan</b> akun ini?.",
                confirmText: "Aktifkan Akun",
                type: "is-primary",
                hasIcon: true,
                onConfirm: () => {
                    this.loading = true;
                    this.$http
                        .post("users/aktifUserBanyak", {
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
                title: "Mengaktifkan akun",
                message: "Apakah anda yakin ingin meng<b>aktifkan</b> akun ini?.",
                confirmText: "Non Aktifkan Akun",
                type: "is-primary",
                hasIcon: true,
                onConfirm: () => {
                    this.loading = true;
                    this.$http
                        .post("users/NonAktifUserBanyak", {
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
                .post("users/getUser", {
                    cari: this.cariValue === "" ? "" : this.cariValue,
                    page: this.cariValue === "" ? this.page : 0,
                    size: this.perPage,
                    sortField: this.sortField,
                    sortOrder: this.sortOrder,
                })
                .then(({ data }) => {
                    this.data = [];

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

