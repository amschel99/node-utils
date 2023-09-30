# Quick Mongo Seed

Quick Mongo Seed is an npm module designed to simplify the process of seeding a MongoDB database for your Node.js applications, particularly in a testing environment. It allows you to easily populate your MongoDB collections with data from seed files.

## Installation


```bash
npm i quick-mongo-seed
```

## Usage
Use the function in your test files as shown below. It will automatically seed the database before tests and close the connection clearing the database after all tests have run.
```
setUpDb("databaseName",true,"mongodb://127.0.0.1","/path/to/seedFiles")
```
Below is an example using supertest.

```javascript
import {app} from '../index.js'
import supertest from 'supertest'
import { setupDB } from "quick-mongo-seed"

const request =supertest(app)
setUpDb("databaseName",true,"mongodb://127.0.0.1","/path/to/seedFiles")
it("should return all products that belong to a particular user", async ()=>{
  
const res= await request.post("/products/list").send({
    email:"kariukiamschel9@gmail.com"
})
expect(res.status).toBe(200)
expect(res.body[0].publisher).toBe("kariukiamschel9@gmail.com")


})


```
The implementation of the endpoints you want to test depends on you. In the example above, we seed our database with products and users from files, product.seed.js and user.seed.js. The controllers for this endpoints use models named Product and User in their logic. Read along to see how this works.

**Parameters:**

- `databaseName` (Type: string): The name of the MongoDB database to be used for seeding.

- `runSaveMiddleware` (Type: boolean): Determines the seeding method. Set to `true` for `create()` and `false` for `insertMany()`.

- `connection_url` (Type: string): The connection string to the MongoDB server.

- `seedDir` (Type: string): The path to the folder containing the seed files.
### Seed Files Format

Seed files should follow a specific naming convention and export data in a particular format:

1. **File Naming Convention:** Seed files should be named in the following format: `<model name>.seed.js`, where `<model name>` corresponds to the name of the MongoDB model or collection to which the data should be seeded. For example:
   - If you want to populate the "Users" collection, name the seed file as `user.seed.js`.
   - For the "Products" collection, use the name `product.seed.js`.

2. **Data Export Format:** Each seed file should export data in the following format using the `export default` syntax:
   
   ```javascript
   export default [
       {
           // Data for the first document
           key1: value1,
           key2: value2,
           // ...
       },
       {
           // Data for the second document
           key1: value1,
           key2: value2,
           // ...
       },
       // Additional documents as needed
   ]
### Using the `runSaveMiddleware` Parameter

The `runSaveMiddleware` parameter in the `setupDB` function controls whether to use `create()` or `insertMany()` when populating the database. This parameter affects the behavior of schema validations and middleware in your MongoDB models.

- When `runSaveMiddleware` is set to `true`:
  - The `create()` method is used to insert documents into the database.
  - This method invokes schema validations and triggers any associated middleware in your MongoDB models.
  - Schema validations ensure that data adheres to the defined schema, enforcing constraints such as required fields, data types, and more.

- When `runSaveMiddleware` is set to `false`:
  - The `insertMany()` method is used to insert documents into the database.
  - This method does not trigger schema validations or middleware in your MongoDB models.
  - Data is inserted directly into the database without schema checks or custom logic defined in your models.

#### Example:

Suppose you have a MongoDB model for users defined as follows:

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "An email must be provided"],
    },
    password: {
        type: String,
        required: [true, "A password must be provided"],
    },
});

const User = mongoose.model("User", userSchema);

export default User;
```
If you call `setupDB` with `runSaveMiddleware` set to `true`:

- It will use `User.create()` to insert data into the "User" collection.
- Schema validations will be enforced, ensuring that data meets the defined schema requirements.

If you call `setupDB` with `runSaveMiddleware` set to `false`:

- It will use `User.insertMany()` to insert data into the "User" collection.
- Schema validations and middleware will be bypassed, allowing data to be inserted without validation checks.

Choose the appropriate value for `runSaveMiddleware` based on your testing and seeding needs, considering whether you want schema validations and middleware to be applied during data insertion.



## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.



