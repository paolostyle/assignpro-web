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
        <a
          role="button"
          :class="['navbar-burger burger', { 'is-active': menuOpen }]"
          aria-label="menu"
          @click="toggleMenu()"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>
      <div :class="['navbar-menu', { 'is-active': menuOpen }]">
        <div class="navbar-end">
          <b-navbar-item @click="changeLanguage()" icon="web" class="change-language-button">
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
import { Mutation, State } from 'vuex-class';
import BNavbarItem from './bulma/BNavbarItem.vue';
import TheNavbarLoginButton from './TheNavbarLoginButton.vue';

@Component({
  components: {
    BNavbarItem,
    TheNavbarLoginButton
  }
})
export default class TheNavbar extends Vue {
  @State tourStep: number;
  @Mutation setTourStep: (value: number) => void;
  menuOpen: boolean = false;

  changeLanguage() {
    if (this.$locale === 'pl') {
      this.$locale = 'en';
    } else {
      this.$locale = 'pl';
    }
  }

  launchTutorial() {
    const intro = this.$intro();
    intro
      .setOptions({
        keyboardNavigation: false,
        disableInteraction: true
      })
      .goToStepNumber(this.tourStep)
      .start()
      .onchange((el: Element) =>
        this.setTourStep(parseInt(el.getAttribute('data-step') as string, 10))
      )
      .oncomplete(() => this.setTourStep(1));
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  z-index: 2;
}
</style>
