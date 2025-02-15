<template>
  <div class="container">
    <h1 class="text-4xl mb-6">Edit Transaksi</h1>
    <div class="grid grid-cols-2 gap-4">
      <Card>
        <template #content>
          <h4 class="text-lg mb-4 font-semibold">
            Ringkasan Transaksi
          </h4>
          <Divider></Divider>
          <div class="mb-4 relative" v-for="barang in transaksi.daftar_barang" :key="barang.id">
            <div class="mb-1 text-right absolute top-0 right-0">
              <Button icon="pi pi-trash" variant="outlined" size="small" severity="danger" rounded @click="deleteBarang(barang)"></Button>
            </div>
            <div class="flex justify-between">
              <div class="mb-1">{{ barang.nama }}</div>
            </div>
            <div class="grid grid-cols-4">
              <div class="mb-1">{{ barang.kode_barang }}</div>
              <div class="mb-1 text-right" v-if="barang.jumlah_barang > 1">{{ barang.jumlah_barang }} x {{ barang.harga_formatted }} = </div>
              <div :class="`mb-1 text-right font-semibold ${barang.jumlah_barang > 1 ? '' : 'col-span-2'}`">{{ barang.subtotal_formatted }}</div>
            </div>
            <Divider type="dashed"/>
          </div>
          <div class="text-red-400 font-semibold text-center" v-if="transaksi.kode_kassa == ''">Pilih Kassa terlebih dahulu</div>
          <div class="text-center" v-else>{{ transaksi.kode_kassa }} / {{ kassa.nama }}</div>
          <Divider type="dashed" v-if="transaksi.daftar_barang.length > 0"/>
          <div class="mb-4" v-if="transaksi.daftar_barang.length > 0">
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
        </template>
      </Card>
      <Card>
        <template #content>
          <form action="#" @submit.prevent="submitTransaksi">
          <h4 class="text-lg mb-4 font-semibold">
            Input Transaksi
          </h4>
          <Divider></Divider>
          <div class="mb-6">
            <label for="kode_kassa" class="block mb-2 text-sm text-gray-400">Kode Kassa</label>
            <Select v-model="kassa" @change="onChangeKassa" :options="list_kassa" filter optionLabel="kode_kassa" placeholder="Pilih Kassa" class="w-full">
              <template #value="slotProps">
                <div v-if="slotProps.value" class="flex items-center">
                  <div>{{ slotProps.value.kode_kassa }} / {{ slotProps.value.nama }}</div>
                </div>
                <span v-else>
                  {{ slotProps.placeholder }}
                </span>
              </template>
              <template #option="slotProps">
                <div class="flex items-center">
                  <div>{{ slotProps.option.kode_kassa }}</div>
                </div>
              </template>
            </Select>
            <Message v-if="errors.kode_kassa" severity="error">{{ errors.kode_kassa }}</Message>
          </div>
          <div class="mb-6">
            <label for="kode_kassa" class="block mb-2 text-sm text-gray-400">Kode Barang</label>
            <Select v-model="barang" :options="list_barang" filter optionLabel="kode_barang" placeholder="Pilih Barang" class="w-full">
              <template #value="slotProps">
                <div v-if="slotProps.value" class="flex items-center">
                  <div>{{ slotProps.value.kode_barang }} - {{ slotProps.value.nama }}</div>
                </div>
                <span v-else>
                  {{ slotProps.placeholder }}
                </span>
              </template>
              <template #option="slotProps">
                <div class="flex items-center">
                  <div>{{ slotProps.option.kode_barang }} - {{ slotProps.option.nama }}</div>
                </div>
              </template>
            </Select>
            <Message v-if="errors.kode_barang" severity="error">{{ errors.kode_barang }}</Message>
          </div>
          <div class="mb-6 text-end">
            <Button label="Hapus Semua Barang" size="small" class="me-4" severity="danger" icon="pi pi-trash" @click="removeAllBarang"></Button>
            <Button label="Tambah Barang" size="small" severity="info" icon="pi pi-plus" @click="addBarang"></Button>
          </div>
          <h4 class="text-lg mb-4 font-semibold">
            Input Pembayaran
          </h4>
          <Divider></Divider>
          <div class="mt-10 mb-6">
            <FloatLabel>
              <InputText @change="onChangeBayar" id="bayar" ref="bayar" type="number" class="w-full" v-model="transaksi.bayar" />
              <label for="bayar">Bayar (Rp.)</label>
            </FloatLabel>
            <Message v-if="errors.bayar" severity="error">{{ errors.bayar }}</Message>
          </div>
          <div class="text-end">
            <Button severity="contrast" type="submit" label="Simpan" icon="pi pi-save" :loading="loading"></Button>
          </div>
          </form>
        </template>
      </Card>
    </div>
  </div>
