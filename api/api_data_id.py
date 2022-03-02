from flask import *
from decouple import config
from mysql.connector import pooling

api_data_id=Blueprint("api_data_id", __name__, template_folder="templates")

trip_pool=pooling.MySQLConnectionPool(
	pool_name='trip_pool',
	pool_size=10,
	pool_reset_session=True,
	host=config('host'),
	user=config('user'),
	password=config('password'),
	database=config('database')
)

@api_data_id.route("/api/attraction/<attractionId>") # 根據景點編號取得景點資料
def getData(attractionId):
    cnx=trip_pool.get_connection()
    data_cursor=cnx.cursor(buffered=False, dictionary=True)
    data_cursor.execute("SELECT * FROM `tpe-attractions` WHERE id=%s", (attractionId,))
    result=data_cursor.fetchone()
    temp_images_val=json.loads(result['images']) # 把 images 的 value 從 字串 轉回 list
    result.pop('images', None)
    result['images']=temp_images_val
    data_cursor.close()
    try:
        if result != None:
            result={
                "data":result
            }
            status=200
        # elif result == None: # 景點編號不正確
        else:
            result={
                "error": True,
                "message": "景點編號不正確"
            }
            status=400
    except 500: # 伺服器內部錯誤
        final_result={
			"error":True,
			"message":"伺服器內部錯誤"
		}
        status=500

    cnx.close()
    
    print(result)

    final_result=jsonify(result)
    response=make_response(final_result, status, {"content-type":"application/json"})
    return response