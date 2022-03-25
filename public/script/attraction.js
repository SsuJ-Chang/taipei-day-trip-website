let currentImageIndex=0;

// 顯示圖片
function showImg(index){
    let allImgs=document.querySelectorAll(".img");
    let allDots=document.querySelectorAll(".dot");
    // 循環 index 設定
    if(index>allImgs.length-1){  // 如果 index 超過總數 即最右邊再右邊 就回到第一張圖
        currentImageIndex=0;
    }
    if(index<0){  // 如果 index 小於 0 即最左邊再左邊 就到最後一張圖
        currentImageIndex=allImgs.length-1;
    }
    // 切換圖片就先全部隱藏 再顯示指定 index 的圖片
    for(let i=0;i<imageArr.length;i++){
        allImgs[i].style.display="none";
    }
    allImgs[currentImageIndex].style.display="block";
    // 切換圖片就將點點全部變回空的 再將對應點點顯示為 active
    for(let i=0;i<imageArr.length;i++){
        allDots[i].className=allDots[i].className.replace(" active", "")
    }
    allDots[currentImageIndex].className+=" active";

    console.log(`目前顯示第 ${currentImageIndex+1} 張圖片`);
}
// 自動輪播
function autoSlide(time){
    for(let i=0;i<3;i++){
        setTimeout(()=>{
            clickDot(currentImageIndex+1);
        }, time); 
    }
}

// 點擊點點切換圖片函式
function clickDot(n){
    showImg(currentImageIndex=n);
}
// 點擊左右箭頭切換圖片事件
let lArrow=document.getElementById("left-arrow");
lArrow.addEventListener("click", ()=>{
    currentImageIndex--;
    showImg(currentImageIndex);
})
let rArrow=document.getElementById("right-arrow");
rArrow.addEventListener("click", ()=>{
    currentImageIndex++;
    showImg(currentImageIndex);
})

let id=0;
window.addEventListener("load", ()=>{  // 網頁載入的結果
    let path=window.location.pathname.split('/');
    id=path[2];
    src=`/api/attraction/${id}`
    // 依照景點編號 fetch
    fetch(src).then((response)=>{
        return response.json();
    }).then((data)=>{
        let nameDiv=document.getElementById("name");
        let locationDiv=document.getElementById("location");
        let name=infoText(data['data']['name']);
        let location=infoText(data['data']['category']+" at "+data['data']['mrt']+"站")
        nameDiv.append(name);
        locationDiv.append(location);

        let descDiv=document.getElementById("description");
        let addressDiv=document.getElementById("address");
        let transportDiv=document.getElementById("transport");
        let description=infoText(data['data']['description']);
        let address=infoText(data['data']['address']);
        let transport=infoText(data['data']['transport']);
        descDiv.append(description);
        addressDiv.append(address);
        transportDiv.append(transport);

        imageArr=data['data']['images'];
        // 動態生成圖片
        let imgDiv=document.getElementById("images");
        let image=document.createElement("img");
        image.setAttribute("src", imageArr[0]);
        image.setAttribute("class", "img");
        image.setAttribute("style", "display:block;");
        imgDiv.append(image);
        for(let i=1;i<imageArr.length;i++){
            let image2=document.createElement("img");
            image2.setAttribute("src", imageArr[i]);
            image2.setAttribute("class", "img");
            image2.setAttribute("style", "display:none;");
            imgDiv.append(image2);
        }
        // 動態生成點點
        let dotDiv=document.getElementById("images");
        let dotBox=document.createElement("div");
        dotBox.setAttribute("id", "dot-box");
        dotDiv.append(dotBox);
        for(let i=0;i<imageArr.length;i++){
            let realDotDiv=document.getElementById("dot-box");
            let dot=document.createElement("div");
            dot.setAttribute("class", "dot");
            dot.setAttribute("onclick", `clickDot(${i})`)
            realDotDiv.append(dot);
        }
        currentImageIndex=Math.floor(Math.random() * imageArr.length); // 隨機決定 index
        showImg(currentImageIndex); // 載入網頁後的圖片和 active 點點
        setInterval(()=>{
            clickDot(currentImageIndex+1);
        }, 3000); 

    }).catch((error)=>{
        console.log(error)
    })
})

// 取得日期的 input 值
let date;
let datepicker=document.getElementById("date-input")
datepicker.addEventListener("change", ()=>{
    date=datepicker.value;
})
// 取得 時間 radio 的值和對應顯示價錢結果
let time;
let price=2000;
let timePicker=document.getElementsByClassName("time");
let morningFee=document.getElementById("price-1");
let afternoonFee=document.getElementById("price-2");
timePicker[0].addEventListener("click", ()=>{
    morningFee.style.display="block";
    afternoonFee.style.display="none";
    time=timePicker[0].value;
    price=2000;
    // localStorage.price=price;
    // localStorage.removeItem("price");
    // sessionStorage.setItem("price", price);
})
timePicker[1].addEventListener("click", ()=>{
    afternoonFee.style.display="block";
    morningFee.style.display="none";
    time=timePicker[1].value;
    price=2500;
    // localStorage.price=price;
    // localStorage.removeItem("price");
    // sessionStorage.setItem("price", price);
})
// 開始預定行程
let booking=document.getElementById("booking-btn");
booking.addEventListener("click", ()=>{
    console.log("景點編號", id);
    console.log("預定日期", date);
    console.log("預定時間", time);
    console.log("價錢", price);
    if(date!==undefined & time!==undefined){
        fetch("/api/booking", {
            method:"POST",
            body: JSON.stringify({
                "attractionId": `${id}`,
                "date": `${date}`,
                "time": `${time}`,
                "price":`${price}`
              }),
            headers: {
                "Content-type": "application/json"
            }
        }).then((response)=>{
            return response.json();
        }).then((data)=>{
            if(data['ok']){
                window.location.href="/booking";
            }else{
                console.log(data['message']);
            }
        })
    }else{
        // 沒有選擇該如何處理？
        console.log("請選擇訂單內容")
    }
    
})