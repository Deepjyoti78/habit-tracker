const router = require('express').Router();
const pool = require('../db/index');
const auth = require('../middleware/auth');

// GET today's checkin
router.get('/today', auth, async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const result = await pool.query(
            'SELECT * FROM daily_checkins WHERE user_id=$1 AND date=$2',
            [req.user.id, today]
        );
        if (result.rows.length === 0) {
            return res.json({
                water_current: 0, water_target: 8,
                sleep_current: 0, sleep_target: 8,
                meditate_current: 0, meditate_target: 10,
                reading_current: 0, reading_target: 30
            });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// SAVE or UPDATE today's checkin
router.post('/', auth, async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const { water_current, water_target, sleep_current, sleep_target,
            meditate_current, meditate_target, reading_current, reading_target } = req.body;

        const result = await pool.query(
            `INSERT INTO daily_checkins
       (user_id, date, water_current, water_target, sleep_current, sleep_target,
        meditate_current, meditate_target, reading_current, reading_target)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       ON CONFLICT (user_id, date) DO UPDATE SET
       water_current=$3, sleep_current=$5,
       meditate_current=$7, reading_current=$9
       RETURNING *`,
            [req.user.id, today, water_current, water_target, sleep_current, sleep_target,
                meditate_current, meditate_target, reading_current, reading_target]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;