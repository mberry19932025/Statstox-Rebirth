document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.hub-grid .arena-card');
  if (!cards.length) return;

  const API_BASE = window.STATSTOX_API_BASE || 'http://localhost:5000/v1';

  const fetchJson = async (url) => {
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) throw new Error('Fetch failed');
    return response.json();
  };

  const applyQuote = (quote) => {
    if (!quote) return;
    const [roundCard, nextCard] = cards;

    const roundLine = roundCard?.querySelector('.player-price');
    if (roundLine) {
      roundLine.textContent = `Signal: ${quote.signal || 'neutral'}`;
    }

    const nextLine = nextCard?.querySelector('.player-price');
    if (nextLine) {
      const change = typeof quote.change === 'number' ? quote.change.toFixed(2) : '0.00';
      nextLine.textContent = `${quote.change >= 0 ? '+' : ''}${change}% move`;
    }
  };

  const loadQuotes = async () => {
    try {
      const quotes = await fetchJson(`${API_BASE}/market/quotes`);
      if (Array.isArray(quotes) && quotes.length) {
        applyQuote(quotes[0]);
      }
    } catch (err) {
      console.warn('Momentum Run live data unavailable');
    }
  };

  loadQuotes();
});
