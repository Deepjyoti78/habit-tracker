import API from './axios';

export const getHabits = () => API.get('/habits');
export const createHabit = (data) => API.post('/habits', data);
export const updateHabit = (id, data) => API.put(`/habits/${id}`, data);
export const deleteHabit = (id) => API.delete(`/habits/${id}`);
export const logHabit = (id, data) => API.post(`/habits/${id}/log`, data);
export const getHabitLogs = (id) => API.get(`/habits/${id}/logs`);