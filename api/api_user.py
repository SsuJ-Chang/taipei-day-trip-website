from flask import *
import api.connector as connector

api_user=Blueprint("api_user", __name__, template_folder="templates")

trip_pool=connector.connect()

@api_user.route("/api/user")
def signin():
    print("hihi")