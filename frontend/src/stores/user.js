import { defineStore } from 'pinia'
import axios from 'axios'; 

export const useUserStore = defineStore('user', {

    // Global state for the authenticated user (shared across components)
    state: () => ({
        id: null,
        nome: null,
    }),

    
    actions: {
        // Updates the user state after login or token validation
        setUser(user) {  
            this.id = user.id;
            this.nome = user.nome;
        },

        async fetchUser(router) { 
            if (this.id)
                return;
            const token = localStorage.getItem('token');
            if (!token)
                return;

            try {
                const { data } = await axios.get('http://localhost:5000/users/user', 
                    { 
                        headers: { Authorization: `Bearer ${token}` } }); // Protected request: the token is sent in the Authorization header
                this.setUser({ id: data.id, nome: data.nome });
            } catch (err) {
                console.error("Token non valido o scaduto", err);
                this.id = null;
                this.nome = null;
                localStorage.removeItem('token');
                router?.push({ name: 'Login' });  
            }
        },

        reset() {
            this.id = null
            this.nome = null
        },
    }
})
