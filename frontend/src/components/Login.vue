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
        localStorage.setItem("token", data.token);
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

  const goToAdmin = () => {
  alert("CLICK ADMIN");
  router.push({ name: "AdminLogin" });
};

</script>

<template>
  <div class="login-container">
    <div class="login-box">
      <h2>Login</h2>
      <form @submit.prevent="loginData">

  <div class="form-group">
    <label for="email">Email</label>
    <input id="email" type="email" v-model="user.email" class="form-control" placeholder="Email">
  </div>


  <div class="form-group">
    <label for="password">Password</label>
    <input id="password" type="password" v-model="user.password" class="form-control" placeholder="Password">
  </div>

  <button type="submit" class="login-button">Login</button>
</form>

<p class="admin-link">
  Sei un amministratore?
  <span @click="goToAdmin">Accedi qui</span>
</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .login-container {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #f2f8f3; // verde chiarissimo
    padding: 20px;
  }

  .login-box {
    width: 360px;
    padding: 32px;
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 8px 20px rgba(76, 175, 80, 0.15);
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .login-box h2 {
    text-align: center;
    color: #2e7d32;
    margin-bottom: 8px;
  }

  /* FORM */
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 12px;

    label {
      font-size: 14px;
      font-weight: 500;
      color: #333;
    }
  }

  .form-control {
    height: 42px;
    padding: 0 12px;
    font-size: 15px;
    border: 1px solid #ccc;
    border-radius: 8px;
    transition: border 0.3s ease, box-shadow 0.3s ease;

    &:focus {
      outline: none;
      border-color: #4caf50;
      box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
    }
  }

  
  .login-button {
    margin-top: 12px;
    width: 100%;
    padding: 12px;
    font-size: 16px;
    font-weight: 600;
    color: #ffffff;
    background-color: #4caf50;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background-color: #66bb6a;
      box-shadow: 0 0 12px rgba(76, 175, 80, 0.6);
      transform: translateY(-2px);
    }

    &:active {
      transform: translateY(0);
      box-shadow: 0 0 6px rgba(76, 175, 80, 0.4);
    }
  }
  .admin-link {
  margin-top: 10px;
  font-size: 14px;
  text-align: center;
  color: #555;

  span {
    color: #2e7d32;
    font-weight: 600;
    cursor: pointer;
    margin-left: 4px;
    transition: color 0.3s ease;

    &:hover {
      color: #4caf50;
      text-decoration: underline;
    }
  }
}


</style>

