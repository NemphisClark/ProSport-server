const Product = require("../models/product");
const User = require("../models/user");
const slugify = require("slugify");

exports.create = async (req, res) => {
  try {
    console.log(req.body);
    req.body.slug = slugify(req.body.title);
    const newProduct = await new Product(req.body).save();
    res.json(newProduct);
  } catch (err) {
    console.log(err);
    // res.status(400).send("Create product failed");
    res.status(400).json({
      err: err.message,
    });
  }
};

exports.listAll = async (req, res) => {
  let products = await Product.find({})
    .limit(parseInt(req.params.count))
    .populate("category")
    .populate("parentSubss")
    .populate("subs")
    .sort([["createdAt", "desc"]])
    .exec();
  res.json(products);
};

exports.remove = async (req, res) => {
  try {
    const deleted = await Product.findOneAndRemove({
      slug: req.params.slug,
    }).exec();
    res.json(deleted);
  } catch (err) {
    console.log(err);
    return res.staus(400).send("Product delete failed");
  }
};

exports.read = async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug })
    .populate("category")
    .populate("parentSubss")
    .populate("subs")
    .exec();
  res.json(product);
};

// WITHOUT PAGINATION
exports.list = async (req, res) => {
  try {
    // createdAt/updatedAt, desc/asc, 5
    const { sort, order, limit } = req.body;
    const products = await Product.find({})
      .populate("category")
      .populate("parentSubss")
      .populate("subs")
      .sort([[sort, order]])
      .limit(limit)
      .exec();

    res.json(products);
  } catch (err) {
    console.log(err);
  }
};

// exports.productsCount = async (req, res) => {
//   let total = await Product.find({}).estimatedDocumentCount().exec();
//   res.json(total);
// };

// SERACH / FILTER

const handleQuery = async (req, res, query) => {
  const products = await Product.find({ $text: { $search: query } })
    .populate("category", "_id name")
    .populate("parentSubs", "_id name")
    .populate("subs", "_id name")
    .populate("postedBy", "_id name")
    .exec();

  res.json(products);
};

const handleCategory = async (req, res, category) => {
  try {
    let products = await Product.find({ category })
      .populate("category", "_id name")
      .populate("parentSubs", "_id name")
      .populate("subs", "_id name")
      .populate("postedBy", "_id name")
      .exec();

    res.json(products);
  } catch (err) {
    console.log(err);
  }
};

const handleParentSub = async (req, res, parentSub) => {
  const products = await Product.find({ parentSubs: parentSub })
    .populate("category", "_id name")
    .populate("parentSubs", "_id name")
    .populate("subs", "_id name")
    .populate("postedBy", "_id name")
    .exec();

  res.json(products);
};

const handleSub = async (req, res, sub) => {
  const products = await Product.find({ subs: sub })
    .populate("category", "_id name")
    .populate("parentSubs", "_id name")
    .populate("subs", "_id name")
    .populate("postedBy", "_id name")
    .exec();

  res.json(products);
};

const handleColor = async (req, res, color) => {
  const products = await Product.find({ color })
    .populate("category", "_id name")
    .populate("parentSubs", "_id name")
    .populate("subs", "_id name")
    .populate("postedBy", "_id name")
    .exec();

  res.json(products);
};

const handleBrand = async (req, res, brand) => {
  const products = await Product.find({ brand })
    .populate("category", "_id name")
    .populate("parentSubs", "_id name")
    .populate("subs", "_id name")
    .populate("postedBy", "_id name")
    .exec();

  res.json(products);
};

const handleSeason = async (req, res, season) => {
  const products = await Product.find({ season })
    .populate("category", "_id name")
    .populate("parentSubs", "_id name")
    .populate("subs", "_id name")
    .populate("postedBy", "_id name")
    .exec();

  res.json(products);
};

const handleStructure = async (req, res, structure) => {
  const products = await Product.find({ structure })
    .populate("category", "_id name")
    .populate("parentSubs", "_id name")
    .populate("subs", "_id name")
    .populate("postedBy", "_id name")
    .exec();

  res.json(products);
};

exports.searchFilters = async (req, res) => {
  const {
    query,
    category,
    sub,
    parentSub,
    color,
    brand,
    season,
    structure,
  } = req.body;

  if (query) {
    console.log("query --->", query);
    await handleQuery(req, res, query);
  }

  if (category) {
    console.log("category ---> ", category);
    await handleCategory(req, res, category);
  }

  if (parentSub) {
    console.log("sub ---> ", parentSub);
    await handleParentSub(req, res, parentSub);
  }

  if (sub) {
    console.log("sub ---> ", sub);
    await handleSub(req, res, sub);
  }

  if (color) {
    console.log("color ---> ", color);
    await handleColor(req, res, color);
  }

  if (structure) {
    console.log("structure ---> ", structure);
    await handleStructure(req, res, structure);
  }

  if (season) {
    console.log("season ---> ", season);
    await handleSeason(req, res, season);
  }

  if (brand) {
    console.log("brand ---> ", brand);
    await handleBrand(req, res, brand);
  }
};
