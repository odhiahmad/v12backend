<template>
  <section>
    <div>
      <b-navbar shadow spaced wrapper-class>
        <template #start>
          <b-navbar-item @click="open = true">
            <b-icon icon="menu" size="is-medium" style="margin-right: 10px">
            </b-icon>
            Admin Dashboard
          </b-navbar-item>
        </template>
        <template #end>
          <b-navbar-item tag="div">
            <b-navbar-item
              class="button is-primary is-light"
              style="margin-right: 10px"
            >
              <b-icon icon="account"></b-icon>
              <p>{{ username | hurufBesar }}</p>
            </b-navbar-item>
            <div class="buttons">
              <a @click="logout" class="button is-danger">
                <b-icon icon="logout"></b-icon>
                <strong>Log Out</strong>
              </a>
            </div>
          </b-navbar-item>
        </template>
      </b-navbar>
    </div>
    <b-sidebar
      :expand-on-hover="true"
      type="is-white"
      :fullheight="true"
      :fullwidth="false"
      :overlay="false"
      :right="false"
      v-model="open"
    >
      <div style="padding: 15px; margin-top: 20px; margin-horinzontal: 20px">
        <img
          src="./../../assets/logo.png"
          alt="Lightweight UI components for Vue.js based on Bulma"
        />
        <b-menu>
          <b-menu-list label="Menu">
            <b-menu-list>
              <div v-for="dm in menu" :key="dm.id">
                <b-menu-item expanded :icon="dm.icon" v-if="dm.anak.length > 0">
                  <template #label="props">
                    {{ dm.keterangan }}
                    <b-icon
                      class="is-pulled-right"
                      :icon="props.expanded ? 'menu-down' : 'menu-up'"
                    ></b-icon>
                  </template>
                  <div v-for="dma in dm.anak" :key="dma.id">
                    <b-menu-item
                      v-if="dm.anak.length > 0"
                      :icon="dma.icon"
                      tag="router-link"
                      :to="{ name: dma.nama }"
                      :label="dma.keterangan"
                    >
                    </b-menu-item>
                  </div>
                </b-menu-item>
                <b-menu-item
                  :icon="dm.icon"
                  tag="router-link"
                  :to="{ name: dm.nama }"
                  :label="dm.keterangan"
                  v-else
                >
                </b-menu-item>
              </div>
            </b-menu-list>
          </b-menu-list>
        </b-menu>
      </div>
    </b-sidebar>
    <div class="container">
      <transition name="slide">
        <router-view></router-view>
      </transition>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      open: false,
      overlay: true,
      fullheight: false,
      fullwidth: false,
      right: false,
      data: "",
      transitionName: null,
    };
  },
  watch: {
    $route(to, from) {
      const toDepth = to.path.split("/").length;
      const fromDepth = from.path.split("/").length;
      this.transitionName = toDepth < fromDepth ? "fade-in" : "fade-out";
    },
  },
  computed: {
    menu() {
      return this.$store.getters.menuUser;
    },
    username() {
      return this.$store.getters.user.email;
    },
  },
  methods: {
    logout() {
      this.$buefy.dialog.confirm({
        title: "Keluar Aplikasi",
        message: "Apakah anda yakin ingin keluar dari aplikasi ?",
        confirmText: "Keluar",
        cancelText: "Kembali",
        type: "is-warning",
        hasIcon: true,
        onConfirm: () => {
          this.$store.dispatch("logout");
          this.$buefy.toast.open("Berhasil Keluar");
        },
      });
    },
  },
};
</script>

<style>
</style>
