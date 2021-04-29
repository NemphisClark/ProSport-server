const Sub = require("../models/sub");
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
      await new Sub({
        name,
        parent,
        slug: slugify(`${name}-${random_slug(4)}`),
      }).save()
    );
  } catch (err) {
    console.log("SUB CREATE ERR ----->", err);
    res.status(400).send("Create sub failed");
  }
};

exports.list = async (req, res) =>
  res.json(await Sub.find({}).sort({ createdAt: -1 }).exec());

exports.read = async (req, res) => {
  let sub = await Sub.findOne({ slug: req.params.slug }).exec();
  const products = await Product.find({ subs: sub })
    .populate("category")
    .populate("subParent")
    .exec();

  res.json({
    sub,
    products,
  });
};

exports.remove = async (req, res) => {
  try {
    const deleted = await Sub.findOneAndDelete({ slug: req.params.slug });
    res.json(deleted);
  } catch (err) {
    res.status(400).send("Sub delete failed");
  }
};
