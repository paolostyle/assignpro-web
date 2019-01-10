<template>
  <footer class="footer">
    <div class="container cols-container">
      <div>
        <h6 class="brand title is-6 is-marginless">Assign<span class="has-text-info">Pro</span></h6>
        <span class="is-size-7 has-text-grey">
          2018-2019 &copy;
          <a class="has-text-grey-dark" href="https://github.com/paolostyle"> Paweł Dąbrowski </a>
        </span>
        <p class="is-size-7">
          GitHub:
          <a href="https://github.com/paolostyle/assignpro-web" target="_blank">Webapp</a> |
          <a href="https://github.com/paolostyle/assignpro-api" target="_blank">API</a>
        </p>
        <p class="is-size-7">Build: {{ buildDate }}</p>
      </div>
      <div class="credits">
        <i18n path="credits" tag="span">
          <a href="http://www.elka.pw.edu.pl/" target="_blank">{{ $t('faculty') }}</a>
        </i18n>
      </div>
    </div>
  </footer>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class TheFooter extends Vue {
  buildDate: string = WEBPACK_BUILD_DATE;
}
</script>

<style lang="scss" scoped>
  .footer {
    padding: 2rem;
    margin-top: 3rem;
  }

  .cols-container {
    display: flex;
    justify-content: space-between;
  }

  .credits {
    font-size: 0.75rem;
    max-width: 16.5rem;
  }
</style>
