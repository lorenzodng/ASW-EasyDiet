import { defineStore } from 'pinia'
import axios from 'axios';

export const useUserStore = defineStore('user', {

    //dati in memoria condivisi tra i componenti
    state: () => ({
        id: null,
        nome: null,
    }),

    //metodi sui dati
    actions: {
        setUser(user) {
            this.id = user.id;
            this.nome = user.nome;
        },

        async fetchUser(router) { //"async" perchè "await" può essere usato solo in una funzione async
            if (this.id)
                return;
            const token = localStorage.getItem('token');
            if (!token)
                return;
            try {
                const { data } = await axios.get('http://localhost:5000/users/user', { headers: { Authorization: `Bearer ${token}` } });
                this.setUser({ id: data.id, nome: data.nome });
            } catch (err) {
                console.error("Token non valido o scaduto", err);
                this.id = null;
                this.nome = null;
                localStorage.removeItem('token');
                router?.push({ name: 'Login' });
            }
        }
    }
})
