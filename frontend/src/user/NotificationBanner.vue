<script setup>
    import { ref, onMounted } from "vue"
    import { useUserStore } from '../stores/user'
    import axios from "axios"

    const publicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY
    const userStore = useUserStore()
    const loading = ref(false) // Subscription process in progress
    const error = ref(null) // Error message 
    const success = ref(false) // Subscription completed successfully
    const visible = ref(false) // Controls notification banner visibility

    // Checks whether notifications are already enabled for the user
    const checkNotifications = async () => {
        if (localStorage.getItem("notificationBannerDismissed")) {
            return;
        }

        try {
            const res = await axios.get(`http://localhost:5000/status-notification/${userStore.id}`);

            if (!res.data.notificationsEnabled) {
                visible.value = true;
            }
        } catch (err) {
            visible.value = true;
        }
    }

   // Subscribes the user to push notifications
    const subscribeUser = async () => {
        if ('serviceWorker' in navigator) { // Checks whether the browser supports Service Workers (navigator is a global browser object)
            try {
                loading.value = true
                error.value = null

                // Register the Service Worker
                const registration = await navigator.serviceWorker.register('./service-worker.js')
                console.log('Service Worker registrato', registration)
                // Create push subscription using VAPID public key 
                const subscription = await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: keyConverter(publicKey) })

                // Save the subscription on the backend
                await axios.post(`http://localhost:5000/subscribe-notification/${userStore.id}`, { subscription, notificationsEnabled: true });

                success.value = true
                setTimeout(() => {
                    visible.value = false;
                }, 1000);
            } catch (err) {
                if (err.name === 'NotAllowedError') {
                    console.log('Utente ha rifiutato le notifiche');
                    visible.value = false;
                } else {
                    console.error('Errore registrazione notifiche:', err);
                    error.value = "Impossibile attivare le notifiche";
                }
            } finally {
                loading.value = false;
            }
        } else {
            error.value = "Service Worker non supportato dal browser"
        }
    }
    // Converts VAPID public key from Base64 to Uint8Array (required by the browser)
    const keyConverter = (base64String) => {
        if (!base64String) {
            throw new Error("VAPID public key undefined!");
        }
        const padding = '='.repeat((4 - base64String.length % 4) % 4)
        const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')
        const rawData = window.atob(base64)
        return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)))
    }

    // Dismisses the notification banner
    const dismissBanner = async () => {
        visible.value = false;
        localStorage.setItem("notificationBannerDismissed", "true");
        try {
            // Create the subscription document
            await axios.post(`http://localhost:5000/subscribe-notification/${userStore.id}`, { notificationsEnabled: false });
        } catch (err) {
            console.error("Errore nel backend per dismiss banner:", err);
        }
    }

    onMounted(() => {
        checkNotifications();
    })
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
            <button v-if="!success" @click="dismissBanner">Chiudi</button>
        </div>
    </div>
</template>

<style scoped lang="scss">
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


        &:disabled {
            cursor: not-allowed;
            opacity: 0.6;
        }
    }

    .error {
        color: red;
    }

    .success {
        color: green;
    }
</style>