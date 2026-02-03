<script setup>
  import { ref } from "vue";
  import axios from "axios";
  import Form from "./Form.vue";

  const props = defineProps({
    dish: {
      type: Object,
      required: true
    }
  });

  const emit = defineEmits(["updated"]);

  const showForm = ref(false);
  const editDish = ref({ ...props.dish });

  const openForm = () => {
    editDish.value = JSON.parse(JSON.stringify(props.dish));
    showForm.value = true;
  };

  // Update an existing dish
  const modifyDish = async (data) => {
    try {
      await axios.put(`http://localhost:5000/admin/dishes/${props.dish._id}`, data);
      showForm.value = false;
      emit("updated");
    } catch (err) {
      console.error(err);
      alert("Errore nel salvataggio del piatto");
    }
  };
</script>

<template>
  <button class="icon" @click="openForm">✏️</button>

  <div v-if="showForm" class="modal-overlay" @click="showForm = false">
    <div class="modal-content" @click.stop>
      <Form :model-value="editDish" @save="modifyDish" @cancel="showForm = false" :isModal="true" class="modal-form" />
    </div>
  </div>
</template>

<style scoped lang="scss">

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: $overlay-bg;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modal-content {
    background-color: $white;
    border-radius: 12px;
    box-shadow: 0 8px 20px $black-shadow;
    max-width: 600px;
    width: 90%;
    max-height: 100vh;
    overflow-y: auto;
    box-sizing: border-box
  }

  .icon {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 18px;
    position: relative;
    z-index: 0;
  }

</style>