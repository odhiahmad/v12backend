<template>
  <div class="container">
    <div class="columns" style="min-height: 100%">
      <div class="column is-8 gambar">
        <b-image
          :src="require('@/assets/loginBg.png')"
          alt="The Buefy Logo"
          :rounded="rounded"
        ></b-image>
      </div>
      <div class="column is-4 styleColumn">
        <div class="card boxStyle">
          <div class="card loginCard">
            <form class="box" @submit.prevent="userLogin">
              <div class="field">
                <label class="label">Username</label>
                <div class="control">
                  <input
                    class="input"
                    v-model="form.username"
                    type="text"
                    placeholder="e.g. alex@example.com"
                  />
                </div>
              </div>

              <div class="field">
                <label class="label">Password</label>
                <div class="control">
                  <input
                    class="input"
                    v-model="form.password"
                    type="password"
                    placeholder="********"
                  />
                </div>
              </div>

              <button class="button is-primary">Sign in</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      rounded: false,
      form: {
        username: "",
        password: "",
      },
      errors: null,
    };
  },
  methods: {
    userLogin() {
      this.$store
        .dispatch("login", this.form)
        .then((response) => {
          if (response.data.berhasil == true) {
            this.$router.push({ name: "page" });
          } else {
            this.$router.push({ name: "login" });
          }
        })
        .catch((error) => {
          this.errors = error.response.data.errors;
        });
    },
  },
};
</script>

<style>
.gambar {
  margin-top: 20;
}
.loginCard {
  margin-top: 50%;
  justify-content: center;
  align-items: center;
}
.styleColumn {
  align-items: center;
  justify-content: center;
  background-color: white;
}
/* .boxStyle {
  height: 100%;
} */
/* .styleColumn {
  border-left: solid black 2px;
} */
</style>