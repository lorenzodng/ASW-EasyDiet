//servizio di login

import user from "./userModel.js";

//login
export const loginUserDBService = async (userData) => {
    const foundUser = await user.findOne({ email: userData.email }); //cerca nel db un utente la cui email corrisponde a quella indicata dall'utente

    if (!foundUser) {
        return {
            status: false,
            message: "Invalid email or password"
        };
    }

    if (userData.password !== foundUser.password) { //cerca nel db un utente la cui password corrisponde a quella indicata dall'utente
        return {
            status: false,
            message: "Invalid password"
        };
    }

    return {
        status: true,
        message: "User validated"
    };
};