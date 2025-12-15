//controller per raggiungere il servizio di login

import * as userService from "./userService.js";

//login
export const loginUserController = async (req, res) => {
    var result = null; 
    try {
        console.log(req.body); 
        result = await userService.loginUserDBService(req.body); 
        if(result.status){
            res.send({
                "status": true,
                "message": result.message
            });
        } else{
            res.send({
                "status": false,
                "message": result.message
            });
        }
    } catch(err) {
        console.log(err); 
    }
}