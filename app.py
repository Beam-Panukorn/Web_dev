// Chiang Mai Wildfire Dashboard in React (Tailwind + Mapbox + Chart.js)
// Basic structure with example components

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectItem } from "@/components/ui/select";
import { Line, Bar } from "react-chartjs-2";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = "your_mapbox_token";

export default function WildfireDashboard() {
  const [selectedDistrict, setSelectedDistrict] = useState("เมืองเชียงใหม่");
  const [weatherData, setWeatherData] = useState([]);
  const [firePoints, setFirePoints] = useState([]);
  const [map, setMap] = useState(null);
  const districts = ["เมืองเชียงใหม่", "แม่ริม", "จอมทอง", "ฝาง", "สันทราย", "แม่แตง"];

  useEffect(() => {
    fetch("/api/weather")
      .then((res) => res.json())
      .then(setWeatherData);

    fetch("/api/firepoints")
      .then((res) => res.json())
      .then((data) => {
        setFirePoints(data);
        if (map) {
          data.forEach((point) => {
            new mapboxgl.Marker({ color: "red" })
              .setLngLat([point.lon, point.lat])
              .addTo(map);
          });
        }
      });
  }, [map]);

  useEffect(() => {
    const initializeMap = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [99.0, 18.8],
      zoom: 7,
    });
    setMap(initializeMap);
    return () => initializeMap.remove();
  }, []);

  const filteredWeather = weatherData.find((d) => d.district === selectedDistrict);

  const barData = {
    labels: weatherData.map((d) => d.district),
    datasets: [
      {
        label: "อุณหภูมิ (°C)",
        data: weatherData.map((d) => d.temp),
        backgroundColor: "#fb923c",
      },
      {
        label: "ความชื้น (%)",
        data: weatherData.map((d) => d.humidity),
        backgroundColor: "#38bdf8",
      },
    ],
  };

  const trendData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "แนวโน้มจุดไฟป่า",
        data: [2, 5, 3, 6, 7, 4, 8],
        fill: false,
        borderColor: "#ef4444",
      },
    ],
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-3xl font-bold text-center">🔥 แดชบอร์ดไฟป่า จังหวัดเชียงใหม่</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent>
            <Select onValueChange={setSelectedDistrict} defaultValue={selectedDistrict}>
              {districts.map((dist) => (
                <SelectItem key={dist} value={dist}>
                  {dist}
                </SelectItem>
              ))}
            </Select>
            <p className="mt-2 text-sm text-gray-500">เลือกอำเภอเพื่อตรวจสอบสภาพอากาศ</p>
            {filteredWeather && (
              <div className="mt-4 space-y-2">
                <p>🌡 อุณหภูมิ: {filteredWeather.temp} °C</p>
                <p>💧 ความชื้น: {filteredWeather.humidity} %</p>
                <p>💨 ลม: {filteredWeather.wind} m/s</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardContent>
            <div className="h-96" id="map" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold">📈 แนวโน้มจุดไฟป่า (7 วัน)</h2>
            <Line data={trendData} />
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold">📊 เปรียบเทียบอุณหภูมิและความชื้น</h2>
            <Bar data={barData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
