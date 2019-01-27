<i18n>
  {
    "pl": {
      "calcPanel": "Panel obliczeń",
      "history": "Historia",
      "tutorialS1": "Witaj w AssignPro!<br/><br />Aplikacja pomoże Ci rozwiązać problem przydziału. Wyobraź sobie, że chcesz przeprowadzić w domu remont. Wynająłeś 3 pracowników: Hyzia, Dyzia i Zyzia do wykonania trzech prac: malowania ścian, hydrauliki i wymiany okien. Chcesz, żeby każdym zadaniem zajął się tylko jeden pracownik, ale... No właśnie, dylematów może być kilka:<br /><br />- zależy ci na jak najniższych kosztach,<br />- chcesz jak najwyższej, ogólnej jakości wykonania,<br />- chcesz, żeby remont zakończył się jak najszybciej,<br />- nie każdy z pracowników jest w stanie zrobić każde zadanie i nie wiesz jak ich przydzielić.<br /><br />W rozwiązaniu każdego z tych dylematów pomoże Ci AssignPro.",
      "tutorialS7": "W tej tabeli widoczne są poprzednie obliczenia, których wyniki możesz przejrzeć w dowolnej chwili. Możesz też zalogować się, używając przycisku Zaloguj z Google powyżej, by mieć dostęp do historii na każdym komputerze.<br /><br />To już koniec tutoriala. W kroku pierwszym mówiłem o trzech pozostałych problemach, które AssignPro może rozwiązać - spróbuj rozwiązać je sam, odpowiednio wybierając Typ obliczenia. Typ Sumacyjny (maks.) pomoże Ci znaleźć przydział zapewniający najwyższą jakość, jeśli wartości w tabeli są równe ocenie umiejętności pracownika w danej dziedzinie, typ Progowy - najkrótszy czas remontu, zakładając, że wartości w tabeli to czas wykonania zadania (i wszyscy pracownicy wykonują je równocześnie), a tryb Prosty - ogólny przydział zależnie od umiejętności.<br /> Powodzenia!"
  },
    "en": {
      "calcPanel": "Calculation panel",
      "history": "History",
      "tutorialS1": "Welcome in AssignPro!<br/><br />This application will help you solve an assignment problem. Imagine you want to organize renovation in your house. You hired 3 workers: Huey, Dewey and Louie to do three tasks: painting, plumbing and replacing windows. Each task should be done by a single worker, but... Well, you might have a couple of dillemas:<br /><br />- you'd want to have the work done as cheaply as possible,<br />- you'd want the highest possible quality,<br />- you'd want to have the whole renovation done as soon as possible,<br />- some workers can't do all these tasks and you just don't know how to assign tasks for them.<br /><br />AssignPro can help you with each of these dillemas.",
      "tutorialS7": "This table shows previous calculations, which you can later check out at any time. You can also use the button above 'Log in with Google' - after logging in you will be able to see your calculations on any device.<br /><br />This is the end of this tutorial. Try solving other problems by selecting a proper Calculation type. Max sum type will help you find an assignment with the highest quality of work if you provide a rating of each worker for each task, Bottleneck type - assignment with the shortest time of renovation (assuming that your values in the table are durations of each task and all the tasks are being done simultaneously) and Simple type - general assignment based on availability.<br /> Good luck!"
    }
  }
</i18n>

<template>
  <section class="main-pane">
    <div class="container">
      <div class="columns">
        <div
          class="column is-8 tour-step-1"
          v-intro="$t('tutorialS1')"
          v-intro-step="1"
          v-intro-tooltip-class="'v-intro-500'"
          v-intro-position="'auto'"
        >
          <h4 class="title is-4">{{ $t('calcPanel') }}</h4>
          <the-tabs class="box" />
        </div>
        <div
          class="column is-4"
          v-intro="$t('tutorialS7')"
          v-intro-step="7"
          v-intro-tooltip-class="'v-intro-500'"
          v-intro-position="'auto'"
        >
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
