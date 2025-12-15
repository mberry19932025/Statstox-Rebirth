document.addEventListener("DOMContentLoaded", () => {
  const PAGE_ID = "all-players";

  const grid = document.getElementById("allPlayersGrid");
  const searchInput = document.getElementById("allPlayersSearch");
  const leagueSelect = document.getElementById("allPlayersLeague");
  const signalSelect = document.getElementById("allPlayersSignal");
  const sortSelect = document.getElementById("allPlayersSort");
  const statusText = document.getElementById("allPlayersStatus");

  if (!grid || !searchInput || !leagueSelect || !signalSelect || !sortSelect || !statusText) {
    console.error(`[${PAGE_ID}] missing required DOM elements`);
    return;
  }

  const normalize = (val) =>
    window.formatUtils?.normalize
      ? window.formatUtils.normalize(val)
      : String(val || "").toLowerCase().trim();

  window.notifications?.add("all players page loaded");

  window.performanceHeatUp?.update({
    page: PAGE_ID,
    action: "view"
  });

  const players = [
    { id: "p1", name: "Player Alpha", league: "NBA", signal: "bullish", projection: 12.5 },
    { id: "p2", name: "Player Beta", league: "NFL", signal: "neutral", projection: 4.0 },
    { id: "p3", name: "Player Gamma", league: "MLB", signal: "bearish", projection: -3.2 },
    { id: "p4", name: "Player Delta", league: "NHL", signal: "bullish", projection: 6.7 },
    { id: "p5", name: "Player Echo", league: "WNBA", signal: "bullish", projection: 9.1 },
    { id: "p6", name: "Campus Star", league: "NCAAB", signal: "neutral", projection: 5.5 },
    { id: "p7", name: "Saturday Legend", league: "NCAAF", signal: "bullish", projection: 10.2 },
    { id: "p8", name: "Main Event Alpha", league: "WRESTLING", signal: "bullish", projection: 7.5 },
    { id: "p9", name: "Pitch Commander", league: "MLS", signal: "neutral", projection: 5.2 },
    { id: "p10", name: "Baseline King", league: "TENNIS", signal: "bullish", projection: 8.4 },
    { id: "p11", name: "Fairway Ace", league: "GOLF", signal: "neutral", projection: 6.3 },
    { id: "p12", name: "Octagon Alpha", league: "MMA", signal: "bullish", projection: 8.9 },
    { id: "p13", name: "Ring Commander", league: "BOXING", signal: "bearish", projection: -2.1 }
  ];

  function renderPlayers(list) {
    grid.innerHTML = "";

    if (!list.length) {
      statusText.textContent = "no players match your filters";
      return;
    }

    statusText.textContent = `${list.length} players shown`;

    list.forEach((player) => {
      const card = document.createElement("article");
      card.className = "player-card";
      card.dataset.playerId = player.id;

      card.innerHTML = `
        <img src="images/player-silhouette.png" alt="player silhouette" />
        <h3>${player.name}</h3>
        <p><strong>league:</strong> ${player.league}</p>
        <p><strong>signal:</strong> ${player.signal}</p>
        <p><strong>projection:</strong> ${player.projection > 0 ? "+" : ""}${player.projection}</p>
        <a href="player-board.html" class="secondary-btn">view player</a>
      `;

      grid.appendChild(card);
    });
  }

  function applyFilters() {
    const query = normalize(searchInput.value);
    const leagueValue = leagueSelect.value;
    const signalValue = signalSelect.value;
    const sortValue = sortSelect.value;

    let filtered = players.filter((p) => {
      return (
        normalize(p.name).includes(query) &&
        (leagueValue === "ALL" || p.league === leagueValue) &&
        (signalValue === "ALL" || p.signal === signalValue)
      );
    });

    if (sortValue === "proj-desc") filtered.sort((a, b) => b.projection - a.projection);
    if (sortValue === "proj-asc") filtered.sort((a, b) => a.projection - b.projection);

    window.notifications?.add("all players filters updated");

    window.performanceHeatUp?.update({
      page: PAGE_ID,
      action: "filter",
      league: leagueValue,
      signal: signalValue
    });

    renderPlayers(filtered);
  }

  searchInput.addEventListener("input", applyFilters);
  leagueSelect.addEventListener("change", applyFilters);
  signalSelect.addEventListener("change", applyFilters);
  sortSelect.addEventListener("change", applyFilters);

  renderPlayers(players);
});