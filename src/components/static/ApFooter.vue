<template>
    <footer class="footer">
        <div class="container">
            <h6 class="brand title is-6 is-marginless">Assign<span class="has-text-info">Pro</span></h6>
            <span class="is-size-7 has-text-grey">
                2018 &copy; <a class="has-text-grey-dark" href="https://github.com/paolostyle">Paweł Dąbrowski</a>
            </span>
            <p class="is-size-7">
                Build: {{ buildDate }}
            </p>
        </div>
    </footer>
</template>

<script lang="ts">
    import {Vue, Component} from 'vue-property-decorator';

    @Component
    export default class Footer extends Vue {
        buildDate: string = WEBPACK_BUILD_DATE;
    }
</script>

<style lang="scss" scoped>
    .footer {
        padding: 2rem;
        margin-top: 3rem;
    }
</style>
