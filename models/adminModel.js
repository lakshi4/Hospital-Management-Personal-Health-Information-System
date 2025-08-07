import mongoose from "mongoose";

const adminSchema = mongoose.Schema(

{
   role: {
      type: String,
      required: true
   },
  username: {
    type: String,
    required: true
 },
 password: {
    type: String,
    required: true
 }
 

}

);

export const Admin = mongoose.model('admint',adminSchema);