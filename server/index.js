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
