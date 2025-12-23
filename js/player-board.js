document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('player');

  const players = {
    'anthony-gridlock': {
      name: 'Anthony Gridlock',
      position: 'QB',
      league: 'NFL',
      price: 5200,
      tier: 'vip'
    },
    'janelle-nova': {
      name: 'Janelle Nova',
      position: 'SG',
      league: 'NBA',
      price: 7450,
      tier: 'premium'
    }
  };

  const player = players[slug];
  if (!player) return;

  document.querySelector('.player-name').textContent = player.name;
  document.querySelector('.player-meta').textContent =
    `${player.position} · ${player.league}`;
  document.querySelector('.player-price').textContent =
    formatCurrency(player.price);

  const avatar = document.querySelector('.player-avatar-large');
  applyTierRing(avatar, player.tier);
});