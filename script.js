// Uncomment this once before submission to start fresh, then remove it
// localStorage.clear();

console.log("JS is loaded!");

// Elements
const form = document.getElementById("checkInForm");
const attendeeNameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const greeting = document.getElementById("greeting");
const attendeeCount = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const waterCount = document.getElementById("waterCount");
const zeroCount = document.getElementById("zeroCount");
const powerCount = document.getElementById("powerCount");
const attendeeListDiv = document.getElementById("attendeeList");

// Counters & Data
let totalCount = parseInt(localStorage.getItem("totalCount")) || 0;
let teamCounts = JSON.parse(localStorage.getItem("teamCounts")) || {
  water: 0,
  zero: 0,
  power: 0
};
let attendees = JSON.parse(localStorage.getItem("attendees")) || [];
const maxGoal = 50;
let celebrationShown = false; // Track if celebration was shown

// Team labels
const teamNames = {
  water: "Team Water Wise 🌊",
  zero: "Team Net Zero 🌿",
  power: "Team Renewables ⚡"
};

// Update UI from saved data on page load
function updateUI() {
  attendeeCount.textContent = totalCount;
  waterCount.textContent = teamCounts.water;
  zeroCount.textContent = teamCounts.zero;
  powerCount.textContent = teamCounts.power;
  progressBar.style.width = (totalCount / maxGoal) * 100 + "%";
  renderAttendeeList();
}
updateUI();

// Render attendee list
function renderAttendeeList() {
  attendeeListDiv.innerHTML = attendees
    .map(a => `<p>${a.name} - ${a.team}</p>`)
    .join("");
}

// Save data to localStorage
function saveData() {
  localStorage.setItem("totalCount", totalCount);
  localStorage.setItem("teamCounts", JSON.stringify(teamCounts));
  localStorage.setItem("attendees", JSON.stringify(attendees));
}

// Celebration banner function
function showCelebration(winningTeam) {
  const banner = document.getElementById("celebrationBanner");
  const teamSpan = document.getElementById("winningTeam");

  teamSpan.textContent = winningTeam;
  banner.style.display = "block";
  banner.scrollIntoView({ behavior: "smooth" });

  // Confetti effect
  for (let i = 0; i < 100; i++) {
    const confetti = document.createElement("div");
    confetti.innerHTML = "🎉";
    confetti.style.position = "fixed";
    confetti.style.left = Math.random() * 100 + "vw";
    confetti.style.top = "-10px";
    confetti.style.fontSize = "24px";
    confetti.style.animation = `fall ${Math.random() * 3 + 2}s linear`;
    document.body.appendChild(confetti);

    setTimeout(() => confetti.remove(), 5000);
  }

  // Auto-hide banner after 5 seconds
  setTimeout(() => {
    banner.style.display = "none";
  }, 5000);
}

// Get winning team
function getWinningTeam() {
  let maxCount = 0;
  let winner = "";
  for (let team in teamCounts) {
    if (teamCounts[team] > maxCount) {
      maxCount = teamCounts[team];
      winner = teamNames[team];
    }
  }
  return winner || "No team yet";
}

// Form submit
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = attendeeNameInput.value.trim();
  const team = teamSelect.value;

  if (!name || !team) return;

  // Update counts
  totalCount++;
  teamCounts[team]++;
  attendees.push({ name, team: teamNames[team] });

  // Save data
  saveData();

  // Update UI
  updateUI();

  // Show greeting
  greeting.textContent = `Welcome, ${name}! You're on ${teamNames[team]}.`;
  greeting.classList.add("success-message");
  greeting.style.display = "block";

  // Trigger celebration once at exactly 50
  if (totalCount === maxGoal && !celebrationShown) {
    showCelebration(getWinningTeam());
    celebrationShown = true;
  }

  // Reset form
  form.reset();
});
