from urllib import response
from flask import *
import api.connector as connector
import jwt
from decouple import config
import requests

api_orders=Blueprint("api_orders", __name__, template_folder="templates")

trip_pool=connector.connect()

key=config('JWT')

@api_orders.route("/api/orders", methods=["POST"])
def order():
    JWT_cookie=request.cookies.get("JWT") # 取得前端進來的 cookie
    order_data=request.json
    if JWT_cookie is None:
        response=make_response({"error": True, "message": "未登入系統，拒絕存取"}, 403)
    else:
        print("刷卡資料", order_data)
        JWT_decode=jwt.decode(JWT_cookie, key, algorithms=['HS256'])
        print("cookie", JWT_decode)
        if order_data['order']['contact']['phone']=="" or order_data['order']['contact']['name'] =="" or order_data['order']['contact']['email']=="":
            response=make_response({"error": True, "message": "訂單建立失敗，請確認聯絡資訊輸入正確"} ,400)
        else:
            try:
                url="https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime"
                body={
                    "prime": order_data['prime'],
                    "partner_key": config('partner_key'),
                    "merchant_id": "loch0728_TAISHIN",
                    "details":order_data['order']['trip']['attraction']['name'],
                    "amount": order_data['order']['price'],
                    "cardholder": {
                        "phone_number": order_data['order']['contact']['phone'],
                        "name": order_data['order']['contact']['name'],
                        "email": order_data['order']['contact']['email'],
                    },
                    "remember": True
                }
                headers={
                    "Content-Type": "application/json",
                    "x-api-key": config('partner_key')
                }
                tappay_result=requests.post(url, json=body, headers=headers)
                print("Tappay 回傳結果：", tappay_result.text)
                dict_result=json.loads(tappay_result.text)
                if dict_result['status']==0:
                    msg="付款成功"
                    cnx=trip_pool.get_connection()
                    order_cursor=cnx.cursor(buffered=True, dictionary=True)
                    order_cursor.execute("INSERT INTO orders (trade_id, member_id, attraction_id, date, time, price, username, email, phone) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)", (dict_result['rec_trade_id'] ,JWT_decode['id'], order_data['order']['trip']['attraction']['id'], order_data['order']['trip']['date'], order_data['order']['trip']['time'], order_data['order']['price'], order_data['order']['contact']['name'], order_data['order']['contact']['email'], order_data['order']['contact']['phone']))
                    cnx.commit()
                    order_cursor.execute("DELETE FROM booking WHERE member_id=%s", (JWT_decode['id'],))
                    cnx.commit()
                    order_cursor.close()
                    print(f"{JWT_decode['name']}，付款成功")
                else:
                    msg="付款失敗"
                    print(f"{JWT_decode['name']}，付款失敗")
                result={
                        "data": {
                            "number": dict_result['rec_trade_id'],
                            "payment": {
                                "status": dict_result['status'],
                                "message": msg
                                }
                            }
                        }
                response=make_response(result, 200)
            except:
                response=make_response({"error": True, "message": "伺服器內部錯誤"}, 500)
            finally:
                cnx.close()

    return response

@api_orders.route("/api/orders/<orderNumber>", methods=["GET"])
def get_order(orderNumber):
    JWT_cookie=request.cookies.get("JWT") # 取得前端進來的 cookie
    if JWT_cookie is None:
        response=make_response({"error": True, "message": "未登入系統，拒絕存取"}, 403)
    else:
        cnx=trip_pool.get_connection()
        print("orderNumber:", orderNumber)
        order_cursor=cnx.cursor(buffered=True, dictionary=True)
        order_cursor.execute("SELECT trade_id, price, attraction_id, `tpe-attractions`.name, `tpe-attractions`.address, `tpe-attractions`.images, date, time, orders.username, email, phone FROM orders JOIN `tpe-attractions` WHERE trade_id=%s AND `tpe-attractions`.id=orders.attraction_id", (orderNumber,))
        result=order_cursor.fetchone()
        print("GET result: ", result)
        order_cursor.close()
        cnx.close()
        if result is not None:
            final_result={
                "data": {
                    "number": result['trade_id'],
                    "price": result['price'],
                    "trip": {
                    "attraction": {
                        "id": result['attraction_id'],
                        "name": result['name'],
                        "address": result['address'],
                        "image": json.loads(result['images'])[0]
                    },
                    "date": result['date'],
                    "time": result['time']
                    },
                    "contact": {
                    "name": result['username'],
                    "email": result['email'],
                    "phone": result['phone']
                    },
                    "status": 1
                }
            }
        else:
            final_result={"data": None, "message": "無此付款訂單，請確認訂單號碼"}
        response=make_response(final_result, 200)
    return response