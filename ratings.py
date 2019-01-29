import sqlite3
conn = sqlite3.connect('neighborhood.db')
cur = conn.cursor()


def allRatings():
	return cur.execute('SELECT * FROM ratings')

	
def insertRating(name, rating):
  return cur.execute('INSERT INTO ratings VALUES (?, ?)', (name,  rating))