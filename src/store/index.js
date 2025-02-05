import vuex from 'vuex';

export default new vuex.Store({
  state: {
    breadcrumbs: [],
    session: '',
    message: ''
  },
  mutations: {
    setBreadcrumbs(state, data){
      state.breadcrumbs = data;
    },
    setSession(state, data){
      state.session = data.session;
      state.message = data.message;
    },
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
    }
  },
  actions: {
    setBreadcrumbs(context, data){
      context.commit('setBreadcrumbs', data);
    },
    setSession(context, data){
      context.commit('setSession', data);
    }
  },
})