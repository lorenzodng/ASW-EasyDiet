<script setup>
  import { ref, reactive } from "vue";
  import { useRouter } from "vue-router";
  import axios from "axios";

  const router = useRouter();
  const adminToken = ref("");
  const loading = ref(false);
  const error = ref("");

  const errors = reactive({
    token: false
  });
  const loginAdmin = async () => {
    error.value = "";
    loading.value = true;

    try {
      const { data } = await axios.post("http://localhost:5000/admin/login", { token: adminToken.value });
      if (data.status) {
        localStorage.setItem("adminToken", data.tokenjwt);
        router.push({ name: "AdminHome" }); // 
      } else {
        error.value = "Token non valido";
        errors.token = true;
      }
    } catch (err) {
      error.value = "Errore di connessione";
      errors.token = true;
    } finally {
      loading.value = false;
    }
  };
</script>

<template>
  <div class="login-container">
    <div class="login-box">
      <h2>Login</h2>

      <form @submit.prevent="loginAdmin">
        <div class="form-group">
          <label for="token">Token</label>
          <input id="token" type="password" v-model="adminToken" :class="['form-control', { error: errors.token }]"
            placeholder="Inserisci token" />
        </div>

        <button type="submit" class="login-button" :disabled="loading">
          {{ loading ? "Verifica..." : "Accedi" }}
        </button>
      </form>

      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
  $white: #ffffff;
  $green-main: #4caf50;
  $green-hover: #66bb6a;
  $green-dark: #2e7d32;
  $gray-border: #ccc;
  $gray-text: #333;
  $red-error: #c62828;
  $red-error-text: #d32f2f;
  $shadow-login: 0 8px 20px rgba(76, 175, 80, 0.15);
  $shadow-focus-green: 0 0 0 2px rgba(76, 175, 80, 0.2);
  $shadow-focus-red: 0 0 0 2px rgba(198, 40, 40, 0.2);
  $shadow-hover-button: 0 0 12px rgba(76, 175, 80, 0.6);
  $shadow-active-button: 0 0 6px rgba(76, 175, 80, 0.4);

  .login-container {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
  }

  .login-box {
    width: 360px;
    padding: 32px;
    background-color: $white;
    border-radius: 12px;
    box-shadow: $shadow-login;
    display: flex;
    flex-direction: column;
    gap: 16px;

    h2 {
      text-align: center;
      color: $green-dark;
      margin-bottom: 8px;
    }
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 12px;
    text-align: left;

    label {
      font-size: 14px;
      font-weight: 500;
      color: $gray-text;
    }
  }

  .form-control {
    height: 42px;
    padding: 0 12px;
    font-size: 15px;
    border: 1px solid $gray-border;
    border-radius: 8px;
    transition: border 0.3s ease, box-shadow 0.3s ease;

    &:focus {
      outline: none;
      border-color: $green-main;
      box-shadow: $shadow-focus-green;
    }

    &.error {
      border-color: $red-error;
      box-shadow: $shadow-focus-red;
      text-align: left;
    }
  }

  .login-button {
    margin-top: 12px;
    width: 100%;
    padding: 12px;
    font-size: 16px;
    font-weight: 600;
    color: $white;
    background-color: $green-main;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background-color: $green-hover;
      box-shadow: $shadow-hover-button;
      transform: translateY(-2px);
    }

    &:active {
      transform: translateY(0);
      box-shadow: $shadow-active-button;
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  .error {
    margin-top: 8px;
    text-align: center;
    color: $red-error-text;
    font-size: 14px;
  }
</style>