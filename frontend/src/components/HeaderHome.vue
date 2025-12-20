<script setup>
import NavBar from './NavBar.vue';

  const props = defineProps({
    userName: {
      type: String,
      required: true
    }
  });
</script>

<template>
  <header class="header">
    <div class="logo">
      🍎 <span>EasyDiet</span> 🍎
    </div>

    <div class="user">
      Ciao, <strong>{{ userName }}</strong>
    </div>
    <NavBar/>
  </header>
</template>

<style scoped>
.header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 40px;
  background-color: #4CAF50;
  color: white;
  overflow: visible;
  box-sizing: border-box;
}


.logo {
  font-size: 22px;
  font-weight: bold;
}

.right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user {
  font-size: 16px;
}
</style>
