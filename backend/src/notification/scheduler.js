import cron from "node-cron";
import * as notificationService from "./service.js";
import * as userService from "../user/service.js";
import * as dietService from "../diet/service.js";

// Main function: starts meal reminders
export const startMealReminders = () => {
    cron.schedule("* * * * *", async () => {
        const currentDateInfo = getCurrentDateInfo();
        const users = await userService.getAllUsers();

        for (let user of users) {
            await processUserMeals(user, currentDateInfo);
        }
    });
};

// Get current day, hour and minute
const getCurrentDateInfo = () => {
    const giorni = ["domenica", "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato"];
    const currentDate = new Date();
    return {
        currentDay: giorni[currentDate.getDay()],
        currentHour: currentDate.getHours(),
        currentMinute: currentDate.getMinutes()
    };
};

// Handle all meals for a single user
const processUserMeals = async (user, { currentDay, currentHour, currentMinute }) => {
    const dieta = await dietService.getDietByUserId(user.userId);
    if (!dieta || !dieta.settimana) return;

    const categoriePasto = ["colazione", "pranzo", "merenda", "cena"];
    for (let categoriaPasto of categoriePasto) {
        await processSingleMeal(user, dieta, categoriaPasto, currentDay, currentHour, currentMinute);
    }
};

// Handle a single meal reminder
const processSingleMeal = async (user, dieta, categoriaPasto, currentDay, currentHour, currentMinute) => {
    const pasto = dieta.settimana[currentDay][categoriaPasto];
    if (!pasto || !pasto.time) return;

    const [ora, minuto] = pasto.time.split(":").map(Number);
    if (ora === currentHour && minuto === currentMinute) {
        const corpo = buildMealMessage(categoriaPasto);
        const payload = {
            title: "Promemoria",
            body: corpo,
        };
        await notificationService.sendNotificationToUser(user.userId, payload);
    }
};

// Build notification message for the meal
const buildMealMessage = (categoriaPasto) => {
    if (categoriaPasto === "pranzo") {
        return `È ora del tuo ${categoriaPasto}! 😋 `;
    } else {
        return `È ora della tua ${categoriaPasto}! 😋`;
    }
};
