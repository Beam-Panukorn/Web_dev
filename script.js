// -----------------------------
// 📌 Tab Switching
// -----------------------------
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab).classList.add('active');
  });
});

// -----------------------------
// 🔔 Green Alert Toggle
// -----------------------------
document.getElementById('greenAlertBtn').addEventListener('click', () => {
  const alertBox = document.getElementById('greenAlert');
  alertBox.style.display = alertBox.style.display === 'block' ? 'none' : 'block';
});

// -----------------------------
// 📊 Chart Initialization
// -----------------------------
new Chart(document.getElementById('tempChartRed'), {
  type: 'line',
  data: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [{
      label: 'Temp (°C)',
      data: [36, 37, 39, 40, 39],
      borderColor: 'red',
      fill: false
    }]
  }
});

new Chart(document.getElementById('windChartRed'), {
  type: 'bar',
  data: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [{
      label: 'Wind (km/h)',
      data: [10, 12, 18, 22, 20],
      backgroundColor: 'blue'
    }]
  }
});

new Chart(document.getElementById('humidityChartGreen'), {
  type: 'line',
  data: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [{
      label: 'Humidity (%)',
      data: [45, 40, 35, 32, 30],
      borderColor: 'green',
      fill: false
    }]
  }
});

new Chart(document.getElementById('rainfallChartGreen'), {
  type: 'bar',
  data: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [{
      label: 'Rainfall (mm)',
      data: [5, 3, 2, 1, 0],
      backgroundColor: 'lightblue'
    }]
  }
});

// -----------------------------
// 🗺️ Red Zone Map (Leaflet)
// -----------------------------
const redMap = L.map('redMap').setView([18.8, 99], 7);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(redMap);

L.circle([18.8, 98.9], {
  radius: 10000,
  color: 'red'
}).addTo(redMap).bindPopup("Chiang Mai: Critical Fire Risk");

L.circle([19.2, 99.5], {
  radius: 10000,
  color: 'orange'
}).addTo(redMap).bindPopup("Chiang Rai: High Fire Risk");

// -----------------------------
// 🌿 Green Zone Map (Leaflet)
// -----------------------------
const greenMap = L.map('greenMap').setView([18.8, 99], 7);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(greenMap);

const greenZones = [
  { coords: [19.0, 99.2], level: 'B', province: 'Lampang' },
  { coords: [18.7, 98.9], level: 'D', province: 'Lamphun' },
  { coords: [18.9, 99.4], level: 'C', province: 'Phayao' }
];

greenZones.forEach(z => {
  const color = 
    z.level === 'A' ? 'green' :
    z.level === 'B' ? 'limegreen' :
    z.level === 'C' ? 'yellow' : 'orange';

  L.circle(z.coords, {
    color,
    radius: 9000
  }).addTo(greenMap).bindPopup(${z.province}: Level ${z.level});

  if (['C', 'D', 'E', 'F'].includes(z.level)) {
    document.getElementById('greenAlert').innerHTML += 
      <p><strong>⚠️ ${z.province}</strong> - Level ${z.level} risk! Monitor and patrol frequently.</p>
    ;
    document.getElementById('greenAlert').style.display = 'block';
  }
});
