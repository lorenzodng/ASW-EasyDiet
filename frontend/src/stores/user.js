import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
    state: () => ({ //dati in memoria condivisi tra i componenti
        id: null,
        nome: null
    }),
    actions: { //metodi sui dati
        setUser(user) {
            this.id = user.id;
            this.nome = user.nome;
        }
    }
})