</template>
<script>
import Card from 'primevue/card';
import axios from 'axios';
import FloatLabel from 'primevue/floatlabel';
import Select from 'primevue/select';
import Divider from 'primevue/divider';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';

export default {
  components: {
    Card, FloatLabel, Select, Divider, Button, InputText, Message
  },
  data(){
    return {
      list_barang: [],
      list_kassa: [],
      barang: '',
      transaksi: {
        total: 0,
        bayar: '',
        kembalian: 0,
        kode_kassa: '',
        kode_barang: [],
        daftar_barang: [],
        kembalian_formatted: '',
        total_formatted: '',
        bayar_formatted: ''
      }, 
      loading: false,
      kassa: '',
    }
  },
  computed: {
    currentTransaksi(){
      return this.$store.getters.currentTransaksi
    }
  },
  watch: {
    "transaksi.daftar_barang"(){
      this.transaksi.total = 0;
      this.transaksi.daftar_barang.forEach(el => {
        this.transaksi.total += el.subtotal;
      });
      this.transaksi.total_formatted = this.formatRupiah(this.transaksi.total);
      if(this.transaksi.bayar !== ''){
        this.transaksi.kembalian = this.transaksi.bayar - this.transaksi.total;
        this.transaksi.kembalian_formatted = this.formatRupiah(this.transaksi.kembalian);
      }
    }
  },
  mounted(){
    this.$store.dispatch('setBreadcrumbs', [
      {label: 'Admin', route: '/admin'},
      {label: 'Transaksi', route: '/admin/transaksi'},
      {label: 'Edit', route: '/admin/transaksi/edit'},
    ]);
  },
  created(){
    this.fetchBarang();
    this.fetchKassa();
    this.fecthTransaksi();
  },
  methods: {
    fecthTransaksi(){
      console.log(this.currentTransaksi);
      axios.post(`http://localhost:5000/api/transaksi/show`, {
        kode_transaksi: this.currentTransaksi.kode_transaksi
      }).then(res => res.data)
      .then(res => {
        console.log(res);
        this.transaksi.kode_transaksi = res.data.kode_transaksi;
        this.transaksi.daftar_barang = res.data.barang;
        this.transaksi.total = res.data.total;
        this.transaksi.total_formatted = this.formatRupiah(this.transaksi.total);
        this.transaksi.bayar = res.data.bayar;
        this.transaksi.bayar_formatted = this.formatRupiah(this.transaksi.bayar);
        this.transaksi.kembalian = res.data.kembalian;
        this.transaksi.kembalian_formatted = this.formatRupiah(this.transaksi.kembalian);
        this.transaksi.kode_kassa = res.data.kode_kassa;  
        this.transaksi.kode_barang = res.data.barang.map(el => el.kode_barang);
        this.kassa = this.list_kassa.find(el => el.kode_kassa === res.data.kode_kassa);
      }).catch(err => {
        this.alert(err);
      });
    },
    fetchBarang(){
      axios.get('http://localhost:5000/api/barang')
      .then(res => res.data)
      .then(res => {
        this.list_barang = res.data;
      }).catch(err => {
        this.alert(err);
      });
    },
    fetchKassa(){
      axios.get('http://localhost:5000/api/kassa')
      .then(res => res.data)
      .then(res => {
        this.list_kassa = res.data;
      }).catch(err => {
        this.alert(err);
      });
    },
    onChangeBayar(){
      if(this.transaksi.bayar - this.transaksi.total < 0){
        return this.alert('Pembayaran tidak cukup');
      }
      this.transaksi.bayar_formatted = this.formatRupiah(this.transaksi.bayar);
      this.transaksi.kembalian = this.transaksi.bayar - this.transaksi.total;
      this.transaksi.kembalian_formatted = this.formatRupiah(this.transaksi.kembalian);
    },
    onChangeKassa(){
      this.transaksi.kode_kassa = this.kassa.kode_kassa;
    },
    addBarang(){
      if(this.barang === '') return;
      const idx = this.transaksi.daftar_barang.findIndex(el => el.kode_barang === this.barang.kode_barang);
      if(idx === -1){
        this.transaksi.daftar_barang.push({
          kode_barang: this.barang.kode_barang,
          nama: this.barang.nama,
          harga: this.barang.harga,
          jumlah_barang: 1,
          subtotal: this.barang.harga,
          harga_formatted: this.formatRupiah(this.barang.harga),
          subtotal_formatted: this.formatRupiah(this.barang.harga),
        });
        this.transaksi.total += this.barang.harga;
        this.transaksi.total_formatted = this.formatRupiah(this.transaksi.total);
      } else {
        this.transaksi.daftar_barang[idx].jumlah_barang += 1;
        this.transaksi.daftar_barang[idx].subtotal = this.transaksi.daftar_barang[idx].harga * this.transaksi.daftar_barang[idx].jumlah_barang;
        this.transaksi.daftar_barang[idx].subtotal_formatted = this.formatRupiah(this.transaksi.daftar_barang[idx].subtotal);
        this.transaksi.daftar_barang[idx].harga_formatted = this.formatRupiah(this.transaksi.daftar_barang[idx].harga);
        this.transaksi.total += this.transaksi.daftar_barang[idx].harga;
        this.transaksi.total_formatted = this.formatRupiah(this.transaksi.total);
      }
      this.transaksi.kode_barang.push(this.barang.kode_barang);
      // this.barang = '';
    },
    deleteBarang(barang){
      this.transaksi.total -= barang.subtotal;
      this.transaksi.total_formatted = this.formatRupiah(this.transaksi.total);
      this.transaksi.daftar_barang = this.transaksi.daftar_barang.filter(el => el.kode_barang != barang.kode_barang);
      this.transaksi.kode_barang = this.transaksi.kode_barang.filter(el => el != barang.kode_barang);
    },
    removeAllBarang(){
      this.transaksi.daftar_barang = [];
      this.transaksi.kode_barang = [];
      this.transaksi.total = 0;
      this.transaksi.total_formatted = this.formatRupiah(this.transaksi.total);
    },
    formatRupiah(bilangan) {
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(bilangan).replace(',00', '');
    },
    submitTransaksi(){
      if(this.transaksi.bayar - this.transaksi.total < 0) return this.alert('Pembayaran tidak cukup');
      this.errors = {};
      this.loading = true;
      axios.post('http://localhost:5000/api/transaksi/update', {
        kode_transaksi: this.transaksi.kode_transaksi,
        kode_kassa: this.transaksi.kode_kassa,
        bayar: this.transaksi.bayar,
        kode_barang: this.transaksi.kode_barang,
      })
      .then(res => res.data)
      .then(res => {
        this.setSession(res);
        this.$router.push({ name: 'admin.transaksi.index' });
      }).catch(err => {
        console.log(err.response.data);
        if(err.response.data.errors){
          this.errors = err.response.data.errors;
        }else{
          this.alert(err);
        }
      });
      this.loading = false;
    }
  }
}
</script>