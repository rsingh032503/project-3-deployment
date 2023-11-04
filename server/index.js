const express = require('express');

// Create express app
const app = express();
const port = parseInt(process.env.APP_PORT, 10) || 3000;

// middleware 
const cors = require('cors');


app.use(cors())


const pool = require('./db');

	 	 	 	
app.set("view engine", "ejs");

// app.get('/', (req, res) => {
//     res.send('Hello World!');
// });

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
            res.status(500).json({ error: 'Server error' });
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
    try {
      const { data_to_insert } = req.body; // Extract the data from the request body
      const insertQuery = 'INSERT INTO ingredient VALUES ($1, $2, $3, $4)';
      await pool.query(insertQuery, [data_to_insert.value1, data_to_insert.value2, data_to_insert.value3, data_to_insert.value4]);
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
