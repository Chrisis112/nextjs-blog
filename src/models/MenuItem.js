import mongoose, {model, models, Schema} from "mongoose";

const ExtraPriceSchema = new Schema({
  name: String,
  price: Number,
});

const TranslationSchema = new Schema({
  ru: String,
  en: String,
  et: String,
}, { _id: false });

const MenuItemSchema = new Schema({
  image: { type: String },
  name: { type: Schema.Types.Mixed }, // теперь поддерживает строку и объект
  description: { type: Schema.Types.Mixed },
  category: { type: mongoose.Types.ObjectId },
  basePrice: { type: Number },
  sizes: { type: [ExtraPriceSchema] },
  temperature: { type: [ExtraPriceSchema] },
  extraIngredientPrices: { type: [ExtraPriceSchema] },
  pricePoints: { type: Number },
}, { timestamps: true });


export const MenuItem = models?.MenuItem || model('MenuItem', MenuItemSchema);
