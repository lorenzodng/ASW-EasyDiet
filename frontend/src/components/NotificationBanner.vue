<!-- componente attivazione notifiche -->

<script setup>
    import { ref } from "vue"
    import { useUserStore } from '../stores/user'
    import axios from "axios"

    const publicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY
    const userStore = useUserStore()
    const loading = ref(false) //indica se la procedura di iscrizione alle notifiche è in corso
    const error = ref(null) //contiene eventuali messaggi di errore
    const success = ref(false) //indica se la sottoscrizione è avvenuta con successo
    const visible = ref(true) //definisce l'apparizione del banner delle notifiche

    const subscribeUser = async () => {
        if ('serviceWorker' in navigator) { //se il browser support il service worker (navigator è un componente globale del browser)
            try {
                loading.value = true
                error.value = null

                //registra il service worker nel browser dell'utente
                const registration = await navigator.serviceWorker.register('/service-worker.js')
                console.log('Service Worker registrato', registration)
                //crea la sottoscrizione dell'utente alle notifiche utilizzando una chiave VAPID 
                const subscription = await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: keyConverter(publicKey) })

                //esegue la sottoscrizione
                await axios.post('/subscribe-notification', {
                    userId: userStore.userId,
                    subscription
                });

                success.value = true
                visible.value = false //chiude il banner
                userStore.notificationsEnabled = true //l'utente ha abilitato le notifiche
            } catch (err) {
                if (err.name === 'NotAllowedError') {
                    console.log('Utente ha rifiutato le notifiche');
                    visible.value = false;
                } else {
                    // Errore tecnico
                    console.error('Errore registrazione notifiche:', err);
                    error.value = "Impossibile attivare le notifiche";
                }
            } finally {
                loading.value = false
            }
        } else {
            error.value = "Service Worker non supportato dal browser"
        }
    }

    //funzione che converte la chiave VAPID in formato "Base64" nel formato "Uint8Array" (necesario per renderla utilizzabile dal browser)
    const keyConverter = (base64String) => {
        const padding = '='.repeat((4 - base64String.length % 4) % 4)
        const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')
        const rawData = window.atob(base64)
        return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)))
    }
</script>

<template>
    <div v-if="visible" class="notification-banner">
        <p v-if="!success && !loading && !error">Vuoi ricevere promemoria per i pasti?</p>
        <p v-if="loading">Attivazione notifiche...</p>
        <p v-if="error" class="error">{{ error }}</p>
        <p v-if="success" class="success">Notifiche attivate ✅</p>

        <div class="actions">
            <button v-if="!success" @click="subscribeUser" :disabled="loading">
                Attiva notifiche
            </button>
            <button @click="visible = false">Chiudi</button>
        </div>
    </div>
</template>

<style scoped>
    .notification-banner {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: white;
        border: 1px solid #ccc;
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
        max-width: 300px;
        z-index: 1000;
        text-align: center;
    }

    .actions {
        margin-top: 10px;
    }

    button {
        margin: 0 5px;
        padding: 6px 12px;
        cursor: pointer;
    }

    button:disabled {
        cursor: not-allowed;
        opacity: 0.6;
    }

    .error {
        color: red;
    }

    .success {
        color: green;
    }
</style>
