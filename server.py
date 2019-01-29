from flask import Flask, request, url_for, redirect
import crime
import json
import ratings
import sqlite3


app = Flask(__name__, static_url_path='')


@app.route('/')
def html_file():
  return app.send_static_file('index.html')

	
@app.route('/map.js')
def js_file():
  return app.send_static_file('map.js')


@app.route('/crime')
def get_crime():
  return crime.get_crime_data('https://data.buffalony.gov/resource/d6g9-xbgu.json')


@app.route('/handle_ratings', methods=['GET', 'POST'])
def handle_ratings():
	conn = sqlite3.connect('neighborhood.db')
	cur = conn.cursor()
	name = request.form['neighborhood']
	rating = request.form['numberRating']
	cur.execute('INSERT INTO ratings VALUES (?, ?)', (name,  rating))
	conn.commit()
	conn.close()
	return redirect(url_for('html_file'))


@app.route('/get_ratings', methods=['GET'])
def get_ratings():
	conn = sqlite3.connect('neighborhood.db')
	cur = conn.cursor()
	ratings_list = cur.execute('SELECT * FROM ratings').fetchall()
	conn.commit()
	conn.close()
	return json.dumps(ratings_list)

	
if __name__ == '__main__':
	app.run(host='0.0.0.0')