<template>
  <div class="container">
    <h1 class="text-4xl mb-10">Tambah Kassa</h1>
    <Message v-if="session === 'success'" severity="success" class="mb-5" @click="resetSession">{{ message }}</Message>
    <Message v-if="session === 'failed'" severity="error" class="mb-5" @click="resetSession">{{ message }}</Message>
    <Card>
      <template #content>
        <form action="#" @submit.prevent="storeKassa">
          <div class="grid grid-cols-2 gap-4">
            <div class="my-5">
              <FloatLabel>
                <InputText fluid id="kode_kassa" ref="kode_kassa" v-model="kassa.kode_kassa"/>
                <label for="kode_kassa">Kode Kassa</label>
              </FloatLabel>
              <Message v-if="errors.kode_kassa" severity="error">{{ errors.kode_kassa }}</Message>
            </div>
            <div class="my-5">
              <FloatLabel>
                <InputText fluid id="nama_kassa" v-model="kassa.nama_kassa"/>
                <label for="nama_kassa">Nama Kassa</label>
              </FloatLabel>
              <Message v-if="errors.nama_kassa" severity="error">{{ errors.nama_kassa }}</Message>
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
import axios from 'axios';
import Card from 'primevue/card';
import Message from 'primevue/message';
import FloatLabel from 'primevue/floatlabel';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';

export default {
  components: {
    Card, Message, FloatLabel, InputText, Button
  },
  data(){
    return {
      kassa: {
        kode_kassa: '',
        nama_kassa: ''
      },
      loading: false,
      errors: {}
    }
  },
  mounted(){
    this.$store.commit('setBreadcrumbs', [
      {label: 'Admin', route: '/admin'},
      {label: 'Kassa', route: '/admin/kassa'},
      {label: 'Tambah', route: '/admin/kassa/create'},
    ]);
  },  
  methods: {
    storeKassa(){
      this.loading = true;
      this.errors = {};
      axios.post('http://localhost:5000/api/kassa/store', this.kassa)
      .then(response => response.data)
      .then(response => {
        this.setSession(response);
        setTimeout(() => {
          this.$router.push({ name: 'admin.kassa.index' });
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