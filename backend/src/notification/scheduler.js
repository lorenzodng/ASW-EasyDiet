import cron from "node-cron";
import * as notificationService from "./service.js";
import * as userService from "../user/service.js";

//invia promemoria sui pasti dell'utente
export const startMealReminders = () => {
    cron.schedule("* * * * *", async () => { //"* * * * *" significa "ogni minuto", quindi il blocco di codice all'interno viene eseguito ogni minuto 
        const giorni = ["lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato", "domenica"];
        const categoriePasto = ["colazione", "pranzo", "merenda", "cena"];
        const now = new Date(); //prende l'orario corrente
        const currentHour = now.getHours(); //estrae l'ora
        const currentMinute = now.getMinutes(); //estrae i minuti

        const users = await userService.getAllUsers(); //recupera tutti gli utenti

        for (let user of users) { //per ogni utente
            for (let giorno of giorni) { //per ogni giorno
                for (let categoriaPasto of categoriePasto) { //per ogni categoria di pasto
                    const pastoData = user.settimana[giorno][categoriaPasto]; //recupera il pasto 
                    const [ora, minuto] = pastoData.time.split(":").map(Number); //recupera l'ora e il minuto del pasto
                    if (ora === currentHour && minuto === currentMinute) { //se l'orario del pasto coincide con quello attuale
                        let corpo;
                        if (categoriaPasto === "pranzo") {
                            corpo = `È ora del tuo ${categoriaPasto}! 🍽️`; //notifica pranzo
                        } else {
                            corpo = `È ora della tua ${categoriaPasto}! 🍽️`; //notifica colazione/merenda/cena
                        }
                        //costruisce la notifica
                        const payload = {
                            title: "Promemoria pasto",
                            body: corpo,
                        };
                        await notificationService.sendNotificationToUser(user.userId, payload); //chiama la funzione per l'invio della notifica
                    }
                }
            }
        }
    });
};