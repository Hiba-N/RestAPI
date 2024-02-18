//import libraries
const express = require('express')
const app = express()
const db = require('./db')

//begin listening on port falana
app.listen(3001, () => console.log('Server Started'))

//get data from database
app.get('/', async (req, res) => {
    try {
      const result = await db.query('SELECT * FROM subscribers');
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });
  
//enable app to be able to work with json object, not yet sure about this  
app.use(express.json())

//setting up routes
const subscribersRouter = require('./routes/subscribers')

//connecting page to routes
app.use('/subscribers', subscribersRouter)
