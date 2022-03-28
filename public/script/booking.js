window.addEventListener("DOMContentLoaded", ()=>{
    
    fetch("/api/booking",
        {method:"GET"}
    ).then((response)=>{
        return response.json();
    }).then((data)=>{
        console.log(data);
        if(data['error']){ // 未登入跳回首頁
            window.location.href="..";
        }else if(data['data']===null){ // 無行程

            document.querySelector(".booking-info").innerHTML="";
            let noBookingText=infoText("目前沒有任何待預訂的行程");
            let noBookingDiv=document.createElement("div");
            noBookingDiv.appendChild(noBookingText);
            document.querySelectorAll(".common-container")[0].appendChild(noBookingDiv) 
            document.querySelectorAll(".common-container")[1].innerHTML="";
            document.querySelectorAll(".common-container")[2].innerHTML="";
            document.querySelectorAll(".common-container")[3].innerHTML="";
            document.querySelectorAll(".hr")[0].innerHTML="";
            document.querySelectorAll(".hr")[1].innerHTML="";
            document.querySelectorAll(".hr")[2].innerHTML="";
            document.querySelector("footer").style.height="860px";
        }else{
            
            let image=document.querySelector(".booking-img");
            let img=document.createElement("img");
            img.setAttribute("src", data['data']['attraction']['image']);
            image.appendChild(img);

            let titleContainer=document.querySelector(".booking-title");
            let titleSpan=document.createElement("span");
            let titleText=infoText(data['data']['attraction']['name']);
            titleSpan.appendChild(titleText);
            titleContainer.appendChild(titleSpan);

            let dateContainer=document.querySelector(".booking-date");
            let dateSpan=document.createElement("span");
            let dateText=infoText(data['data']['date']);
            dateSpan.appendChild(dateText);
            dateContainer.appendChild(dateSpan);

            let timeContainer=document.querySelector(".booking-time");
            let timeSpan=document.createElement("span");
            let timeText="";
            if(data['data']['time']==="morning"){
                timeText=infoText("上午 9 點至上午 12 點 30 分");
            }else{
                timeText=infoText("下午 2 點 30 分至下午 6 點 30 分");
            }
            timeSpan.appendChild(timeText);
            timeContainer.appendChild(timeSpan);

            let priceContainer=document.querySelector(".booking-price");
            let priceSpan=document.createElement("span");
            let priceText=infoText(`新台幣 ${data['data']['price']} 元`);
            priceSpan.appendChild(priceText);
            priceContainer.appendChild(priceSpan);

            let addressContainer=document.querySelector(".booking-address");
            let addressSpan=document.createElement("span");
            let addressText=infoText(data['data']['attraction']['address']);
            addressSpan.appendChild(addressText);
            addressContainer.appendChild(addressSpan);

            let totalPriceContainer=document.getElementById("total-price");
            let totalPriceText=infoText(`新台幣 ${data['data']['price']} 元`);
            totalPriceContainer.appendChild(totalPriceText);
        }
    }).catch((error)=>{
        console.log(error);
    })
})

let deleteBooking=document.getElementById("booking-delete");
deleteBooking.addEventListener("click", ()=>{
    fetch("api/booking", {
        method:"DELETE"
    }).then((response)=>{
        return response.json();
    }).then((data)=>{
        console.log(data);
        if(data['ok']){ 
            window.location.reload();
        }else{
            createMemberUI("signin", "登入會員帳號", "登入帳戶", "還沒有帳戶？點此註冊");
        }
    }).catch((error)=>{
        console.log(error);
    })
})