const Product = require("../models/product");

const getAllProductsStatic = async (req, res) => {
  const products = await Product.find({})
    .sort("name -price")
    .select("name price");
  await res.status(200).json({
    products,
    items: products.length,
  });
};
const getAllProducts = async (req, res) => {
  const { featured, company, name, sort, fields, numericFilters } = req.query;
  const queryObject = {};
  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }
  if (company) {
    queryObject.company = company;
  }
  // search name of the product  with  a regex pattern
  if (name) {
    queryObject.name = {
      $regex: name,
      $options: "i", // i standsfor case insensitive
    };
  }
  if (numericFilters) {
    const operatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "<": "$lt",
      "<=": "$lte",
    };
    const regEx = /\b(<|>|>=|=|<|<=)\b/g;
    let filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    ); //returns arrray of string filters
    const options = ["price", "rating"];
    filters = filters.split(",").forEach((item) => {
      const [field, operator, value] = item.split("-");
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
    });
  }

  //  for chaining of mongoose methods

  let result = Product.find(queryObject);

  //sort
  if (sort) {
    //{{URL}}/products/products?sort=-name
    //sorting ascending: field_name
    //sorting descending:-field_name
    let sortlist = sort.split(",").join(" ");
    result = result.sort(sortlist);
  } else {
    result = result.sort("createdAt");
  }
  // fetching particular fields
  if (fields) {
    let fieldsList = fields.split(",").join(" ");
    result = result.select(fieldsList);
  }
  const limit = req.query.limit || 10;
  const page = req.query.page || 1;
  let skip = (page - 1) * limit;
  result = result.limit(limit).skip(skip);
  const products = await result;

  res.status(200).json({
    products,
    items: products.length,
  });
};

module.exports = {
  getAllProducts,
  getAllProductsStatic,
};
