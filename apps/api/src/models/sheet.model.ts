import mongoose from "mongoose";

const workbookSchema = new mongoose.Schema({
  name: String,
  sheet_id: { type: String, unique: true },
  sheet_name:{type:String},
  data: [
  [
      {
      type: mongoose.Schema.Types.Mixed,
      default:null,
    }
    ]
  ],
  order: Number,
  row: Number,
  column: Number,
  config: mongoose.Schema.Types.Mixed,
  pivotTable: mongoose.Schema.Types.Mixed,
  isPivotTable: Boolean,
  status: Number,
});
const Sheet = mongoose.model("Sheet", workbookSchema);
export default Sheet