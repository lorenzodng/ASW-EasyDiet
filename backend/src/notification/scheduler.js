import cron from "node-cron";
import * as notificationService from "./service.js";
import * as userService from "../user/service.js";
import * as dietService from "../diet/service.js";

//invia promemoria sui pasti dell'utente
export const startMealReminders = () => {
    cron.schedule("* * * * *", async () => { //"* * * * *" significa "ogni minuto", quindi il blocco di codice all'interno viene eseguito ogni minuto 
        const giorni = ["domenica", "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato"];
        const categoriePasto = ["colazione", "pranzo", "merenda", "cena"];
        const currentDate = new Date(); //orario corrente
        const currentDay = giorni[currentDate.getDay()]; //giorno corrente
        const currentHour = currentDate.getHours(); //ora corrente
        const currentMinute = currentDate.getMinutes(); //minuti correnti
        const users = await userService.getAllUsers(); //recupera tutti gli utenti

        for (let user of users) { //per ogni utente
            const dieta = await dietService.getDietByUserId(user.userId); //recupera la dieta

            if (!dieta || !dieta.settimana) //se l'utente non ha ancora nessuna dieta, passa al prossimo utente
                continue;

            for (let categoriaPasto of categoriePasto) { //per ogni categoria di pasto
                const pasto = dieta.settimana[currentDay][categoriaPasto]; //recupera il pasto 
                if (!pasto || !pasto.time) //se l'utente non ha ancora nessuna dieta, passa alla prossima categoria di pasto
                    continue;
                const [ora, minuto] = pasto.time.split(":").map(Number); //recupera l'ora e il minuto del pasto
                if (ora === currentHour && minuto === currentMinute) { //se l'orario del pasto coincide con quello attuale
                    let corpo;
                    if (categoriaPasto === "pranzo") {
                        corpo = `È ora del tuo ${categoriaPasto}! *aggiungere icona/emoji* `; //notifica pranzo
                    } else {
                        corpo = `È ora della tua ${categoriaPasto}! *aggiungere icona/emoji* `; //notifica colazione/merenda/cena
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
    });
};