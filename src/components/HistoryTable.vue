<template>
    <div>
        <b-table :data="history"
                 :paginated="true"
                 :perPage="5"
                 @click="(row) => addExistingTab(row)"
                 hoverable
                 default-sort="date"
                 default-sort-direction="desc">
            <template slot-scope="scope">
                <b-table-column field="type" label="Typ" sortable>
                    <type-icon :type="scope.row.type" v-tooltip.top-left="'msg'"></type-icon>
                </b-table-column>

                <b-table-column field="name" label="Nazwa" sortable>
                    {{ scope.row.name }}
                </b-table-column>

                <b-table-column field="date" label="Data" sortable :custom-sort="dateSorting">
                    {{ new Date(scope.row.date).toLocaleString() }}
                </b-table-column>
            </template>
            <template slot="empty">
                <section class="section">
                    <div class="content has-text-grey has-text-centered">
                        <p>
                            <b-icon
                                icon="emoticon-sad"
                                size="is-large">
                            </b-icon>
                        </p>
                        <p>Brak obliczeń w historii.</p>
                    </div>
                </section>
            </template>
        </b-table>
    </div>
</template>

<script lang="ts">
    import {Vue, Component} from 'vue-property-decorator';
    import {Action, State} from 'vuex-class';
    import {CalculatedTab} from '../types';
    import TypeIcon from './TypeIcon.vue';

    @Component({
        components: {TypeIcon}
    })
    export default class HistoryTable extends Vue {
        @Action addExistingTab: (tab) => void;
        @Action restoreHistoryFromLocalStorage: () => void;
        @State history: CalculatedTab[];
        dateSorting: (a, b, isAsc: boolean) => number;

        created() {
            this.dateSorting = (a, b, isAsc) => {
                let diff = Date.parse(a.date) - Date.parse(b.date);
                return isAsc ? diff : -diff;
            };
            this.restoreHistoryFromLocalStorage();
        }
    }
</script>
