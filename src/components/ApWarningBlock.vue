<template>
    <section class="section">
        <div class="content has-text-grey has-text-centered">
            <p>
                <b-icon :icon="icon"
                        size="is-large">
                </b-icon>
            </p>
            <p><slot></slot></p>
        </div>
    </section>
</template>

<script lang="ts">
    import {Vue, Component, Prop} from 'vue-property-decorator';

    @Component
    export default class ApWarningBlock extends Vue {
        @Prop({type: String, default: 'alert-circle-outline'}) icon: string;
    }
</script>
