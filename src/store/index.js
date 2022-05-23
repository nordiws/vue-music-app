import { createStore } from 'vuex';
import { auth, userCollection } from '@/includes/firebase.config';
import { Howl } from 'howler';
import helper from '@/includes/helper';

export default createStore({
  state: {
    authModalShow: false,
    userLoggedIn: false,
    currentSong: {},
    sound: {},
    seek: '00:00',
    duration: '',
    playerProgress: '0%',
  },
  getters: {
    playing: (state) => {
      if (state.sound.playing) {
        return state.sound.playing();
      }
      return false;
    },
  },
  mutations: {
    toggleAuthModal: (state) => {
      state.authModalShow = !state.authModalShow;
    },
    toggleAuth(state) {
      state.userLoggedIn = !state.userLoggedIn;
    },
    newSong(state, payload) {
      state.currentSong = payload;
      state.sound = new Howl({
        src: [payload.url],
        html5: true,
      });
    },
    updatePosition(state) {
      state.seek = helper.formatTime(state.sound.seek());
      state.duration = helper.formatTime(state.sound.duration());
      state.playerProgress = `${((state.sound.seek() / state.sound.duration()) * 100)}%`;
    },
  },
  actions: {
    init_login({ commit }) {
      const user = auth.currentUser;
      if (user) {
        commit('toggleAuth');
      }
    },
    async register({ commit }, {
      email, password, name, age, country,
    }) {
      const userCredentials = await auth.createUserWithEmailAndPassword(email, password);
      await userCollection.doc(userCredentials.user.uid).set({
        name,
        email,
        age,
        country,
      });
      await userCredentials.user.updateProfile({
        displayName: name,
      });
      commit('toggleAuth');
    },
    async login({ commit }, { email, password }) {
      await auth.signInWithEmailAndPassword(email, password);
      commit('toggleAuth');
    },
    async signOut({ commit }) {
      await auth.signOut();
      commit('toggleAuth');
      window.location.reload();
    },
    async newSong({ commit, state, dispatch }, payload) {
      if (!state.sound.playing) {
        if (state.sound instanceof Howl) {
          state.sound.unload();
        }
        commit('newSong', payload);
        state.sound.play();
        state.sound.on('play', () => requestAnimationFrame(() => dispatch('progress')));
      } else {
        dispatch('toggleAudio');
      }
    },
    async toggleAudio({ state }) {
      if (!state.sound.playing) return;
      if (state.sound.playing()) {
        state.sound.pause();
      } else {
        state.sound.play();
      }
    },
    progress({ commit, state, dispatch }) {
      commit('updatePosition');
      if (state.sound.playing()) requestAnimationFrame(() => dispatch('progress'));
    },
    updateSeek({ state, dispatch }, payload) {
      if (!state.sound.playing) return;
      const { x, width } = payload.currentTarget.getBoundingClientRect();
      const clickX = payload.clientX - x;
      const percentage = clickX / width;
      const seconds = state.sound.duration() * percentage;
      state.sound.seek(seconds);
      state.sound.once('seek', () => dispatch('progress'));
    },
  },
  modules: {
  },
});
