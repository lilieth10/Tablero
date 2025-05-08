import { Schema, Document, Types } from 'mongoose';

export interface Card extends Document {
  title: string;
  description?: string;
  columnId: Types.ObjectId;
  position: number;
}

export const CardSchema = new Schema<Card>({
  title: { type: String, required: true },
  description: String,
  columnId: {
    type: Schema.Types.ObjectId,
    ref: 'Column',
    required: true,
  },
  position: { type: Number, required: true },
});

CardSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = (ret._id as Types.ObjectId).toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const CardModelName = 'Card';
