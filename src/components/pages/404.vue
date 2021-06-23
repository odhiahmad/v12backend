<template>
    <section>
         <div class="container">
             <div class="columns is-centered">
      <div class="column is-half">

             404
      </div>
             </div>
         </div>
    </section>
</template>

<script>
    export default {
        methods: {
            clickMe() {
                this.$buefy.notification.open('Clicked!!')
            }
        }
    }
</script>
