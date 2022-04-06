from flask import *
from api.api_data_lst import api_data_lst
from api.api_data_id import api_data_id
from api.api_user import api_user
from api.api_booking import api_booking
from api.api_orders import api_orders

app=Flask(__name__, static_folder="public", static_url_path="/")
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True
app.config['JSON_SORT_KEYS'] = False # 關閉 JSON 自動排序

app.register_blueprint(api_data_lst)
app.register_blueprint(api_data_id)
app.register_blueprint(api_user)
app.register_blueprint(api_booking)
app.register_blueprint(api_orders)


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