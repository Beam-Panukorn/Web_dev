from flask import Flask, jsonify, render_template
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

def generate_data():
    provinces = ['เชียงใหม่','ลำปาง','ลำพูน','เชียงราย','น่าน']
    data = []
    for prov in provinces:
        data.append({
            'province': prov,
            'wind_speed': round(random.uniform(5,20),1),
            'temperature': random.randint(30,40),
            'humidity': random.randint(10,30),
            'pm25': random.randint(50,150),
            'risk_areas': random.randint(1,5),
            'lat': random.uniform(17.5,19.5),
            'lon': random.uniform(98.0,100.0)
        })
    return data

@app.route('/api/data')
def get_data():
    return jsonify(generate_data())

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
