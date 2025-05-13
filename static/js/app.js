$(async function() {
  const resp = await fetch('/api/data');
  const data = await resp.json();

  // สร้างการ์ดข้อมูล
  const cards = $('#info-cards');
  data.forEach(d => {
    cards.append(`
      <div class="card">
        <h3>${d.province}</h3>
        <p>ลม: ${d.wind_speed} กม./ชม.</p>
        <p>อุณหภูมิ: ${d.temperature}°C</p>
        <p>ความชื้น: ${d.humidity}%</p>
        <p>PM2.5: ${d.pm25}</p>
        <p>พื้นที่เสี่ยง: ${d.risk_areas}</p>
      </div>`);
  });

  // กราฟ PM2.5
  new Chart($('#pmChart'), {
    type: 'bar',
    data: {
      labels: data.map(d=>d.province),
      datasets: [{ label:'PM2.5', data:data.map(d=>d.pm25), backgroundColor:'#e74c3c' }]
    }
  });

  // ตาราง DataTable
  $('#dataTable').DataTable({
    data, columns:[
      {title:'จังหวัด',data:'province'},
      {title:'ลม',data:'wind_speed'},
      {title:'อุณหภูมิ',data:'temperature'},
      {title:'ความชื้น',data:'humidity'},
      {title:'PM2.5',data:'pm25'},
      {title:'พื้นที่เสี่ยง',data:'risk_areas'}
    ]
  });

  // แผนที่ Leaflet
  const map = L.map('map').setView([18.7,98.98],6);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    attribution:'&copy; OSM'
  }).addTo(map);
  data.forEach(d=>{
    L.circle([d.lat,d.lon],{radius:8000,color:'red',fillOpacity:0.5})
     .addTo(map).bindPopup(`${d.province}<br>PM2.5: ${d.pm25}`);
  });
});
