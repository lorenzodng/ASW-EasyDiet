<script setup>
import { useRouter } from "vue-router";

const props = defineProps({
  userId: {
    type: String,
    required: true
  }
});

const router = useRouter();

const goToEditDiet = () => {
  router.push({
    name: "ComponiDieta",
    query: {
      mode: "edit",
      userId: props.userId
    }
  });
};
</script>

<template>
  <button @click="goToEditDiet">
    ✏️
  </button>
</template>
