<script setup>
import axios from "axios";

const props = defineProps({
  userId: {
    type: String,
    required: true
  }
});

const emit = defineEmits(["deleted"]);

const deleteDiet = async () => {
  const conferma = confirm("Sei sicuro di voler eliminare la dieta di questo utente?");
  if (!conferma) return;

  try {
    await axios.delete(
      `http://localhost:5000/diet/user/${props.userId}`
    );

    emit("deleted", props.userId);

  } catch (error) {
    console.error("Errore eliminazione dieta:", error);
    alert("Errore durante l'eliminazione");
  }
};
</script>

<template>
  <button class="delete" @click="deleteDiet">
    🗑️
  </button>
</template>

<style scoped>
.delete {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
}

.delete:hover {
  transform: scale(1.1);
}
</style>
