from flask import *
from api.api_data_lst import api_data_lst
from api.api_data_id import api_data_id
from decouple import config
from mysql.connector import pooling

app=Flask(__name__, static_folder="public", static_url_path="/")
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True
app.config['JSON_SORT_KEYS'] = False # 關閉 JSON 自動排序

app.register_blueprint(api_data_lst)
app.register_blueprint(api_data_id)


@app.route("/")
def index():
	return render_template("index.html")
@app.route("/attraction/<id>")
def attraction(id):
	return render_template("attraction.html")
@app.route("/booking")
def booking():
	return render_template("booking.html")
@app.route("/thankyou")
def thankyou():
	return render_template("thankyou.html")


app.run(host='0.0.0.0', port=3000, debug=False)