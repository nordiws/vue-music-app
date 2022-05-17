import { createStore } from 'vuex';
import { auth, userCollection } from '@/includes/firebase.config';

export default createStore({
  state: {
    authModalShow: false,
    userLoggedIn: false,
  },
  getters: {
  },
  mutations: {
    toggleAuthModal: (state) => {
      state.authModalShow = !state.authModalShow;
    },
    toggleAuth(state) {
      state.userLoggedIn = !state.userLoggedIn;
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
  },
  modules: {
  },
});
