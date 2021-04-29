const SubParent = require("../models/subParent");
const Product = require("../models/product");
const slugify = require("slugify");

exports.create = async (req, res) => {
  try {
    const { name, parent } = req.body;

    function random_slug(length) {
      let random_str = "";
      let characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz";

      for (let i = 0; i < length; i++) {
        random_str += characters.charAt(
          Math.floor(Math.random() * characters.length)
        );
      }
      return random_str;
    }

    res.json(
      await new SubParent({
        name,
        parent,
        slug: slugify(`${name}-${random_slug(4)}`),
      }).save()
    );
  } catch (err) {
    console.log("SUB CREATE ERR ----->", err);
    res.status(400).send("Ошибка при создании!");
  }
};

exports.list = async (req, res) =>
  res.json(await SubParent.find({}).sort({ createdAt: -1 }).exec());

exports.read = async (req, res) => {
  let subParent = await SubParent.findOne({ slug: req.params.slug }).exec();
  const products = await Product.find({ parentSubs: subParent })
    .populate("category")
    .exec();

  res.json({
    subParent,
    products,
  });
};

exports.remove = async (req, res) => {
  try {
    const deleted = await SubParent.findOneAndDelete({ slug: req.params.slug });
    res.json(deleted);
  } catch (err) {
    res.status(400).send("Sub delete failed");
  }
};
