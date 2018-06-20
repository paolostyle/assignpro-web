<template>
    <b-table default-sort="date"
             default-sort-direction="desc"
             hoverable
             :data="history"
             :paginated="true"
             :perPage="5"
             @click="row => addExistingTab(row)">
        <template slot-scope="scope">
            <b-table-column field="type"
                            label="Typ"
                            sortable>
                <ap-type-icon :type="scope.row.type"
                              :tooltip="true">
                </ap-type-icon>
            </b-table-column>

            <b-table-column field="name"
                            label="Nazwa"
                            sortable>
                {{ scope.row.name }}
            </b-table-column>

            <b-table-column field="date"
                            label="Data"
                            sortable
                            :custom-sort="dateSorting">
                {{ new Date(scope.row.date).toLocaleString() }}
            </b-table-column>
        </template>
        <template slot="empty">
            <ap-warning-block>
                Brak obliczeń w historii.
            </ap-warning-block>
        </template>
    </b-table>
</template>

<script lang="ts">
    import {Vue, Component} from 'vue-property-decorator';
    import {Action, State} from 'vuex-class';
    import {CalculatedTab} from '../types';
    import ApWarningBlock from './ApWarningBlock.vue';
    import ApTypeIcon from './ApTypeIcon.vue';

    @Component({
        components: {ApTypeIcon, ApWarningBlock}
    })
    export default class TheHistory extends Vue {
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
