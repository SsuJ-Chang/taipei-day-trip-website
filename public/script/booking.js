window.addEventListener("DOMContentLoaded", ()=>{
    fetch("/api/booking",
        {method:"GET"}
    ).then((response)=>{
        return response.json();
    }).then((data)=>{
        console.log(data);
        if(data['data']===null | data['error']){ // 暫時無行程或未登入都跳回首頁
            window.location.href="..";
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
            let timeText=infoText(data['data']['time']);
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
        // if(data['ok']){  // 暫時都先回首頁 
        //     window.location.href="..";
        // }else{
        //     window.location.href="..";
        // }
    }).catch((error)=>{
        console.log(error);
    })
})