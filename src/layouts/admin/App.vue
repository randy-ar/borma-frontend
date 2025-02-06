<template>
  <div class="h-screen min-h-screen w-full">
    <nav class="flex w-full pt-6">
      <div class="w-64">
        <div class="flex justify-center items-center">
          <img class="h-14" src="https://upload.wikimedia.org/wikipedia/commons/f/f3/Logo_Borma_Toserba.jpg" alt="Logo Borma">
        </div>
      </div>
      <div class="flex-1">
        <Menubar>
          <template #start>
            <Breadcrumb :model="breadcrumbs_items">
              <template #item="{ item, props }">
                <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
                    <a :href="href" v-bind="props.action" @click="navigate">
                        <span :class="[item.icon, 'text-color']" />
                        <span class="text-primary font-semibold">{{ item.label }}</span>
                    </a>
                </router-link>
                <a v-else :href="item.url" :target="item.target" v-bind="props.action">
                    <span class="text-surface-700 dark:text-surface-0">{{ item.label }}</span>
                </a>
            </template>
            </Breadcrumb>
          </template>
          <template #end>
            <Button @click="$router.push({ name: 'auth.login' })" label="Logout" severity="contrast" icon="pi pi-user"></Button>
          </template>
        </Menubar>
      </div>
    </nav>

    <div class="flex mt-5 h-full w-full">
      <aside class="w-64">
        
        <div class="card flex justify-center">
          <Menu :model="sidebar_items" ></Menu>
        </div>
      </aside>

      <main class="flex-1 p-3  mb-32">
        <slot></slot>
      </main>
    </div>

    <!-- <footer class="p-4 text-center">
      &copy; 2025 Admin Borma. All rights reserved.
    </footer> -->
  </div>
</template>
<script>
import { Menu } from 'primevue';
import Menubar from 'primevue/menubar';
import Breadcrumb from 'primevue/breadcrumb';
import Button from 'primevue/button';

import { ref } from 'vue';
export default {
  components: {
    Menu,
    Menubar,
    Breadcrumb,
    Button
  },
  data() {
    return {
      sidebar_items: ref([
        {
            label: 'Dashboard',
            items: [
              { label: 'Dashboard', icon: 'pi pi-chart-line', command: () => { this.$router.push({ name: 'admin'}) }},
            ]
        },
        {
          label: 'Data Master',
          items: [
            { label: 'Toko', icon: 'pi pi-warehouse' , command: () => { this.$router.push({ name: 'admin.toko.index'}) } },
            { label: 'Kassa', icon: 'pi pi-desktop' , command: () => { this.$router.push({ name: 'admin.kassa.index'}) }},
            { label: 'Barang', icon: 'pi pi-barcode' , command: () => { this.$router.push({ name: 'admin.barang.index'}) }},
          ]
        },
        {
            label: 'Sistem Transaksi',
            items: [
              { label: 'Transaksi', icon: 'pi pi-receipt', command: () => { this.$router.push({ name: 'admin.transaksi.index'}) }},
            ]
        },
      ]),
    }
  },
  computed: {
    breadcrumbs_items() {
      return this.$store.getters.breadcrumbs
    }
  }
}
</script>