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
        `http://localhost:5000/admin/recipes/${props.recipeId}`
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
  <button class="icon" data-label="Elimina" @click="deleteRecipe">
    🗑️
  </button>
</template>

<style scoped lang="scss">
  .icon {
    border: none;
    background: none;
    cursor: pointer;
    font-size: 18px;
    transition: transform 0.2s;


    &:hover {
      transform: scale(1.15);
    }

    &::after {
      content: attr(data-label);
      position: absolute;
      bottom: 130%;
      left: 50%;
      transform: translateX(-50%);
      background: #2e7d32;
      color: #ffffff;
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 12px;
      white-space: nowrap;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s ease;
    }

    &:hover::after {
      opacity: 1;
    }
  }

</style>