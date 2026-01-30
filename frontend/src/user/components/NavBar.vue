<script setup>
  import { ref, onMounted, onBeforeUnmount } from "vue"
  import { useRouter } from "vue-router"
  import { useUserStore } from "../../stores/user"
  import { useDietStore } from "../../stores/diet"

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

  onBeforeUnmount(() => {
    document.removeEventListener("click", handleClickOutside);
  });

  onMounted(() => {
    document.addEventListener("click", handleClickOutside);
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
  $white: #ffffff;
  $black: #000000;
  $gray-text: #333;

  $green-light: #e8f5e9;
  $green-hover: #4caf50;
  $green-dark: #2e7d32;

  $red-error: #c62828;
  $red-light: #ffebee;
  $red-hover: #e53935;

  $orange-main: #e46e0d;
  $orange-light: #fff3e0;
  $border-color: #b71c1c;

  $red-hover-light: #ffcdd2;
  $orange-hover-light: #ffe0b2;

  $transition-fast: 0.2s ease;

  .navbar {
    position: relative;
  }

  .menu-icon {
    width: 28px;
    height: 15px;
    object-fit: contain;
    fill: $gray-text;
  }

  .menu-btn {
    display: flex;
    align-items: center;
    background: rgba($white, 0.2);
    border: 2px solid transparent;
    border-radius: 12px;
    padding: 10px 5px;
    transition: none;
    cursor: pointer;

    &:hover {
      background: rgba($white, 0.3);
    }

    &.active {
      background: rgba($white, 0.3);
      border-color: $black;
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
    background: $white;
    border-radius: 14px;
    padding: 12px;
    min-width: 250px;
    box-shadow: 0 12px 30px rgba($black, 0.18);
    display: flex;
    flex-direction: column;
    gap: 6px;
    z-index: 100;

    > :nth-last-child(2) {
      margin-bottom: 5px;
    }

    a,
    button {
      font-size: 16px;
      font-family: inherit;
    }

    a {
      color: $gray-text;
      padding: 10px 12px;
      border-radius: 8px;
      padding: 11px 12px;
      text-align: left;

      &:hover {
        background: $green-light;
        color: $green-dark;
      }
    }
  }

  .delete-diet {
    background: $red-light;
    color: $red-error;
    border: none;
    padding: 10px;
    border-radius: 8px;
    cursor: pointer;
    margin-top: 10px;

    &:hover {
      background: $red-hover-light;
      ;
    }
  }

  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba($black, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modal {
    background: $white;
    padding: 24px;
    border-radius: 12px;
    width: 400px;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
    text-align: center;

    h2 {
      margin-bottom: 32px;
      color: $green-dark;
    }

    p {
      font-size: 17px;
      color: $gray-text;
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
      background-color: $green-light;
      color: $green-dark;

      &:hover {
        background-color: $green-hover;
        color: $white;
        border-color: $green-dark;
      }
    }

    .cancel {
      background-color: $red-light;
      color: $red-error;

      &:hover {
        background-color: $red-hover;
        color: $white;
        border-color: $border-color;
      }
    }
  }

  .logout {
    background: $orange-light;
    color: $orange-main;
    border: none;
    padding: 10px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;

    &:hover {
      background: $orange-hover-light;

    }
  }
</style>