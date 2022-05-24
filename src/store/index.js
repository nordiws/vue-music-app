import { createStore } from 'vuex';

import auth from '@/store/modules/auth';
import player from '@/store/modules/player';

export default createStore({
  modules: {
    auth,
    player,
  },
});
