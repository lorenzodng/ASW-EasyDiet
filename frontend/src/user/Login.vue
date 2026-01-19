<!-- componente login -->

<script setup>
  import { ref, reactive } from "vue";
  import { useRouter } from "vue-router";
  import { useUserStore } from '../stores/user'
  import axios from "axios";

  const router = useRouter(); //utilizza vue-rotuer per passare a una nuova pagina dopo il login
  const userStore = useUserStore() //utilizza lo store di pinia definito
  const errorMsg = ref("");

  //oggetto di variabili reattive
  const user = reactive({
    email: "",
    password: ""
  });

  const errors = reactive({
    email: false,
    password: false
  });

  //metodo di login
  const loginData = async () => {
    try {
      const { data } = await axios.post("http://localhost:5000/login", user); //invia una post all'url del server (backend), specificando come corpo l'oggetto user
      if (data.status) {
        userStore.setUser(data.user) //salva nella memoria dello store le informazioni dell'utente
        localStorage.setItem("token", data.token);
        if (data.hasProfileInfo) {
          router.push({ name: "Home" }); //passa al componente home passandogli il parametro id
        } else {
          router.push({ name: "Form" }); //passa al componente form utente
        }
      } else {
        errors.email = true;
        errors.password = true;
        errorMsg.value = "Email o password non validi";
      }
    } catch (err) {
      errorMsg.value = "Errore di connessione";
      errors.email = true;
      errors.password = true;
    }
  };

  const goToAdmin = () => {
    //alert("CLICK ADMIN");
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
          <input id="email" type="email" v-model="user.email" :class="['form-control', { 'error': errors.email }]"
            placeholder="Email">
        </div>


        <div class="form-group">
          <label for="password">Password</label>
          <input id="password" type="password" v-model="user.password"
            :class="['form-control', { 'error': errors.password }]" placeholder="Password">
        </div>

        <button type="submit" class="login-button">Accedi</button>
      </form>

      <p v-if="errorMsg" class="error">{{ errorMsg }}</p>

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

    h2 {
      text-align: center;
      color: #2e7d32;
      margin-bottom: 8px;
    }
  }

  /* FORM */
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 12px;
    text-align: left;

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

    &.error {
      border-color: #c62828;
      box-shadow: 0 0 0 2px rgba(198, 40, 40, 0.2);
      text-align: left;
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

  .error {
    margin-top: 8px;
    text-align: center;
    color: #d32f2f;
    font-size: 14px;
  }

</style>
