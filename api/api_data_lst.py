from flask import *
from decouple import config
from mysql.connector import pooling

api_data_lst=Blueprint("api_data_lst", __name__, template_folder="templates")

trip_pool=pooling.MySQLConnectionPool(
	pool_name='trip_pool',
	pool_size=1,
	pool_reset_session=True,
	host=config('host'),
	user=config('user'),
	password=config('password'),
	database=config('database')
)

@api_data_lst.route("/api/attractions")
def getDataList():
	cnx=trip_pool.get_connection()
	data_cursor=cnx.cursor(buffered=False, dictionary=True)

	page=int(request.args.get("page", 0))
	keyword=request.args.get("keyword", "")

	def query(page, keyword): # 查詢資料 
		if keyword == "":   # 只用 page 搜尋
			# sql="SELECT * FROM `tpe-attractions` WHERE id BETWEEN %s and %s" # 不要用 id 搜尋範圍
			sql="SELECT * FROM `tpe-attractions` LIMIT %s, %s"
			val=(page*12, 12)
		else:  # 只用 keyword 搜尋
			# sql="SELECT * FROM `tpe-attractions` WHERE name LIKE %s"
			# val=("%"+keyword+"%", )
			sql="SELECT * FROM `tpe-attractions` WHERE name LIKE %s LIMIT %s, %s"
			val=("%"+keyword+"%", page*12, 12)
		data_cursor.execute(sql, val)
		result=data_cursor.fetchall()
		print(result[0])
		print(type(result[0]))
		for i in range(len(result)):  # 把 images 的 value 從 字串 轉回 list
			temp_images_val=json.loads(result[i]['images'])
			print(temp_images_val)
			print(type(temp_images_val))
			result[i]['images']=temp_images_val
		return result

	def response_data(page, data_lst, last_page): # response 資料格式
		if page > last_page-1:
			response={
				"nextPage":None,
				"data":data_lst
			}
		else:
			response={
				"nextPage":page+1,
				"data":data_lst
			}
		return response

	def error(msg): # 錯誤
		return {
			"error":True,
			"message":msg
		}

	result=query(page, keyword)

	print("page", page)
	print("keyword", keyword)
	print(f"page={page} 的資料總數", len(result))

	try:
		if result == []:  # 搜尋不到資料即錯誤
			status=400
			data_result=error("查無相關景點資料。")
		else:
			if page is not None and keyword == "":  # 只用 page 搜尋的資料取得邏輯
				status=200
				data_cursor.execute("SELECT COUNT(*) FROM `tpe-attractions`")
				last_id=data_cursor.fetchone()
				print("符合條件的資料總數", last_id['COUNT(*)'])
				last_page=last_id['COUNT(*)']/12			
			else:  # 用 keyword 搜尋的資料取得邏輯 page 會變成對應的頁數
				status=200
				data_cursor.execute("SELECT COUNT(*) FROM `tpe-attractions` WHERE name LIKE %s", (f"%{keyword}%", ))
				last_id=data_cursor.fetchone()
				print("符合條件的資料總數", last_id['COUNT(*)'])
				last_page=last_id['COUNT(*)']/12

			data_result=response_data(page, result, last_page)

	except 500:
		status=500
		data_result=error("伺服器內部錯誤")

	data_cursor.close()
	cnx.close()
	
	final_result=jsonify(data_result) # 可能不需要
	response=make_response(data_result, status, {"content-type":"application/json"})
	return response