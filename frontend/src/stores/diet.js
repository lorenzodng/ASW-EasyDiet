import { defineStore } from "pinia";
import axios from "axios";

export const useDietStore = defineStore('diets', {

    // Hold the current diet object
    state: () => ({
        dieta: null,
    }),

    // Methods for diet state
    actions: {

        // Get the diet for a specific user
        async fetchDiet(userId) {
            if (!userId)
                return
            const token = localStorage.getItem('token');
            if (!token)
                return

            try {
                const { data } = await axios.get(`http://localhost:5000/diets/${userId}`, { headers: { Authorization: `Bearer ${token}` } }); // Protected request: the token is sent in the Authorization header
                this.dieta = data ?? null
            } catch (err) {
                console.error("Errore nel recupero della dieta", err)
                this.dieta = null
            }
        },

        // Delete the diet for a specific user
        async deleteDiet(userId) {
            try {
                await axios.delete(`http://localhost:5000/diets/${userId}`);
                this.dieta = null
            } catch (err) {
                console.error("Errore nell'eliminazione della dieta", err)
            }
        },

        // Reset the diet state
        reset() {
            this.dieta = null
        }
    }
});
