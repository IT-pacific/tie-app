import { Schema, model, Document, Types } from 'mongoose';

export interface IItemDetail {
  item: Types.ObjectId;
  quantity: number;
  unitPrice: number;
}

export interface IOrder extends Document {
  link_id: Types.ObjectId;
  order_id: string;
  retail_id: Types.ObjectId;
  generatedBy: Types.ObjectId|undefined;
  item_details: IItemDetail[];
  status:
    | 'pending'
    | 'confirmed'
    | 'rejected'
    | 'cancelled'
    | 'payment-pending'
    | 'completed';
  paymentProof?: string;
  statusChangeDate?: Date;
  createdAt?: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    link_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Link',
    },
    order_id: {
      type: String,
      required: true,
      unique: true,
    },
    retail_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    item_details: [
      {
        item: {
          type: Schema.Types.ObjectId,
          ref: 'Inventory',
          required: true,
        },
        quantity: {
          type: Number,
        default:0
        },
        unitPrice: {
          type: Number,
          default: 0,
        },
      },
    ],
    status: {
      type: String,
      enum: [
        'pending',
        'confirmed',
        'rejected',
        'cancelled',
        'payment-pending',
        'completed',
      ],
      default: 'pending',
    },
    paymentProof: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

export const Order = model<IOrder>('Order', orderSchema);
