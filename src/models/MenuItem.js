/*
import mongoose, {model, models, Schema} from "mongoose";

const ExtraPriceSchema = new Schema({
  name: String,
  price: Number,
});



const MenuItemSchema = new Schema({
  image: { type: String },
  name: { type: Schema.Types.Mixed }, // теперь поддерживает строку и объект
  description: { type: Schema.Types.Mixed },
  category: { type: mongoose.Types.ObjectId },
  basePrice: { type: Number },
  locations: { type: [String], default: [] },
  sizes: { type: [ExtraPriceSchema] },
  temperature: { type: [ExtraPriceSchema] },
  extraIngredientPrices: { type: [ExtraPriceSchema] },
  pricePoints: { type: Number },
}, { timestamps: true });


export const MenuItem = models?.MenuItem || model('MenuItem', MenuItemSchema);
*/
import mongoose, { model, models, Schema } from 'mongoose';

// Если больше не нужен ExtraPrice (цены, размеры и т.п.) — убери этот блок
// const ExtraPriceSchema = new Schema({
//   name: String,
//   price: Number,
// });

const MenuItemSchema = new Schema(
  {
    // Фото по языкам: { ru, en, et }
    image: {
      type: Schema.Types.Mixed,
      required: true,
    },

    // Название по языкам: { ru, en, et }
    name: {
      type: Schema.Types.Mixed,
      required: true,
    },

    // Описание по языкам: { ru, en, et }
    description: {
      type: Schema.Types.Mixed,
      required: true,
    },

    // Категория (ссылка на Category через ObjectId)
    category: {
      type: mongoose.Types.ObjectId,
      ref: 'Category', // если у тебя есть Category model
      required: true,
    },

    // Локации (массив строк)
    locations: {
      type: [String],
      default: [],
    },

    // Здесь можно будет добавить цены/опции, если снова понадобится
    // basePrice: { type: Number },
    // sizes: [ExtraPriceSchema],
    // temperature: [ExtraPriceSchema],
    // extraIngredientPrices: [ExtraPriceSchema],
    // pricePoints: { type: Number },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

export const MenuItem = models?.MenuItem || model('MenuItem', MenuItemSchema);
