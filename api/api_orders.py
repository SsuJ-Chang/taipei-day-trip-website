from urllib import response
from flask import *
import api.connector as connector
import jwt
from decouple import config
import requests

api_orders=Blueprint("api_oreders", __name__, template_folder="templates")

trip_pool=connector.connect()

key=config('JWT')

@api_orders.route("/api/orders", methods=["POST"])
def oreder():
    JWT_cookie=request.cookies.get("JWT") # 取得前端進來的 cookie
    order_data=request.json
    if JWT_cookie is None:
        response=make_response({"error": True, "message": "未登入系統，拒絕存取"}, 403)
    else:
        print("刷卡資料", order_data)
        if order_data['order']['contact']['phone']=="" or order_data['order']['contact']['name'] =="" or order_data['order']['contact']['email']=="":
            response=make_response({"error": True, "message": "訂單建立失敗，輸入不正確"} ,400)
        else:
            try:
                url="https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime"
                body={
                    "prime": order_data['prime'],
                    "partner_key": config('partner_key'),
                    "merchant_id": "RJcorp_TAISHIN",
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
                    # 存到 DB???
                else:
                    msg="付款失敗"
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

    return response

@api_orders.route("/api/orders", methods=["GET"])
def get_oreder():
    JWT_cookie=request.cookies.get("JWT") # 取得前端進來的 cookie
    order_data=request.json
    if JWT_cookie is None:
        response=make_response({"error": True, "message": "未登入系統，拒絕存取"}, 403)
    else:
        # 從 DB 抓已付款資料???
        response=make_response({"ok": True}, 200)
    return response