<template>
  <main>
    <app-banner />
    <!-- Main Content -->
    <section class="container mx-auto">
      <div
        class="bg-white rounded border border-gray-200 relative flex flex-col"
      >
        <!-- Icon -->
        <div
          class="px-6 pt-6 pb-5 font-bold border-b border-gray-200"
        >
          <span class="card-title">{{ $t('home.songs') }}</span>
          <span v-icon-secondary="{ icon: 'headphones-alt', right: true }" />
        </div>
        <!-- Playlist -->
        <ul id="playlist">
          <app-song-item
            v-for="song in songs"
            :key="song.docID"
            :song="song"
          />
        </ul>
        <!-- .. end Playlist -->
      </div>
    </section>
  </main>
</template>

<script>
import { songsCollection } from '@/includes/firebase.config';
import AppSongItem from '@/components/SongItem.vue';
import IconSecondary from '@/directives/icon-secondary';
import AppBanner from '@/components/AppBanner.vue';

export default {
  name: 'HomeView',
  data() {
    return {
      songs: [],
      maxPerPage: 25,
      pendingRequest: false,
    };
  },
  components: {
    AppSongItem,
    AppBanner,
  },
  directives: {
    'icon-secondary': IconSecondary,
  },
  methods: {
    async getSongs() {
      let snapshots;
      if (this.pendingRequest) return;
      this.pendingRequest = true;
      if (this.songs.length) {
        const lastDocument = await songsCollection
          .doc(this.songs[this.songs.length - 1].docID)
          .get();
        snapshots = await songsCollection
          .orderBy('modified_name')
          .startAfter(lastDocument)
          .limit(this.maxPerPage)
          .get();
      } else {
        snapshots = await songsCollection.orderBy('modified_name').limit(this.maxPerPage).get();
      }
      snapshots.forEach((document) => this.songs.push({
        docID: document.id,
        ...document.data(),
      }));
      this.pendingRequest = false;
    },
    handleScroll() {
      const { scrollTop, offsetHeight } = document.documentElement;
      const { innerHeight } = window;
      const bottomOfWindow = Math.round(scrollTop) + innerHeight === offsetHeight;
      if (bottomOfWindow) {
        this.getSongs();
      }
    },
  },
  async created() {
    this.getSongs();
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
};
</script>
