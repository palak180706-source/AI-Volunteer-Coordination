// Mock Data
const missions = [
  { id: 0, title: "Flash Flood - Sector 4", type: "Urgent", needs: ["Medical", "Water Rescue", "Logistics"] },
  { id: 1, title: "Forest Fire Response", type: "Pending", needs: ["SAR", "Evacuation", "Truck Driving"] },
  { id: 2, title: "Food Security Drive", type: "Planned", needs: ["Logistics", "Distribution"] }
];

const volunteers = [
  { id: 1, name: "Sarah Chen", skills: ["Medical", "Logistics"], proximity: 95, availability: 100, experience: 80, bio: "Certified Nurse, 3 missions completed." },
  { id: 2, name: "Marcus Thorne", skills: ["Water Rescue", "SAR"], proximity: 40, availability: 90, experience: 95, bio: "Expert diver, 12 years in SAR." },
  { id: 3, name: "Elena Rodriguez", skills: ["Logistics", "Distribution"], proximity: 85, availability: 70, experience: 60, bio: "Local warehouse manager." },
  { id: 4, name: "David Kim", skills: ["Medical", "Communication"], proximity: 20, availability: 100, experience: 40, bio: "Paramedic student, ready to help." },
  { id: 5, name: "Jordan Smith", skills: ["SAR", "Medical"], proximity: 70, availability: 85, experience: 75, bio: "Former firefighter." },
  { id: 6, name: "Aisha Khan", skills: ["Logistics", "Truck Driving"], proximity: 60, availability: 95, experience: 85, bio: "CDL License, supply chain expert." }
];

let weights = {
  proximity: 30,
  skill: 40,
  availability: 20,
  experience: 10
};

let currentMissionIndex = 0;

// Scoring Logic
function calculateMatchScore(volunteer, mission, currentWeights) {
  // Skill match calculation
  const matchingSkills = volunteer.skills.filter(skill => mission.needs.includes(skill));
  const skillScore = (matchingSkills.length / mission.needs.length) * 100;

  // Weighted formula
  const score = (
    (volunteer.proximity * (currentWeights.proximity / 100)) +
    (skillScore * (currentWeights.skill / 100)) +
    (volunteer.availability * (currentWeights.availability / 100)) +
    (volunteer.experience * (currentWeights.experience / 100))
  );

  return Math.round(score);
}

// UI Rendering
function renderVolunteers() {
  const grid = document.getElementById('volunteerGrid');
  const hero = document.getElementById('bestMatchHero');
  const mission = missions[currentMissionIndex];
  const helpTypeFilter = document.getElementById('input-help-type').value;
  
  // Filter based on selected help type
  let filteredVolunteers = volunteers;
  if (helpTypeFilter !== 'All') {
    filteredVolunteers = volunteers.filter(v => v.skills.includes(helpTypeFilter));
  }

  // Calculate scores and sort
  const scoredVolunteers = filteredVolunteers.map(v => ({
    ...v,
    score: calculateMatchScore(v, mission, weights)
  })).sort((a, b) => b.score - a.score);

  grid.innerHTML = '';
  hero.innerHTML = '';

  if (scoredVolunteers.length > 0) {
    // Spotlight the Best Match
    const best = scoredVolunteers[0];
    hero.innerHTML = createVolunteerCard(best, 0, true);
    
    // Fill the rest in the grid
    scoredVolunteers.slice(1).forEach((v, index) => {
      grid.innerHTML += createVolunteerCard(v, index + 1, false);
    });
  } else {
    grid.innerHTML = '<p style="color: var(--text-dim); text-align: center; grid-column: 1/-1;">No volunteers matching this specific help type found in Sector 4.</p>';
  }

  // Update Stats
  const analyzedBase = 1240; // Static base for "hackathon" effect
  document.getElementById('analyzedCount').textContent = (analyzedBase + (Math.random() * 50)).toFixed(0);
}

function createVolunteerCard(v, index, isHero) {
  return `
    <div class="volunteer-card" style="animation-delay: ${index * 0.1}s; --score: ${v.score}">
      ${isHero ? '<div class="best-badge">BEST AI MATCH</div>' : ''}
      <div class="match-score">
        <div class="match-score-inner">${v.score}%</div>
      </div>
      <div class="v-info">
        <h3>${v.name}</h3>
        <p>${v.bio}</p>
        <div class="skill-tags">
          ${v.skills.map(s => `<span class="skill-tag">${s}</span>`).join('')}
        </div>
        <div style="margin-top: 15px; font-size: 11px; display: flex; gap: 10px;">
          <span style="color: ${v.proximity > 70 ? 'var(--accent-secondary)' : 'var(--text-dim)'}">📍 Proximity: ${v.proximity}%</span>
          <span style="color: var(--text-dim)">⭐ Exp: ${v.experience}%</span>
        </div>
      </div>
    </div>
  `;
}

function updateFilters() {
  renderVolunteers();
}

function selectMission(index) {
  currentMissionIndex = index;
  document.querySelectorAll('.mission-card').forEach((card, i) => {
    card.classList.toggle('active', i === index);
  });
  
  // Update location input based on mission (mock logic)
  const locations = ["Sector 4 Core", "Foothills Range", "Downtown Hub"];
  document.getElementById('input-location').value = locations[index] || "Global Zone";
  
  renderVolunteers();
}

// Weight Control Logic
function initWeightControls() {
  const controls = [
    { id: 'proximity', label: 'label-proximity' },
    { id: 'skill', label: 'label-skill' },
    { id: 'availability', label: 'label-availability' },
    { id: 'experience', label: 'label-experience' }
  ];
  
  controls.forEach(ctrl => {
    const input = document.getElementById(`weight-${ctrl.id}`);
    const label = document.getElementById(ctrl.label);
    
    input.addEventListener('input', (e) => {
      weights[ctrl.id] = parseInt(e.target.value);
      label.textContent = `${weights[ctrl.id]}%`;
      renderVolunteers();
    });
  });
}

// Global scope for events
window.selectMission = selectMission;
window.updateFilters = updateFilters;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initWeightControls();
  renderVolunteers();
  
  // Add some entrance animation sugar
  document.querySelectorAll('.stat-card').forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(10px)';
    setTimeout(() => {
      card.style.transition = 'all 0.5s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 100 * i);
  });
});
