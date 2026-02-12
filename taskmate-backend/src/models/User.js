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
averageRating: {
  type: Number,
  default: 0,
},
totalRatings: {
  type: Number,
  default: 0,
},

    blockCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
