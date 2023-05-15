# Project: GrubDash

<img src="https://abbett-resume.vercel.app/assets/img/grubdash.png">

You've been hired as a backend developer for a new startup called GrubDash!
As another developer works on the design and frontend experience, you have been tasked with setting up an API and building out specific routes so that
the frontend developers can demo out some initial design ideas to the big bosses.

## Learning Objectives

- Run tests from the command line.
- Use common middleware packages.
- Receive requests through routes.
- Access relevant information through route parameters.
- Build an API following RESTful design principles.
- Write custom middleware functions.

## Skills Used

- RESTful API
- Express API
- Robust Error Handling
- HTTP status codes

## Tasks Completed

- In the src/dishes/dishes.controller.js file, add handlers and middleware functions to create, read, update, and list dishes. Note that dishes cannot be deleted.
- In the src/dishes/dishes.router.js file, add two routes: /dishes, and /dishes/:dishId and attach the handlers (create, read, update, and list) exported from src/dishes/dishes.controller.js.
- In the src/orders/orders.controller.js file, add handlers and middleware functions to create, read, update, delete, and list orders.
- In the src/orders/orders.router.js file, add two routes: /orders, and /orders/:orderId and attach the handlers (create, read, update, delete, and list) exported from src/orders/orders.controller.js.
- Anytime you need to assign a new id to an order or dish, use the nextId function exported from src/utils/nextId.js

## Test

```
npm test
```

