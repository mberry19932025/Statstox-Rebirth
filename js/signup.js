document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.auth-form');
  if (!form) return;

  const error = document.querySelector('.form-error');
  const API_BASE = window.STATSTOX_API_BASE || 'http://localhost:5000/v1';

  const setError = (message) => {
    if (!error) return;
    if (!message) {
      error.hidden = true;
      error.textContent = '';
      return;
    }
    error.textContent = message;
    error.hidden = false;
  };

  const setAuth = (payload) => {
    localStorage.setItem('statstox:auth', 'true');
    if (payload?.token) {
      localStorage.setItem('statstox:token', payload.token);
    }
    if (payload?.user) {
      localStorage.setItem('statstox:user', JSON.stringify(payload.user));
    }
  };

  const postJson = async (url, data) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || 'Signup failed');
    }
    return response.json();
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const username = formData.get('username');
    const email = formData.get('email');
    const password = formData.get('password');

    setError('');

    try {
      const payload = await postJson(`${API_BASE}/auth/signup`, { username, email, password });
      setAuth(payload);
      window.location.href = 'account.html';
    } catch (err) {
      setError('Unable to create account. Try again.');
    }
  });
});
