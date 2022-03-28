from flask import *
import api.connector as connector
import jwt
from decouple import config

api_booking=Blueprint("api_booking", __name__, template_folder="templates")

trip_pool=connector.connect()

key=config('JWT')

@api_booking.route("/api/booking", methods=["POST"])
def booking():
    JWT_cookie=request.cookies.get("JWT") # 取得前端進來的 cookie
    if JWT_cookie is None:
        response=make_response({"error": True, "message": "未登入系統，拒絕存取"}, 403)
    else:
        try:
            JWT_decode=jwt.decode(JWT_cookie, key, algorithms=['HS256'])
            cnx=trip_pool.get_connection()
            booking_cursor=cnx.cursor(buffered=True, dictionary=True)
            # 確認是否已有訂單
            booking_cursor.execute("SELECT * FROM booking WHERE member_id=%s", (JWT_decode['id'], ))
            check_booking=booking_cursor.fetchone()
            booking_data=request.json
            print("訂單資料", booking_data)
            if booking_data['date'] == "undefined" or booking_data['time'] == "undefined": # 資料輸入不完整
                response=make_response({"error": True, "message": "訂單建立失敗，請選擇訂單內容。"}, 400)
            elif check_booking is None: # 新增訂單
                booking_cursor.execute("INSERT INTO booking (member_id, attraction_id, date, time, price) VALUES (%s, %s, %s, %s, %s)", (JWT_decode['id'], booking_data['attractionId'], booking_data['date'], booking_data['time'], booking_data['price']))
                cnx.commit()
                response=make_response({"ok": True}, 200)
            else: # 已有訂單更新資料
                booking_cursor.execute("UPDATE booking SET attraction_id=%s, date=%s, time=%s, price=%s WHERE member_id=%s", (booking_data['attractionId'], booking_data['date'], booking_data['time'], booking_data['price'], JWT_decode['id']))
                cnx.commit()
                response=make_response({"ok": True}, 200)
        except:
            response=make_response({"error": True, "message": "伺服器內部錯誤"}, 500)
        finally:
            booking_cursor.close()
            cnx.close()
    return response        

@api_booking.route("/api/booking", methods=["GET"])
def get_booking():
    JWT_cookie=request.cookies.get("JWT") # 取得前端進來的 cookie
    if JWT_cookie is None:
        response=make_response({"error": True, "message": "未登入系統，拒絕存取"}, 403)
    else:
        JWT_decode=jwt.decode(JWT_cookie, key, algorithms=['HS256'])
        cnx=trip_pool.get_connection()
        booking_cursor=cnx.cursor(buffered=True, dictionary=True)
        sql="SELECT `tpe-attractions`.id, `tpe-attractions`.name, `tpe-attractions`.address, `tpe-attractions`.images, `booking`.date, `booking`.time, `booking`.price from `tpe-attractions` JOIN `booking` ON `booking`.attraction_id = `tpe-attractions`.id WHERE member_id=%s"
        booking_cursor.execute(sql, (JWT_decode['id'],))
        result=booking_cursor.fetchone()
        if result is not None:
            response=make_response({"data":{
                "attraction":{"id":result['id'], "name":result['name'], "address":result['address'], "image":json.loads(result['images'])[0]},
                "date":result['date'], "time": result['time'], "price":result['price']
                }}, 200)
        else:
            response=make_response({"data":None}, 400)
    return response

@api_booking.route("/api/booking", methods=["DELETE"])
def delete_booking():
    JWT_cookie=request.cookies.get("JWT") # 取得前端進來的 cookie
    if JWT_cookie is None:
        return {"error": True, "message": "未登入系統，拒絕存取"}, 403
    else:
        JWT_decode=jwt.decode(JWT_cookie, key, algorithms=['HS256'])
        cnx=trip_pool.get_connection()
        booking_cursor=cnx.cursor(buffered=True, dictionary=True)
        booking_cursor.execute("DELETE FROM booking WHERE member_id=%s", (JWT_decode['id'],))
        cnx.commit()
        booking_cursor.close()
        cnx.close()
        return {"ok": True}, 200
