<template>
    <div class="assign-pro">
        <app-navbar></app-navbar>
        <app-main></app-main>
        <app-footer></app-footer>
    </div>
</template>

<script lang="ts">
    import {Vue, Component} from 'vue-property-decorator';
    import AppNavbar from './components/stateless/AppNavbar.vue';
    import AppFooter from './components/stateless/AppFooter.vue';
    import AppMain from './components/stateless/AppMain.vue';
    import {initializeFirebase, configureAxios} from './configs/app-config';

    @Component({
        components: {
            AppMain,
            AppFooter,
            AppNavbar
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
