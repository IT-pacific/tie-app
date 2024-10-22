import {Schema,model} from "mongoose"

const notificationSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  orderId: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
  },
  message: {
    type: String,
    required: true,
  },
  toAll: {
    type: Boolean,
    default: false,
  },
  read: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


export const Notification =model('Notification', notificationSchema);
