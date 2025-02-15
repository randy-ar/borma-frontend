<template>
  <div class="h-screen min-h-screen w-full">
    <nav class="flex w-full">
      <div class="flex-1">
        <Menubar>
          <template #end>
            <Button @click="$router.push({ name: 'auth.login' })" label="Login" severity="contrast" icon="pi pi-user"></Button>
          </template>
        </Menubar>
      </div>
    </nav>
    <main class="flex-1 w-full p-3">
      <slot></slot>
    </main>
  </div>
</template>
<script>
import Menubar from 'primevue/menubar';
import Button from 'primevue/button';

export default {
  components: {
    Menubar,
    Button
  },
}
</script>