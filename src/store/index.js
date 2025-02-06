import vuex from 'vuex';

export default new vuex.Store({
  state: {
    breadcrumbs: [],
    session: '',
    message: '',
    currentTransaksi: {
      kode_transaksi: ''
    }
  },
  mutations: {
    setBreadcrumbs(state, data){
      state.breadcrumbs = data;
    },
    setSession(state, data){
      state.session = data.session;
      state.message = data.message;
    },
    setCurrentTransaksi(state, data){
      state.currentTransaksi = data;
    }
  },
  getters: {
    breadcrumbs(state){
      return state.breadcrumbs;
    },
    session(state){
      return state.session;
    },
    message(state){
      return state.message;
    },
    currentTransaksi(state){
      return state.currentTransaksi;
    }
  },
  actions: {
    setBreadcrumbs(context, data){
      context.commit('setBreadcrumbs', data);
    },
    setSession(context, data){
      context.commit('setSession', data);
    },
    setTransaksi(context, data){
      context.commit('setTransaksi', data);
    }
  },
})