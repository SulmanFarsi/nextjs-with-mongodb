import mongoose, { Connection } from "mongoose";
import chalk from "chalk";
import { log } from "./utils";



let connection: null | Connection = null;

export default async function db() {
    if (connection) {
        log({
            type: "INFO",
            message: "Already Connected With Database",
            process: "DATABASE",
        });
        return;
    };
    try {
        const _ = await mongoose.connect(process.env.DB_URL as string);
        connection = _.connections[0];
        log({
            type: "SUCCESS",
            message: "Successfully Connected With Database",
            process: "DATABASE",
        });
    } catch (error) {
        connection=null;
        log({
            type: "DANGER",
            message: "Failed Connect With Database",
            process: "DATABASE",
        });
        process.exit(1  );
    };
}