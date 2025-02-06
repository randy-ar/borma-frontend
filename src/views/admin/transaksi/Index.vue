<template>
  <div class="container pb-16">
    <div class="flex justify-between items-center">
      <h1 class="text-4xl mb-6">Transaksi</h1>
      <Button icon="pi pi-plus" label="Tambah" severity="contrast" @click="$router.push({ name: 'admin.transaksi.create' })"></Button>
    </div>
    <Message v-if="session === 'success'" severity="success" class="mb-5" @click="resetSession">{{ message }}</Message>
    <Message v-if="session === 'failed'" severity="error" class="mb-5" @click="resetSession">{{ message }}</Message>
    <Card class="mb-6">
      <template #content>
        <DataView :value="list_transaksi">
          <template #header class="mb-6">
            <div class="flex justify-end">
              Showing {{ pagination.totalItems }} Items
            </div>
          </template>
          <template #list="slotProps">
            <div class="grid grid-cols-2 gap-4">
              <div class="mb-3" v-for="transaksi in list_transaksi" :key="transaksi.id">
                <Card>
                  <template #content>
                    <div class="flex justify-between">
                      <div class="text-left">
                        <div class="mb-3">
                          <div class="mb-3">
                            {{ transaksi.kode_transaksi }}
                            <small class="block text-sm text-gray-400">PC:{{transaksi.kode_kassa}}/{{ transaksi.nama }}</small>
                          </div>
                          <div class="text-lg">{{ transaksi.count_barang }}</div>
                          <small class="block text-xs text-gray-400">Total Barang</small>
                        </div>
                      </div>
                      <div class="text-right">
                        <div class="mb-4">
                          <div class="flex gap-3">
                            <Button size="small" @click="deleteTransaksi(transaksi)" severity="danger" variant="outlined" icon="pi pi-trash" rounded label="Hapus"></Button>
                            <Button size="small" @click="editTransaksi(transaksi)" severity="success" variant="outlined" icon="pi pi-pencil" rounded label="Edit"></Button>
                            <Button size="small" @click="setTransaksi(transaksi)" severity="secondary" variant="outlined" icon="pi pi-external-link" rounded label="Detail"></Button>
                          </div>
                        </div>
                        <div class="text-lg">{{ transaksi.total_formatted }}</div>
                        <small class="block text-xs text-gray-400">Total</small>
                      </div>
                    </div>
                  </template>
                </Card>
              </div>
            </div>
          </template>
        </DataView>
      </template>
    </Card>
    <Pagination class="mb-6" :pagination="pagination" @paginate="fetchTransaksi" />

    <Dialog v-model:visible="visible" modal header="Detail Transaksi" :style="{ width: '35rem' }">
      <div class="mb-4 text-center">
        <div class="mb-1">
          {{ transaksi.nama_perusahaan }}
        </div>
        <div class="mb-1">
          {{ transaksi.alamat }}
        </div>
        <div class="mb-1">
          {{ transaksi.kode_toko }}
        </div>
        <div class="mb-1">
          {{ transaksi.nama_toko }}
        </div>
        <div class="mb-1">
          Phone: {{ transaksi.nomor_telepon }}
        </div>
      </div>
      <Divider type="dashed" />
      <div class="text-center">
        PC:{{ transaksi.kode_kassa }}/{{ transaksi.nama }}
      </div>
      <Divider type="dashed"/>
      <div class="mb-4" v-for="barang in transaksi.daftar_barang" :key="barang.id">
        <div class="mb-1">{{ barang.nama }}</div>
        <div class="grid grid-cols-3">
          <div class="mb-1">{{ barang.kode_barang }}</div>
          <div class="mb-1 text-right" v-if="barang.jumlah_barang > 1">{{ barang.jumlah_barang }} x {{ barang.harga_formatted }} = </div>
          <div :class="`mb-1 text-right ${barang.jumlah_barang > 1 ? '' : 'col-span-2'}`">{{ barang.subtotal_formatted }}</div>
        </div>
      </div>
      <Divider type="dashed"/>
      <div class="mb-4">
        <div class="flex justify-between">
          <div class="mb-1 font-semibold">Total</div>
          <div class="mb-1 font-semibold text-right">{{ transaksi.total_formatted }}</div>
        </div>
        <div class="flex justify-between">
          <div class="mb-1">Bayar</div>
          <div class="mb-1 text-right">{{ transaksi.bayar_formatted }}</div>
        </div>
        <div class="flex justify-between">
          <div class="mb-1">Kembalian</div>
          <div class="mb-1 text-right">{{ transaksi.kembalian_formatted }}</div>
        </div>
      </div>
      <Divider type="dashed"/>
      <div class="mb-8 text-center">
        <span class="text-surface-500 dark:text-surface-400 block mb-1">{{ transaksi.kode_transaksi }}</span>
        <small class="block text-xs text-gray-400">Kode Transaksi</small>
      </div>
    </Dialog>
  </div>
</template>

<script>
import Message from 'primevue/message';
import Button from 'primevue/button';
import DataView from 'primevue/dataview';
import Card from 'primevue/card';
import axios from 'axios';
import Dialog from 'primevue/dialog';
import Divider from 'primevue/divider';
import Pagination from '@/components/Pagination.vue';
import Swal from 'sweetalert2';

export default {
  components: {
    Message, DataView, Card, Button, Dialog, Divider, Pagination
  },
  data(){
    return{
      list_transaksi: [],
      transaksi: {
        kode_transaksi: '',
        kode_kassa: '',
        nama: '',
        total: '',
        kembalian: '',
        bayar: '',
        daftar_barang: [],
      },
      pagination: {},
      visible: false
    }
  },
  created(){
    this.fetchTransaksi();
  },
  methods:{
    fetchTransaksi(request = {}){
      request.paginate = 10;
      axios.get(`http://localhost:5000/api/transaksi/paginate?` + new URLSearchParams(request))
      .then(res => res.data)
      .then(res => {
        this.list_transaksi = res.data.map(transaksi => ({
          ...transaksi,
          total_formatted: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(transaksi.total).replace(',00', ''),
          kembalian_formatted: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(transaksi.kembalian).replace(',00', ''),
          bayar_formatted: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(transaksi.bayar).replace(',00', ''),
          count_barang: transaksi.daftar_barang.reduce((total, barang) => total + barang.jumlah_barang, 0),
        }));

        this.pagination = res.pagination;
      }).catch(err => {
        this.alert(err);
      });
    },
    setTransaksi(transaksi){
      this.transaksi = transaksi;
      this.visible = true;
    },
    deleteTransaksi(transaksi){
      Swal.fire({
        title: 'Hapus Data Transaksi',
        text: "Data yang telah dihapus tidak dapat dikembalikan!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Ya, Hapus!',
        cancelButtonText: 'Batalkan'
      })
      .then((result) => {
        if (result.value) {
          axios.delete(`http://localhost:5000/api/transaksi/delete`, {
            data: {
              kode_transaksi: transaksi.kode_transaksi
            }
          })
          .then(res => res.data)
          .then(res => {
            this.setSession({
              session: 'failed',
              message: res.message
            });
            this.fetchTransaksi();
          }).catch(err => {
            this.alert(err);
          });
        }
      });
    },
    editTransaksi(transaksi){
      this.$store.commit('setCurrentTransaksi', transaksi);
      this.$router.push({ name: 'admin.transaksi.edit' });
    }
  }
}
</script>