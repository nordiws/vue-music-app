<template>
  <div class="bg-white rounded border border-gray-200 relative flex flex-col">
    <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
      <span class="card-title">{{ $t('upload.title') }}</span>
      <i class="fas fa-upload float-right text-green-400 text-2xl" />
    </div>
    <div class="p-6">
      <!-- Upload Dropbox -->
      <div
        class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed
          border-gray-400 text-gray-400 transition duration-500 hover:text-white
          hover:bg-green-400 hover:border-green-400 hover:border-solid"
        :class="{'bg-green-400 border-green-400 border-solid': is_dragover}"
        @dragend.prevent.stop="is_dragover = false"
        @dragover.prevent.stop="is_dragover = true"
        @dragenter.prevent.stop="is_dragover = true"
        @dragleave.prevent.stop="is_dragover = false"
        @drop.prevent.stop="upload($event)"
      >
        <h5>{{ $t('upload.drop_files') }}</h5>
      </div>
      <label for="file">
        <input
          type="file"
          multiple
          @change="upload($event)"
        >
      </label>
      <hr class="my-6">
      <!-- Progress Bars -->
      <div
        class="mb-4"
        v-for="item in uploads"
        :key="item.name"
      >
        <!-- File Name -->
        <div
          class="font-bold text-sm"
          :class="item.text_class"
        >
          {{ item.name }} <i :class="item.icon" />
        </div>
        <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
          <!-- Inner Progress Bar -->
          <div
            class="transition-all progress-bar bg-blue-400"
            :class="item.variant"
            :style="{width: item.current_progress + '%'}"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { storage, auth, songsCollection } from '@/includes/firebase.config';

export default {
  name: 'AppUpload',
  data() {
    return {
      is_dragover: false,
      uploads: [],
    };
  },
  props: {
    addSong: {
      type: Function,
      required: true,
    },
  },
  methods: {
    upload($event) {
      const { uid, displayName } = auth.currentUser;
      this.is_dragover = false;
      const files = $event.dataTransfer ? [...$event.dataTransfer.files] : [...$event.target.files];
      files.forEach((file) => {
        if (file.type !== 'audio/mpeg') return;

        if (!navigator.onLine) {
          this.uploads.push({
            task: [],
            current_progress: 100,
            name: file.name,
            variant: 'bg-red-400',
            icon: 'fas fa-times',
            text_class: 'text-red-400',
          });
          return;
        }

        const storageRef = storage.ref();
        const songRef = storageRef.child(`songs/${uid}/${file.name}`);
        const task = songRef.put(file);
        const uploadIndex = this.uploads.push({
          task,
          current_progress: 0,
          name: file.name,
          variant: 'bg-blue-400',
          icon: 'fas fa-spinner fa-spin',
          text_class: '',
        }) - 1;
        task.on(
          'state_change',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            this.uploads[uploadIndex].current_progress = progress;
          },
          (error) => {
            this.uploads[uploadIndex].variant = 'bg-red-400';
            this.uploads[uploadIndex].icon = 'fas fa-times';
            this.uploads[uploadIndex].text_class = 'text-red-400';
            console.log(error);
          },
          async () => {
            const song = {
              uid,
              display_name: displayName,
              original_name: task.snapshot.ref.name,
              modified_name: task.snapshot.ref.name.split('.')[0],
              genre: '',
              comment_count: 0,
              url: '',
            };
            song.url = await task.snapshot.ref.getDownloadURL();
            const songDbRef = await songsCollection.add(song);
            const songSnapshot = await songDbRef.get();
            this.addSong(songSnapshot);
            this.uploads[uploadIndex].variant = 'bg-green-400';
            this.uploads[uploadIndex].icon = 'fas fa-check';
            this.uploads[uploadIndex].text_class = 'text-green-400';
          },
        );
      });
    },
    cancelUploads() {
      this.uploads.forEach((song) => song.task.cancel());
    },
  },
};
</script>
