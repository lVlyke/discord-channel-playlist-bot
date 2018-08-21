import * as winston from "winston";

export const logger: winston.Logger = winston.createLogger({
    level: "debug",
    transports: [
        new winston.transports.Console()
    ]
});