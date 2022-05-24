<template>
  <!-- Header -->
  <header
    id="header"
    class="bg-gray-700"
  >
    <nav class="container mx-auto flex justify-start items-center py-5 px-4">
      <!-- App Name -->
      <router-link
        class="text-white font-bold uppercase text-2xl mr-4"
        exact-active-class="no-active"
        :to="{ name: 'home' }"
      >
        {{ $t('header.title') }}
      </router-link>

      <div class="flex flex-grow items-center">
        <!-- Primary Navigation -->
        <ul class="flex flex-row mt-1">
          <!-- Navigation Links -->
          <li>
            <router-link
              class="px-2 text-white"
              :to="{ name: 'about' }"
            >
              {{ $t('header.about') }}
            </router-link>
          </li>
          <li v-if="!userLoggedIn">
            <a
              class="px-2 text-white"
              href="#"
              @click.prevent="toggleAuthModal"
            >{{ $t('header.register') }}</a>
          </li>
          <template v-else>
            <li>
              <router-link
                class="px-2 text-white"
                :to="{ name: 'manage' }"
              >
                {{ $t('header.manage') }}
              </router-link>
            </li>
            <li>
              <a
                class="px-2 text-white"
                href="#"
                @click="signOut"
              >{{ $t('header.logout') }}</a>
            </li>
          </template>
        </ul>
        <!-- Language Toggle -->
        <label
          for="language"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400 ml-auto"
        >
          <select
            id="language"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
              focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700
              dark:border-gray-600 dark:placeholder-gray-400
              dark:text-white dark:focus:ring-blue-500dark:focus:border-blue-500"
            @change="changeLocale"
          >
            <option value="en">English</option>
            <option value="pt">Português</option>
            <option value="es">Español</option>
          </select>
        </label>
      </div>
    </nav>
  </header>
</template>

<script>
import { mapMutations, mapState } from 'vuex';

export default {
  name: 'AppHeader',
  computed: {
    ...mapState(['userLoggedIn']),
    currentLocale() {
      return this.$i18n.locale === 'pt' ? 'Português' : 'English';
    },
  },
  methods: {
    ...mapMutations(['toggleAuthModal']),
    signOut() {
      this.$store.dispatch('signOut');
      if (this.$route.requiresAuth) this.$router.push({ name: 'home' });
    },
    changeLocale({ target }) {
      this.$i18n.locale = target.value;
    },
  },
};
</script>
