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
      `http://localhost:5000/recipes/${props.recipe._id}`,
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

    <button
  v-if="!isEditing"
  class="icon"
  data-label="Modifica"
  @click="modifica"
>
  ✏️
</button>

    <form v-else @submit.prevent="salva">

      
      <h3>Dati ricetta</h3>

      <label>Nome</label>
      <input
        :value="editRecipe.nome"
        @input="editRecipe.nome = $event.target.value"
        required
      />

      <label>Categoria</label>
      <select
        :value="editRecipe.categoria"
        @change="editRecipe.categoria = $event.target.value"
      >
        <option value="colazione">Colazione</option>
        <option value="pranzo">Pranzo</option>
        <option value="merenda">Merenda</option>
        <option value="cena">Cena</option>
      </select>

      <label>Kcal totali</label>
      <input
        type="number"
        :value="editRecipe.kcal"
        @input="editRecipe.kcal = Number($event.target.value)"
      />

      
      <h3>Ingredienti</h3>

      <div
        v-for="(ing, index) in editRecipe.ingredienti"
        :key="index"
        class="ingredient-row"
      >
        <input
          :value="ing.nome"
          @input="ing.nome = $event.target.value"
          placeholder="Ingrediente"
        />

        <input
          type="number"
          :value="ing.peso"
          @input="ing.peso = Number($event.target.value)"
          placeholder="g"
        />

        <input
          type="number"
          :value="ing.kcal"
          @input="ing.kcal = Number($event.target.value)"
          placeholder="kcal"
        />

        <button
  type="button"
  class="remove-ingredient"
  @click="removeIngredient(index)"
>
  ❌
</button>

      </div>

      <button type="button" @click="addIngredient">
        ➕ Aggiungi ingrediente
      </button>

      
      <h3>Note</h3>

      <textarea
        :value="editRecipe.info?.[0]?.descrizioneKcal"
        @input="editRecipe.info[0].descrizioneKcal = $event.target.value"
        placeholder="Descrizione kcal"
      />

      <textarea
        :value="editRecipe.info?.[1]?.descrizioneTipoDieta"
        @input="editRecipe.info[1].descrizioneTipoDieta = $event.target.value"
        placeholder="Tipo dieta"
      />

      <textarea
        :value="editRecipe.info?.[2]?.descrizioneIntolleranze"
        @input="editRecipe.info[2].descrizioneIntolleranze = $event.target.value"
        placeholder="Intolleranze"
      />

      <!-- AZIONI -->
      <div class="actions">
        <button type="submit">💾 Salva</button>
        <button type="button" @click="annulla">❌ Annulla</button>
      </div>

    </form>
  </div>
</template>



<style scoped lang="scss">
.icon {
  position: relative;
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 6px;
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
/* FORM CARD */
form {
  background: #ffffff;
  padding: 24px;
  margin-top: 16px;
  border-radius: 14px;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

/* TITOLI */
h3 {
  margin: 20px 0 12px;
  color: #2e7d32;
  font-size: 18px;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 6px;
}

/* LABEL */
label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 4px;
  color: #555;
}

/* INPUT / SELECT / TEXTAREA */
input,
select,
textarea {
  width: 100%;
  padding: 10px 12px;
  margin-bottom: 14px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 14px;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: #4caf50;
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.15);
  }
}

textarea {
  resize: vertical;
  min-height: 70px;
}

/* INGREDIENTI */
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
    color: #d32f2f;

    &:hover {
      transform: scale(1.15);
    }
  }
}

/* BOTTONE AGGIUNGI */
button[type="button"] {
  background-color: #e8f5e9;
  color: #2e7d32;
  font-weight: 600;
  border-radius: 8px;
  padding: 8px 12px;
  margin-top: 8px;

  &:hover {
    background-color: #c8e6c9;
  }
}

/* AZIONI FINALI */
.actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;

  button {
    padding: 10px 16px;
    border-radius: 8px;
    font-weight: 600;
  }

  button[type="submit"] {
    background-color: #4caf50;
    color: #ffffff;
    font-weight: 600;
  border-radius: 8px;
  padding: 8px 12px;
  margin-top: 8px;

    &:hover {
      background-color: #66bb6a;
    }
  }
}
.remove-ingredient {
  width: 32px;
  height: 32px;
  padding: 0;
  margin: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;
  background: #ffebee;
  color: #d32f2f;
  border: none;
  cursor: pointer;

  &:hover {
    background: #ffcdd2;
    transform: scale(1.1);
  }
}

</style>