const express = require('express');

// Create express app
const app = express();
const port = parseInt(process.env.APP_PORT, 10) || 3000;

// middleware 
const cors = require('cors');


app.use(cors());
app.use(express.json()); // req.body


const pool = require('./db');

	 	 	
app.set("view engine", "ejs");


app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});


// get ALL credentials
// app.get('/credentials', (req, res) => {
//     pool.query('SELECT * FROM credentials;')
//         .then(query_res => {
//             const credentials = query_res.rows;
//             const data = { credentials };
//             res.json(data);
//         })
//         .catch(err => {
//             console.error(err);
//             res.status(500).json({ error: 'Server error' });
//         });
// });

// get ALL customers
// app.get('/customers', (req, res) => {
//     pool.query('SELECT * FROM customer;')
//         .then(query_res => {
//             const customers = query_res.rows;
//             const data = { customers };
//             res.json(data);
//         })
//         .catch(err => {
//             console.error(err);
//             res.status(500).json({ error: 'Server error' });
//         });
// });

// Define a common function to get all records from a table
function getAllFromTable(table, res) {
    pool.query(`SELECT * FROM ${table};`)
        .then(query_res => {
            const data = { [table]: query_res.rows };
            res.json(data);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Error getting data from server' });
        });
}

// Create "GET all" routes for each table

app.get('/credentials', (req, res) => {
    getAllFromTable('credentials', res);
});

app.get('/customer', (req, res) => {
    getAllFromTable('customer', res);
});

app.get('/customer_order_join_table', (req, res) => {
    getAllFromTable('customer_order_join_table', res);
});

app.get('/ingredient', (req, res) => {
    getAllFromTable('ingredient', res);
});

app.get('/ingredient_menu_item_join_table', (req, res) => {
    getAllFromTable('ingredient_menu_item_join_table', res);
});

app.get('/menu_item', (req, res) => {
    getAllFromTable('menu_item', res);
});

app.get('/menu_item_order_join_table', (req, res) => {
    getAllFromTable('menu_item_order_join_table', res);
});

app.get('/order_table', (req, res) => {
    getAllFromTable('order_table', res);
});

//Deletes a menu item based on the name that is provided
app.delete("/menu_item/:name", async (req, res) =>{
    try{
        const {name} = req.params;
        const deleteTodo = await pool.query("DELETE FROM menu_item WHERE name = $1", [
            name
        ]);
        res.json("Menu Item was deleted!")
    }catch(err){
        console.log(err.message);
    }
});

//Adds an ingredient to the data
app.post('/ingredient', async (req, res) => {

    const name = req.body.name;
    const price = req.body.price;
    const quantity = req.body.quantity;
    const id = red.body.id;
    const threshold = req.body.threshold;
    try {
      const insertQuery = 'INSERT INTO ingredient VALUES ($1, $2, $3, $4, $5)';
      await pool.query(insertQuery, [id, quantity, price, name, threshold]);
      res.json('Ingredient was added!');
    } catch (err) {
      console.error(err);
      res.status(500).json('Error adding ingredient');
    }
  });

//Deletes a ingredient based on the name that is provided
app.delete("/ingredient/:name", async (req, res) =>{
    try{
        const {name} = req.params;
        const deleteTodo = await pool.query("DELETE FROM ingredient WHERE name = $1", [
            name
        ]);
        res.json("Ingredient was deleted!")
    }catch(err){
        console.log(err.message);
    }
});

//Updates ingredients based on the name that is provided
app.put('/ingredient/:name', async (req, res) => {
    try {
      const { name } = req.params; // Extract the ID from the URL
      const { data_to_update } = req.body; // Extract the data to update from the request body
      const updateQuery = 'UPDATE ingredient SET quantity = $1, restock_price = $2 WHERE name = $3';
      await pool.query(updateQuery, [data_to_update.value1, data_to_update.value2, name]);
      res.json('Ingredient was udpated!');
    } catch (err) {
      console.error(err);
      res.status(500).json('Error updating ingredient');
    }
});


function getTotal(items) {
    let total = 0.0;
    for (const item of items) {
        total += item.price;
    }
    return total;
}

