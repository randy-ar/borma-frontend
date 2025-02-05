<template>
  <div class="d-flex justify-center align-center items-center content-center min-h-screen w-full">
    <Card class="w-128 justify-self-center self-center">
      <template #title>
        <h1 class="text-4xl mb-8">Login</h1>
      </template>
      <template #content>
        <form @submit.prevent="onSubmit" class="flex w-full flex-col gap-4 w-full">
          <div class="flex w-full flex-col gap-1">
              <InputText v-model="username" name="username" type="text" placeholder="Username" class="w-full"/>
              <Message v-if="errors.username" :severity="errors.username?.severity">{{ errors.username }}</Message>
          </div>
          <div class="flex w-full flex-col gap-1">
              <InputText v-model="password" name="password" type="password" placeholder="Password" class="w-full"/>
              <Message v-if="errors.password" :severity="errors.password?.severity">{{ errors.password }}</Message>
          </div>
          <Button type="submit" severity="secondary" label="Submit"></Button>
        </form>
      </template>
    </Card>
  </div>
</template>
<script>
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import { Button } from 'primevue';

export default {
  components: {
    Card, InputText, Message, Button
  },
  data(){
    return {
      username: "",
      password: "",
      errors: {}
    }
  },
  methods: {
    onSubmit(){
      this.errors = {};
      if(this.username === ""){
        this.errors.username = "Username is required";
        this.errors.username.severity = "error";
      }
      if(this.password === ""){
        this.errors.password = "Password is required";
        this.errors.password.severity = "error";
      }
      if(this.username === "admin" && this.password === "12341234"){
        this.$router.push({ name: 'admin' });
      }else{
        this.errors.username = "Invalid username or password";
        this.errors.username.severity = "error";
      }
    }
  }
}
</script>