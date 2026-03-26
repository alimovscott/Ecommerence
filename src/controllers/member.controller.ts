import { T } from "../libs/types/common";
import  { Request, Response } from "express";



const memberController: T = {};

memberController.goHome = (req: Request, res: Response) => {
    try{
        console.log("goHome");
        res.send("Home page")

    } catch(err) {
        console.log("Error, goHome:", err)

    }
}


memberController.getLogin = (req: Request, res: Response) => {
    try{
        console.log("getLogin")

    } catch(err) {
        console.log("Error, getLogin:", err)

    }
}

memberController.getSignup = (req: Request, res: Response) => {
    try{
        console.log("getSignup")

    } catch(err) {
        console.log("Error, getSignup:", err)

    }
}


export default memberController;