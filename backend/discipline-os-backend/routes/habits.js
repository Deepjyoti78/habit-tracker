const router = require('express').Router();
const pool = require('../db/index');
const auth = require('../middleware/auth');

// GET all habits for logged in user
router.get('/', auth, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM habits WHERE user_id = $1 ORDER BY created_at ASC',
            [req.user.id]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// CREATE a new habit
router.post('/', auth, async (req, res) => {
    try {
        const { name, emoji, category, target_value, unit, color, frequency, active_days, reminder } = req.body;
        const result = await pool.query(
            `INSERT INTO habits (user_id, name, emoji, category, target_value, unit, color, frequency, active_days, reminder)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
            [req.user.id, name, emoji, category, target_value, unit, color, frequency, active_days, reminder]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// UPDATE a habit
router.put('/:id', auth, async (req, res) => {
    try {
        const { name, emoji, category, target_value, unit, color, frequency, active_days, reminder } = req.body;
        const result = await pool.query(
            `UPDATE habits SET name=$1, emoji=$2, category=$3, target_value=$4,
       unit=$5, color=$6, frequency=$7, active_days=$8, reminder=$9
       WHERE id=$10 AND user_id=$11 RETURNING *`,
            [name, emoji, category, target_value, unit, color, frequency, active_days, reminder, req.params.id, req.user.id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Habit not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// DELETE a habit
router.delete('/:id', auth, async (req, res) => {
    try {
        await pool.query(
            'DELETE FROM habits WHERE id=$1 AND user_id=$2',
            [req.params.id, req.user.id]
        );
        res.json({ message: 'Habit deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// LOG habit progress for today
router.post('/:id/log', auth, async (req, res) => {
    try {
        const { current_value, target_value, done } = req.body;
        const progress = Math.round((current_value / target_value) * 100);
        const today = new Date().toISOString().split('T')[0];

        const result = await pool.query(
            `INSERT INTO habit_logs (habit_id, user_id, date, current_value, target_value, progress, done)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       ON CONFLICT (habit_id, date) DO UPDATE
       SET current_value=$4, progress=$6, done=$7
       RETURNING *`,
            [req.params.id, req.user.id, today, current_value, target_value, progress, done]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// GET habit logs (for heatmap & analytics)
router.get('/:id/logs', auth, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM habit_logs WHERE habit_id=$1 AND user_id=$2 ORDER BY date DESC',
            [req.params.id, req.user.id]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;