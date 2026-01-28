<script setup>
  import { ref, onMounted, onBeforeUnmount } from "vue"
  import { useRouter } from "vue-router"
  import { useUserStore } from "../stores/user"
  import { useDietStore } from "../stores/diet"

  const router = useRouter();
  const isOpen = ref(false);
  const navbarRef = ref(null);
  const modalRef = ref(null);
  const userStore = useUserStore();
  const dietStore = useDietStore();
  const showConfirmModal = ref(false);

  const props = defineProps({
    // If true, shows only the logout button
    onlyLogout: {
      type: Boolean,
      default: false
    }
  });

  // Closes the menu when clicking outside the navbar or modal
  const handleClickOutside = (event) => {
    if (navbarRef.value && !navbarRef.value.contains(event.target) && (!modalRef.value || !modalRef.value.contains(event.target))) {
      isOpen.value = false;
    }
  };

  const menu = () => {
    isOpen.value = !isOpen.value;
  };

  // Opens confirmation modal for diet deletion
  const askDeleteDiet = () => {
    showConfirmModal.value = true;
  };

  const confirmDeleteDiet = async () => {
    try {
      await dietStore.deleteDiet(userStore.id);
      showConfirmModal.value = false;
      isOpen.value = false;
    } catch (err) {
      console.error("Errore nell'eliminazione della dieta", err);
    }
  };

  const cancelDeleteDiet = () => {
    showConfirmModal.value = false;
  };

  // Logs out the user and clears local state
  const logout = () => {
    userStore.reset();
    dietStore.reset();
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    localStorage.removeItem("notificationBannerDismissed");
    localStorage.removeItem("token");
    router.replace({ name: "Login" });
  };


  onMounted(() => {
    document.addEventListener("click", handleClickOutside);
  });

  onBeforeUnmount(() => {
    document.removeEventListener("click", handleClickOutside);
  });
</script>

<template>
  <div class="navbar" ref="navbarRef">
    <button class="menu-btn" :class="{ 'active': isOpen }" @click="menu">
      <img src="/images/hamburger-menu.png" alt="Menu" class="menu-icon" />
    </button>

    <div v-if="isOpen" class="menu">
      <!-- Show all links when onlyLogout is false -->
      <template v-if="!props.onlyLogout">
        <router-link to="/home" @click="menu">🏠 Home</router-link>
        <router-link to="/informazioni-personali" @click="menu">
          👤 Informazioni personali
        </router-link>
        <router-link :to="{ name: 'TrackingPeso' }" @click="menu">
          📊 I tuoi progressi
        </router-link>

        <button v-if="dietStore.dieta" class="delete-diet" @click="askDeleteDiet">
          🗑️ Elimina dieta
        </button>
      </template>

      <!-- Logout button is always visible -->
      <button class="logout" @click="logout">Logout</button>
    </div>

    <div v-if="showConfirmModal" class="modal-overlay" ref="modalRef" @click.self="cancelDeleteDiet">
      <div class="modal" @click.stop>
        <h2>Conferma eliminazione</h2>
        <p>Sei sicuro di eliminare la dieta?</p>
        <div class="actions">
          <button class="confirm" @click="confirmDeleteDiet">Sì</button>
          <button class="cancel" @click="cancelDeleteDiet">Annulla</button>
        </div>
      </div>
    </div>

  </div>
</template>


<style scoped lang="scss">
  .navbar {
    position: relative;
  }

  .menu-icon {
    width: 28px;
    height: 15px;
    object-fit: contain;
    fill: #333;
  }

  .menu-btn {
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.2);
    border: 2px solid transparent;
    border-radius: 12px;
    padding: 10px 5px;
    transition: none;
    cursor: pointer;

    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    &.active {
      background: rgba(255, 255, 255, 0.3);
      border-color: #000000;
    }

    &:focus {
      outline: none;
    }

  }

  .menu {
    position: absolute;
    top: calc(100% + 12px);
    left: 50%;
    transform: translateX(-50%);
    background: #ffffff;
    border-radius: 14px;
    padding: 12px;
    min-width: 250px;

    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.18);
    display: flex;
    flex-direction: column;
    gap: 6px;

    z-index: 100;

    a,
    button {
      font-size: 16px;
      font-family: inherit;
    }

    //router link
    a {
      color: #333;
      padding: 10px 12px;
      border-radius: 8px;
      padding: 11px 12px;
      text-align: left;

      &:hover {
        background: #e8f5e9;
        color: #2e7d32;
      }
    }
  }

  .delete-diet {
    background: #fbe9e7;
    color: #c62828;
    border: none;
    padding: 10px;
    border-radius: 8px;
    cursor: pointer;

    &:hover {
      background: #ffcdd2;
      ;
    }
  }

  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modal {
    background: #ffffff;
    padding: 24px;
    border-radius: 12px;
    width: 400px;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
    text-align: center;

    h2 {
      margin-bottom: 32px;
      color: #2e7d32;
    }

    p {
      font-size: 17px;
      color: #333;
    }

    .actions {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin-top: 50px;
    }

    .confirm,
    .cancel {
      min-width: 100px;
      font-size: 16px;
      border: 1px solid transparent;
      font-weight: 600;
      padding: 10px 18px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .confirm {
      background-color: #e8f5e9;
      color: #2e7d32;

      &:hover {
        background-color: #4caf50;
        color: white;
        border-color: #3da73f;
      }
    }

    .cancel {
      background-color: #ffebee;
      color: #c62828;

      &:hover {
        background-color: #e53935;
        color: white;
        border-color: #b71c1c;
      }
    }
  }

  .logout {
    background: #fff3e0;
    color: #e46e0d;
    border: none;
    padding: 10px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;

    &:hover {
      background: #ffe0b2;

    }
  }
</style>