/******************************************************
  AiPayingRent - Simulation Script
  Purpose: Simulate a few AI agents managing personal finances
  and visualize net worth, stress, and actions over time.

  The simulation is intentionally simple and deterministic in
  structure but uses randomness for events and returns.
******************************************************/

/******************************************************
  ECONOMY
  A global flag for broad economic state. Changing this to
  `true` increases the chance of employment-related shocks.
******************************************************/
const economy = {
  recession: true, // toggle to simulate a recession environment
};

/******************************************************
  AI FACTORY
  Creates an agent object with initial finances and traits.
  - name: display label
  - color: chart color
  - cash: liquid funds
  - salary: monthly income when employed
  - rent/food/otherExpenses: monthly outgoing costs
  - investments: current invested capital
  - riskTolerance/discipline/intelligence: behavior modifiers
  - stress: simple metric driven by finances/events
  - employed: whether the agent gets salary
  - sideHustle/business: additional income sources
  - alive: false when bankrupt (stops simulation for agent)
******************************************************/
function createAI(name, riskTolerance, discipline, intelligence, color) {
  return {
    name,
    color,
    cash: 5000,
    salary: 2000,
    rent: 800,
    food: 400,
    otherExpenses: 300,
    investments: 0,
    riskTolerance,
    discipline,
    intelligence,
    stress: 0,
    employed: true,
    sideHustle: false,
    business: null,
    alive: true,
  };
}

// Example agents with distinct profiles
const agents = [
  createAI("Conservative", 0.2, 0.9, 0.8, "#4caf50"), // saves more, low risk
  createAI("Balanced", 0.5, 0.7, 0.8, "#2196f3"), // moderate decisions
  createAI("Risky", 0.9, 0.3, 0.7, "#ff9800"), // chancier moves, less disciplined
];

const TOTAL_MONTHS = 60; // how long the sim runs
let currentMonth = 0; // tracks simulation time

/******************************************************
  CHART SETUP
  Basic Chart.js line chart showing net worth over time
  (cash + investments) for each agent. The chart object is
  updated each month in `updateUI()`.
******************************************************/
const ctx = document.getElementById("netWorthChart");

const chart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [], // populated with month labels like 'M1', 'M2', ...
    datasets: agents.map((ai) => ({
      label: ai.name,
      data: [], // will be filled with net worth each month
      borderColor: ai.color,
      tension: 0.3,
    })),
  },
  options: {
    responsive: true,
    plugins: {
      legend: { labels: { color: "white" } },
    },
    scales: {
      x: { ticks: { color: "white" } },
      y: { ticks: { color: "white" } },
    },
  },
});

/******************************************************
  SIMULATION ENGINE
  The month-by-month simulation applies income, expenses,
  random events, and then runs the decision engine which
  picks an action (save, invest, start business, job_search).
  After decisions we apply investment returns and update
  stress and insolvency state.
******************************************************/

/**
 * runMonth
 * Apply a full month cycle for an agent and return the
 * action chosen by their decision engine.
 */
function runMonth(ai) {
  // 1) Income and expenses
  processIncome(ai);
  processExpenses(ai);

  // 2) Random life / economic events (job loss, unexpected costs)
  randomEvents(ai);

  // 3) Decide on an action using heuristics + randomness
  const action = decisionEngine(ai);

  // 4) Investments grow or shrink slightly
  applyInvestments(ai);

  // 5) Adjust stress and check for bankruptcy
  updateStress(ai);

  if (ai.cash < 0) {
    // Agent is bankrupt and removed from future activity
    ai.alive = false;
  }

  return action;
}

/**
 * processIncome
 * Add predictable (salary) and opportunistic income
 * (side hustle, business revenue) to `ai.cash`.
 */
function processIncome(ai) {
  if (ai.employed) ai.cash += ai.salary; // core monthly income
  if (ai.sideHustle) ai.cash += 300 + Math.random() * 400; // variable side income
  if (ai.business) ai.cash += ai.business.revenue; // ongoing business revenue
}

/**
 * processExpenses
 * Subtract fixed monthly living costs from `ai.cash`.
 */
function processExpenses(ai) {
  ai.cash -= ai.rent + ai.food + ai.otherExpenses;
}

/**
 * randomEvents
 * Introduces low-probability events:
 * - job loss (more likely in recession)
 * - sudden large expense
 * Probabilities are simple and illustrative, not realistic.
 */
function randomEvents(ai) {
  const r = Math.random();

  if (economy.recession && r < 0.08) {
    // Slightly higher chance of job loss during a recession
    ai.employed = false;
    ai.stress += 20;
  } else if (r < 0.03) {
    // non-recession job loss
    ai.employed = false;
    ai.stress += 20;
  } else if (r < 0.06) {
    // unexpected expense (medical, car, etc.)
    ai.cash -= 2000;
  }
}

/**
 * getContext
 * Compute derived context metrics used by the decision engine.
 * - emergencyMonths: how many months the agent could survive on
 *   current cash given current expenses.
 */
function getContext(ai) {
  const expenses = ai.rent + ai.food + ai.otherExpenses;
  return {
    emergencyMonths: ai.cash / expenses,
  };
}

