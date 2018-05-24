<template>
    <div class="assign-pro">
        <ap-navbar></ap-navbar>
        <ap-main></ap-main>
        <ap-footer></ap-footer>
    </div>
</template>

<script lang="ts">
    import {Vue, Component} from 'vue-property-decorator';
    import ApNavbar from './components/static/ApNavbar.vue';
    import ApFooter from './components/static/ApFooter.vue';
    import ApMain from './components/static/ApMain.vue';

    @Component({
        components: {
            ApMain,
            ApFooter,
            ApNavbar
        }
    })
    export default class App extends Vue {
    }
</script>

<style lang="scss" src="./app.scss"></style>
