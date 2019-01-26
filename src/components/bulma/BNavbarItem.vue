<template>
  <a class="navbar-item" @click="$emit('click')">
    <b-icon v-if="icon" :icon="icon"></b-icon>
    <slot></slot>
  </a>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class BNavbarItem extends Vue {
  @Prop() icon: string;
}
</script>

<style lang="scss" scoped></style>
