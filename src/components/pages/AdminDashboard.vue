<template>
  <section>
    <div>
      <b-navbar shadow spaced>
        <template #brand>
            <b-navbar-item tag="router-link" :to="{ path: '/' }">
                <img
                    src="https://raw.githubusercontent.com/buefy/buefy/dev/static/img/buefy-logo.png"
                    alt="Lightweight UI components for Vue.js based on Bulma"
                >
            </b-navbar-item>
        </template>
        <template #start>
            <b-navbar-item @click="open = true">
                Admin Dashboard
            </b-navbar-item>
          
        </template>

  
    </b-navbar>
    </div>
    <b-sidebar
      type="is-white"
      :fullheight="true"
      :fullwidth="false"
      :overlay="false"
      :right="false"
      v-model="open"
      style="padding:10px"
    >
      <div class="p-1">
        <b-menu>
          <b-menu-list>
            <b-menu-item icon="information-outline" label="Home"></b-menu-item>
             <b-menu-item icon="information-outline" label="User"></b-menu-item>
              <b-menu-item icon="information-outline" label="Pegawai"></b-menu-item>
               <b-menu-item icon="information-outline" label="Absen"></b-menu-item>
                <b-menu-item icon="information-outline" label="Izin"></b-menu-item>
          </b-menu-list>
        </b-menu>
      </div>
    </b-sidebar>
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
      right: false
    };
  }
};
</script>

<style>
.p-1 {
  padding: 1em;
}
</style>
