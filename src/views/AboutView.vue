<template>
  <div>
    <app-banner />
    <section class="container mx-auto">
      <div class="bg-white rounded border border-gray-200 relative flex flex-col">
        <div class="px-6 pt-6 pb-5 border-b border-gray-200">
          <p class="font-bold">
            Your Music!
          </p>
          <p>
            Vue.js project for learning the framework!
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import AppBanner from '@/components/AppBanner.vue';

export default {
  name: 'AboutView',
  components: {
    AppBanner,
  },
};
</script>
