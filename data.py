import json
from decouple import config
import mysql.connector
from mysql.connector import pooling

trip_db=mysql.connector.connect(
    host=config('host'),
    user=config('user'),
    password=config('password'),
    database=config('database')
)

with open("data/taipei-attractions.json", encoding="utf-8") as data:
    raw_data=json.load(data)
    data_length=len(raw_data['result']['results'])
    for i in range(data_length):
        name=raw_data['result']['results'][i]['stitle']
        category=raw_data['result']['results'][i]['CAT2']
        description=raw_data['result']['results'][i]['xbody']
        address=raw_data['result']['results'][i]['address']
        transport=raw_data['result']['results'][i]['info']
        mrt=raw_data['result']['results'][i]['MRT']
        latitude=raw_data['result']['results'][i]['latitude']
        longitude=raw_data['result']['results'][i]['longitude']
        image_list=[]
        for j in range(1, len(raw_data['result']['results'][i]['file'].split("https:"))):
            image="https:"+raw_data['result']['results'][i]['file'].split("https:")[j]
            if ".jpg" in image or ".JPG" in image or ".png" in image or ".PNG" in image:
                image_list.append(image)
        images=json.dumps(image_list)
        trip_cursor=trip_db.cursor(buffered=False, dictionary=True)
        sql="INSERT INTO `tpe-attractions` (name, category, description, address, transport, mrt, latitude, longitude, images) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"
        val=(name, category, description, address, transport, mrt, latitude, longitude, images)
        trip_cursor.execute(sql, val)
        trip_db.commit()
trip_cursor.close()
trip_db.close()

# result['result']['results'][list index]['dict key']
# ~id
# stitle 景點名稱 ~name
# CAT2 分類2 ~category
# xbody 景點說明 ~description
# address 地址 ~address
# info 交通資訊 ~transport
# MRT 捷運站 ~mrt
# latitude 緯度 ~latitude
# longitude 經度 ~longitude
# file 圖片網址 ~images