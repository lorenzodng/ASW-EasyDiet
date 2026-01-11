import { defineStore } from 'pinia'
import axios from 'axios'; //per chiamare il backend

export const useUserStore = defineStore('user', {

    //dati in memoria condivisi tra i componenti
    state: () => ({
        id: null,
        nome: null,
    }),

    //metodi sui dati
    actions: {
        setUser(user) {  //per aggiornare lo stato
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
                const { data } = await axios.get('http://localhost:5000/users/user', { headers: { Authorization: `Bearer ${token}` } }); //invia il token all'header
                this.setUser({ id: data.id, nome: data.nome });
            } catch (err) {
                console.error("Token non valido o scaduto", err);
                this.id = null;
                this.nome = null;
                localStorage.removeItem('token');
                router?.push({ name: 'Login' });  //logout forzato e redirect al login
            }
        }//Recupera i dati dell’utente autenticato a partire dal token
    }
})
