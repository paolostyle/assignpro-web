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
          <b-navbar-item @click="changeLanguage()" icon="web">
            {{ $t('otherLang') }}
          </b-navbar-item>
          <b-navbar-item icon="book-open-variant" @click="launchTutorial()">
            {{ $t('tutorial') }}
          </b-navbar-item>
          <the-navbar-login-button />
        </div>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import BNavbarItem from './bulma/BNavbarItem.vue';
import TheNavbarLoginButton from './TheNavbarLoginButton.vue';

@Component({
  components: {
    BNavbarItem,
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