// Submits an order
app.post('/submitOrder', async (req, res) => {
    const items = req.body.items;
    const customer = req.body.customer;
  
    try {
        // Get the next order ID
        const orderIdRes = await pool.query('SELECT MAX(id) FROM order_table');
        const orderId = orderIdRes.rows[0].max + 1;
        console.log("Next Order id: ", orderId);

        // Get the next customer ID
        const customerIdRes = await pool.query('SELECT MAX(id) FROM customer');
        const customerId = customerIdRes.rows[0].max + 1;
        console.log("Next customer id: ", customerId);

        // Get the next menu item order join ID
        const menuOrderJoinIdRes = await pool.query('SELECT MAX(id) FROM menu_item_order_join_table');
        const menuOrderJoinId = menuOrderJoinIdRes.rows[0].max + 1;
        console.log("Next menuOrderJoinId: ", menuOrderJoinId);

        // Get the next customer order join ID
        const customerOrderJoinIdRes = await pool.query('SELECT MAX(id) FROM customer_order_join_table');
        const customerOrderJoinId = customerOrderJoinIdRes.rows[0].max + 1;
        console.log("Next customerOrderJoinId: ", customerOrderJoinId);
    
        // Get the ingredients needed for every menu item
        // const ingredientRes = await pool.query('SELECT * FROM menu_item, ingredient_menu_item_join_table WHERE id=menu_item_id AND id = ANY($1) ORDER BY id', [items.map(item => item.id)]);
        const ingredientRes = await pool.query('SELECT * FROM menu_item JOIN ingredient_menu_item_join_table ON menu_item.id = ingredient_menu_item_join_table.menu_item_id WHERE menu_item.id = ANY($1) ORDER BY menu_item.id', [items.map(item => item.id)]);
        //console.log(ingredientRes.rows);
        const ingredients = ingredientRes.rows;

        // Create a map to store the total quantity needed for each ingredient
        const ingredientMap = {};
        for (const ingredient of ingredients) {
            const ingredientId = ingredient.ingredient_id;
            const quantity = ingredient.quantity;
            if (ingredientMap[ingredientId]) {
                ingredientMap[ingredientId] += quantity;
            } else {
                ingredientMap[ingredientId] = quantity;
            }
        }
    
        // TODO: Check to make sure there are enough ingredients
        const ingredientQuantities = await pool.query('SELECT * FROM ingredient');
        for (const ingredient of ingredientQuantities.rows) {
            const ingredientId = ingredient.id;
            const ingredientQuantity = ingredient.quantity;
            if (ingredientMap[ingredientId]) {
                ingredientMap[ingredientId] = ingredientQuantity - ingredientMap[ingredientId];
                if (ingredientMap[ingredientId] < 0) {
                    throw new Error('Not enough ingredients to fulfill order');
                }
            }
        }
    
        // TODO: If there are enough ingredients, subtract them from their respective stock
        for (const ingredientId in ingredientMap) {
            if (ingredientMap[ingredientId] >= 0) {
                await pool.query('UPDATE ingredient SET quantity = $1 WHERE id = $2', [ingredientMap[ingredientId], ingredientId]);
            }    
        }
    
        // Execute the query for the order table
        // await pool.query('INSERT INTO order_table OVERRIDING SYSTEM VALUE (id, totalprice, date_placed) VALUES ($1, $2, $3)', [orderId, getTotal(items), new Date()]);
        await pool.query('INSERT INTO order_table (id, totalprice, date_placed) VALUES ($1, $2, $3)', [orderId, getTotal(items), new Date()]);
        // await pool.query('INSERT INTO order_table (totalprice, date_placed) VALUES ($1, $2)', [getTotal(items), new Date()]);
    
        // Fill the menu item order join table
        // for (const item of items) {
        //     await pool.query('INSERT INTO menu_item_order_join_table (id, menuitemid, orderid) VALUES ($1, $2, $3)', [menuOrderJoinId, item.id, orderId]);
        // }
        const itemsWithQuantity = [];
        items.forEach(item => {
            const existingItem = itemsWithQuantity.find(i => i.name === item.name);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                itemsWithQuantity.push({ ...item, quantity: 1 });
            }
        });
        
        let currentMenuOrderJoinId = menuOrderJoinId;
        for (const item of itemsWithQuantity) {
            await pool.query('INSERT INTO menu_item_order_join_table (id, menuitemid, orderid, quantity) VALUES ($1, $2, $3, $4)', [currentMenuOrderJoinId, item.id, orderId, item.quantity]);
            currentMenuOrderJoinId++;
        }
    
        // Check to see if the customer is a new customer
        const customerRes = await pool.query('SELECT * FROM customer WHERE name = $1 AND email = $2', [customer.name, customer.email]);
        if (customerRes.rowCount === 0) {
            // If the customer is new, add them to the customer table
            customer.id = customerId;
            await pool.query('INSERT INTO customer (id, name, email) VALUES ($1, $2, $3)', [customer.id, customer.name, customer.email]);
        } else {
            customer.id = customerRes.rows[0].id;
            console.log("Existing customer id: ", customer.id);
        }
    
        // Add the order customer relation to the join table
        await pool.query('INSERT INTO customer_order_join_table (id, orderid, customerid) VALUES ($1, $2, $3)', [customerOrderJoinId, orderId, customer.id]);
    
        res.json({ message: 'Order submitted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error while attempting to add order' });
    }
});
