<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();

const adminToken = ref("");
const loading = ref(false);
const error = ref("");

const loginAdmin = async () => {
  error.value = "";
  loading.value = true;

  try {
    const { data } = await axios.post(
      "http://localhost:5000/admin/login",
      { token: adminToken.value }
    );

    if (data.status) {
      localStorage.setItem("adminToken", adminToken.value);
      alert("Accesso admin effettuato");
      router.push({ name: "AdminHome" }); // o Area Dieta
    } else {
      error.value = "Token non valido";
    }
  } catch (err) {
    error.value = "Errore di connessione";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="login-container">
    <div class="login-box">
      <h2>Accesso Amministratore</h2>

      <form @submit.prevent="loginAdmin">
        <div class="form-group">
          <label for="token">Token Admin</label>
          <input
            id="token"
            type="password"
            v-model="adminToken"
            class="form-control"
            placeholder="Inserisci token"
          />
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
.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f2f8f3;
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

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.error {
  margin-top: 8px;
  text-align: center;
  color: #d32f2f;
  font-size: 14px;
}
</style>