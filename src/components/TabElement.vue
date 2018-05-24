<template>
    <li>
        <a @dblclick="nameChanging = true">
            <input class="tab-name-input"
                   maxlength="30"
                   type="text"
                   ref="tabNameInput"
                   v-model="tabName"
                   v-show="nameChanging"
                   @blur="nameChanging = false"
                   @keyup.escape="restoreOldName()"
                   @keyup.enter="nameChanging = false">
            <span v-show="!nameChanging" :class="isFromHistory ? 'is-italic' : ''">
                {{tabName}}
            </span>
            <span class="icon is-small" @click.stop="confirmClosingTab()">
                <i class="mdi mdi-close tab-close"></i>
            </span>
        </a>
    </li>
</template>

<script lang="ts">
    import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
    import {Getter, Action} from 'vuex-class';

    @Component
    export default class TabElement extends Vue {
        @Prop() id: number;
        @Action setTabProperty: (payload: {id: number, property: string, value: any}) => void;
        @Action closeTab: (id: number) => void;
        @Getter getTab: (id: number) => any;
        @Getter tabHasData: (id: number) => boolean;
        nameChanging: boolean = false;
        oldName: string = '';

        get isFromHistory() {
            return !!this.getTab(this.id).historyId;
        }

        get tabName(): string {
            return this.getTab(this.id).name;
        }

        set tabName(value: string) {
            this.setTabProperty({
                id: this.id,
                property: 'name',
                value
            });
        }

        confirmClosingTab() {
            if (!this.isFromHistory && this.tabHasData(this.id)) {
                this.$dialog.confirm({
                    message: 'Jesteś pewien, że chcesz zamknąć tę zakładkę? Dane zostaną utracone.',
                    onConfirm: () => this.closeTab(this.id)
                });
            } else {
                this.closeTab(this.id);
            }
        }

        restoreOldName() {
            this.tabName = this.oldName;
            this.nameChanging = false;
        }

        @Watch('nameChanging')
        focusInput(newValue) {
            if (newValue) {
                this.oldName = this.tabName;
                setTimeout(() => (this.$refs.tabNameInput as HTMLElement).focus());
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '../styles/bulma.scss';

    .tab-close {
        font-size: 1rem;
        margin-left: 1rem;

        &:hover {
            color: $red;
        }
    }

    input.tab-name-input {
        color: $primary;
        font-size: 1rem;
        border: 0;
        outline: $primary 0;
        width: 20rem;
    }
</style>
