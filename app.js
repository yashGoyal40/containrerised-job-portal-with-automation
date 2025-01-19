import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connection } from "./database/connection.js";
import { errorMiddleware } from "./middlewares/error.js";
import fileUpload from "express-fileupload";
import userRouter from "./routes/userRoutes.js";
import jobRouter from "./routes/jobRoutes.js";
import applicationRouter from "./routes/applicationRoutes.js";
import { newsLetterCron } from "./automation/newsLetterCron.js";
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

const secret_name = "jobPortalSecret";
const client = new SecretsManagerClient({
  region: "us-east-1",
});

async function fetchSecrets() {
  try {
    const response = await client.send(
      new GetSecretValueCommand({
        SecretId: secret_name,
        VersionStage: "AWSCURRENT",
      })
    );
    const secret = JSON.parse(response.SecretString);
    return secret;
  } catch (error) {
    console.error("Error fetching secrets : ", error);
    throw error;
  }
}

const setEnvFromSecrets = async () => {
  const secrets = await fetchSecrets();
  for (const key in secrets) {
    if (secrets.hasOwnProperty(key)) {
      process.env[key] = secrets[key];
    }
  }
};

const app = express();

async function initializeApp() {
  await setEnvFromSecrets(); 


  app.use(
    cors({
      origin: [process.env.FRONTEND_URL],
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    })
  );

  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(
    fileUpload({
      useTempFiles: true,
      tempFileDir: "/tmp/",
    })
  );

  app.use("/api/v1/user", userRouter);
  app.use("/api/v1/job", jobRouter);
  app.use("/api/v1/application", applicationRouter);

  newsLetterCron();
  connection();

  app.use(errorMiddleware);
}
export  {app,initializeApp};
