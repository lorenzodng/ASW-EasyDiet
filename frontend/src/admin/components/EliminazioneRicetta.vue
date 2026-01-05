<script setup>
import axios from "axios";


//  props dal padre
const props = defineProps({
  recipeId: {
    type: String,
    required: true
  }
});

// eventi verso il padre
const emit = defineEmits(["deleted"]);

// elimina ricetta
const deleteRecipe = async () => {
  const conferma = confirm("Sei sicuro di voler eliminare questa ricetta?");
  if (!conferma) return;

  try {
    await axios.delete(
      `http://localhost:5000/recipes/${props.recipeId}`
    );

    // avvisa il padre
    emit("deleted", props.recipeId);

  } catch (error) {
    console.error("Errore eliminazione ricetta:", error);
    alert("Errore durante l'eliminazione");
  }
};
</script>

<template>
  <button class="delete" @click="deleteRecipe">
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
