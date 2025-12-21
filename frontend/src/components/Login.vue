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
  <div class="login-container">
    <div class="login-box">
      <h2>Login</h2>
      <form @submit.prevent="loginData">

        <!-- email -->
        <div class="form-group">
          <label for="email">Email</label>
          <input id="email" type="email" v-model="user.email" class="form-control" placeholder="Email">
        </div>

        <!-- password -->
        <div class="form-group">
          <label for="password">Password</label>
          <input id="password" type="password" v-model="user.password" class="form-control" placeholder="Password">
        </div>

        <button type="submit" class="btn btn-primary btn-block">Login</button>

      </form>
    </div>
  </div>
</template>

<style scoped>
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f5f5f5;
  }

  .login-box {
    width: 350px;
    padding: 30px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }

  .login-box h2 {
    text-align: center;
    margin-bottom: 20px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 15px;
  }

  .form-group label {
    margin-bottom: 5px;
  }

  .form-control {
    height: 40px;
    padding: 0 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .btn-block {
    width: 100%;
    padding: 10px;
    font-size: 16px;
  }
</style>


<!--completare con bottone per admin e login admin-->