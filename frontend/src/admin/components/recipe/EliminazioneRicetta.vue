<script setup>
  import axios from "axios";

  // Props received from the parent component
  // Contains the ID of the recipe to be deleted
  const props = defineProps({
    recipeId: {
      type: String,
      required: true
    }
  });

  const emit = defineEmits(["deleted"]);
  //Deletes the selected recipe after user confirmation.
  const deleteRecipe = async () => {
    const conferma = confirm("Sei sicuro di voler eliminare questa ricetta?");
    if (!conferma) return;

    try {
      await axios.delete(
        `http://localhost:5000/admin/recipes/${props.recipeId}`
      );

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
  $green-dark: #2e7d32;
  $white: #ffffff;

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
      background: $green-dark;
      color: $white;
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
