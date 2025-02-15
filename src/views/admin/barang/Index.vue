<template>
  <div class="container">
    <div class="flex justify-between items-center">
      <h1 class="text-4xl mb-6">Data Barang</h1>
      <Button icon="pi pi-plus" label="Tambah" severity="contrast" @click="$router.push({ name: 'admin.barang.create' })"></Button>
    </div>
    <Message v-if="session === 'success'" severity="success" class="mb-5" @click="resetSession">{{ message }}</Message>
    <Message v-if="session === 'failed'" severity="error" class="mb-5" @click="resetSession">{{ message }}</Message>
    <div class="card">
      <div class="grid grid-cols-12 gap-4">
        <div class="col-span-12 mb-6">
          <InputGroup>
            <Button @click="fetchBarang" icon="pi pi-search" severity="secondary"/>
              <InputText @keyup.enter="fetchBarang" v-model="search" placeholder="Cari Barang" />
            </InputGroup>
        </div>
      </div>
      <DataTable :value="barang" tableStyle="min-width: 50rem" class="mb-3">
        <Column field="no" header="#"></Column>
        <Column field="kode_barang" header="Kode Barang"></Column>
        <Column field="nama_barang" header="Nama Barang"></Column>
        <Column field="harga_formated" header="Harga Barang"></Column>
        <Column class="w-18 !text-end" header="Edit">
          <template #body="{ data }">
              <router-link :to="{ name: 'admin.barang.edit', params: { kode_barang: data.kode_barang } }">
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
      <Pagination :pagination="pagination" @paginate="fetchBarang"></Pagination>
    </div>
  </div>
</template>
<script>
import Message from 'primevue/message';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';   
import Row from 'primevue/row';
import axios from 'axios';
import Button from 'primevue/button';
import Pagination from '../../../components/Pagination.vue';
import Swal from 'sweetalert2';
import InputGroup from 'primevue/inputgroup';
import InputText from 'primevue/inputtext';
import InputGroupAddon from 'primevue/inputgroupaddon';

export default {
  components: {
    Message, DataTable, Column, ColumnGroup, Row, Button, Pagination, InputGroup, InputText, InputGroupAddon
  },
  data(){
    return {
      barang: [],
      pagination : {},
      limit: 5,
      search: '',
    }
  },
  mounted(){
    this.$store.dispatch('setBreadcrumbs', [
      {label: 'Admin', route: '/admin'},
      {label: 'Barang', route: '/admin/barang'}
    ]);
  },
  created(){
    this.fetchBarang();
  },
  methods: {
    fetchBarang(request = {}){
      request.cari = this.search;
      axios.get('http://localhost:5000/api/barang/paginate?' + new URLSearchParams(request))
      .then(res => res.data)
      .then(res => {
        this.barang = res.data.data.map((item, index) => ({ 
          no: (res.data.pagination.currentPage - 1) * res.data.pagination.perPage + index + 1, ...item,
          harga_formated: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.harga).replace(',00', '')
        }));
        this.pagination = res.data.pagination;
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
          axios.delete(`http://localhost:5000/api/barang/${data.kode_barang}/delete`)
          .then(res => res.data)
          .then(res => {
            this.setSession({
              session: 'failed',
              message: res.message
            });
            this.fetchBarang();
          }).catch(err => {
            this.alert(err);
          });
        }
      })
    }
  }
}
</script>