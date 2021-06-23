<template>
<div class="container">
<form class="box" @submit.prevent="userLogin">
  <div class="field">
    <label class="label">Username</label>
    <div class="control">
      <input class="input" v-model="form.username" type="text" placeholder="e.g. alex@example.com">
    </div>
  </div>

  <div class="field">
    <label class="label">Password</label>
    <div class="control">
      <input class="input" v-model="form.password" type="password" placeholder="********">
    </div>
  </div>

  <button class="button is-primary">Sign in</button>
</form>
</div>

</template>
<script>
 export default {  
    data(){
      return {
        form: {
          username: '',
          password: '',
        },
        errors: null
      }
    },
    methods: {
      userLogin () { 
      this.$store.dispatch('login', this.form).then(response => {
      
        if(response.data.berhasil == true){
           if(response.data.data.role == 'Admin'){
                   this.$router.push({name: 'admin'})
                }
                else{
                  this.$router.push({name: 'userboard'})
                   
                }
           
        }else{
            this.$router.push({name: 'login'})
        }
       
      }).catch(error => {
        this.errors = error.response.data.errors
      })
    } 
    }
  }
</script>
