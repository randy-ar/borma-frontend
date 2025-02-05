<template>
  <div class="container">
    <div class="flex justify-between items-center">
      <h1 class="text-4xl mb-6">Data Kassa</h1>
      <Button rounded icon="pi pi-plus" label="Tambah" severity="contrast" @click="$router.push({ name: 'admin.kassa.create' })"></Button>
    </div>
    <Message v-if="session === 'success'" severity="success" class="mb-5" @click="resetSession">{{ message }}</Message>
    <Message v-if="session === 'failed'" severity="error" class="mb-5" @click="resetSession">{{ message }}</Message>
    <div class="card">
      <DataTable :value="kassa" tableStyle="min-width: 50rem" class="mb-3">
        <Column field="no" header="#"></Column>
        <Column field="kode_kassa" header="Kode Kassa"></Column>
        <Column field="nama" header="Nama Kassa"></Column>
        <Column class="w-18 !text-end" header="Edit">
          <template #body="{ data }">
              <router-link :to="{ name: 'admin.kassa.edit', params: { kode_kassa: data.kode_kassa } }">
                <Button icon="pi pi-pen-to-square" severity="success" rounded></Button>
              </router-link>
          </template>
        </Column>
        <Column class="w-18 !text-end" header="Delete">
          <template #body="{ data }">
              <Button icon="pi pi-trash" @click="onDelete(data)" severity="danger" rounded></Button>
          </template>
        </Column>
      </DataTable>
      <Pagination :pagination="pagination" @paginate="fetchKassa"></Pagination>
    </div>
  </div>
</template>

<script>
import Message from 'primevue/message';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';   
import Row from 'primevue/row';
import { ref } from 'vue';
import axios from 'axios';
import Button from 'primevue/button';
import Pagination from '../../../components/Pagination.vue';
import Swal from 'sweetalert2';

export default {
  components: {
    Message, DataTable, Column, ColumnGroup, Row, Button, Pagination
  },
  data(){
    return {
      kassa:ref(),
      pagination : {},
      limit: 5,
      pageOptions: [5, 10, 20],
    }
  },
  mounted(){
    this.$store.dispatch('setBreadcrumbs', [
      {label: 'Admin', route: '/admin'},
      {label: 'Kassa', route: '/admin/kassa'}
    ]);
  },
  created(){
    this.fetchKassa();
  },
  methods: {
    fetchKassa(request = {}){
      request.page = request.page || 1;
      axios.get('http://localhost:5000/api/kassa/paginate?' + new URLSearchParams(request))
      .then(res => res.data)
      .then(res => {
        this.kassa = res.data.data.map((item, index) => ({ 
          no: (res.data.pagination.currentPage - 1) * res.data.pagination.perPage + index + 1, ...item
        }));
        this.pagination = res.data.pagination;
        console.log(this.pagination);
      }).catch(err => {
        this.alert(err);
      });
    },
    onDelete(data){
      Swal.fire({
        title: 'Hapus data ini?',
        text: "Data yang telah dihapus tidak dapat dikembalikan!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Hapus!',
        cancelButtonText: 'Batalkan'
      }).then((result) => {
        if (result.value) {
          axios.delete(`http://localhost:5000/api/kassa/${data.kode_kassa}/delete`)
          .then(res => res.data)
          .then(res => {
            this.setSession({
              session: 'failed',
              message: res.message
            });
            this.fetchKassa();
          }).catch(err => {
            this.alert(err);
          });
        }
      })
    }
  }
}
</script>