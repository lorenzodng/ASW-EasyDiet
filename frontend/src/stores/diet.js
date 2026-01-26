import { defineStore } from 'pinia'
import axios from 'axios'

export const useDietStore = defineStore('diets', {
    state: () => ({
        dieta: null,
    }),

    getters: {
        // Returns true if a diet is currently loaded
        exists: (state) => !!state.dieta
    },

    actions: {

    //Fetches the user's diet from the backend.The JWT token is used for security purposes, 
    // ensuring that only the authenticated user can access their own diet.

        async fetchDiet(userId) {
            if (!userId)
                return
            const token = localStorage.getItem('token');
            if (!token)
                return

            try {
                const { data } = await axios.get(`http://localhost:5000/diets/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
                // Assign the diet if it exists, otherwise reset it
                this.dieta = data ?? null 
            } catch (err) {
                console.error("Errore nel recupero della dieta", err)
                this.dieta = null
            }
        },

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
