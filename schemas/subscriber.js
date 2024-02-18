const db = require('../db');
const { subscribe } = require('../routes/subscribers');

// Function to create a new schema
async function createSchema(schemaName) {
  try {
    // Execute the CREATE SCHEMA query
    await db.query(`CREATE SCHEMA IF NOT EXISTS ${schemaName}`);
    console.log(`Schema "${schemaName}" created successfully.`);
  } catch (error) {
    console.error('Error creating schema:', error);
  }
}

// Call the function to create a schema
createSchema('subscribers');

// Function to create a table
async function createTable(tablename) {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS ${tablename} (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      subscriber_to_channel TEXT NOT NULL,
      subscribe_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  try {
    // Execute the CREATE TABLE query
    await db.query(createTableQuery);
    console.log('Table "subscribers" created successfully.');
  } catch (error) {
    console.error('Error creating table:', error);
  }
}

// Call the function to create a table
createTable('subscribers');


async function getAllSubscribers() {
    try {
        const result = await db.query('SELECT * FROM subscribers');
        return result.rows;
    } catch (error) {
        throw new Error('Error fetching subscribers: ' + error.message);
    }
}


async function addSubscriber(name, subscriber_to_channel, res) {
  try {
    // Insert the new subscriber into the table
    const insertQuery = 'INSERT INTO subscribers (name, subscriber_to_channel) VALUES ($1, $2) RETURNING *';
    const result = await db.query(insertQuery, [name, subscriber_to_channel]);

    // Respond with the newly created subscriber
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating subscriber:', error);
    res.status(500).json({ message: 'Error creating subscriber' });
  }
}


async function findSubscriber(req, res, next) {
  try {
    const query = 'SELECT * FROM subscribers WHERE id = $1';
    const result = await db.query(query, [req.params.id]);

    if (result.rows.length > 0) {
      req.subscriber = result.rows[0];
      next();
    } else {
      res.status(404).json({message: 'Cannot find subscriber'});
    }
  } catch (err) {
    next(err);
  }
}


async function deleteSubscriber(id) {
  try {
    //const query = 'DELETE FROM subscribers WHERE id = $1';
    const result = await db.query('WITH deleted_subscriber AS (DELETE FROM subscribers WHERE id = $1 RETURNING *) SELECT * FROM deleted_subscriber', [id]);
  
  if (result.rows.length > 0){
    return result.rows[0];
  } else {
    return null
  }
  } catch (error) {
     // Handle errors
    throw new Error(error.message);   
  }
}

// async function updateSubscriber(res, id) {
//   try {
//     if (res.result.name !== undefined && res.result.subscriber_to_channel !== undefined) {
//       const query = `UPDATE subscribers SET name = $1, subscriber_to_channel = $2 WHERE id = $3 RETURNING *`;
//       const result = await db.query(query, [res.result.name, res.result.subscriber_to_channel, id]);
//     } else{
//         if (res.result.name == undefined) {
//           const query = `UPDATE subscribers SET subscriber_to_channel = $1 WHERE id = $2 RETURNING *`;
//           const result = await db.query(query, [res.result.subscriber_to_channel, id]);
//         }
//         else {
//           const query = `UPDATE subscribers SET name = $1 WHERE id = $2 RETURNING *`;
//           const result = await db.query(query, [res.result.name, id]);
//         }
//     }
//     res.result = result
//   } catch (error) {
//       res.status(500).json({message: err.message});
//   }
// }

async function updateSubscriber(name, subscriber_to_channel, id) {
  try {
      let query;
      let result;
      if (name !== undefined && subscriber_to_channel !== undefined) {
          query = `UPDATE subscribers SET name = $1, subscriber_to_channel = $2 WHERE id = $3 RETURNING *`;
          result = await db.query(query, [name, subscriber_to_channel, id]);
      } else if (name === undefined) {
          query = `UPDATE subscribers SET subscriber_to_channel = $1 WHERE id = $2 RETURNING *`;
          result = await db.query(query, [subscriber_to_channel, id]);
      } else {
          query = `UPDATE subscribers SET name = $1 WHERE id = $2 RETURNING *`;
          result = await db.query(query, [name, id]);
      }
      return result.rows[0];
  } catch (error) {
      throw new Error('Error updating subscriber: ' + error.message);
  }
}


module.exports = {
    getAllSubscribers,
    findSubscriber,
    addSubscriber,
    deleteSubscriber,
    updateSubscriber
};


