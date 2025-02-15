<template>
  <div class="container">
    <h1 class="text-4xl mb-6">Edit Barang</h1>
    {{ session }}    
    <Message v-if="session === 'success'" severity="success" class="mb-5" @click="resetSession">{{ message }}</Message>
    <Message v-if="session === 'failed'" severity="error" class="mb-5" @click="resetSession">{{ message }}</Message>
    <Card>
      <template #content>
        <form action="#" @submit.prevent="updateBarang">
          <div class="grid grid-cols-2 gap-4">
            <div class="my-5">
              <FloatLabel>
                <InputMask fluid id="kode_barang" ref="kode_barang" v-model="barang.kode_barang" mask="9999999"/>
                <label for="kode_barang">Kode Barang</label>
              </FloatLabel>
              <Message v-if="errors.kode_barang" severity="error">{{ errors.kode_barang }}</Message>
            </div>
            <div class="my-5">
              <FloatLabel>
                <InputText fluid id="nama_barang" v-model="barang.nama_barang"/>
                <label for="nama_barang">Nama Barang</label>
              </FloatLabel>
              <Message v-if="errors.nama_barang" severity="error">{{ errors.nama_barang }}</Message>
            </div>
            <div class="mb-5 col-span-2">
              <FloatLabel>
                <InputText fluid id="harga" v-model="barang.harga"/>
                <label for="harga">Harga (Rp.)</label>
              </FloatLabel>
              <Message v-if="errors.harga" severity="error">{{ errors.harga }}</Message>
            </div>
          </div>
           <div class="flex justify-end">
            <Button severity="contrast" type="submit" class="px-6" label="Simpan" icon="pi pi-save" :loading="loading" />
          </div>
        </form>
      </template>
    </Card>
  </div>
</template>
<script>
import Message from 'primevue/message';
import Card from 'primevue/card';
import FloatLabel from 'primevue/floatlabel';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import InputMask from 'primevue/inputmask';
import axios from 'axios';

export default {
  components: {
    Message, Card, FloatLabel, InputText, Button, InputMask
  },
  props: ['kode_barang'],
  data(){
    return {
      barang: {
        kode_barang: '',
        nama_barang: '',
        harga: ''
      },
      loading: false
    }
  },
  mounted(){
    this.$store.dispatch('setBreadcrumbs', [
      {label: 'Admin', route: '/admin'},
      {label: 'Barang', route: '/admin/barang'},
      {label: 'Edit', route: '/admin/barang/edit/'+this.$route.params.kode_barang},
    ]);
  },
  created(){
    this.fetchBarang();
  },
  methods:{
    fetchBarang(){
      axios.get(`http://localhost:5000/api/barang/${this.$route.params.kode_barang}/show`)
      .then(res => res.data)
      .then(res => {
        this.barang = res.data;
      }).catch(err => {
        this.alert(err);
      });
    },
    updateBarang(){
      this.loading = true;
      this.errors = {};
      axios.post(`http://localhost:5000/api/barang/${this.$route.params.kode_barang}/update`, this.barang)
      .then(response => response.data)
      .then(response => {
        this.setSession(response);
        setTimeout(() => {
          this.$router.push({ name: 'admin.barang.index' });
        }, 2000);
      })
      .catch(err => {
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