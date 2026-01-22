import { defineStore } from 'pinia'
import axios from 'axios'

export const useDietStore = defineStore('diets', {
    state: () => ({
        dieta: null,
    }),

    getters: {
        // restituisce true se la dieta esiste
        exists: (state) => !!state.dieta
    },

    actions: {

        //recupera la dieta
        //in questo caso il token ha una funzione di "sicurezza", e serve per consentire di recuperare la dieta solo per l'utente autenticato
        async fetchDiet(userId) {
            if (!userId)
                return
            const token = localStorage.getItem('token');
            if (!token)
                return

            try {
                const { data } = await axios.get(`http://localhost:5000/diets/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
                this.dieta = data ?? null //imposta la dieta se esiste, altrimenti associa null
            } catch (err) {
                console.error("Errore nel recupero della dieta", err)
                this.dieta = null
            }
        },

        // elimina la dieta
        async deleteDiet(userId) {
            try {
                const token = localStorage.getItem('token')
                if (!token) return
                const { data } = await axios.delete(`http://localhost:5000/diets/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
                this.dieta = null
            } catch (err) {
                console.error("Errore nell'eliminazione della dieta", err)
            }
        },

        reset() {
            this.dieta = null
        }
    }
});
