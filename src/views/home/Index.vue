<template>
  <div class="min-h-screen w-screen flex justify-center items-start">
    <Card class="min-w-256 mt-16">
      <template #content>
        <InputGroup>
            <Button @click="cariTransaksi" icon="pi pi-search" severity="secondary"/>
            <InputText @keyup.enter="cariTransaksi" v-model="kode_transaksi" placeholder="Cari Kode Transaksi" />
        </InputGroup>
        <small class="block text-xs text-gray-400 mt-2">*Cari riwayat transaksi anda disini. Masukan kode transaksi dengan lengkap</small>
      </template>
    </Card>

    <Dialog v-model:visible="visible" modal header="Detail Transaksi" class="font-mono relative" :style="{ width: '28rem' }">
      <div class="text-end absolute bottom-6 right-8 rounded-full bg-white" style="z-index: 10;" v-if="transaksi.kode_transaksi != ''">
        <Button @click="printTransaksi(transaksi)" severity="danger" rounded label="Print" icon="pi pi-print" class="mx-auto"></Button>
      </div>
      <div id="card-transaksi" class="p-4 mb-6">
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
          PC:{{ transaksi.kode_kassa }}/{{ transaksi.nama_kassa }}
        </div>
        <Divider type="dashed"/>
        <div class="mb-4" v-for="barang in transaksi.barang" :key="barang.id">
          <div class="mb-1">{{ barang.nama_barang }}</div>
          <div class="grid grid-cols-3">
            <div class="mb-1">{{ barang.kode_barang }}</div>
            <div class="mb-1 text-right" v-if="barang.jumlah_barang > 1">{{ barang.jumlah_barang }} x {{ barang.harga_formatted }} = </div>
            <div :class="`mb-1 text-right ${barang.jumlah_barang > 1 ? '' : 'col-span-2'}`">*{{ barang.subtotal_formatted }}</div>
          </div>
        </div>
        <Divider type="dashed"/>
        <div class="mb-4">
          <div class="flex justify-between">
            <div class="mb-1 font-semibold">Total</div>
            <div class="mb-1 font-semibold text-right">{{ toIDR(transaksi.total) }}</div>
          </div>
          <div class="flex justify-between">
            <div class="mb-1">Bayar</div>
            <div class="mb-1 text-right">{{ toIDR(transaksi.bayar) }}</div>
          </div>
          <div class="flex justify-between">
            <div class="mb-1">Kembalian</div>
            <div class="mb-1 text-right">{{ toIDR(transaksi.kembalian) }}</div>
          </div>
        </div>
        <Divider type="dashed"/>
        <div class="mb-8 text-center">
          <span class="text-surface-500 dark:text-surface-400 block mb-1">{{ transaksi.kode_transaksi }}</span>
          <small class="block text-xs text-gray-400">Kode Transaksi</small>
        </div>
      </div>
    </Dialog>
  </div>
</template>
<script>
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroup';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Dialog from 'primevue/dialog';
import Divider from 'primevue/divider';
import axios from 'axios';

export default {
  components: {
    InputGroup, InputGroupAddon, InputText, Button, Card, Dialog, Divider
  },
  data(){
    return {
      kode_transaksi: '',
      transaksi: {
        kode_transaksi: '',
        kode_kassa: '',
        nama_kassa: '',
        total: '',
        kembalian: '',
        bayar: '',
        daftar_barang: [],
      },
      visible: false
    }
  },
  methods: {
    cariTransaksi(){
      axios.post(`http://localhost:5000/api/transaksi/show`, {
        kode_transaksi: this.kode_transaksi
      })
      .then(res => res.data)
      .then(res => {
        this.transaksi = res.data;
        this.visible = true;
      }).catch(err => {
        console.log(err);
        if(err.response.data.errors){
          if(err.response.data.errors.kode_transaksi){
            this.alert(err.response.data.errors.kode_transaksi);
          }
        }else{
          this.alert(err);
        }
      });
    },
    toIDR(value){
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value).replace(',00', '');
    },
    printTransaksi(transaksi) {
      const getCardTransaksiHeight = document.getElementById("card-transaksi").offsetHeight;
      const getCardTransaksiWidth = document.getElementById("card-transaksi").offsetWidth;
      window.html2pdf(document.getElementById("card-transaksi"), {
        margin: 0,
        filename: `${transaksi.kode_transaksi}.pdf`,
        pagebreak: { mode: ['.kode-transaksi']},
        jsPDF: {
          orientation: 'p',
          unit: 'px',
          format: [getCardTransaksiWidth, getCardTransaksiHeight],
          putOnlyUsedFonts:true,
          floatPrecision: 16 // or "smart", default is 16
        }
      });
    },
  }
}
</script>