let imgArr = []; // 景點圖 Array
let titleArr = []; // 景點名稱 Array      
function titleText(t) { // 函式：建立「景點名稱」函式 用 createTextNode 
    let content = document.createTextNode(t);
    return content;
}

function attractionItems(first, n) { // 函式：建立「景點項目」
    for (let i = first; i < n; i++) {
        let titleDiv = document.createElement("div") // 建立 第一層 <div>
        titleDiv.setAttribute("id", "title-" + i)
        titleDiv.setAttribute("class", "title")
        let main = document.getElementById("main"); // 找到 <main>
        main.appendChild(titleDiv); // 將每個 第一層 <div> 裝進 <main>

        let image = document.createElement("img"); // 建立 第二層 <img> 作為放「景點圖」的容器
        //i.src=imgArr[0]  // 指定屬性 src
        image.setAttribute("src", imgArr[i]); // 指定屬性 src 並指定「景點圖網址」

        let p = document.createElement("p"); // 建立 第二層 <p> 作為放「景點名稱」的容器
        p.appendChild(titleText(titleArr[i])); // 使用建立「景點名稱」函式產生文字裝進 <p>

        let currentDiv = document.getElementById("title-" + i); // 找到 第一層 <div> (id="title")
        currentDiv.appendChild(image); // 將 <img> 裝進 第一層 <div> (id="title")
        currentDiv.appendChild(p); // 將 <p> 裝進 第一層 <div> (id="title")
    }
}

// 從網頁抓資料並存進「景點圖 Array」與「景點名稱 Array」
let req = new XMLHttpRequest();
req.open("get", "https://padax.github.io/taipei-day-trip-resources/taipei-attractions-assignment.json")
req.send();
// req.onload = function(){
//     let data = JSON.parse(this.responseText);  // 載入資料並轉成 JSON 格式
//     for(let i=0;i<data.result.results.length;i++){
//         titleArr.push(data.result.results[i].stitle)
//         imgArr.push("http:"+data.result.results[i].file.split("https:",2)[1])
//     }
//     attractionItems(0,8)  // 網頁 load 進來時產生前 8 筆「景點項目」
// }

req.addEventListener("load", () => {
    let data = JSON.parse(req.responseText); // 載入資料並轉成 JSON 格式
    for (let i = 0; i < data.result.results.length; i++) {
        titleArr.push(data.result.results[i].stitle)
        imgArr.push("http:" + data.result.results[i].file.split("https:", 2)[1])
    }
    attractionItems(0, 8) // 網頁 load 進來時產生前 8 筆「景點項目」
})

// 註冊 load 按鈕事件
let load = document.getElementById("load");
load.addEventListener("click", () => {
    let titleNums = document.querySelectorAll(".title"); // 查詢 .title 的數量
    // let titleNum=document.querySelector(".title")
    let newTitles = 0;
    if (titleArr.length - titleNums.length >= 8) { // 判斷要產生多少新的「景點項目」
        newTitles = 8; // 剩餘項目超過 8 筆新的就產生 8筆
    } else { // 不足 8 筆就產生剩餘的數量
        newTitles = titleArr.length - titleNums.length;
        document.getElementById("load").disabled = true; // 因不能再產生新的「景點項目」故 按鈕停用
    }
    attractionItems(titleNums.length, titleNums.length + newTitles) // 產生新的「景點項目」
})

// window.addEventListener("load", () => {  // 註冊「網頁載入」時的事件





// })