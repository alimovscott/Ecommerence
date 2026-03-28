import { Request, Response } from "express";
import { T } from "../libs/types/common";
import Errors, { HttpCode, Message } from "../libs/Errors";
import ProductService from "../models/Product.service";
import { ProductInput } from "../libs/types/product";
import { AdminRequest } from "../libs/types/member";


const productServive = new ProductService(); 
const productController: T = {}

 // ******************************************** //
 //     ***********   REACT     *********        //
 // ******************************************** //


 // ******************************************** //
 //     ***********   BSSR      *********        //
 // ******************************************** //

productController.getAllProducts = async (req: Request, res: Response) => {
    try{
        console.log("getAllProducts");
        const data = await productServive.getAllProducts()
        
        res.render("products", {products: data});
        
    } catch(err) {
      console.log("Error, getAllProducts", err);
        if(err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard)
     
    }
}

productController.createNewProduct = async (req: AdminRequest, res: Response) => {
    try{
        console.log("createNewProduct")
       if(!req.files?.length)   
        throw new Errors(HttpCode.INTERNAL_SERVER_ERROR, Message.CREATE_FAILED)       
        

       const data: ProductInput = req.body;
       data.productImages = req.files?.map(ele => {
        return ele.path.replace(/\\/g, "/");
       });

        await productServive.createNewProduct(data);
        res.send(`<script> alert("Successful creation!"); window.location.replace('/admin/product/all')</script> `);
        
    } catch(err) {
        console.log("Error, getAllProducts:", err)
        if(err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard)
        
    }
}

productController.updateChosenProduct = async (req: Request, res: Response) => {
    try{
        console.log("uptadeChosenProduct")
        const id =  req.params.id as string;

        const result = await productServive.updateChosenProduct(id, req.body);
        
        res.status(HttpCode.OK).json({data: result}); 
        
    } catch(err) {
        console.log("Error, uptadeChosenProduct:", err)
        if(err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard)
        
    }
}





export default productController;