import {app,initializeApp} from "./app.js";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_SECRET,
  api_secret: process.env.CLOUDINARY_API_KEY,
});


async function startServer() {
  await initializeApp();
  app.listen(process.env.PORT, () => {
    console.log(`server listening at port ${process.env.PORT} `);
  });
}

startServer();

