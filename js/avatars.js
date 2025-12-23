/* =========================
   Avatars Page Logic
   ========================= */

const PAGE_ID = 'avatars';

document.addEventListener('DOMContentLoaded', () => {
  // highlight active nav (handled safely)
  document.body.dataset.page = PAGE_ID;

  // future-ready: avatar selection
  const avatarCards = document.querySelectorAll('.avatar-card');

  avatarCards.forEach(card => {
    card.addEventListener('click', () => {
      avatarCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');

      // placeholder for backend hookup
      console.log('Avatar selected:', card.dataset.avatar);
    });
  });
});