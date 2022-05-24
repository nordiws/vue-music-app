<template>
  <!-- Introduction -->
  <section class="mb-8 py-20 text-white text-center relative">
    <div
      class="absolute inset-0 w-full h-full bg-contain introduction-bg"
      style="background-image: url(assets/img/header.png)"
    />
    <div class="container mx-auto">
      <div class="text-white main-header-content">
        <!-- Introduction Header -->
        <h1 class="font-bold text-5xl mb-5">
          {{ $t('home.title') }}
        </h1>
        <p class="w-full md:w-8/12 mx-auto">
          {{ $t('home.description') }}
        </p>
      </div>
    </div>
    <img
      alt=""
      class="relative block mx-auto mt-5 -mb-20 w-auto max-w-full"
      src="assets/img/introduction-music.png"
    >
  </section>
</template>

<script>
export default {
  name: 'AppBanner',
};
</script>
