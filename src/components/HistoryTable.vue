<template>
    <b-table :data="history"
             :paginated="true"
             :perPage="5"
             @click="(row) => addExistingTab(row)"
             hoverable
             default-sort="date"
             default-sort-direction="desc">
        <template slot-scope="scope">
            <b-table-column field="type"
                            label="Typ"
                            sortable>
                <type-icon :type="scope.row.type"
                           :tooltip="true">
                </type-icon>
            </b-table-column>

            <b-table-column field="name"
                            label="Nazwa"
                            sortable>
                {{ scope.row.name }}
            </b-table-column>

            <b-table-column field="date"
                            label="Data"
                            :custom-sort="dateSorting"
                            sortable>
                {{ new Date(scope.row.date).toLocaleString() }}
            </b-table-column>
        </template>
        <template slot="empty">
            <empty-placeholder>
                Brak obliczeń w historii.
            </empty-placeholder>
        </template>
    </b-table>
</template>

<script lang="ts">
    import {Vue, Component} from 'vue-property-decorator';
    import {Action, State} from 'vuex-class';
    import {CalculatedTab} from '../types';
    import TypeIcon from './stateless/TypeIcon.vue';
    import EmptyPlaceholder from './stateless/EmptyPlaceholder.vue';

    @Component({
        components: {EmptyPlaceholder, TypeIcon}
    })
    export default class HistoryTable extends Vue {
        @Action addExistingTab: (tab) => void;
        @Action restoreHistoryFromLocalStorage: () => void;
        @State history: CalculatedTab[];
        dateSorting: (a, b, isAsc: boolean) => number;

        created() {
            this.restoreHistoryFromLocalStorage();
            this.dateSorting = (a, b, isAsc) => {
                let diff = Date.parse(a.date) - Date.parse(b.date);
                return isAsc ? diff : -diff;
            };
        }
    }
</script>
