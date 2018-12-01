<template>
  <div class="assign-pro">
    <the-navbar />
    <the-content />
    <the-footer />
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import TheContent from './components/TheContent.vue';
  import TheFooter from './components/TheFooter.vue';
  import TheNavbar from './components/TheNavbar.vue';
  import { configureAxios, initializeFirebase } from './configs/app-config';

  @Component({
  components: {
    TheNavbar,
    TheContent,
    TheFooter
  }
})
export default class App extends Vue {
  beforeCreate() {
    configureAxios();
    initializeFirebase();
  }
}
</script>

<style lang="scss" src="./app.scss"></style>
