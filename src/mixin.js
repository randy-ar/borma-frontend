import Swal from 'sweetalert2';

const mixin = {
  data(){
    return {
      errors: {},
    }
  },
  computed: {
    session(){
      return this.$store.getters.session;
    },
    message(){
      return this.$store.getters.message;
    }
  },
  methods:{
    alert(message, icon = 'error', callback = () => {}) {
      Swal.fire({
        icon: icon,
        title: message,
        showConfirmButton: false,
        timer: 1500
      }).then(() => {
        callback();
      });
    },
    setSession(response){
      this.$store.dispatch('setSession', response);
      window.scrollTo(0,0);
    },
    resetSession(){
      this.$store.commit('setSession', {session: '', message: ''});
      window.scrollTo(0,0);
    }
  }
}

export default mixin;