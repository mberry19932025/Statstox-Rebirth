const PAGE_ID = 'auth';

document.addEventListener('DOMContentLoaded', () => {
  const modeToggle = document.getElementById('authToggle');
  const title = document.getElementById('authTitle');

  let mode = 'login';

  function updateMode() {
    title.textContent = mode === 'login' ? 'Log In' : 'Create Account';
    modeToggle.textContent =
      mode === 'login'
        ? 'Need an account? Sign up'
        : 'Already have an account? Log in';
  }

  modeToggle.addEventListener('click', () => {
    mode = mode === 'login' ? 'signup' : 'login';
    updateMode();
  });

  updateMode();
});