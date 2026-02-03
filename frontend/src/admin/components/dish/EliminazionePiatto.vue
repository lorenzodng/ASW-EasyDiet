<script setup>
  import axios from "axios";

  const props = defineProps({
    dishId: {
      type: String,
      required: true
    }
  });

  const emit = defineEmits(["deleted"]);

  // Delete the selected dish
  const deleteDish = async () => {
    const conf = confirm("Sei sicuro di voler eliminare questo piatto?");
    if (!conf) return;
    try {
      await axios.delete(
        `http://localhost:5000/admin/dishes/${props.dishId}`
      );
      emit("deleted", props.dishId);
    } catch (error) {
      console.error("Errore eliminazione piatto: ", error);
      alert("Errore eliminazione");
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
