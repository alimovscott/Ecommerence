import { T } from "../libs/types/common";
import  { Request, Response } from "express";
import MemberService from "../models/Member.service";
import { LoginInput, MemberInput } from "../libs/types/member";
import { MemberType } from "../libs/enums/member.enum";



const adminController: T = {};
const memberService = new MemberService();

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





adminController.processSignup = async (req: Request, res: Response) => {
    try{
        console.log("processSignup")
        
        const newMember: MemberInput = req.body;
        newMember.memberType  = MemberType.ADMIN;
        
        
        const result =  await memberService.processSignup(newMember);
        
        
        
        res.send(result);
        
    } catch(err) {
        console.log("Error, processSignup:", err)
        res.send(err)
        
    }
}



adminController.processLogin = async (req: Request, res: Response) => {
    try{
        console.log("processLogin");
        console.log("body", req.body);
        const input: LoginInput = req.body;

        const result =  await memberService.processLogin(input)
       
        res.send(result);
        
    } catch(err) {
        console.log("Error, processLogin:", err)
        res.send(err);

    }
}

export default adminController;