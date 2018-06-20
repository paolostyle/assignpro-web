<template>
    <div class="assign-pro">
        <the-navbar />
        <the-content />
        <the-footer />
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import TheNavbar from './components/TheNavbar.vue';
    import TheContent from './components/TheContent.vue';
    import TheFooter from './components/TheFooter.vue';
    import {configureAxios, initializeFirebase} from './configs/app-config';

    @Component({
        components: {
            TheNavbar,
            TheContent,
            TheFooter
        }
    })
    export default class App extends Vue {
        beforeCreate() {
            configureAxios();
            initializeFirebase(user => {
                user
                    ? this.$store.dispatch('logIn', user)
                    : this.$store.commit('switchSpinner', false);
            });
        }
    }
</script>


<style lang="scss" src="./app.scss">
</style>
