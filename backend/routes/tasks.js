import express from 'express';
import pool from '../db/index.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// GET all tasks for logged in user
router.get('/', auth, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at ASC',
            [req.user.id]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// CREATE a new task
router.post('/', auth, async (req, res) => {
    try {
        const { title, description, priority, work_type, group_name, start_time, end_time, due_date } = req.body;
        const result = await pool.query(
            `INSERT INTO tasks (user_id, title, description, priority, work_type, group_name, start_time, end_time, due_date)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
            [req.user.id, title, description, priority, work_type, group_name, start_time, end_time, due_date]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// UPDATE a task
router.put('/:id', auth, async (req, res) => {
    try {
        const { title, description, priority, work_type, group_name, start_time, end_time, due_date, completed } = req.body;
        const result = await pool.query(
            `UPDATE tasks SET title=$1, description=$2, priority=$3, work_type=$4,
       group_name=$5, start_time=$6, end_time=$7, due_date=$8, completed=$9
       WHERE id=$10 AND user_id=$11 RETURNING *`,
            [title, description, priority, work_type, group_name, start_time, end_time, due_date, completed, req.params.id, req.user.id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Task not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// TOGGLE task complete
router.patch('/:id/toggle', auth, async (req, res) => {
    try {
        const result = await pool.query(
            `UPDATE tasks SET completed = NOT completed
       WHERE id=$1 AND user_id=$2 RETURNING *`,
            [req.params.id, req.user.id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// DELETE a task
router.delete('/:id', auth, async (req, res) => {
    try {
        await pool.query(
            'DELETE FROM tasks WHERE id=$1 AND user_id=$2',
            [req.params.id, req.user.id]
        );
        res.json({ message: 'Task deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;