import mongoose from "mongoose";

const banHistorySchema = new mongoose.Schema({
  reason: String,
  bannedAt: { type: Date, default: Date.now },
  bannedUntil: Date,
  permanent: { type: Boolean, default: false },
});

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

    banReason: {
      type: String,
      default: "",
    },

    banUntil: {
      type: Date,
      default: null,
    },
unblockRequested: {
  type: Boolean,
  default: false,
},
unblockMessage: {
  type: String,
  default: "",
},

    banHistory: [banHistorySchema],

    averageRating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },

    blockCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
