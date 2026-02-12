import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,

    role: {
      type: String,
      enum: ["client", "volunteer", "admin"],
      default: "client",
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    isPermanentlyBlocked: {
      type: Boolean,
      default: false,
    },

    blockCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
