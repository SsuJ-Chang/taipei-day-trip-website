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
let lArrow=document.getElementById("leftArrow");
lArrow.addEventListener("click", ()=>{
    currentImageIndex--;
    showImg(currentImageIndex);
})
let rArrow=document.getElementById("rightArrow");
rArrow.addEventListener("click", ()=>{
    currentImageIndex++;
    showImg(currentImageIndex);
})

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
        dotBox.setAttribute("id", "dotBox");
        dotDiv.append(dotBox);
        for(let i=0;i<imageArr.length;i++){
            let realDotDiv=document.getElementById("dotBox");
            let dot=document.createElement("div");
            dot.setAttribute("class", "dot");
            // dot.setAttribute("style", "display:inline-block;");
            dot.setAttribute("onclick", `clickDot(${i})`)
            realDotDiv.append(dot);
        }
        // currentImageIndex=Math.floor(Math.random() * imageArr.length); // 隨機決定 index
        showImg(currentImageIndex); // 載入網頁後的圖片和 active 點點
        setInterval(()=>{
            clickDot(currentImageIndex+1);
        }, 3000); 

    }).catch((error)=>{
        console.log(error)
    })
})

let time=document.getElementsByClassName("time");
let morningFee=document.getElementById("fee-1");
let eveningFee=document.getElementById("fee-2");
for(let i=0;i<time.length;i++){
    time[i].addEventListener("click", ()=>{
        if(time[i].id==="morning"){
            morningFee.style.display="block";
            eveningFee.style.display="none";
        }else{
            eveningFee.style.display="block";
            morningFee.style.display="none";
        }
    })
}