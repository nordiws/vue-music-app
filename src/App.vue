<template>
  <div>
    <app-header />
    <router-view v-slot="{ Component }">
      <transition
        name="fade"
        mode="out-in"
      >
        <component :is="Component" />
      </transition>
    </router-view>
    <app-player />
    <app-auth />
  </div>
</template>

<script>
import AppPlayer from '@/components/AppPlayer.vue';
import AppHeader from '@/components/AppHeader.vue';
import AppAuth from '@/components/AppAuth.vue';

export default {
  name: 'App',
  components: {
    AppHeader,
    AppAuth,
    AppPlayer,
  },
  created() {
    this.$store.dispatch('init_login');
  },
};
</script>

<style>
  .fade-enter-from {
    opacity: 0;
  }
  .fade-enter-active {
    transition: all 0.5s linear;
  }
  .fade-leave-to {
    transition: all 0.5s linear;
    opacity: 0;
  }
</style>
