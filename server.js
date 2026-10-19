require('dotenv').config();
const express = require('express');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

app.get('/materials', async(req, res) => {
    try {
          const result = await pool.query('SELECT * FROM materials ORDER BY item_id');
          res.json(result.rows);

    } catch ( err) {
         console.error(err);
         res.status(500).json({error: 'Server Error'});
    }
}) 

app.post('/materials', async(req, res) => {
    try { 
        const {name, quantity, unit} = req.body;
        const qty = Number(quantity);

        if (!name || !unit||  Number.isNan || qty < 0  ) {
            return res.status(400).json({error: "Invalid Name, Quantity or Unit"});''
        }

        const result = await pool.query('INSERT INTO materials (name, quantity, unit) VALUES ($1,$2,$3) RETURNING * ',
             [String(name).trim() , qty, String(unit).trim() ]);
        
              res.status(201).json(result.rows[0]);

    } catch(err) {
            res.status(500).json({error: "Failed to add Materials"});

    }
})



app.put('/materials/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const qty = Number(req.body.quantity);

    if (!Number.isInteger(id) || Number.isNaN(qty) || qty < 0) {
      return res.status(400).json({ error: 'Invalid id or quantity' });
    }

    const result = await pool.query(
      'UPDATE materials SET quantity = $1 WHERE item_id = $2 RETURNING *',
      [qty, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Material not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/materials/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: 'Invalid id' });
    }

    const result = await pool.query(
      'DELETE FROM materials WHERE item_id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Material not found' });
    }

    res.json({ message: 'Deleted', deleted: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
   console.log(`IMAMS running at http://localhost:${PORT}`);
});
