import { Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
    FirstName: {
      type: String,
      trim:true
    },  
    LastName: {
      type: String,
      trim:true

    },  
    Email: {
      type: String,
      require:true,
      unique:true,
      trim:true

    },
    Password:{
      type:String,
      require:true,
      trim:true

    },
    Role:{
     type:String,
     trim:true

    }
  },
  {
    timestamps: true
  }
);

export default model('User', userSchema);
