const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
      text: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 2000,
      text: true,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
      maxlength: 32,
    },
    category: {
      type: ObjectId,
      ref: "Category",
    },
    parentSubs: [
      {
        type: ObjectId,
        ref: "SubParent",
      },
    ],
    subs: [
      {
        type: ObjectId,
        ref: "Sub",
      },
    ],
    quantity: Number,
    sold: {
      type: Number,
      default: 0,
    },
    images: {
      type: Array,
    },
    season: {
      type: String,
      enum: ["Зима", "Весна", "Лето", "Осень"],
    },
    structure: {
      type: String,
      enum: [
        "Хлопок",
        "Полиэстер",
        "Кожа",
        "Пластмасса",
        "Эластан",
        "Текстиль",
        "Замша",
        "Латекс",
      ],
    },
    size: {
      type: Array,
    },
    color: {
      type: String,
      enum: [
        "Белый",
        "Бежевый",
        "Розовый",
        "Желтый",
        "Оранжевый",
        "Красный",
        "Зеленый",
        "Синий",
        "Фиолетовый",
        "Коричневый",
        "Серый",
        "Черный",
      ],
    },
    brand: {
      type: String,
      enum: [
        "Hermes",
        "Fendi",
        "Gucci",
        "Louis & Vitton",
        "Dolce & Gabbana",
        "Giorgio Armani",
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
