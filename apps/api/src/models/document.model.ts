import mongoose from "mongoose";
const documentSchema = new mongoose.Schema({
  doc_id: { type: String, unique: true },
  doc_name: { type: String },
  user: {
    type: mongoose.Schema.ObjectId,
    ref:"User"
  },
  sheets: [
    {
      type: mongoose.Schema.ObjectId,
      ref:"Sheet"
    }
  ]
},{timestamps:true})
const Document = mongoose.model("Document", documentSchema);
export default Document