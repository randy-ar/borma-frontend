<template>
  <div class="container justify-self-center self-center items-center">
    <h1 class="text-4xl mb-6">Data Toko</h1>
    <Message v-if="session === 'success'" severity="success" class="mb-5" @click="resetSession">{{ message }}</Message>
    <Message v-if="session === 'failed'" severity="error" class="mb-5" @click="resetSession">{{ message }}</Message>
    <Card>
      <template #content>
        <h1 class="text-2xl mb-10">Form Toko</h1>
        <form @submit.prevent="storeToko" action="#">
        <div class="grid grid-cols-2 gap-4">
          <div class="w-full mb-5">
            <FloatLabel>
              <InputMask fluid id="kode_toko" ref="kode_toko" v-model="toko.kode_toko" mask="99.999.999.9-999.999"/>
              <label for="kode_toko">Kode Toko</label>
            </FloatLabel>
            <Message v-if="errors.kode_toko" severity="error">{{ errors.kode_toko }}</Message>
          </div>
          <div class="w-full mb-5">
            <FloatLabel>
              <InputText fluid id="nama_toko" v-model="toko.nama_toko"/>
              <label for="nama_toko">Nama Toko</label>
            </FloatLabel>
            <Message v-if="errors.nama_toko" severity="error">{{ errors.nama_toko }}</Message>
          </div>
          <div class="w-full mb-5">
            <FloatLabel>
              <InputText fluid id="nama_perusahaan" v-model="toko.nama_perusahaan"/>
              <label for="nama_perusahaan">Nama Perusahaan</label>
            </FloatLabel>
            <Message v-if="errors.nama_perusahaan" severity="error">{{ errors.nama_perusahaan }}</Message>
          </div>
          <div class="w-full mb-5">
            <FloatLabel>
              <InputMask fluid id="nomor_telepon" v-model="toko.nomor_telepon" mask="022-9999999"/>
              <label for="nomor_telepon">Nomor Telepon</label>
            </FloatLabel>
          </div>
          <div class="w-full col-span-full mb-5">
            <IftaLabel>
              <Textarea id="alamat" v-model="toko.alamat" rows="5" class="w-full" fluid style="resize: none" />
              <label for="alamat">Alamat</label>
            </IftaLabel>
            <Message v-if="errors.alamat" severity="error">{{ errors.alamat }}</Message>
          </div>
        </div>
        <div class="flex justify-end">
          <Button rounded severity="contrast" type="submit" label="Search" icon="pi pi-save" :loading="loading" />
        </div>
        </form>
      </template>
    </Card>
  </div>
</template>

<script>
import Card from 'primevue/card';
import FloatLabel from 'primevue/floatlabel';
import InputMask from 'primevue/inputmask';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import Textarea from 'primevue/textarea';
import IftaLabel from 'primevue/iftalabel';
import Button from 'primevue/button';
import axios from 'axios';

export default {
  components: {
    Card, FloatLabel, InputText, InputMask, Message, IftaLabel, Textarea, Button
  },
  data() {
    return {
      toko: {
        kode_toko: '',
        nama_toko: '',
        nama_perusahaan: '',
        alamat: '',
        nomor_telepon: '',
      }, 
      errors: {},
      loading: false
    }
  },
  created(){
    this.fetchTokoFirst();
  },
  methods: {
    async fetchTokoFirst(){
      axios.get('http://localhost:5000/api/toko/first')
      .then(res => res.data)
      .then(res => {
        this.toko = res.data[0];
        this.$refs.kode_toko.value = this.toko.kode_toko;
      }).catch(err => {
        this.alert(err);
      })
    },
    async storeToko(){
      this.loading = true;
      this.errors = {};
      axios.post('http://localhost:5000/api/toko/update-first', this.toko)
      .then(res => res.data)
      .then(res => {
        this.setSession(res);
        this.fetchTokoFirst();
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
  },
}
</script>