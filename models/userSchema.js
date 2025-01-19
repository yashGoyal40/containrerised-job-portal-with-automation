import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: [3, "Name must caontain atleast 3 characters"],
      maxLength: [30, "Name cannot excede 30 characters"],
    },
    email: {
      type: String,
      required: true,
      validate: [validator.isEmail, "Please provide valid email"],
      unique: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    niches: {
      firstNiche: String,
      secondNiche: String,
      thirdNiche: String,
    },
    password: {
      type: String,
      required: true,
      minLength: [8, "Password must contain atleast 8 characters"],
      maxLength: [32, "Password cannot contain more than 32 characters"],
      select: false,
    },
    resume: {
      public_id: String,
      url: String,
    },
    coverLetter: {
      type: String,
    },
    role: {
      type: String,
      required: true,
      enum: ["Job seeker", "Employer"],
      immutable: true,
    },
    otp: {
      type: String,
      select: false,
    },
    otpExpires: {
      type: Date,
      select: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    appliedJobs: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Job"
    }
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

export const User = mongoose.model("User", userSchema);
