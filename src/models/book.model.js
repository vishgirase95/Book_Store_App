import { object, string } from '@hapi/joi';
import { Schema, model } from 'mongoose';
import { File } from 'winston/lib/winston/transports';

const userSchema =new Schema({
    author:{
        type:String
    },
    title:{
        type:String
    },

    image:{
        type:Object
    },
    quantity:{
        type:Number
    },
    price:{
        type:Number
    },
    description:{
        type:String
    }
},{
    timestamps:true
})

export default model("Book",userSchema);