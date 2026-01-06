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

    <button v-if="!isEditing" @click="modifica">
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

        <button type="button" @click="removeIngredient(index)">
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
.edit {
  margin-top: 12px;
}

input, select {
  display: block;
  margin-bottom: 8px;
}
</style>