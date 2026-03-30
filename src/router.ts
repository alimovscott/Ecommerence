import express from "express";
const router = express.Router();
import memberController from "./controllers/member.controller";



router.post("/login", memberController.login);
router.post("/signup", memberController.signup);


/**  Product */


/**  User    */





export default router;