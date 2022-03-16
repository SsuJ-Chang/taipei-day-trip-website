from flask import *
import api.connector as connector

api_data_id=Blueprint("api_data_id", __name__, template_folder="templates")

trip_pool=connector.connect()

@api_data_id.route("/api/attraction/<attractionId>") # 根據景點編號取得景點資料
def getData(attractionId):
    cnx=trip_pool.get_connection()
    data_cursor=cnx.cursor(buffered=False, dictionary=True)
    data_cursor.execute("SELECT * FROM `tpe-attractions` WHERE id=%s", (attractionId,))
    result=data_cursor.fetchone()
    print(result)
    data_cursor.close()
    try:
        if result != None:
            temp_images_val=json.loads(result['images']) # 把 images 的 value 從 字串 轉回 list
            result['images']=temp_images_val
            result={
                "data":result
            }
            status=200

            print(f"查到 id={result['data']['id']} 的資料", result['data']['name'])
        # elif result == None: # 景點編號不正確
        else:
            result={
                "error": True,
                "message": "景點編號不正確"
            }
            status=400
    except 500: # 伺服器內部錯誤
        result={
			"error":True,
			"message":"伺服器內部錯誤"
		}
        status=500

    cnx.close()

    # final_result=jsonify(result)
    response=make_response(result, status, {"content-type":"application/json"})
    return response