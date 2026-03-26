import { T } from "../libs/types/common";
import  { Request, Response } from "express";



const adminController: T = {};

adminController.goHome = (req: Request, res: Response) => {
    try{
        console.log("goHome");
        res.send("Home page")

    } catch(err) {
        console.log("Error, goHome:", err)

    }
}


adminController.getLogin = (req: Request, res: Response) => {
    try{
        console.log("getLogin")

    } catch(err) {
        console.log("Error, getLogin:", err)

    }
}

adminController.getSignup = (req: Request, res: Response) => {
    try{
        console.log("getSignup")

    } catch(err) {
        console.log("Error, getSignup:", err)

    }
}


export default adminController;