import { Schema, model } from 'mongoose';

const userSchema =new Schema({
    author:{
        type:String
    },
    title:{
        type:String
    },

    image:{
        type:String
    },
    quantity:{
        type:String
    },
    price:{
        type:String
    },
    description:{
        type:String
    }
},{
    timestamps:true
})

export default model("Book",userSchema);