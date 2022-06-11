# [Taipei Day Trip](https://17tesyun99.rj728web.fun/)
It's a project of arranging 1 day Tapei trip website.


Welcome to try this game!
|Account|Password|
|---|---|
|test@test.com|test|


## Core Features
* Multiple Playes Online Game
* Chatroom

## Language
* Front-End: Javascript
* Back-End: Node.js & Express.js

## How to implement gameplay mechanics 
### Client Side
* Transporting player data by **Socket.IO** client
* Rendering game view by **HTML5 Canvas API**
  * Background images
  * Player's spaceship (controller)
  * All other player's spaceships (enemies)
  * All bullets 
* Implementing 60 FPS by **JavaScript `setInterval()`**

> Client will render player's spaceship according to the latest player data in client for ***making sure player's spaceship moving smoothly***. 

### Server Side
* Transporting game data by **Socket.IO** server
  * Players data
  * Leaderboard 
  * Bullets data
* Implementing fixed server updating frequency by **JavaScript `setInterval()`**

> In order to decrease unnecessary packets transporting, the game data will broadcast after the ***`isPlayersInfoChanged` flag*** becoming ***true***. 

## Back-End Architecture
![17TS99](https://user-images.githubusercontent.com/52148950/172580967-f7db2244-6051-4983-b928-38ab9e5e3db8.png)

### About Back-End
* Monitoring metrics from instances and auto scaling group by **AWS Cloudwatch**
* Horizontal scailing by **AWS Auto Scaling** based on AWS Cloudwatch alarms
  * Adding 1 instance when CPU Utilization approachs to specified metrics of the original instance
  ![add](https://user-images.githubusercontent.com/52148950/173033486-d9eb81cc-6acc-4ed2-a238-c9d2549da0ce.JPG)
  * Removing 1 instance when CPU Utilization approachs to specified metrics of an addtional instance scaled by auto scaling group
* Deploying application server by **Docker**
* Storing member data by **MongoDB**
* Listening port 80 & 443 for reverse proxy by **Nginx**
* Authenticating member state by **JWT**
* Improving application availability and responsiveness by **AWS Load Balancer**
