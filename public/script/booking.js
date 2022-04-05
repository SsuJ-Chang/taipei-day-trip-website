let bookingPrice=2000;
let bookingAttractionId=1;
let bookingAttractionName="";
let bookingAttractionAddress="";
let bookingAttractionImage="";
let bookingDate="";
let bookingTime="";

function createAlertUI(titleStr, messageStr){ // 動態生成 警告視窗
    let header=document.getElementById("header-tag");
    // 半透明黑底
    let funcBg=document.createElement("div");
    setAttributes(funcBg, {"class":"header-func-bg"});
    header.appendChild(funcBg);
    // 警告視窗 最外層
    let alertUIDiv=document.createElement("div");
    setAttributes(alertUIDiv, {"class":"alert-BG"});
    header.appendChild(alertUIDiv)

     // 最上面裝飾
    let alertDeco=document.createElement("div");
    setAttributes(alertDeco, {"class":"alert-deco"});
    // 錯誤 Title
    let alertTitle=document.createElement("div");
    alertTitle.setAttribute("class", "alert-title");
    let title=infoText(`${titleStr}`);
    alertTitle.appendChild(title);

    // 關閉按鈕
    let alertClose=document.createElement("img");
    setAttributes(alertClose ,{"src":"/pic/icon_close.png", "class":"alert-close", "onclick":"closeUI(2)"});

    // 警示訊息
    let alertMessage=document.createElement("div");
    alertMessage.setAttribute("id", "alert-message");
    let errorDiv=document.createElement("div");
    errorDiv.setAttribute("class", "alert-message");
    let alertMsg=infoText(`${messageStr}`);
    errorDiv.appendChild(alertMsg);
    alertMessage.appendChild(errorDiv);

    alertUIDiv.appendChild(alertDeco);
    alertUIDiv.appendChild(alertTitle);
    alertUIDiv.appendChild(alertClose);
    alertUIDiv.appendChild(alertMessage);

    document.addEventListener('touchmove', function(e) {
        e.preventDefault();
    }, { passive: false });
}

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
            document.getElementById("scroll").style.overflow="hidden";
        }else{
            bookingPrice=data['data']['price'];
            bookingAttractionId=data['data']['attraction']['id'];
            bookingAttractionName=data['data']['attraction']['name'];
            bookingAttractionAddress=data['data']['attraction']['address'];
            bookingAttractionImage=data['data']['attraction']['image'];
            bookingDate=data['data']['date'];
            bookingTime=data['data']['time'];
            
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

// Tappay
TPDirect.setupSDK(123937, 'app_KmyPgXbcehq3Wz9K3Cm92GpSdJEBIBtlYpNykdokn3kMsaBCfFSnADShAt86', 'sandbox');  // Setup SDK
var fields = {
    number: {
        // css selector
        element: '#card-input',
        placeholder: '**** **** **** ****'
    },
    expirationDate: {
        // DOM object
        element: document.getElementById('expiration-input'),
        placeholder: 'MM / YY'
    },
    ccv: {
        element: '#CVV-input',
        placeholder: '後三碼'
    }
}
TPDirect.card.setup({ // TPDirect.card.setup(config)
    fields: fields,
    styles: {
        // Style all elements
        'input': {
            'color': 'gray'
        },
        // Styling ccv field
        'input.ccv': {
            // 'font-size': '16px'
        },
        // Styling expiration-date field
        'input.expiration-date': {
            // 'font-size': '16px'
        },
        // Styling card-number field
        'input.card-number': {
            // 'font-size': '16px'
        },
        // style focus state
        ':focus': {
            // 'color': 'black'
        },
        // style valid state
        '.valid': {
            'color': 'green'
        },
        // style invalid state
        '.invalid': {
            'color': 'red'
        },
        // Media queries
        // Note that these apply to the iframe, not the root window.
        '@media screen and (max-width: 400px)': {
            'input': {
                'color': 'orange'
            }
        }
    }
}); 
let submitButton = document.getElementById("payment-btn");
// TPDirect.card.onUpdate((update)=>{  // 取得目前卡片資訊的輸入狀態 4242424242424242, 01/23, 123
//     if (update.canGetPrime) {
//       submitButton.removeAttribute('disabled')
//     } else {
//       submitButton.setAttribute('disabled', true)
//     }
  
//     if (update.hasError) {
//       cardViewContainer.classList.add('error')
//     } else {
//       cardViewContainer.classList.remove('error')
//     }
  
//     if (update.status.number) {
//       showErrorMessage('Please check your credit card number')
//     } else {
//       hideErrorMessage()
//     }
//   })
submitButton.addEventListener("click", (e)=>{
    e.preventDefault();
    const tappayStatus = TPDirect.card.getTappayFieldsStatus()
    if (tappayStatus.canGetPrime === false) {
        createAlertUI("錯誤", "請確認信用卡資料")
        console.log('can not get prime');
        return
    }
    TPDirect.card.getPrime((result) => { // 取得 Prime Token 結果
        if (result.status !== 0) {
            createAlertUI("錯誤", "請確認信用卡資料")
            console.log('getPrime error' + result.msg);
            return
        }
        console.log('getPrime success: ' + result.card.prime)
        
        fetch("/api/orders", {
            method:"POST",
            body: JSON.stringify({
                "prime": result.card.prime,
                "order": {
                    "price": bookingPrice,
                    "trip": {
                        "attraction": {
                            "id": bookingAttractionId,
                            "name": bookingAttractionName,
                            "address": bookingAttractionAddress,
                            "image": bookingAttractionImage
                        },
                        "date": bookingDate,
                        "time": bookingTime
                    },
                    "contact": {
                        "name": document.getElementById("name-input").value,
                        "email": document.getElementById("email-input").value,
                        "phone": document.getElementById("phone-input").value
                    }
                }
            }),
            headers: {
                "Content-type": "application/json"
            }
        }).then((response)=>{
            return response.json()
        }).then((data)=>{
            if(data['message']==="訂單建立失敗，請確認聯絡資訊輸入正確"){ // 聯絡資訊輸入不正確
                createAlertUI("錯誤", `${data['message']}`)
                console.log(`${data['message']}`)
            }else if(data['error']){
                window.location.href="..";
            }else{
                window.location.href=`/thankyou?number=${data['data']['number']}`;
            }
        }).catch((error)=>{
            console.log(error)
        })
    })
})