import cron from "node-cron";
import { Job } from "../models/jobSchema.js";
import { User } from "../models/userSchema.js";
import {sendEmail} from "../utils/sendMail.js"
import { message } from "../utils/message.js";
export const newsLetterCron = () => {
  cron.schedule("*/30 * * * *", async () => {
    
    const jobs = await Job.find({ newsLettersSent: false });
    for (const job of jobs) {
      try {
        const filteredUsers = await User.find({
          $or: [
            { "niches.firstNiche": job.jobNiche },
            { "niches.secondNiche": job.jobNiche },
            { "niches.thirdNiche": job.jobNiche },
          ],
        });
        for (const user of filteredUsers) {
          const subject = `Hot Job Alert: ${job.title} in ${job.jobNiche} Available Now`;
          const emailContent = message(user,job);
          sendEmail({
            email: user.email,
            subject,
            message:emailContent,
          });
        }
        job.newsLettersSent = true;
        await job.save();
      } catch (error) {
        console.log("ERROR IN NODE CRON CATCH BLOCK");
        return next(console.error(error || "Some error in Cron."));
      }
    }
  });
};