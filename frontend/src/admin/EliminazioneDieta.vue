<script setup>
  import axios from "axios";
  import { useDietStore } from "../stores/diet";
  import { onMounted } from "vue";

  const dietStore = useDietStore();

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
      await dietStore.deleteDiet(props.userId)

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
  .delete {
    position: relative;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 18px;
    transition: transform 0.2s ease;

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