from ast import And
from flask import *
from decouple import config
from mysql.connector import pooling
import math

api_data_lst=Blueprint("api_data_lst", __name__, template_folder="templates")

trip_pool=pooling.MySQLConnectionPool(
	pool_name='trip_pool',
	pool_size=10,
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
			sql="SELECT * FROM `tpe-attractions` WHERE id BETWEEN %s and %s"
			val=(page*12+1, page*12+12)
		else:  # 只用 keyword 搜尋
			sql="SELECT * FROM `tpe-attractions` WHERE name LIKE %s"
			val=("%"+keyword+"%", )
		data_cursor.execute(sql, val)
		result=data_cursor.fetchall()
		for i in range(len(result)):  # 把 images 的 value 從 字串 轉回 list
			temp_images_val=json.loads(result[i]['images'])
			result[i].pop('images', None)
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

	data_lst=[]
	result=query(page, keyword)

	print("page", page)
	print("keyword", keyword)
	print("從資料庫查到的資料總數", len(result))
	print(result)

	try:
		if result == []:  # 搜尋不到資料即錯誤
			status=500
			data_result=error("找不到資料")
		else:
			if page is not None and keyword == "":  # 只用 page 搜尋的資料取得邏輯
				status=200
				for datas in result:
					data_lst.append(datas)
				data_cursor.execute("SELECT id FROM `tpe-attractions` ORDER BY id DESC LIMIT 1")
				last_id=data_cursor.fetchone()
				last_page=last_id['id']/12			
			else:  # 用 keyword 搜尋的資料取得邏輯 page 會變成對應的頁數
				if page > len(result)/12:  # page 超過總數
					status=500
					data_result=error("伺服器內部錯誤")
				else:
					status=200
					if len(result) <= 12:  # 總資料 <= 12 的頁面資料取得
						last_page=0
						for datas in result:
							data_lst.append(datas)
					else:  # 總資料 >12 的頁面資料取得
						if page+1 < len(result)/12:  # 非最後一頁的資料
							last_page=page+1
							for i in range(page*12, page*12+12):
								data_lst.append(result[i])
						else:  # 最後一頁的資料
							last_page=0
							for i in range(page*12, len(result)):
								data_lst.append(result[i])

			data_result=response_data(page, data_lst, last_page)
			print(type(data_result['data'][0]))
	except 500:
		status=500
		data_result=data_result=error("伺服器內部錯誤")

	data_cursor.close()
	cnx.close()
	
	final_result=jsonify(data_result)
	response=make_response(final_result, status, {"content-type":"application/json"})
	return response