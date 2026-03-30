import MemberService from "../models/Member.service";
import { T } from "../libs/types/common";
import  { Request, Response } from "express";
import { LoginInput, Member, MemberInput } from "../libs/types/member";
import { MemberType } from "../libs/enums/member.enum";
import Errors from "../libs/Errors";
import AuthService from "../models/Auth.service";



const memberController: T = {};
const memberService = new MemberService();
const authService = new AuthService();


memberController.signup = async (req: Request, res: Response) => {
    try{
        console.log("signup")
        const input: MemberInput = req.body;

        const result: Member =  await memberService.signup(input);
        const token = await authService.createToken(result);
        res.json({member: result});
        
    } catch(err) {
        console.log("Error, signup:", err)
        if(err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard)
        
    }
}



memberController.login = async (req: Request, res: Response) => {
    try{
        console.log("processLogin");
        console.log("body", req.body);
        const input: LoginInput = req.body;

        const result =  await memberService.login(input)
        const token = await authService.createToken(result);
        
       
        res.json({member: result});
        
    } catch(err) {
        console.log("Error, login:", err)
        if(err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard)

    }
}

export default memberController;