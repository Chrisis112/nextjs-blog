import { model, models, Schema } from "mongoose";

const CategorySchema = new Schema(
  {
    name: {
      type: {
        ru: { type: String, trim: true },
        en: { type: String, trim: true },
        et: { type: String, trim: true },
      },
      required: true,
      // можно сделать валидацию: хотя бы одно поле не пусто
    },
  },
  { timestamps: true }
);

// Опционально: добавить валидатор, чтобы было хотя бы одно имя
CategorySchema.path("name").validate(function (value) {
  return (
    value.ru?.trim() ||
    value.en?.trim() ||
    value.et?.trim()
  );
}, "At least one language name (ru/en/et) is required");

export const Category = models?.Category || model("Category", CategorySchema);