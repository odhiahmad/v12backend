<template>
    <section>
        <b-button @click="clickMe">This is Absen</b-button>
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
