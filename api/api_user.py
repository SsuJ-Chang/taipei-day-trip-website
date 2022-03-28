from flask import *
import api.connector as connector
import jwt
from decouple import config
from datetime import datetime, timedelta
import time
from flask_bcrypt import Bcrypt

api_user=Blueprint("api_user", __name__, template_folder="templates")

trip_pool=connector.connect()

key=config('JWT')

@api_user.route("/api/user", methods=["PATCH"])
def signin():
    signin_data = request.get_json() # 接收 JSON 資料轉為 dictionary
    cnx=trip_pool.get_connection()
    user_cursor=cnx.cursor(buffered=True, dictionary=True)
    # user_cursor.execute("SELECT member_id, name FROM member WHERE email=%s AND password=%s", (signin_data['email'], signin_data['password']))
    user_cursor.execute("SELECT * FROM member WHERE email=%s", (signin_data['email'], ))
    result=user_cursor.fetchone()
    user_cursor.close()

    bcrypt = Bcrypt() # 實例化 bcrypt

    try:
        # if result is not None:
        if result is not None and bcrypt.check_password_hash(result['password'], signin_data['password']):
            print(f"{result['name']} 登入成功")

            JWT_data={"id":result['member_id'], "name":result['name'], "email":signin_data['email'], "exp": datetime.utcnow() + timedelta(minutes=3)}
            token=jwt.encode(JWT_data, key, algorithm='HS256') # 產生 JWT
            response=make_response({"ok": True}, 200)
            response.set_cookie("JWT", value=token, expires=time.time()+3*60) # 把 JWT 設定至 cookie

            return response
        else:
            print("登入失敗")
            return {"error": True, "message": "帳號或密碼錯誤，請重新輸入。"}, 400
    except:
        return {"error": True, "message": "伺服器內部錯誤"}, 500
    finally:
        cnx.close()

@api_user.route("/api/user", methods=["GET"])
def get_member_data():
    JWT_cookie=request.cookies.get("JWT") # 取得前端進來的 cookie
    if JWT_cookie is None:
        return {"data":None}
    else:
        try:
            JWT_decode=jwt.decode(JWT_cookie, key, algorithms=['HS256'])
            JWT_decode.pop('exp')
            return {"data":JWT_decode}, 200
        except jwt.ExpiredSignatureError:
            return {"data":None}

@api_user.route("/api/user", methods=["POST"])
def signup():
    try:
        signup_data=request.json
        cnx=trip_pool.get_connection()
        signup_cursor=cnx.cursor(buffered=True, dictionary=True)
        signup_cursor.execute("SELECT email FROM member WHERE email=%s", (signup_data['email'], ))
        result=signup_cursor.fetchone()
        print("是否有重複帳號", result)
        if result == None:

            bcrypt = Bcrypt() # 實例化 bcrypt
            hashed=bcrypt.generate_password_hash(password=signup_data['password'])
            print(hashed)

            signup_cursor.execute("INSERT INTO member (name, email, password) VALUES (%s, %s, %s)", (signup_data['name'], signup_data['email'], hashed))
            cnx.commit()
            signup_cursor.close()
            print(f"{signup_data['name']} 註冊成功！")
            return {"ok": True}, 200
        else:
            print("註冊失敗，Email 重複。")
            return {"error": True, "message": "註冊失敗，Email 重複。"}, 400
    except:
        return {"error": True, "message": "伺服器內部錯誤"}, 500
    finally:
        cnx.close()

@api_user.route("/api/user", methods=["DELETE"])
def delete():
    response=make_response({"ok": True}, 200)
    response.set_cookie("JWT", value="", expires=0) # 把 JWT 的 cookie 刪除
    return response