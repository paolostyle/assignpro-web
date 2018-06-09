<template>
    <nav class="navbar is-light has-shadow"
         role="navigation"
         aria-label="main navigation">
        <div class="container">
            <div class="navbar-brand">
                <a class="navbar-item has-text-black">
                    <h4 class="brand title is-4">
                        Assign<span class="has-text-info">Pro</span>
                    </h4>
                </a>
            </div>
            <div class="navbar-menu">
                <div class="navbar-end">
                    <a class="navbar-item"
                       @click="launchTutorial()">
                        <b-icon icon="book-open-variant"></b-icon>
                        Tutorial
                    </a>
                    <login-button></login-button>
                </div>
            </div>
        </div>
    </nav>
</template>

<script lang="ts">
    import {Vue, Component} from 'vue-property-decorator';
    import LoginButton from '../stateful/LoginButton.vue';

    @Component({
        components: {LoginButton}
    })
    export default class AppNavbar extends Vue {
        launchTutorial() {
            this.$intro().start();
        }
    }
</script>

<style lang="scss" scoped>
    .navbar {
        z-index: 2;
    }
</style>
