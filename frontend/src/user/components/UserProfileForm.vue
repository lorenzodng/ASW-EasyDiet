<script setup>

  /* Reusable user informations form */

  const props = defineProps({
    modelValue: {
      type: Object,
      required: true
    }
  })
</script>

<template>
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
        <option value="aumento peso">Aumento di peso</option>
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
    border: 1px solid $gray-muted;
    background-color: $white;
    transition: all $transition-fast;

    &:focus {
      outline: none;
      border-color: $green-hover;
      box-shadow: 0 0 0 4px rgba($green-hover, 0.18);
    }
  }

</style>
