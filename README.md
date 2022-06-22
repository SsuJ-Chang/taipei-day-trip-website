# [Taipei Day Trip](http://taipeitrip.rj728web.fun:3000/)
It's an e-commerce website project of arranging 1 day trip in Taipei.
![tp01](https://user-images.githubusercontent.com/52148950/173220494-239b6daa-a952-4dd1-a654-d5010690a221.JPG)
![tp02](https://user-images.githubusercontent.com/52148950/173220500-cd57dc18-953e-4fb5-bb6f-fb5958706419.JPG)

There is a testing account below for this website!
|Account|Password|
|---|---|
|test@test.com|test|

## Core Features
* Searching detail information of famous attractions in Taipei
  * Browsing directly
  * Keying keyword to search specific attractions
* Booking the trip
* Paying the order with a credit card

## Tech Stack
* Developing application server by **Python Flask**
* Realizing RESTful API in all pages which need to communicate with database
  * Using **Fetch API** in frontend to call APIs 
* Storing member data, attraction data, booking data and order data by **MySQL**
 * Optimizing query by using **Index**  
* Authenticating member state by **JWT**
* Integrating **[TapPay](https://www.tappaysdk.com/zh/)** payment system
* Deploying application server on **AWS EC2 Instance**
* Importing **Flask Blueprint** for managing application easily
