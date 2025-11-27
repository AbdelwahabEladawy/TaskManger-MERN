import mongoose from "mongoose"
const connectionDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {})
        console.log("mongoDB is connected");


    } catch (error) {
        console.error("error connecting mongo ", error)
        process.exit(1)
    }
}
export default connectionDB