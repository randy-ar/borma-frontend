<template>
  <component :is="layout">
    <router-view></router-view>
  </component>
</template>
<script> 

import home_layout from './home/App.vue';
import admin_layout from './admin/App.vue';

export default { 
  computed: {
    layout() {
      const layout = this.$route.meta.layout || 'home-layout';
      return {
        'home-layout': home_layout,
        'admin-layout': admin_layout
      }[layout];
    },
  }
}
</script>