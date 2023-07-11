import mongoose from "mongoose";
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
    });
    console.log("MONGODB CONNECTED SUCCESSFULLY");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};
export default connectDB;
