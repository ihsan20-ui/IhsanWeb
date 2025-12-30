import mongoose from "mongoose";

export const connectDB =async()=>{
    await mongoose.connect('mongodb+srv://ihsanjomaa2004_db_user:Ihsan2005@cluster0.6tydkhs.mongodb.net/FoodieFrenzy')
    .then(()=> console.log('DB CONNECTED'))
}