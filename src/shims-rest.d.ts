import Vue from 'vue';

declare module 'vue/types/vue' {
  interface Vue {
    $intro: any;
    $locale: string;
  }
}
