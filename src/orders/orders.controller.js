const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /orders handlers needed to make the tests pass

// List all orders

function list(req, res) {
  res.json({ data: orders });
}

// Create a new order

function create(req, res) {
  const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;
  const newOrder = {
		id: nextId(orders),
		deliverTo,
		mobileNumber,
		status,
		dishes,
	}
  orders.push(newOrder);
  res.status(201).json({ data: newOrder });
}

// Checking validity of order properties

function hasDeliverTo(req, res, next) {
  const { data: { deliverTo } = {} } = req.body;
  if (deliverTo) {
    return next();
  }
  next({ status: 400, message: "A 'deliverTo' property is required." });
}

function hasMobileNumber(req, res, next) {
  const { data: { mobileNumber } = {} } = req.body;
  if (mobileNumber) {
    return next();
  }
  next({ status: 400, message: "A 'mobileNumber' property is required." });
}

function hasDishes(req, res, next) {
  const { data: { dishes } = {} } = req.body;
  if (dishes && Array.isArray(dishes) && dishes.length > 0) {
    return next();
  }
  next({ status: 400, message: "A 'dishes' property is required." });
}

function hasQuantity(req, res, next) {
  const { data: { dishes } = {} } = req.body;
  for (let i = 0; i < dishes.length; i++) {
    if (!dishes[i].quantity || dishes[i].quantity < 1 || !Number.isInteger(dishes[i].quantity)) {
      return next({
        status: 400,
        message: `Dish ${i} must have a quantity that is an integer greater than 0`,
      });
    }
  }
  next();
}

// Read Order

function read(req, res) {
	res.json({ data: res.locals.order });
}

// OrderExists

function orderExists(req, res, next) {
  const { orderId } = req.params;
  const foundOrder = orders.find((order) => order.id === orderId);
  if (foundOrder) {
    res.locals.order = foundOrder;
    return next();
  }
  next({ status: 404, message: `Order id does not exist: ${orderId}` });
}

// Update Order

function update(req, res) {
  const { order } = res.locals;
  const { data: { deliverTo, mobileNumber, dishes, status } = {} } = req.body;
  
  order.deliverTo = deliverTo;
  order.mobileNumber = mobileNumber;
  order.dishes = dishes;
  order.status = status;
  
  res.json({ data: order });
}

function matchId(req, res, next) {
  const { orderId } = req.params;
  const { data: { id } = {} } = req.body;
  if(!id || id === orderId) {
    res.locals.orderId = orderId;
    return next();
  }
  next({ status: 400, message: `Dish id does not match route id. Dish: ${id}, Route: ${orderId}` });
}

// Validate Status 

function hasStatus(req, res, next) {
  const { orderId } = req.params;
  const { data: { status } = {} } = req.body;
  if (status && status !== "invalid") {
    return next();
  }
  next({ status: 400, message: "A 'status' property is required."})
}

//Delete Order

function destroy(req, res) {
	const index = orders.indexOf(res.locals.order);
	orders.splice(index, 1);

	res.sendStatus(204);
}

function validateDestroy(req, res, next) {
	if(res.locals.order.status === "pending") {
      return next();
	}
	next({ status: 400, message: "An order cannot be deleted unless it is pending" });
}

module.exports = {
	create: [hasDeliverTo, hasMobileNumber, hasDishes, hasQuantity, create],
    list,
	read: [orderExists, read],
	update: [orderExists, matchId, hasStatus, hasDeliverTo, hasMobileNumber, hasDishes, hasQuantity, update],
	delete: [orderExists, validateDestroy, destroy],
}
