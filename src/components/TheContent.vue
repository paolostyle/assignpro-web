<i18n>
  {
    "pl": {
      "calcPanel": "Panel obliczeń",
      "history": "Historia"
    },
    "en": {
      "calcPanel": "Calculation panel",
      "history": "History"
    }
  }
</i18n>

<template>
  <section class="main-pane">
    <div class="container">
      <div class="columns">
        <div class="column is-8">
          <h4 class="title is-4">{{ $t('calcPanel') }}</h4>
          <the-tabs class="box" />
        </div>
        <div class="column is-4">
          <h4 class="title is-4">{{ $t('history') }}</h4>
          <the-history class="box" />
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import TheHistory from './TheHistory.vue';
import TheTabs from './TheTabs.vue';

@Component({
  components: { TheHistory, TheTabs }
})
export default class TheContent extends Vue {}
</script>

<style lang="scss" scoped>
.main-pane {
  flex: 1;
  padding: 2rem 1rem 1rem;
}
</style>
