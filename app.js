let fleet = JSON.parse(localStorage.getItem('techlog_fleet')) || {
  "F-GZHX": { flightNo: "AF123", route: "CDG-JFK", fuelDep: 45000, defects: [], cabin: [] }
};

let currentTail = Object.keys(fleet)[0] || "";

function init() {
  updateFleetDropdown();
  loadCurrentAircraftData();
}

function updateFleetDropdown() {
  const select = document.getElementById('aircraftSelect');
  select.innerHTML = '';
  Object.keys(fleet).forEach(tail => {
    const opt = document.createElement('option');
    opt.value = tail;
    opt.textContent = tail;
    if (tail === currentTail) opt.selected = true;
    select.appendChild(opt);
  });
}

function addAircraft() {
  const tail = prompt("Entrez l'immatriculation du nouvel appareil (ex: F-GZHN) :");
  if (tail && !fleet[tail]) {
    fleet[tail] = { flightNo: "", route: "", fuelDep: 0, defects: [], cabin: [] };
    currentTail = tail;
    saveFleet();
    updateFleetDropdown();
    loadCurrentAircraftData();
  }
}

function deleteAircraft() {
  if (confirm(`Supprimer l'appareil ${currentTail} ?`)) {
    delete fleet[currentTail];
    currentTail = Object.keys(fleet)[0] || "";
    saveFleet();
    updateFleetDropdown();
    loadCurrentAircraftData();
  }
}

function changeAircraft() {
  saveCurrentAircraftData();
  currentTail = document.getElementById('aircraftSelect').value;
  loadCurrentAircraftData();
}

function saveCurrentAircraftData() {
  if (!currentTail) return;
  fleet[currentTail].flightNo = document.getElementById('flightNo').value;
  fleet[currentTail].route = document.getElementById('route').value;
  fleet[currentTail].flightDate = document.getElementById('flightDate').value;
  fleet[currentTail].fuelDep = document.getElementById('fuelDep').value;
  fleet[currentTail].fuelArr = document.getElementById('fuelArr').value;
  fleet[currentTail].fuelUplift = document.getElementById('fuelUplift').value;
  fleet[currentTail].maintNotes = document.getElementById('maintNotes').value;
  saveFleet();
  alert(`Données sauvegardées pour ${currentTail}`);
}

function loadCurrentAircraftData() {
  if (!currentTail || !fleet[currentTail]) return;
  const data = fleet[currentTail];
  document.getElementById('flightNo').value = data.flightNo || '';
  document.getElementById('route').value = data.route || '';
  document.getElementById('flightDate').value = data.flightDate || '';
  document.getElementById('fuelDep').value = data.fuelDep || '';
  document.getElementById('fuelArr').value = data.fuelArr || '';
  document.getElementById('fuelUplift').value = data.fuelUplift || '';
  document.getElementById('maintNotes').value = data.maintNotes || '';
  renderDefects();
  renderCabin();
}

function addDefect() {
  const desc = document.getElementById('defectDesc').value;
  const mel = document.getElementById('melRef').value;
  if (desc) {
    fleet[currentTail].defects = fleet[currentTail].defects || [];
    fleet[currentTail].defects.push({ desc, mel });
    document.getElementById('defectDesc').value = '';
    document.getElementById('melRef').value = '';
    saveFleet();
    renderDefects();
  }
}

function renderDefects() {
  const list = document.getElementById('defectsList');
  list.innerHTML = '';
  (fleet[currentTail]?.defects || []).forEach((item, index) => {
    list.innerHTML += `<li><strong>${item.desc}</strong> (MEL: ${item.mel || 'N/A'}) <button onclick="removeDefect(${index})">❌</button></li>`;
  });
}

function removeDefect(index) {
  fleet[currentTail].defects.splice(index, 1);
  saveFleet();
  renderDefects();
}

function addCabinDefect() {
  const text = document.getElementById('cabinDefectText').value;
  if (text) {
    fleet[currentTail].cabin = fleet[currentTail].cabin || [];
    fleet[currentTail].cabin.push(text);
    document.getElementById('cabinDefectText').value = '';
    saveFleet();
    renderCabin();
  }
}

function renderCabin() {
  const list = document.getElementById('cabinList');
  list.innerHTML = '';
  (fleet[currentTail]?.cabin || []).forEach((item, index) => {
    list.innerHTML += `<li>${item} <button onclick="removeCabin(${index})">❌</button></li>`;
  });
}

function removeCabin(index) {
  fleet[currentTail].cabin.splice(index, 1);
  saveFleet();
  renderCabin();
}

function saveFleet() {
  localStorage.setItem('techlog_fleet', JSON.stringify(fleet));
}

function showTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
  event.target.classList.add('active');
}

window.onload = init;
