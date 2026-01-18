<script setup>
  import { ref, onMounted, computed } from "vue";
  import axios from "axios";
  import { useUserStore } from "../stores/user";
  import HeaderHome from "./HeaderHome.vue"
  import { useRouter } from "vue-router";

  const router = useRouter();
  const userStore = useUserStore();
  const pesi = ref([]);
  const obiettivoPeso = ref(0);
  const obiettivo = ref("");
  const loading = ref(true);

  // carica dati utente
  const loadUserInfo = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/users/${userStore.id}/profile`);

      pesi.value = data.pesi || [];
      obiettivoPeso.value = data.obiettivoPeso;
      obiettivo.value = data.obiettivo;
    } catch (err) {
      console.error("Errore caricamento dati", err);
    } finally {
      loading.value = false;
    }
  };

  // calcolo progresso
  //const pesoIniziale = pesi.value[0].peso

  const storicoPesi = computed(() => {
    return [...pesi.value].sort(
      (a, b) => new Date(b.data) - new Date(a.data)
    );
  });

  const pesoIniziale = computed(() => {
    return pesi.value.length ? pesi.value[0].peso : 0;
  });

  const pesoAttuale = computed(() => {
    return pesi.value.length
      ? pesi.value[pesi.value.length - 1].peso
      : 0;
  });

  const progress = computed(() => {
    if (!pesi.value.length || !obiettivoPeso.value) return 0;

    let percent = 0;

    if (obiettivo.value === "dimagrimento") {
      const totale = pesoIniziale.value - obiettivoPeso.value;
      const fatto = pesoIniziale.value - pesoAttuale.value;
      percent = (fatto / totale) * 100;
    }
    if (obiettivo.value === "aumento_peso") {
      const totale = obiettivoPeso.value - pesoIniziale.value;
      const fatto = pesoAttuale.value - pesoIniziale.value;
      percent = (fatto / totale) * 100;
    }
    if (obiettivo.value === "mantenimento") {
      const tolleranza = 1; // kg
      const maxDiff = 8;   // oltre questo sei fuori target

      const diff = Math.abs(pesoAttuale.value - pesoIniziale.value);

      if (diff <= tolleranza) {
        percent = 100;
      } else {
        percent = 100 - ((diff - tolleranza) / maxDiff) * 100;
      }
    }  // se ci si allontana di 2 kg siamo a 80% 4 kg a 40% maggiore di target kg a 0%

    return Math.min(Math.max(Math.round(percent), 0), 100);

  });

  onMounted(() => {
    const init = async () => {
      await userStore.fetchUser(router);
      await loadUserInfo();
    };
    init();
  });
</script>

<template>
  <div>
    <HeaderHome :userName="userStore.nome" />
    <div class="tracking-container">
      <h2>Tracking Peso</h2>

      <p v-if="loading">Caricamento...</p>

      <div v-else>
        <p><strong>Peso attuale:</strong> {{ pesoAttuale }} kg</p>

        <p><strong>Obiettivo:</strong> {{ obiettivoPeso }} kg</p>
        <div class="progress-bar-container">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progress + '%' }"></div>
          </div>

          <!-- coriandoli attorno alla barra, senza toccare la barra -->
          <div class="confetti-container" v-if="progress >= 100">
            <div v-for="n in 30" :key="n" class="confetti" :style="{
              left: Math.random() * 120 - 10 + '%', // -10% a 110%
              top: Math.random() * 60 - 20 + 'px',   // -20px a 40px
              backgroundColor: ['#f44336', '#e91e63', '#ffeb3b', '#4caf50', '#2196f3', '#ff9800'][Math.floor(Math.random() * 6)]
            }"></div>
          </div>
        </div>

        <p class="percent">{{ Math.round(progress) }}%</p>
        <div class="storico">
          <h3>Storico pesi</h3>

          <ul v-if="storicoPesi.length">
            <li v-for="(p, index) in storicoPesi" :key="index" :class="{ current: index === 0 }">
              <span class="date">
                {{ new Date(p.data).toLocaleDateString() }}
              </span>
              <span class="peso">
                {{ p.peso }} kg
              </span>
            </li>
          </ul>

          <p v-else class="empty">
            Nessun peso registrato
          </p>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .storico {
    margin-top: 25px;
    text-align: left;


    h3 {
      text-align: center;
      margin-bottom: 10px;
      font-size: 16px;
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    li {
      display: flex;
      justify-content: space-between;
      padding: 8px 12px;
      margin-bottom: 6px;
      border-radius: 6px;
      background-color: #f5f5f5;
      font-size: 14px;
    }

    &.current {
      background-color: #e8f5e9;
      font-weight: bold;
    }
  }

  .date {
    color: #555;
  }

  .peso {
    color: #2e7d32;
  }

  .empty {
    text-align: center;
    color: #888;
    font-style: italic;
  }

  .tracking-container {
    max-width: 400px;
    margin: 130px auto 0;
    padding: 20px;
    text-align: center;
  }

  .progress-bar-container {
    position: relative;
    margin: 15px 0;
  }

  .progress-bar {
    width: 100%;
    height: 20px;
    background-color: #eee;
    border-radius: 10px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background-color: #4caf50;
    border-radius: 10px;
    transition: width 0.4s ease;
  }

  .confetti-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 60px;
    pointer-events: none;
  }

  .confetti {
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    animation: fall 2s forwards;
    opacity: 1;
  }

  /* serve a dire al browser come cambiano le proprietà di un elemento nel tempo */
  @keyframes fall {
    0% {
      /* all’inizio dell’animazione (0%), il coriandolo è nella sua posizione originale */
      transform: translateY(0) rotate(0deg);
      opacity: 1;
    }

    50% {
      /* a metà animazione, il coriandolo cambia posizione */
      transform: translateY(20px) rotate(180deg);
    }

    100% {
      /* alla fine dell'animazione, il coriandolo cambia posizione */
      transform: translateY(40px) rotate(360deg);
      opacity: 0;
    }
  }

  .percent {
    font-weight: bold;
  }
</style>