from decouple import config
from mysql.connector import pooling

def connect():
	return pooling.MySQLConnectionPool(
		pool_name="trip_pool",
		pool_size=10,
		pool_reset_session=True,
		host=config('host'),
		user=config('user'),
		password=config('password'),
		database=config('database')
	)