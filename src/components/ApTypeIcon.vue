<template>
    <span class="type-icon-container" v-tooltip.top="tooltip ? config.text : null" v-if="isInline">
        <span v-if="config.secIcon" class="complex-icon-inline">
            <b-icon :icon="config.icon"></b-icon>
            <i v-if="config.secIcon" :class="['mdi', 'mdi-' + config.secIcon]"></i>
        </span>
        <b-icon v-else :icon="config.icon" class="type-icon"></b-icon>
    </span>
    <div v-else
         v-tooltip.top="tooltip ? config.text : null"
         :class="['type-icon-container', config.secIcon ? 'complex-icon' : '']">
        <b-icon class="media-left" :icon="config.icon"></b-icon>
        <i v-if="config.secIcon" :class="['mdi', 'mdi-' + config.secIcon]"></i>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {CalculationType} from '../types';

    @Component
    export default class ApTypeIcon extends Vue {
        @Prop() type: CalculationType;
        @Prop() isInline: boolean;
        @Prop() tooltip: boolean;

        get config() {
            switch (this.type) {
                case CalculationType.Sum:
                    return {
                        text: 'Sumacyjny',
                        icon: 'sigma',
                        secIcon: 'arrow-down'
                    };
                case CalculationType.SumMax:
                    return {
                        text: 'Sumacyjny (maks.)',
                        icon: 'sigma',
                        secIcon: 'arrow-up'
                    };
                case CalculationType.Bottleneck:
                    return {
                        text: 'Progowy',
                        icon: 'chart-gantt'
                    };
                case CalculationType.Simple:
                    return {
                        text: 'Prosty',
                        icon: 'checkbox-multiple-marked'
                    };
                default:
                    return {
                        icon: 'help'
                    };
            }
        }
    }
</script>

<style lang="scss" scoped>
    .complex-icon, .complex-icon-inline {
        position: relative;

        .mdi-arrow-down, .mdi-arrow-up {
            position: absolute;
            left: 1.1rem;
            font-size: 0.8rem;
        }

        .mdi-arrow-down {
            bottom: -0.1rem;
        }

        .mdi-arrow-up {
            top: -0.1rem;
        }
    }

    .complex-icon-inline {
        width: 1.5rem;
        margin-right: 0.5rem;

        .mdi-arrow-down, .mdi-arrow-up {
            left: 0.7rem;
        }

        .mdi-arrow-down {
            bottom: -0.2rem;
        }

        .mdi-arrow-up {
            top: -0.4rem;
        }
    }

    // !important because something is wrong on prod build
    .type-icon-container .type-icon {
        margin-right: 0.5rem !important;
    }
</style>
