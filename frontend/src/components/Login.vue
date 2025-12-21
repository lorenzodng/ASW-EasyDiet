<!-- componente login -->

<script setup>
  import { reactive } from "vue";
  import { useRouter } from "vue-router";
  import { useUserStore } from '../stores/user'
  import axios from "axios";

  const router = useRouter(); //utilizza vue-rotuer per passare a una nuova pagina dopo il login
  const userStore = useUserStore() //utilizza lo store di pinia definito

  //oggetto di variabili reattive
  const user = reactive({
    email: "",
    password: ""
  });

  //metodo di login
  const loginData = async () => {
    try {
      const { data } = await axios.post("http://localhost:5000/login", user); //invia una post all'url del server (backend), specificando come corpo l'oggetto user
      if (data.status) {
        userStore.setUser(data.user) //salva nella memoria dello store le informazioni dell'utente
        alert("Login effettuato con successo");
        if (data.hasProfileInfo) {
          router.push({ name: "Home" }); //passa al componente home passandogli il parametro id
        } else {
          router.push({ name: "Form" }); //passa al componente form utente
        }
      } else {
        alert("Login fallito");
      }
    } catch (err) {
      alert("Errore: " + err);
    }
  };
</script>

<template>
  <div class="row">
    <div class="col-sm-4">
      <h2 align="center">Login</h2>
      <form @submit.prevent="loginData"> <!-- viene intercettato l'evento "submit" ed eseguito il metodo "loginData" -->

        <!-- email -->
        <div class="form-group" align="center">
          <label>Email</label>
          <input type="email" v-model="user.email" class="form-control" placeholder="Mobile">
        </div>

        <!-- password -->
        <div class="form-group" align="center">
          <label>Password</label>
          <input type="password" v-model="user.password" class="form-control" placeholder="Mobile">
        </div>

        <!-- al click sul bottone, viene invocato "@submit.prevent" -->
        <button type="submit" class="btn btn-primary">Login</button>

      </form>
    </div>
  </div>
</template>

<style scoped></style>



<!--completare con bottone per admin e login admin-->