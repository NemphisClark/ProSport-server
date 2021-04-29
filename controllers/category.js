const Category = require("../models/category");
const SubParent = require("../models/subParent");
const Sub = require("../models/sub");
const Product = require("../models/product");
const slugify = require("slugify");

exports.create = async (req, res) => {
  try {
    const { name } = req.body;

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
      await new Category({
        name,
        slug: slugify(`${name}-${random_slug(4)}`),
      }).save()
    );
  } catch (err) {
    res.status(400).send("Create category failed. ERROR ->", err);
  }
};

exports.list = async (req, res) =>
  res.json(await Category.find({}).sort({ createdAt: -1 }).exec());

exports.read = async (req, res) => {
  let category = await Category.findOne({ slug: req.params.slug }).exec();
  const products = await Product.find({ category }).populate("category").exec();

  res.json({
    category,
    products,
  });
};

exports.remove = async (req, res) => {
  try {
    const deleted = await Category.findOneAndDelete({ slug: req.params.slug });
    res.json(deleted);
  } catch (err) {
    res.status(400).send("Category delete failed. ERROR ->", err);
  }
};

exports.getParentSubs = (req, res) => {
  SubParent.find({ parent: req.params._id }).exec((err, subs) => {
    if (err) console.log(err);
    res.json(subs);
  });
};

exports.getSubs = (req, res) => {
  Sub.find({ parent: req.params._id }).exec((err, subs) => {
    if (err) console.log(err);
    res.json(subs);
  });
};
