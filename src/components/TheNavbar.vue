<i18n>
  {
    "pl": {
      "tutorial": "Tutorial",
      "otherLang": "English"
    },
    "en": {
      "tutorial": "Tutorial",
      "otherLang": "Polski"
    }
  }
</i18n>

<template>
  <nav class="navbar is-light has-shadow" role="navigation" aria-label="main navigation">
    <div class="container">
      <div class="navbar-brand">
        <a class="navbar-item has-text-black">
          <h4 class="brand title is-4">Assign<span class="has-text-info">Pro</span></h4>
        </a>
      </div>
      <div class="navbar-menu">
        <div class="navbar-end">
          <a class="navbar-item" @click="changeLanguage()">
            <b-icon icon="web"></b-icon>
            {{ $t('otherLang') }}
          </a>
          <a class="navbar-item" @click="launchTutorial()">
            <b-icon icon="book-open-variant"></b-icon>
            {{ $t('tutorial') }}
          </a>
          <the-navbar-login-button />
        </div>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import TheNavbarLoginButton from './TheNavbarLoginButton.vue';

@Component({
  components: {
    TheNavbarLoginButton
  }
})
export default class TheNavbar extends Vue {
  changeLanguage() {
    if (this.$locale === 'pl') {
      this.$locale = 'en';
    } else {
      this.$locale = 'pl';
    }
  }

  launchTutorial() {
    this.$intro().start();
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  z-index: 2;
}
</style>
