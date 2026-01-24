<script setup>
// Receives and updates the parent form state via v-model
const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <!-- Personal information form -->
  <div>
    <div class="form-field">
      <label>Età</label>
      <input type="number" v-model.number="modelValue.eta" />
    </div>

    <div class="form-field">
      <label>Peso (kg)</label>
      <input type="number" v-model.number="modelValue.peso" />
    </div>

    <div class="form-field">
      <label>Altezza (cm)</label>
      <input type="number" v-model.number="modelValue.altezza" />
    </div>

    <div class="form-field">
      <label>Sesso</label>
      <select v-model="modelValue.sesso">
        <option disabled value="">Seleziona</option>
        <option value="maschio">Maschio</option>
        <option value="femmina">Femmina</option>
      </select>
    </div>

    <div class="form-field">
      <label>Obiettivo</label>
      <select v-model="modelValue.obiettivo">
        <option disabled value="">Seleziona</option>
        <option value="dimagrimento">Dimagrimento</option>
        <option value="mantenimento">Mantenimento</option>
        <option value="aumento_peso">Aumento di peso</option>
      </select>
    </div>

    <div class="form-field">
      <label>Obiettivo peso (kg)</label>
      <input type="number" v-model.number="modelValue.obiettivoPeso" />
    </div>

    <div class="form-field">
      <label>Attività fisica</label>
      <select v-model="modelValue.livelloAttivitaFisica">
        <option value="basso">Basso</option>
        <option value="moderato">Moderato</option>
        <option value="intenso">Intenso</option>
      </select>
    </div>
  </div>
</template>

<style scoped lang="scss">

.form-field {
  display: flex;
  flex-direction: column;
  width: 50%;
  margin: 0 auto 20px;
}

label,
input,
select {
  font-size: inherit;
}

label {
  display: block;
  margin-bottom: 6px;
  font-size: 15px;
  font-weight: 600;
}

 input,
 select {
    width: 100%;
    box-sizing: border-box;
    padding: 12px 14px;
    font-size: 15px;
    border-radius: 10px;
    border: 1px solid grey;
    background-color: #ffffff;
    transition: all 0.2s ease;

    &:focus {
      outline: none;
      border-color: #4caf50;
      box-shadow: 0 0 0 4px rgba(76, 175, 80, 0.18);
    }
  }

</style>
