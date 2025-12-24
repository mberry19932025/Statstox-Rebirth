document.addEventListener('DOMContentLoaded', () => {
  console.log('Login page loaded');

  const form = document.querySelector('.auth-form');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    localStorage.setItem('statstox:auth', 'true');
    window.location.href = 'account.html';
  });
});
