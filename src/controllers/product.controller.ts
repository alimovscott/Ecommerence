import { Request, Response } from "express";
import { T } from "../libs/types/common";
import Errors from "../libs/Errors";
import ProductService from "../models/Product.service";


const productServive = new ProductService(); 
const productController: T = {}

productController.getAllProducts = async (req: Request, res: Response) => {
    try{
        console.log("getAllProducts")
        res.render("products")
        
    } catch(err) {
        console.log("Error, getAllProducts:", err)
        if(err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard)
        
    }
}

productController.createNewProduct = async (req: Request, res: Response) => {
    try{
        console.log("createNewProduct")
        
        res.send("done")
        
    } catch(err) {
        console.log("Error, getAllProducts:", err)
        if(err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard)
        
    }
}

productController.uptadeChosenProduct = async (req: Request, res: Response) => {
    try{
        console.log("uptadeChosenProduct")
        
        
    } catch(err) {
        console.log("Error, uptadeChosenProduct:", err)
        if(err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard)
        
    }
}





export default productController;