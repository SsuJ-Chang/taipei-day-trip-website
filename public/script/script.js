let page=0; // 頁數
let src="api/attractions?page="+page;
let idArr=[]; // 景點編號 Array
let imgArr=[]; // 景點圖 Array
let nameArr=[]; // 景點名稱 Array
let mrtArr=[]; // 捷運站 Array  
let categoryArr=[]; // 景點分類 Array

// 載入網頁檢查登入狀態
window.addEventListener("DOMContentLoaded", ()=>{
    document.getElementById("signinup").style.display="none";
    fetch("/api/user",{
        method: 'GET',
        credentials: 'include'
      }).then((response)=>{
          return response.json()
      }).then((data)=>{
          if(data['data']!==null){
            let header=document.getElementById("header");
            header.removeChild(header.children[2]);
            let logout=document.createElement("div");
            setAttributes(logout, {"class":"item", "id":"logout", "onclick":"logout()"});
            let logoutText=infoText("登出系統");
            logout.appendChild(logoutText);
            header.appendChild(logout);
            if(document.getElementById("member-name")){
                document.getElementById("member-name").innerHTML=data['data']['name'];
            }
          }else{
            document.getElementById("signinup").style.display="block";
          }
      })
})

let refresh=document.getElementById("refresh")
refresh.addEventListener("click", (e)=>{
    e.preventDefault();
    window.location.href=".."
})

function infoText(s) { // 用 createTextNode 建立文字節點 
    let text=document.createTextNode(s);
    return text;
}

function setAttributes(element, attrs){ // 複數設定屬性
    for(var key in attrs) {
        element.setAttribute(key, attrs[key]);
    }
}

function createAttractions(first, n){ // 建立「景點項目」
    for (let i=first;i<n;i++){
        // 建立 第一層 景點欄位
        let attractionDiv=document.createElement("div"); // 建立 第一層 景點欄位 <div>
        setAttributes(attractionDiv, {"class":"attraction", "id":`attraction-${i}`,"onclick":"getId(this.id)"})

        let main=document.getElementById("main"); // 找到 <main>
        main.appendChild(attractionDiv); // 將每個 第一層 .attraction 裝進 <main>

        // 建立 第二層 「景點圖」與「景點資訊」
        let image=document.createElement("img"); // 建立 第二層 「景點圖」 <img>
        image.setAttribute("src", imgArr[i]); // 指定屬性 src 並指定「景點圖網址」
        let infoDiv=document.createElement("div"); // 建立 第二層 「景點資訊」 .info
        setAttributes(infoDiv, {"class":"info", "id":`info-${i}`})

        let attraction=document.getElementById("attraction-"+i); // 找到 第一層 景點欄位
        attraction.appendChild(image); // 將 第二層 「景點圖」 <img> 裝進 第一層
        attraction.appendChild(infoDiv); // 將 第二層 「景點資訊」.info 裝進 第一層

        // 建立 第三層 「景點名稱」、「捷運站」、「景點類型」
        let nameDiv=document.createElement("div"); // 「景點名稱」
        nameDiv.setAttribute("class", "name");
        let attrName=infoText(nameArr[i]);
        nameDiv.appendChild(attrName);
        let mrtDiv=document.createElement("div"); // 「捷運站」
        mrtDiv.setAttribute("class", "mrt");
        let mrt=infoText(mrtArr[i]+"站");
        mrtDiv.appendChild(mrt);
        let categoryDiv=document.createElement("div"); // 「景點類型」
        categoryDiv.setAttribute("class", "category");
        let category=infoText(categoryArr[i]);
        categoryDiv.appendChild(category);
        // 將「景點名稱」、「捷運站」、「景點類型」裝進 第二層
        let info=document.getElementById("info-"+i);
        info.appendChild(nameDiv);
        info.appendChild(mrtDiv);
        info.appendChild(categoryDiv);
    }
}

function errorMsg(message){  // 顯示搜尋錯誤
    let messageDiv=document.createElement("div");
    messageDiv.setAttribute("class", "error-msg");
    let errorMessage=infoText(message);
    messageDiv.appendChild(errorMessage);
    let main=document.getElementById("main");
    main.appendChild(messageDiv);
}

// function getId(event){ // 取得點擊目標 id
//     let e=event || window.event;
//     e=e.target;
//     console.log(e.parentNode.id); // 父 Node id 名稱
//     let idx=Number(e.parentNode.id.split("-")[1]) // 取得 id 尾數作為 index
//     let id=idArr[idx]  // 從 id array 中取得景點真正 id
//     console.log("景點 id ", id);
//     window.location.replace(`attraction/${id}`);  // 跳轉至景點頁面
// }

function getId(attrId){ // 取得點擊目標 id
    console.log(attrId); // 父 Node id 名稱
    let idx=Number(attrId.split("-")[1]) // 取得 id 尾數作為 index
    let id=idArr[idx]  // 從 id array 中取得景點真正 id
    console.log("景點 id ", id);

    window.location.replace(`attraction/${id}`);  // 跳轉至景點頁面
}

// 預定行程
let redirectBooking=document.getElementById("itinerary");
redirectBooking.addEventListener("click", ()=>{
    fetch("/api/user",{
        method: 'GET',
        credentials: 'include'
      }).then((response)=>{
          return response.json()
      }).then((data)=>{
          if(data['data']!==null){
            window.location.href="/booking"
          }else{
            createMemberUI("signin", "登入會員帳號", "登入帳戶", "還沒有帳戶？點此註冊")
          }
      })
})