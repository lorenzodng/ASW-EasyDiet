<!-- componente form utente -->

<script setup>
import { reactive } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();
const userInfo = reactive ({
    sesso: "",
    eta: "",
    peso: "",
    altezza: "",
    livelloAttivita: "",
    obiettivo: ""

});
const submitData = async () => {
  try {
    await axios.post("http://localhost:5000/user/setup", userInfo);
    alert("Dati salvati con successo");
    router.push({ name: "Home" });
  } catch (err) {
    alert("Errore nel salvataggio dei dati");
    console.error(err);
  }
};
</script>

<template>
    <div class="container">
        <h2>Completa il tuo profilo</h2>
        <form @submit.prevent="submitData">

            <div class="form-group">
            <label>Età</label>
            <input type="number" v-model="userInfo.eta" required/>
            </div>

            <div class="form-group">
            <label>Peso(kg)</label>
            <input type="number" v-model="userInfo.peso" required/>
            </div>

            <div class="form-group">
                <label>Sesso</label>
                <select v-model="userInfo.sesso" required>
                    <option disabled value="">Seleziona</option>
                    <option value="maschio">Maschio</option>
                    <option value="femmina">Femmina</option>
                </select>
            </div>


            <div class="form-group">
            <label>Altezza</label>
            <input type="number" v-model="userInfo.altezza" required/>
            </div>

            <div class="form-group"> 
            <label>Obiettivo che vuoi raggiungere</label>
            <select v-model="userInfo.obiettivo" required>
                <option disabled value="">Seleziona</option>
                <option value="dimagrimento">Dimagrimento</option>
                <option value="mantenimento">Mantenimento</option>
                <option value="aumento_peso">Aumento di peso</option>
            </select>
            </div>


            <div class="form-group"> 
            <label>Livello di attività fisica</label>
            <select v-model="userInfo.livelloAttivita" required>
                <option disabled value="">Seleziona</option>
                <option value="basso">Basso</option>
                <option value="moderato">Moderato</option>
                <option value="intenso">Intenso</option>
            </select>
            </div>
            <button type="submit">Continua</button>

        </form>
    </div>

    
</template>

<style scoped>
.container {
  max-width: 400px;
  margin: auto;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input, select {
  width: 100%;
  padding: 8px;
}
</style>

<!--si potrebbe pensare magari di disabilitare il bottone se non sono stati inseriti i campi-->