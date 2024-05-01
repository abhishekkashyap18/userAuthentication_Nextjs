import mongoose from "mongoose";

export async function connect() {
    try {
    
        mongoose.connect(process.env.MONGO_URI!)
        const connection = mongoose.connection

        connection.on('connected', () => {
            console.log('MongoDb connected');
            
        })

        connection.on('error', (err) => {
            console.log('MongoDb connection error, please make sure db is up and running: ' + err);
            process.exit(1);
        })
    } catch (error) {
        console.log("Something went wrong in connecting to DB")
        console.log(error);
        
    }
}