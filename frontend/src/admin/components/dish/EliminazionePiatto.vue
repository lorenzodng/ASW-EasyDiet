<script setup>
  import axios from "axios";

  // Props received from the parent component
  // Contains the ID of the dish to be deleted
  const props = defineProps({
    dishId: {
      type: String,
      required: true
    }
  });

  const emit = defineEmits(["deleted"]);
  //Deletes the selected dish after user confirmation.
  const deleteDish = async () => {
    const conferma = confirm("Sei sicuro di voler eliminare questo piatto?");
    if (!conferma) return;

    try {
      await axios.delete(
        `http://localhost:5000/admin/dishes/${props.dishId}`
      );

      emit("deleted", props.dishId);

    } catch (error) {
      console.error("Errore eliminazione piatto:", error);
      alert("Errore durante l'eliminazione");
    }
  };
</script>

<template>
  <button class="icon" data-label="Elimina" @click="deleteDish">
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
      background: $green-main;
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
