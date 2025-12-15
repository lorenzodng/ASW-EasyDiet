<!-- componente login -->

<script setup>
  import { reactive } from "vue";
  import axios from "axios";
  import { useRouter } from "vue-router";

  const router = useRouter(); //utilizza vue-rotuer per passare a una nuova pagina dopo il login

  const user = reactive({ //variabili reattive
    email: "",
    password: ""
  });

  //metodo di login
  const loginData = async () => {
    try {
      const { data } = await axios.post("http://localhost:5000/login", user); //invia una post all'url del server (backend), specificando come corpo l'oggetto user
      if (data.status) {
        alert("Login effettuato con successo");
        router.push({ name: "Home" }); //passa al componente home
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

        <div class="form-group" align="center">
          <label>Email</label>
          <input type="email" v-model="user.email" class="form-control" placeholder="Mobile">
        </div>

        <div class="form-group" align="center">
          <label>Password</label>
          <input type="passowrd" v-model="user.password" class="form-control" placeholder="Mobile">
        </div>

        <button type="submit" class="btn btn-primary">Login</button> <!-- al click sul bottone, viene invocato "@submit.prevent" -->

      </form>

    </div>

  </div>
</template>

<style scoped></style>