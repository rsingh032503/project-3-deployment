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

app.get('/login_info', (req, res) => {
    getAllFromTable('login_info', res);
});


app.post('/menu_item', async (req, res) => {
    const name = req.body.name;
    const price = req.body.price;
    const id = req.body.id;
    try {
      const insertQuery = 'INSERT INTO menu_item VALUES ($1, $2, $3)';
      await pool.query(insertQuery, [id, price, name]);
      res.json('Menu item was added!');
    } catch (err) {
      console.error(err);
      res.status(500).json('Error adding menu item');
    }
});

app.post('/ingredient_menu_item_join_table', async (req, res) => {
    const id = req.body.join_id;
    const ingredient_id = req.body.ingredient_id;
    const menu_item_id = req.body.menu_item_id;
    const quantity = req.body.quantity;
    try {
      const insertQuery = 'INSERT INTO ingredient_menu_item_join_table VALUES ($1, $2, $3, $4)';
      await pool.query(insertQuery, [id, ingredient_id, menu_item_id, quantity]);
      res.json('Menu item ingredients were added!');
    } catch (err) {
      console.error(err);
      res.status(500).json('Error adding menu item ingredients');
    }
});

app.delete('/ingredient_menu_item_join_table/menu-item/:id', async (req, res) => {
    try {
        const menuItemId = req.params.id;

        const deleteRowsQuery = 'DELETE FROM ingredient_menu_item_join_table WHERE menu_item_id = $1';
        await pool.query(deleteRowsQuery, [menuItemId]);

        res.status(200).json(`Rows in ingredient_menu_item_join_table deleted for menu item id: ${menuItemId}`);
    } catch (err) {
        console.error(err);
        res.status(500).json('Error deleting rows in ingredient_menu_item_join_table');
    }
});

app.delete('/menu_item/:id', async (req, res) => {
    try {
        const menuItemId = req.params.id;

        // First, delete rows in ingredient_menu_item_join_table
        const deleteRowsQuery = 'DELETE FROM ingredient_menu_item_join_table WHERE menu_item_id = $1';
        await pool.query(deleteRowsQuery, [menuItemId]);

        // Then, delete the menu item from the menu_item table
        const deleteMenuItemQuery = 'DELETE FROM menu_item WHERE id = $1';
        await pool.query(deleteMenuItemQuery, [menuItemId]);

        res.status(200).json(`Menu item deleted with id: ${menuItemId}`);
    } catch (err) {
        console.error(err);
        res.status(500).json('Error deleting menu item');
    }
});

app.put('/menu_item', async (req, res) => {
    try {
        const name = req.body.name;
        const price = req.body.price; 
        await pool.query(`UPDATE menu_item SET price = ${price} WHERE name = '${name}'`);
        res.json('Menu item price was updated!');
    } catch (err) {
      console.error(err);
      res.status(500).json('Error updating ingredient');
    }
});

//Adds an ingredient to the data
app.post('/ingredient', async (req, res) => {

    const name = req.body.name;
    const price = req.body.price;
    const quantity = req.body.quantity;
    const id = req.body.id;
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
app.delete("/ingredient", async (req, res) =>{
    try{
        const {name} = req.body;
        pool.query(`DELETE FROM ingredient WHERE name = '${name}'`);
        res.json("Ingredient was deleted!");
    }catch(err){
        console.log(err.message);
    }
});

//Updates ingredients based on the name that is provided
app.put('/ingredient', async (req, res) => {
    try {
      const price = req.body.price; 
      const quantity  = req.body.quantity; 
      const name = req.body.name;
      let updateQuery;
      if(price != undefined){
        updateQuery = `UPDATE ingredient SET quantity = ${quantity}, restock_price = ${price} WHERE name = '${name}'`;
      }
      else{
        updateQuery = `UPDATE ingredient SET quantity = ${quantity} WHERE name = '${name}'`;
      }
      await pool.query(updateQuery);
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

app.get('/sales-report', async (req, res) => {
    try {
      const start = req.query.start;
      const end = req.query.end;
  
      // Query to filter orders based on the time window
      const orderQuery = 'SELECT * FROM order_table WHERE date_placed >= $1 AND date_placed <= $2';
      const orderResult = await pool.query(orderQuery, [start, end]);
      const filteredOrders = orderResult.rows;
  
      // Query to retrieve menu item sales from join table
      const salesQuery = `
        SELECT
          m.name AS menu_item_name,
          m.price AS menu_item_price,
          SUM(jo.quantity) AS total_quantity,
          SUM(m.price * jo.quantity) AS total_sales
        FROM
          menu_item_order_join_table jo
        JOIN
          menu_item m ON jo.menuitemid = m.id
        WHERE
          jo.orderid = ANY($1::int[])
        GROUP BY
          m.name, m.price;
      `;
  
      const salesResult = await pool.query(salesQuery, [filteredOrders.map(order => order.id)]);
      const menuItemSales = salesResult.rows;
  
      res.json({ sales: menuItemSales });
    } catch (err) {
      console.error(err);
      res.status(500).json('Error getting sales report');
    }
});

app.get('/excess-report', async (req, res) => {
    try {
        const start = req.query.start;

        // Single query to retrieve excess report data
        const excessReportQuery = `
            SELECT
                i.id AS ingredient_id,
                i.name AS ingredient_name,
                i.quantity AS original_quantity,
                COALESCE(SUM(jo.quantity), 0) AS amount_sold_since_timestamp
            FROM
                ingredient i
            LEFT JOIN
                ingredient_menu_item_join_table im ON i.id = im.ingredient_id
            LEFT JOIN
                menu_item_order_join_table jo ON im.menu_item_id = jo.menuitemid
            LEFT JOIN
                order_table o ON jo.orderid = o.id
            WHERE
                o.date_placed >= $1
            GROUP BY
                i.id
        `;

        const excessReportResult = await pool.query(excessReportQuery, [start]);
        const excessIngredients = excessReportResult.rows.map(ingredient => {
            const quantityAtTimestamp = Number(ingredient.original_quantity) + Number(ingredient.amount_sold_since_timestamp);
            const percentageSold = (ingredient.amount_sold_since_timestamp / quantityAtTimestamp) * 100;

            return {
                id: ingredient.ingredient_id,
                name: ingredient.ingredient_name,
                quantityAtTimestamp: quantityAtTimestamp,
                amountSoldSinceTimestamp: ingredient.amount_sold_since_timestamp,
                percentageSold: percentageSold,
            };
        }).filter(ingredient => ingredient.percentageSold < 10);
        res.json({ excessIngredients });
    } catch (err) {
        console.error(err);
        res.status(500).json('Error getting excess report');
    }
});

//Gets the understocked ingredients
app.get('/understocked', async (req, res) => {
    try {
        const understockedQuery = 'SELECT * FROM ingredient WHERE quantity < threshold';
        const result = await pool.query(understockedQuery);
        const understockedIngredients = result.rows;

        res.json({ understockedIngredients });

    }
    catch (err) {
        console.error(err);
        res.status(500).json('Error getting understocked ingredients');
    }
});

