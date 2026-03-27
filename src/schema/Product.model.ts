import mongoose, {Schema} from "mongoose";
import { ProductCollection, ProductStatus } from "../libs/enums/product.enum";


// memberschemani 2 xil usulda qursa buladi 1-Schema first va Code first orqali quriladi bu qurganimiz schama based
const productSchema = new Schema(
    {
      productStatus: {
        type: String,
        enum: ProductStatus,
        default: ProductStatus.PAUSE,

      },

      productCollection: {
        type: String,
        enum: ProductCollection,
        required: true,

      },

      productName: {
        type: String,
        required: true,
      },

      productPrice: {
        type: Number,
        required: true,
      },

      productLeftCount: {
        type: Number,
        required: true,
      },

      productDesc: {
        type: String,
        
      },
      productImages: {
        type: [String],
        default: [],
      },

      productViews: {
        type: Number,
        default: 0,
      },


}, {timestamps: true} // updatedAt, createdAt bu bizda updatedAt va createdAt qachon hosil bulganini quyib beradi
);

export default mongoose.model('Product', productSchema);
