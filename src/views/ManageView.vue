<template>
  <!-- Main Content -->
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
        <app-upload
          ref="upload"
          :add-song="addSong"
        />
      </div>
      <div class="col-span-2">
        <div class="bg-white rounded border border-gray-200 relative flex flex-col">
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">{{ $t('manage.my_songs') }}</span>
            <i class="fa fa-compact-disc float-right text-green-400 text-2xl" />
          </div>
          <div class="p-6">
            <div v-if="songs.length > 0">
              <composition-item
                v-for="(song, index) in songs"
                :key="song.docID"
                :song="song"
                :index="index"
                :update-song="updateSong"
                :delete-song="deleteSong"
                :update-unsaved-flag="updateUnsavedFlag"
              />
            </div>
            <div v-else>
              <h3>{{ $t('manage.no_songs') }}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import AppUpload from '@/components/AppUpload.vue';
import { songsCollection, auth } from '@/includes/firebase.config';
import CompositionItem from '@/components/CompositionItem.vue';

export default {
  name: 'ManageView',
  data() {
    return {
      songs: [],
      unsavedFlag: false,
    };
  },
  components: {
    AppUpload,
    CompositionItem,
  },
  methods: {
    updateUnsavedFlag(value) {
      this.unsavedFlag = value;
    },
    updateSong(index, values) {
      this.songs[index].modified_name = values.modified_name;
      this.songs[index].genre = values.genre;
      this.songs[index].display_name = values.display_name;
    },
    deleteSong(index) {
      this.songs.splice(index, 1);
    },
    addSong(document) {
      const song = {
        docID: document.id,
        ...document.data(),
      };
      this.songs.push(song);
    },
  },
  // Life Cycle methods
  async created() {
    const snapShot = await songsCollection.where('uid', '==', auth.currentUser.uid).get();
    snapShot.forEach(this.addSong);
  },
  beforeRouteLeave(to, from, next) {
    this.$refs.upload.cancelUploads();
    if (!this.unsavedFlag) {
      next();
    } else {
      // eslint-disable-next-line no-restricted-globals, no-alert
      const leave = confirm('You have unsaved changes. Are you sure you want to leave?');
      next(leave);
    }
  },
};
</script>
