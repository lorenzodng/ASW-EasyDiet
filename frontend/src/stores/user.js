import { defineStore } from "pinia";
import axios from "axios";

export const useUserStore = defineStore('user', {

    // Hold the current user object
    state: () => ({
        id: null,
        nome: null,
    }),

    // Methods for user state
    actions: {

        // Update the user state
        setUser(user) {
            this.id = user.id;
            this.nome = user.nome;
        },

        // Get the user ID and name
        async fetchUser(router) {
            if (this.id)
                return;
            const token = localStorage.getItem('token');
            if (!token)
                return;

            try {
                const { data } = await axios.get('http://localhost:5000/users/user', { headers: { Authorization: `Bearer ${token}` } }); // Protected request: the token is sent in the Authorization header
                this.setUser({ id: data.id, nome: data.nome });
            } catch (err) {
                console.error("Token non valido o scaduto", err);
                this.id = null;
                this.nome = null;
                localStorage.removeItem('token');
                router?.push({ name: 'Login' });
            }
        },

        // Reset the user state
        reset() {
            this.id = null
            this.nome = null
        }
    }
})
