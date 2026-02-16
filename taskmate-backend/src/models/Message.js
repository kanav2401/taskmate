import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      default: "",
    },
    fileUrl: {
      type: String,
      default: null,
    },
    delivered: {
      type: Boolean,
      default: false,
    },
    seen: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
export default Message;
