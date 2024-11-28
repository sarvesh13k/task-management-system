const db = require('../database');

// Create a new task
exports.createTask = (req, res) => {
  const { title, description, due_date, status } = req.body;
  const sql = 'INSERT INTO tasks (title, description, due_date, status) VALUES (?, ?, ?, ?)';
  db.run(sql, [title, description, due_date, status], function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID, title, description, due_date, status });
  });
};

// Get all tasks
exports.getAllTasks = (req, res) => {
  const sql = 'SELECT * FROM tasks';
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.status(200).json(rows);
  });
};

// Update a task
exports.updateTask = (req, res) => {
  const { title, description, due_date, status } = req.body;
  const { id } = req.params;
  const sql = 'UPDATE tasks SET title = ?, description = ?, due_date = ?, status = ? WHERE id = ?';

  db.run(sql, [title, description, due_date, status, id], function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    // Query to fetch the updated task after update operation
    const fetchUpdatedTaskSql = 'SELECT * FROM tasks WHERE id = ?';
    db.get(fetchUpdatedTaskSql, [id], (err, updatedTask) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      // Respond with the updated task data
      res.status(200).json(updatedTask);
    });
  });
};

// Delete a task
exports.deleteTask = (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM tasks WHERE id = ?';
  db.run(sql, [id], function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.status(200).json({ message: 'Task deleted successfully' });
  });
};
