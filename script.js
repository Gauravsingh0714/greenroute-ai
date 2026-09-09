/**
 * GreenRoute AI — script.js
 * Handles: priority button selection, recommendation updates,
 *          recommended card highlighting, and Compare Routes button.
 * No external dependencies. No live or real-world data.
 */

/* ============================================================
   PRIORITY CONFIGURATION
   Maps each priority to: which route is recommended, and what
   explanation text to display in the recommendation banner.

   Walking is intentionally excluded from Cheapest and Greenest
   recommendations for this example journey (~9–13 km). At this
   distance, a 9.7 km / ~115-minute walk is impractical for most
   users. Public Transport is used as the lowest practical-cost
   and lower-emission alternative instead.

   Future version note: Walking could be recommended for Cheapest
   and Greenest when the journey distance is short (e.g. under 2 km),
   once distance-aware logic is added.
   ============================================================ */
const PRIORITIES = {
  fastest: {
    routeId: 'card-private',
    routeName: 'Private Ride',
    explanation:
      'Private Ride has the shortest estimated travel time (~25 min) among all options shown.'
  },
  // Walking is ₹0 and 0 kg CO₂, but the 9.7 km / ~115-min walk is impractical
  // for this distance. Public Transport is the lowest practical-cost option here.
  cheapest: {
    routeId: 'card-public',
    routeName: 'Public Transport',
    explanation:
      'Public Transport is the lowest practical-cost option for this distance at ₹32. ' +
      'Walking (₹0) is shown on the card for reference but is not practical for a ~9.7 km journey.'
  },
  // Walking produces 0 kg CO₂, but is impractical at this distance.
  // Public Transport is the lowest-emission practical option for this journey.
  greenest: {
    routeId: 'card-public',
    routeName: 'Public Transport',
    explanation:
      'Public Transport is the lowest-emission practical travel option for this distance ' +
      'at an estimated 0.9 kg CO₂. Walking (0.0 kg CO₂) is shown on the card for reference ' +
      'but is not practical for a ~9.7 km journey.'
  },
  balanced: {
    routeId: 'card-metro',
    routeName: 'Metro + Walk',
    explanation:
      'Metro + Walk offers a strong balance of travel time, cost, and lower estimated emissions.'
  }
};

/* ============================================================
   DOM REFERENCES
   ============================================================ */
const priorityButtons = document.querySelectorAll('.btn-priority');
const recBanner       = document.getElementById('rec-banner');
const recRouteName    = document.getElementById('rec-route-name');
const recExplanation  = document.getElementById('rec-explanation');
const allCards        = document.querySelectorAll('.route-card');
const compareBtn      = document.getElementById('compare-btn');

/* ============================================================
   APPLY PRIORITY
   Switches the recommended card and updates the banner.
   ============================================================ */
function applyPriority(priority) {
  const config = PRIORITIES[priority];
  if (!config) return;

  // 1. Update priority button active state + aria-pressed
  priorityButtons.forEach(btn => {
    const isActive = btn.dataset.priority === priority;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });

  // 2. Remove 'recommended' class and hide badge from all cards
  allCards.forEach(card => {
    card.classList.remove('recommended');
    const badge = card.querySelector('.rec-badge');
    // Badge visibility is controlled by CSS (.recommended .rec-badge),
    // but we also update aria-label for screen readers
    if (badge) {
      badge.setAttribute('aria-hidden', 'true');
    }
  });

  // 3. Apply 'recommended' to the correct card
  const targetCard = document.getElementById(config.routeId);
  if (targetCard) {
    targetCard.classList.add('recommended');

    // Scroll the recommended card into comfortable view (non-disruptive)
    targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    const badge = targetCard.querySelector('.rec-badge');
    if (badge) {
      badge.removeAttribute('aria-hidden');
    }
  }

  // 4. Update the recommendation banner text
  recRouteName.textContent  = config.routeName;
  recExplanation.textContent = config.explanation;
}

/* ============================================================
   EVENT LISTENERS — Priority buttons
   ============================================================ */
priorityButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    applyPriority(btn.dataset.priority);
  });
});

/* ============================================================
   EVENT LISTENER — Compare Routes button
   Provides visible feedback; results are already shown as
   example estimates (no live data fetching needed for MVP).
   ============================================================ */
compareBtn.addEventListener('click', () => {
  // Flash button text briefly to acknowledge the action
  const original = compareBtn.textContent;
  compareBtn.textContent = '✔ Routes Compared';
  compareBtn.disabled = true;

  setTimeout(() => {
    compareBtn.textContent = original;
    compareBtn.disabled = false;
  }, 1400);

  // Smoothly scroll down to the recommendation banner
  recBanner.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

/* ============================================================
   SELECT ROUTE buttons — lightweight acknowledgement
   ============================================================ */
document.querySelectorAll('.btn-select').forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.route-card');
    const name = card ? card.querySelector('.route-name').textContent : 'this route';

    const original = btn.textContent;
    btn.textContent = `✔ You selected ${name}`;
    btn.disabled = true;

    // Reset other select buttons so only one appears "selected" at a time
    document.querySelectorAll('.btn-select').forEach(other => {
      if (other !== btn) {
        other.textContent = 'Select Route';
        other.disabled = false;
      }
    });

    setTimeout(() => {
      btn.textContent = original;
      btn.disabled = false;
    }, 2000);
  });
});

/* ============================================================
   INITIALISE — apply default priority (Balanced) on page load
   ============================================================ */
applyPriority('balanced');
