<template>
  <section class="hero is-warning is-light is-fullheight">
    <div class="hero-body">
      <div class="container">
        <div class="columns is-centered">
          <div class="column is-8">
            <b-image
              :src="require('@/assets/loginBg.png')"
              alt="The Buefy Logo"
              :rounded="rounded"
            ></b-image>
          </div>
          <div class="column is-4">
            <div class="card boxStyle">
              <div class="card loginCard">
                <ValidationObserver ref="observer" v-slot="{ handleSubmit }">
                  <div class="box">
                    <BInputValidations
                      rules="required"
                      type="text"
                      placeholder="Isikan email anda"
                      label="Username *"
                      v-model="form.email"
                    />

                    <BInputValidations
                      rules="required"
                      type="password"
                      placeholder="Isikan password anda"
                      label="Password *"
                      v-model="form.password"
                      password-reveal
                    />

                    <button
                      class="button is-primary"
                      @click="handleSubmit(userLogin)"
                    >
                      Sign in
                    </button>
                  </div>
                </ValidationObserver>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <b-loading :closable="false" v-model="loading"></b-loading>
  </section>
</template>
<script>
import BInputValidations from "./../../../inputs/BInputValidations";
import { ValidationObserver } from "vee-validate";
export default {
  components: {
    BInputValidations,
    ValidationObserver,
  },
  data() {
    return {
      loading: false,
      rounded: false,
      form: {
        email: "",
        password: "",
      },
      errors: null,
    };
  },
  methods: {
    resetForm() {
      requestAnimationFrame(() => {
        this.$refs.observer.reset();
      });
    },
    userLogin() {
      this.loading = true;
      this.$store
        .dispatch("login", this.form)
        .then((response) => {
          console.log(response);
          if (response.data.berhasil === true) {
            this.$router.push({ name: "page" });
            this.loading = false;
            this.$buefy.toast.open({
              message: response.data.pesan,
              type: "is-success",
            });
          } else if (response.data.berhasil === false) {
            this.loading = false;
            this.$buefy.toast.open({
              message: response.data.pesan,
              type: "is-success",
            });
          }
        })
        .catch((error) => {
          this.errors = error.response.data.errors;
        });
    },
  },
};
</script>