/******************************************************
  SCORING & DECISION ENGINE
  The agent scores possible actions and picks the highest.
  Scores are heuristics based on the context and the agent's
  personality traits (discipline, riskTolerance, etc.).
******************************************************/

/**
 * decisionEngine
 * Evaluate actions with simple scoring rules and execute
 * the chosen action.
 */
function decisionEngine(ai) {
  const context = getContext(ai);

  // Scores reflect desirability; negative means forbidden.
  const scores = {
    // Save: prioritize saving if emergency buffer is low
    save:
      (3 - context.emergencyMonths) * 20 + // more weight when emergency buffer is small
      ai.discipline * 10 - // disciplined agents favor saving
      ai.riskTolerance * 5,

    // Invest only if there's a comfortable emergency buffer
    invest:
      context.emergencyMonths > 3
        ? context.emergencyMonths * 5 + ai.discipline * 10
        : -100,

    // Start business only if enough cash and no existing business
    start_business:
      ai.cash > 5000 && !ai.business ? ai.riskTolerance * 30 : -100,

    // Job search becomes attractive when unemployed
    job_search: !ai.employed ? 100 : -100,
  };

  // Add small randomness so agents behave less predictably
  Object.keys(scores).forEach((k) => {
    scores[k] += (Math.random() - 0.5) * 5;
  });

  // Pick the action with the highest score
  const best = Object.keys(scores).reduce((a, b) =>
    scores[a] > scores[b] ? a : b,
  );

  executeAction(ai, best);
  return best;
}

/**
 * executeAction
 * Apply the immediate effects of a chosen action. Effects are
 * simplified: invest moves cash to investments, starting a
 * business costs a fixed amount and creates a revenue stream,
 * job_search restores employment.
 */
function executeAction(ai, action) {
  switch (action) {
    case "invest":
      // invest 20% of current cash (simple allocation rule)
      const amount = ai.cash * 0.2;
      ai.investments += amount;
      ai.cash -= amount;
      break;
    case "start_business":
      // one-time startup cost with a fixed revenue (toy model)
      ai.cash -= 5000;
      ai.business = { revenue: 1000 };
      break;
    case "job_search":
      // find work and receive salary again
      ai.employed = true;
      break;
  }
}

/**
 * applyInvestments
 * Apply a small random return (positive or negative) to investments
 * to simulate market fluctuations.
 */
function applyInvestments(ai) {
  const returnRate = (Math.random() - 0.5) * 0.1; // -5%..+5% roughly
  ai.investments *= 1 + returnRate;
}

/**
 * updateStress
 * Increase stress if the agent can't cover rent, then apply a
 * small monthly recovery. Stress is clamped at 0 as a floor.
 */
function updateStress(ai) {
  if (ai.cash < ai.rent) ai.stress += 15;
  ai.stress = Math.max(0, ai.stress - 5); // small recovery each month
}

/******************************************************
  VISUAL UPDATES
  Update chart, scoreboard, stress bar, and action feed each
  month to reflect latest agent states and actions.
******************************************************/

function updateUI(actions) {
  // Add current month label
  chart.data.labels.push("M" + currentMonth);

  // Push net worth (cash + investments) for each agent dataset
  agents.forEach((ai, i) => {
    chart.data.datasets[i].data.push(ai.cash + ai.investments);
  });

  chart.update();

  // Scoreboard: simple list of agent net worths
  const scoreboard = document.getElementById("scoreboard");
  scoreboard.innerHTML =
    "<h3>Scoreboard</h3>" +
    agents
      .map(
        (ai) =>
          `<div style="color:${ai.color}">
        ${ai.name}: $${Math.round(ai.cash + ai.investments)}
      </div>`,
      )
      .join("");

  // Stress Panel: a visual bar for each agent's stress (0-100)
  const stressPanel = document.getElementById("stressPanel");
  stressPanel.innerHTML =
    "<h3>Stress Levels</h3>" +
    agents
      .map(
        (ai) =>
          `<div>${ai.name}
        <div class="stress-bar">
          <div class="stress-fill" 
            style="width:${Math.min(ai.stress, 100)}%">
          </div>
        </div>
      </div>`,
      )
      .join("");

  // Action Feed: append the actions taken this month
  const feed = document.getElementById("actionFeed");
  feed.innerHTML += `
    <div>
      <strong>Month ${currentMonth}</strong><br>
      ${agents.map((ai) => `${ai.name}: ${actions[ai.name]}`).join("<br>")}
      <hr>
    </div>
  `;
}

/******************************************************
  ANIMATION LOOP
  simulateMonth runs every ~800ms until TOTAL_MONTHS is reached.
  Each tick advances time, runs each agent (if alive), updates
  the UI, and schedules the next tick.
******************************************************/

function simulateMonth() {
  if (currentMonth >= TOTAL_MONTHS) return; // end condition

  currentMonth++;

  const actions = {};

  agents.forEach((ai) => {
    if (ai.alive) {
      actions[ai.name] = runMonth(ai);
    } else {
      actions[ai.name] = "BANKRUPT"; // display placeholder
    }
  });

  updateUI(actions);

  // schedule next month iteration
  setTimeout(simulateMonth, 800);
}

// kick off the simulation
simulateMonth();
