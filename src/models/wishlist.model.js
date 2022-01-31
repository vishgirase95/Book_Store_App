import { Schema, model } from "mongoose";

const WishListSchema=new Schema ({
  UserID:{
      type:String
  },
  Book:[
      {
          BookID:{
              type:String
          },
          Price:{
              type:Number
          }

      }
  ]

})

export default model("WishList",WishListSchema);