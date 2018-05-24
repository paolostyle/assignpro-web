<template>
    <section class="main-pane">
        <div class="container">
            <div class="columns">
                <div class="column is-8">
                    <h4 class="title is-4">Panel obliczeń</h4>
                    <tabs class="box"></tabs>
                </div>
                <div class="column is-4">
                    <h4 class="title is-4">Historia</h4>
                    <history-table class="box"></history-table>
                </div>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
    import {Vue, Component} from 'vue-property-decorator';
    import Tabs from '../Tabs.vue';
    import HistoryTable from '../HistoryTable.vue';

    @Component({
        components: {HistoryTable, Tabs}
    })
    export default class ApMain extends Vue {
    }
</script>

<style lang="scss" scoped>
    .main-pane {
        flex: 1;
        padding: 2rem 1rem 1rem;
    }
</style>
