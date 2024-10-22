import { Schema, model } from 'mongoose';
const linkSchema = new Schema(
  {
    wholesaleId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    allItems: {
      type: Boolean,
      default: true,
    },
    items: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Inventory',
      },
    ],
    customerIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    hiddenFields: [
      {
        type: String,
      },
    ],
    expiresAt: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'expired'],
      default: 'active',
    },
  },
  { timestamps: true },
);

linkSchema.methods.getItemInLink = async function (userId: string) {
  
  if (userId === String(this.wholesaleId)) {
    return this;
  } else {
  
    return await this.populate('items', this.visibleFields.join(' ')).execPopulate();
  }
};

linkSchema.index({ expiresAt: 1 });
linkSchema.index({ wholesaleId: 1 });
export const Link = model('Link', linkSchema);
