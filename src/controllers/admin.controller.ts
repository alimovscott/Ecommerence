import { T } from "../libs/types/common";
import  { NextFunction, Request, Response } from "express";
import MemberService from "../models/Member.service";
import { AdminRequest, LoginInput, MemberInput } from "../libs/types/member";
import { MemberType } from "../libs/enums/member.enum";
import Errors, { HttpCode, Message } from "../libs/Errors";



const adminController: T = {};
const memberService = new MemberService();

adminController.goHome = (req: Request, res: Response) => {
    try{
        console.log("goHome");
        res.render("home")

    } catch(err) {
        console.log("Error, goHome:", err)
        res.redirect("/admin")

    }
}


adminController.getLogin = (req: Request, res: Response) => {
    try{
        console.log("getLogin")
        res.render("login")
    } catch(err) {
        console.log("Error, getLogin:", err)
        res.redirect("/admin")

    }
}

adminController.getSignup = (req: Request, res: Response) => {
    try{
        console.log("getSignup")
        res.render("signup")

    } catch(err) {
        console.log("Error, getSignup:", err)
        res.redirect("/admin")

    }
}





adminController.processSignup = async (req: AdminRequest, res: Response) => {
    try{
        console.log("processSignup")

        const file = req.file;
        if(!file) 
          throw new Errors(HttpCode.BAD_REQUEST, Message.SOMETHING_WENT_WRONG)
        
        const newMember: MemberInput = req.body;
        newMember.memberType  = MemberType.ADMIN;
        newMember.memberImage = file?.path;
        
        const result =  await memberService.processSignup(newMember);
        // SESSION AUTHENTICATION
        req.session.member = result;
        req.session.save(function() {
            res.redirect("/admin/product/all");
        });
    
    } catch(err) {
        console.log("Error, processSignup:", err)
        const message = err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG
        res.send(`<script> alert("Hi Admin, ${message}"); window.location.replace('/admin/signup')</script>`);
        
    }
}



adminController.processLogin = async (req: AdminRequest, res: Response) => {
    try{
        console.log("processLogin");
        console.log("body", req.body);
        const input: LoginInput = req.body;

        const result =  await memberService.processLogin(input)
       
        // SESSION AUTHENTICATION
        req.session.member = result;
        req.session.save(function() {
            res.redirect("/admin/product/all");
        });
        
    } catch(err) {
        console.log("Error, processLogin:", err)
        const message = err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG
        res.send(`<script> alert("Hi, ${message}"); window.location.replace('/admin/login')</script> `);
    }
}
adminController.logout = async (req: AdminRequest, res: Response) => {
    try{
        console.log("logout");
        req.session.destroy(function() {
            res.redirect("/admin")
        })
    } catch(err) {
        console.log("Error, logout:", err)
        res.redirect("/admin")

    }
}


adminController.checkAuthSession = async (req: AdminRequest, res: Response) => {
    try{
        console.log("checkAuthSession");
       if(req.session?.member) res.send(`<script> alert("Hi, ${req.session.member.memberNick}")</script> `);
       else res.send(`<script> alert("${Message.NOT_AUTHENTICATED}")</script>`)
       

    } catch(err) {
        console.log("Error, checkAuthSession:", err)
        res.send(err);

    }
}


adminController.verifyAdmin = (
    req: AdminRequest, 
    res: Response, 
    next: NextFunction) => {
    if(req.session?.member?.memberType === MemberType.ADMIN) {
        req.member = req.session.member;
        next();
    } else {
        const message = Message.NOT_AUTHENTICATED;
        res.send(`<script> alert("${message}"); window.location.replace ('/admin/login'); </script>`);
    }
}

export default adminController;