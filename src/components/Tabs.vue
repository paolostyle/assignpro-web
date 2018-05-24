<template>
    <div class="is-relative">
        <div class="tabs">
            <ul>
                <tab-element v-for="tab in tabs"
                             :key="tab.id"
                             :id="tab.id"
                             :class="[{'is-active': activeTab === tab.id }]"
                             @click.native="setActiveTab(tab.id)">
                </tab-element>
                <li @click="add()">
                    <a><i class="mdi mdi-plus"></i></a>
                </li>
            </ul>
        </div>
        <div v-if="activeTab">
            <data-table :id="activeTab"></data-table>
            <config-panel :id="activeTab"></config-panel>
        </div>
        <section v-else class="section">
            <div class="content has-text-grey has-text-centered">
                <p>
                    <b-icon
                        icon="emoticon-sad"
                        size="is-large">
                    </b-icon>
                </p>
                <p>Brak otwartych zakładek. Utwórz nową, używając przycisku <i class="mdi mdi-plus"></i> powyżej.</p>
            </div>
        </section>
        <b-loading :is-full-page="false" :active.sync="spinnerActive"></b-loading>
    </div>
</template>

<script lang="ts">
    import {Vue, Component} from 'vue-property-decorator';
    import {Action, Mutation, State} from 'vuex-class';
    import {Tab} from '../types';
    import TabElement from './TabElement.vue';
    import ConfigPanel from './ConfigPanel.vue';
    import DataTable from './DataTable.vue';

    @Component({
        components: {
            TabElement,
            DataTable,
            ConfigPanel
        }
    })
    export default class Tabs extends Vue {
        @State tabs: Tab[];
        @State activeTab: number;
        @State tabCounter: number;
        @State spinnerActive: boolean;
        @Mutation setActiveTab: (id: number) => void;
        @Action addTab: (name: string) => void;

        add() {
            this.$dialog.prompt({
                message: 'Podaj nazwę nowego obliczenia:',
                confirmText: 'Dodaj',
                inputAttrs: {
                    value: 'Obliczenia ' + this.tabCounter,
                    maxlength: 30
                },
                onConfirm: name => this.addTab(name)
            });
        }
    }
</script>

<style lang="scss" scoped>
    .is-relative {
        position: relative;
    }
</style>
