<script setup>
  import { useDietStore } from "../../../stores/diet.js";

  const dietStore = useDietStore();

  const props = defineProps({
    userId: {
      type: String,
      required: true
    }
  });

  const emit = defineEmits(["deleted"]);

  /**
  * Deletes the diet associated with the given user.
  * Asks for confirmation before proceeding.
  * Emits a "deleted" event on success.
  */

  const deleteDiet = async () => {

    const conferma = confirm("Sei sicuro di voler eliminare la dieta di questo utente?");
    if (!conferma) return;

    try {
      await dietStore.deleteDiet(props.userId);

      emit("deleted", props.userId);

    } catch (error) {
      console.error("Errore eliminazione dieta:", error);
      alert("Errore durante l'eliminazione");
    }
  };
</script>

<template>
  <button class="delete" data-label="Elimina" @click="deleteDiet">
    🗑️
  </button>
</template>

<style scoped lang="scss">
  $green-dark: #2e7d32;
  $white: #ffffff;
  $border-radius: 6px;
  $transition-fast: 0.2s ease;
  $icon-font-size: 18px;
  $tooltip-font-size: 12px;

  .delete {
    position: relative;
    background: none;
    border: none;
    cursor: pointer;
    font-size: $icon-font-size;
    transition: transform $transition-fast;

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
      border-radius: $border-radius;
      font-size: $tooltip-font-size;
      white-space: nowrap;
      opacity: 0;
      pointer-events: none;
      transition: opacity $transition-fast;
    }

    &:hover::after {
      opacity: 1;
    }
  }
</style>
