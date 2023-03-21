const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass
// create, read, update, and list dishes

// list all dishes

function list(req, res) {
  res.json({ data: dishes });
}

// create a new dish by id

function create(req, res) {
  const { data: { name, description, price, image_url } = {} } = req.body;
  const newDish = {
    id: nextId(dishes),
    name,
    description,
    price,
    image_url,
  };
  dishes.push(newDish);
  res.status(201).json({ data: newDish });
}

// Checking validity of dish properties

function hasName(req, res, next) {
  const { data: { name } = {} } = req.body;
  if (name) {
    return next();
  }
  next({ status: 400, message: "A 'name' property is required." });
}

function hasDescription(req, res, next) {
  const { data: { description } = {} } = req.body;
  if (description) {
    return next();
  }
  next({ status: 400, message: "A 'description' property is required." });
}

function hasImage(req, res, next) {
  const { data: { image_url } = {} } = req.body;
  if (image_url) {
    return next();
  }
  next({ status: 400, message: "An 'image_url' property is required." });
}

function hasPrice(req, res, next) {
  const { data: { price } = {} } = req.body;
  if (Number.isInteger(price) && price > 0) {
    return next();
  }
  next({ status: 400, message: "A 'price' property is required." });
}

// Validate if the order exists

function dishExists(req, res, next) {
  const { dishId } = req.params;
  const foundDish = dishes.find((dish) => dish.id === dishId);
  if (foundDish) {
    res.locals.dish = foundDish;
    return next();
  }
  next({
    status: 404,
    message: `Dish id not found: ${dishId}`,
  });
}

// Can read all exisiting dishes

function read(req, res) {
  res.json({ data: res.locals.dish })
}

// updating dishes

function update(req, res) {
  const { dish } = res.locals;
  const { data: { id, name, description, price, image_url } = {} } = req.body;

  dish.id = id;
  dish.name = name;
  dish.description = description;
  dish.price = price;
  dish.image_url = image_url;

  res.json({ data: dish });
}

function matchId(req, res, next) {
  const { dishId } = req.params;
  const { data: { id } = {} } = req.body;
  if(!id || id === dishId) {
    res.locals.dishId = dishId;
    return next();
  }
  next({ status: 400, message: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}` });
}

module.exports = {
  create: [hasName, hasDescription, hasImage, hasPrice, create],
  list,
  read: [dishExists, read],
  update: [dishExists, matchId, hasName, hasDescription, hasImage, hasPrice, update],
  dishExists,
}
