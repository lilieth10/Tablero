import { Schema, Document } from 'mongoose';

export interface Column extends Document {
  title: string;
  position?: number;
}

export const ColumnSchema = new Schema<Column>({
  title: { type: String, required: true },
  position: Number,
});

// Virtual para relacionar tarjetas
ColumnSchema.virtual('cards', {
  ref: 'Card', // Asegúrate de que este nombre coincida con el esquema de Card
  localField: '_id',
  foreignField: 'columnId',
});

// Asegura que los virtuals se incluyan en JSON
ColumnSchema.set('toObject', { virtuals: true });
ColumnSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret: { _id?: string; __v?: number; id?: string }) => {
    ret.id = ret._id; // Copia el valor de _id a id
    if (ret._id !== undefined) {
      delete ret._id; // Elimina _id
    }
    delete ret.__v; // Elimina __v
    return ret;
  },
});
