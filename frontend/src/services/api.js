import axios from 'axios';

const api = axios.create({
  baseURL:
    window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'http://localhost:3450/api'
      : 'https://backend-repo-for-ai-code-explainer.onrender.com/api',
});

export const loginAPI = async (data) => {
  const res = await api.post('/auth/login', data);
  localStorage.setItem('token', res.data.accesstoken);
  return res.data;
};

export const registerAPI = async (data) => {
  const res = await api.post('/auth/register', data);
  return res.data;
};

export const getNotesAPI = async (token) => {
  const res = await api.get('/notes', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const createNoteAPI = async (data, token) => {
  const res = await api.post('/notes', data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateNoteAPI = async (id, data, token) => {
  const res = await api.put(`/notes/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteNoteAPI = async (id, token) => {
  const res = await api.delete(`/notes/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};