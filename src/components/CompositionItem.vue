<template>
  <div class="border border-gray-200 p-3 mb-4 rounded">
    <div v-show="!showForm">
      <h4 class="inline-block text-2xl font-bold">
        {{ song.modified_name }}
      </h4>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right"
        @click.prevent="removeSong"
      >
        <i class="fa fa-times" />
      </button>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"
        @click.prevent="showForm = !showForm"
      >
        <i class="fa fa-pencil-alt" />
      </button>
    </div>
    <div v-show="showForm">
      <div
        class="text-white text-center font-bold p-4"
        v-if="show_alert"
        :class="alert_variant"
      >
        {{ alert_message }}
      </div>
      <vee-form
        :validation-schema="schema"
        :initial-values="song"
        @submit="editSong"
      >
        <div class="mb-3">
          <span
            class="inline-block mb-2"
            for="songTitle"
          >
            Song Title
          </span>
          <vee-field
            name="modified_name"
            type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300
            transition duration-500 focus:outline-none focus:border-black rounded"
            @input="updateUnsavedFlag(true)"
          />
          <ErrorMessage
            class="text-red-600"
            name="modified_name"
          />
        </div>
        <div class="mb-3">
          <span
            class="inline-block mb-2"
            for="genre"
          >
            Genre
          </span>
          <vee-field
            name="genre"
            type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300
              transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Genre"
            @input="updateUnsavedFlag(true)"
          />
          <ErrorMessage
            class="text-red-600"
            name="genre"
          />
        </div>
        <div class="mb-3">
          <span
            class="inline-block mb-2"
            for="genre"
          >
            Artist Name
          </span>
          <vee-field
            name="display_name"
            type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300
              transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Artist Name"
            @input="updateUnsavedFlag(true)"
          />
          <ErrorMessage
            class="text-red-600"
            name="display_name"
          />
        </div>
        <button
          type="submit"
          class="py-1.5 px-3 rounded text-white bg-green-600"
          :disabled="in_submission"
        >
          Submit
        </button>
        <button
          type="button"
          class="py-1.5 px-3 rounded text-white bg-gray-600"
          @click.prevent="showForm = false"
          :disabled="in_submission"
        >
          Go Back
        </button>
      </vee-form>
    </div>
  </div>
</template>

<script>
import { songsCollection, storage, auth } from '@/includes/firebase.config';

export default {
  name: 'CompositionItem',
  data() {
    return {
      showForm: false,
      in_submission: false,
      show_alert: false,
      alert_variant: 'bg-blue-500',
      alert_message: 'Please wait! Updating song info...',
      schema: {
        modified_name: 'required',
        genre: 'alpha_spaces',
      },
    };
  },
  props: {
    song: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    updateSong: {
      type: Function,
      required: true,
    },
    deleteSong: {
      type: Function,
      required: true,
    },
    updateUnsavedFlag: {
      type: Function,
      required: true,
    },
  },
  methods: {
    async editSong(values) {
      this.in_submission = true;
      this.show_alert = true;
      this.alert_variant = 'bg-blue-500';
      this.alert_message = 'Please wait! Updating song info...';
      try {
        await songsCollection.doc(this.song.docID).update(values);
      } catch (error) {
        console.log(error);
        this.in_submission = false;
        this.alert_variant = 'bg-red-500';
        this.alert_message = 'Something wen wrong! Try again later';
        return;
      }
      this.updateSong(this.index, values);
      this.updateUnsavedFlag(false);
      this.in_submission = false;
      this.alert_variant = 'bg-green-500';
      this.alert_message = 'Success!';
      setTimeout(() => {
        this.showForm = false;
      }, 2000);
    },
    async removeSong() {
      const { uid } = auth.currentUser;
      const storageRef = storage.ref();
      const songRef = storageRef.child(`songs/${uid}/${this.song.original_name}`);
      await songRef.delete();
      await songsCollection.doc(this.song.docID).delete();
      this.deleteSong(this.index);
    },
  },
};
</script>
