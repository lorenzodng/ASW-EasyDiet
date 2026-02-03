<script setup>
  import { ref, onMounted, computed } from "vue";
  import { useRouter } from "vue-router";
  import { useUserStore } from "../../stores/user";
  import { useDietStore } from "../../stores/diet";
  import axios from "axios";
  import HeaderHome from "../components/HeaderHome.vue";

  const router = useRouter();
  const userStore = useUserStore();
  const dietStore = useDietStore();
  const weights = ref([]);
  const weightTarget = ref(0);
  const weight = ref("");
  const loading = ref(true);
  const expanded = ref(false);

  // Load user's informations
  const loadUserInfo = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/users/${userStore.id}/profile`);
      weights.value = data.pesi || [];
      weightTarget.value = data.obiettivoPeso;
      weight.value = data.obiettivo;
    } catch (err) {
      console.error("Errore caricamento dati", err);
    } finally {
      loading.value = false;
    }
  };

  // Weight history
  const weightHistory = computed(() => {
    return [...weights.value].sort(
      (a, b) => new Date(b.data) - new Date(a.data)
    );
  });

  // Visible weights
  const VisibleWeights = computed(() => {
    if (expanded.value) {
      return weightHistory.value;
    } else {
      return weightHistory.value.slice(0, 6);
    }
  });

  const initialWeight = computed(() => {
    return weights.value.length ? weights.value[0].peso : 0;
  });

  const currentWeight = computed(() => {
    return weights.value.length
      ? weights.value[weights.value.length - 1].peso
      : 0;
  });

  // Progress percentage based on user goal
  const progress = computed(() => {
    if (!weights.value.length || !weightTarget.value)
      return 0;
    let percent = 0;
    if (weight.value === "dimagrimento") {
      const total = initialWeight.value - weightTarget.value;
      const achieved = initialWeight.value - currentWeight.value;
      percent = (achieved / total) * 100;
    }
    if (weight.value === "aumento peso") {
      const total = weightTarget.value - initialWeight.value;
      const achieved = currentWeight.value - initialWeight.value;
      percent = (achieved / total) * 100;
    }
    if (weight.value === "mantenimento") {
      const tollerance = 1;
      const maxDiff = 8;   // Out-of-range threshold
      const diff = Math.abs(currentWeight.value - initialWeight.value);

      if (diff <= tollerance) {
        percent = 100;
      } else {
        percent = 100 - ((diff - tollerance) / maxDiff) * 100;
      }
    }  // Progress decreases as the user moves away from the target weight: +2 kg ≈ 80%, +4 kg ≈ 40% ...
    return Math.min(Math.max(Math.round(percent), 0), 100);

  });

  onMounted(async () => {
    await userStore.fetchUser(router);
    await loadUserInfo();
    await dietStore.fetchDiet(userStore.id);
  });
</script>

<template>
  <div class="page">
    <HeaderHome :userName="userStore.nome" />
    <div class="tracking-container">
      <h2>I tuoi progressi</h2>

      <p v-if="loading">Caricamento...</p>

      <div v-else>
        <p><strong>Peso attuale:</strong> {{ currentWeight }} kg</p>
        <p class="obiettivo"><strong>Obiettivo:</strong> {{ weightTarget }} kg</p>

        <div class="progress-bar-container">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progress + '%' }"></div>
          </div>

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
          <h3>Storico</h3>

          <ul v-if="weightHistory.length > 0">
            <li v-for="(p, index) in VisibleWeights" :key="p.data" :class="{ 'current-weight': index === 0 }">
              <span class="date">{{ new Date(p.data).toLocaleDateString() }}</span>
              <span class="peso">{{ p.peso }} kg</span>
            </li>
          </ul>

          <p v-else class="empty">
            Nessun peso registrato
          </p>

          <button v-if="weightHistory.length > 4" class="toggle-storico" @click="expanded = !expanded">
            {{ expanded ? 'Mostra meno' : 'Mostra tutti' }}
          </button>

        </div>

      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">

  .page {
    min-height: 100vh;
    background-color: $green-light;
    padding-top: 105px;
    box-sizing: border-box;
  }

  .storico {
    margin-top: 40px;
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
      background-color: $gray-soft;
      font-size: 14px;
    }
  }

  .current-weight {
    font-weight: 700;
  }

  .date {
    color: $gray-text;
  }

  .peso {
    color: $green-main;
  }

  .empty {
    text-align: center;
    color: $gray-muted;
    font-style: italic;
  }

  .tracking-container {
    max-width: 400px;
    margin: 0 auto;
    padding: 50px;
    text-align: center;

    h2 {
      margin-bottom: 50px;
    }

    p {
      font-size: 16px;

      &.obiettivo strong {
        color: $green-main;
        font-weight: 700;
      }
    }
  }

  .progress-bar-container {
    position: relative;
    margin: 15px 0;
  }

  .progress-bar {
    width: 100%;
    height: 20px;
    background-color: $gray-soft;
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid $gray-muted;
  }

  .progress-fill {
    height: 100%;
    background-color: $green-hover;
    border-radius: 10px;
    transition: width $transition-fast;
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
    animation: fall 3s forwards;
    opacity: 1;
  }

  @keyframes fall {
    0% {
      /* At the start of the animation (0%), the confetti is in its original position */
      transform: translateY(0) rotate(0deg);
      opacity: 1;
    }

    50% {
      /* Midway through the animation, the confetti moves */
      transform: translateY(20px) rotate(180deg);
    }

    100% {
      /* At the end of the animation, the confetti reaches its final position */
      transform: translateY(40px) rotate(360deg);
      opacity: 0;
    }
  }

  .percent {
    font-weight: bold;
  }

  .toggle-storico {
    margin: 12px auto 0;
    display: block;
    background: none;
    border: none;
    color: $green-main;
    font-weight: 600;
    cursor: pointer;
    font-size: 14px;
    outline: none;

    &:hover {
      text-decoration: underline;
    }
  }

</style>