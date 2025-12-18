<script setup>
const props = defineProps({
  username: {
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
      Ciao, <strong>{{ props.username }}</strong>
    </div>
  </header>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 25px;
  background-color: #4CAF50;
  color: white;
}

.logo {
  font-size: 20px;
  font-weight: bold;
}

.user {
  font-size: 16px;
}
</style>
