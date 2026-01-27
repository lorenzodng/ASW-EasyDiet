<script setup>
  import { ref } from "vue";
  import axios from "axios";

  const props = defineProps({
    recipe: {
      type: Object,
      required: true
    }
  });

  const emit = defineEmits(["updated"]);

  const isEditing = ref(false);
  const editRecipe = ref({});

  // apre form
  const modifica = () => {
    editRecipe.value = JSON.parse(JSON.stringify(props.recipe));
    isEditing.value = true;
  };

  // ingredienti da aggiungere 
  const addIngredient = () => {
    editRecipe.value.ingredienti.push({
      nome: "",
      peso: "",
      kcal: ""
    });
  };

  const removeIngredient = (index) => {
    editRecipe.value.ingredienti.splice(index, 1);
  };

  // salva
  const salva = async () => {
    try {
      await axios.put(
        `http://localhost:5000/admin/recipes/${props.recipe._id}`,
        editRecipe.value
      );

      isEditing.value = false;
      emit("updated");
    } catch (err) {
      alert("Errore nel salvataggio");
    }
  };

  // annulla
  const annulla = () => {
    isEditing.value = false;
    editRecipe.value = {};
  };
</script>

<template>
  <div class="edit">

    <button v-if="!isEditing" class="icon" data-label="Modifica" @click="modifica">
      ✏️
    </button>

    <form v-else @submit.prevent="salva">


      <h3>Dati ricetta</h3>

      <label>Nome</label>
      <input :value="editRecipe.nome" @input="editRecipe.nome = $event.target.value" required />

      <label>Categoria</label>
      <select :value="editRecipe.categoria" @change="editRecipe.categoria = $event.target.value">
        <option value="colazione">Colazione</option>
        <option value="pranzo">Pranzo</option>
        <option value="merenda">Merenda</option>
        <option value="cena">Cena</option>
      </select>

      <label>Kcal totali</label>
      <input type="number" :value="editRecipe.kcal" @input="editRecipe.kcal = Number($event.target.value)" />


      <h3>Ingredienti</h3>

      <div v-for="(ing, index) in editRecipe.ingredienti" :key="index" class="ingredient-row">
        <input :value="ing.nome" @input="ing.nome = $event.target.value" placeholder="Ingrediente" />

        <input type="number" :value="ing.peso" @input="ing.peso = Number($event.target.value)" placeholder="g" />

        <input type="number" :value="ing.kcal" @input="ing.kcal = Number($event.target.value)" placeholder="kcal" />

        <button type="button" class="remove-ingredient" @click="removeIngredient(index)">
          ❌
        </button>

      </div>

      <button type="button" @click="addIngredient">
        ➕ Aggiungi ingrediente
      </button>


      <h3>Note</h3>

      <textarea :value="editRecipe.info?.[0]?.descrizioneKcal"
        @input="editRecipe.info[0].descrizioneKcal = $event.target.value" placeholder="Descrizione kcal" />

      <textarea :value="editRecipe.info?.[1]?.descrizioneTipoDieta"
        @input="editRecipe.info[1].descrizioneTipoDieta = $event.target.value" placeholder="Tipo dieta" />

      <textarea :value="editRecipe.info?.[2]?.descrizioneIntolleranze"
        @input="editRecipe.info[2].descrizioneIntolleranze = $event.target.value" placeholder="Intolleranze" />

      <!-- AZIONI -->
      <div class="actions">
        <button type="submit">💾 Salva</button>
        <button type="button" @click="annulla">❌ Annulla</button>
      </div>

    </form>
  </div>
</template>

<style scoped lang="scss">
  $green-dark: #2e7d32;
  $green-main: #4caf50;
  $green-light: #66bb6a;
  $green-light-bg: #e8f5e9;
  $green-light-bg-hover: #c8e6c9;
  $red-main: #d32f2f;
  $red-light-bg: #fdecea;
  $red-light-bg-hover: #f9c5c3;
  $gray-border: #ccc;
  $gray-light: #e0e0e0;
  $gray-text: #555;
  $white: #ffffff;
  $shadow-dark: rgba(0, 0, 0, 0.08);
  $shadow-focus: rgba(76, 175, 80, 0.15);

  $border-radius: 8px;
  $transition-fast: 0.2s ease;

  .icon {
    position: relative;
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
    padding: 6px;
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
      border-radius: 6px;
      font-size: 12px;
      white-space: nowrap;
      opacity: 0;
      pointer-events: none;
      transition: opacity $transition-fast;
    }

    &:hover::after {
      opacity: 1;
    }
  }

  form {
    background: $white;
    padding: 24px;
    margin-top: 16px;
    border-radius: 14px;
    width: 100%;
    max-width: 600px;
    box-shadow: 0 8px 20px $shadow-dark;
  }

  h3 {
    margin: 20px 0 12px;
    color: $green-dark;
    font-size: 18px;
    border-bottom: 1px solid $gray-light;
    padding-bottom: 6px;
  }

  label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 4px;
    color: $gray-text;
  }

  input,
  select,
  textarea {
    width: 95%;
    height: 42px;
    padding: 10px 12px;
    border-radius: $border-radius;
    border: 1px solid $gray-border;
    font-size: 14px;
    transition: border-color $transition-fast, box-shadow $transition-fast;

    &:focus {
      outline: none;
      border-color: $green-main;
      box-shadow: 0 0 0 2px $shadow-focus;
    }
  }

  textarea {
    resize: vertical;
    min-height: 50px;
  }

  .ingredient-row {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 40px;
    gap: 8px;
    align-items: center;
    margin-bottom: 8px;

    button {
      background: none;
      border: none;
      font-size: 16px;
      cursor: pointer;
      color: $red-main;

      &:hover {
        transform: scale(1.15);
      }
    }
  }

  button[type="button"] {
    background-color: $green-light-bg;
    color: $green-dark;
    font-weight: 600;
    border-radius: $border-radius;
    padding: 8px 12px;
    margin-top: 8px;

    &:hover {
      background-color: $green-light-bg-hover;
    }
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 24px;

    button {
      padding: 10px 16px;
      border-radius: $border-radius;
      font-weight: 600;
    }

    button[type="submit"] {
      background-color: $green-main;
      color: $white;
      padding: 8px 12px;

      &:hover {
        background-color: $green-light;
      }
    }
  }

  .remove-ingredient {
    width: 28px;
    height: 28px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: $red-light-bg;
    color: $red-main;
    border: none;
    cursor: pointer;
    font-size: 14px;
    line-height: 1;
    transition: background $transition-fast, transform $transition-fast;

    &:hover {
      background: $red-light-bg-hover;
      transform: scale(1.15);
    }
  }
</style>
