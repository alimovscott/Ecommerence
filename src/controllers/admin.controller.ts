import { T } from "../libs/types/common";
import  { Request, Response } from "express";
import MemberService from "../models/Member.service";



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
        res.send("LOGIN PAGE")
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


adminController.processLogin = (req: Request, res: Response) => {
    try{
        console.log("processLogin")
        res.send("DONE")

    } catch(err) {
        console.log("Error, processLogin:", err)

    }
}


adminController.processSignup = (req: Request, res: Response) => {
    try{
        console.log("processSignup")
        res.send("processSignup")

    } catch(err) {
        console.log("Error, processSignup:", err)

    }
}

export default adminController;