from flask import *
import api.connector as connector

api_user=Blueprint("api_user", __name__, template_folder="templates")

trip_pool=connector.connect()

@api_user.route("/api/user", methods=["PATCH"])
def signin():
    signin_data = request.get_json() # 接收 JSON 資料轉為 dictionary
    cnx=trip_pool.get_connection()
    user_cursor=cnx.cursor(buffered=True, dictionary=True)
    user_cursor.execute("SELECT * FROM member WHERE email=%s AND password=%s", (signin_data['email'], signin_data['password']))
    result=user_cursor.fetchone()
    user_cursor.close()
    try:
        if result is not None:
            print(f"{result['name']} 登入成功")
            return {"ok": True}, 200
        else:
            print("登入失敗")
            return {"error": True, "message": "帳號或密碼錯誤，請重新輸入。"}, 400
    except:
        return {"error": True, "message": "伺服器內部錯誤"}, 500
    finally:
        cnx.close()

@api_user.route("/api/user", methods=["GET"])
def get_member_data():
    cnx=trip_pool.get_connection()
    user_data_cursor=cnx.cursor(buffered=True, dictionary=True)
    user_data_cursor.execute("SELECT member_id, name, email FROM member")
    result=user_data_cursor.fetchone()
    user_data_cursor.close()
    # 好像還缺判斷使用者是否有登入 沒登入 return null 的流程
    # 推測可能是點擊右上角 預定行程 跳轉後要先確認是否有登入
    print("取得會員資料", {"data":result})
    cnx.close()
    return {"data":result}, 200

@api_user.route("/api/user", methods=["POST"])
def signup():
    try:
        name=request.form['name']
        email=request.form['email']
        password=request.form['password']
        cnx=trip_pool.get_connection()
        signup_cursor=cnx.cursor(buffered=True, dictionary=True)
        signup_cursor.execute("SELECT email FROM member WHERE email=%s", (email, ))
        result=signup_cursor.fetchone()
        print("是否有重複帳號", result)
        if result == None:
            print("斷點！")
            signup_cursor.execute("INSERT INTO member (name, email, password) VALUES (%s, %s, %s)", (name, email, password))
            print("斷點！")
            cnx.commit()
            print("斷點！")
            signup_cursor.close()
            print(f"{name} 註冊成功！")
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
    return {"ok": True}, 200