<template>
  <div class="container h-full w-full">
    <div class="grid grid-cols-4 gap-4">
      <Card>
        <template #title>Barang</template>
        <template #content>
            <h1>192</h1>
        </template>
      </Card>
      <Card>
        <template #title>Kassa</template>
        <template #content>
            <h1>12</h1>
        </template>
      </Card>
      <Card>
        <template #title>Transaksi</template>
        <template #content>
            <h1>200</h1>
        </template>
      </Card>
      <Card>
        <template #title>Penjualan</template>
        <template #content>
            <h1>Rp. 20.000.000</h1>
        </template>
      </Card>
    </div>
  </div>
</template>
<script>
import Card from 'primevue/card';

export default {
  components: {
    Card
  },
  mounted() {
    this.$store.dispatch('setBreadcrumbs', [
      {label: 'Admin', route: '/admin'},
    ]);
  }
}
</script>