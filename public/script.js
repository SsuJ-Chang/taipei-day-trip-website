let imgArr=[]; // 景點圖 Array
let nameArr=[]; // 景點名稱 Array
let mrtArr=[]; // 景點名稱 Array  
let categoryArr=[]; // 景點名稱 Array 

function infoText(s) { // 用 createTextNode 建立「景點名稱」函式 
    let text=document.createTextNode(s);
    return text;
}

function attractionItems(first, n) { // 建立「景點項目」
    for (let i=first;i<n;i++) {
        // 建立 第一層 景點欄位
        let attractionDiv=document.createElement("div"); // 建立 第一層 景點欄位 <div>
        attractionDiv.setAttribute("class", "attraction")
        attractionDiv.setAttribute("id", "attraction-"+i)

        let main=document.getElementById("main"); // 找到 <main>
        main.appendChild(attractionDiv); // 將每個 第一層 .attraction 裝進 <main>

        // 建立 第二層 「景點圖」與「景點資訊」
        let image=document.createElement("img"); // 建立 第二層 「景點圖」 <img>
        image.setAttribute("src", imgArr[i]); // 指定屬性 src 並指定「景點圖網址」
        let infoDiv=document.createElement("div"); // 建立 第二層 「景點資訊」 .info
        infoDiv.setAttribute("class", "info");
        infoDiv.setAttribute("id", "info-"+i);

        let attraction=document.getElementById("attraction-"+i); // 找到 第一層 景點欄位
        attraction.appendChild(image); // 將 第二層 「景點圖」 <img> 裝進 第一層
        attraction.appendChild(infoDiv); // 將 第二層 「景點資訊」.info 裝進 第一層

        // 建立 第三層 「景點名稱」、「捷運站」、「景點類型」
        let nameDiv=document.createElement("div"); // 「景點名稱」
        nameDiv.setAttribute("class", "name")
        let attrName=infoText(nameArr[i])
        nameDiv.appendChild(attrName)
        let mrtDiv=document.createElement("div"); // 「捷運站」
        mrtDiv.setAttribute("class", "mrt")
        let mrt=infoText(mrtArr[i])
        mrtDiv.appendChild(mrt)
        let categoryDiv=document.createElement("div"); // 「景點類型」
        categoryDiv.setAttribute("class", "category")
        let category=infoText(categoryArr[i])
        categoryDiv.appendChild(category)
        // 將「景點名稱」、「捷運站」、「景點類型」裝進 第二層
        let info=document.getElementById("info-"+i)
        info.appendChild(nameDiv)
        info.appendChild(mrtDiv)
        info.appendChild(categoryDiv)
    }
}

// 網頁 load 進來時產生前 12 筆預設「景點項目」 page=0
window.addEventListener("load", () => {
    let src="http://192.168.1.116:3000/api/attractions?page=0";  // local
    // let src="http://18.213.157.118:3000/api/attractions?page=0"; // EC2
    fetch(src).then((response)=>{
        return response.json();
    }).then((data)=>{
        for(let i=0;i<12;i++){
            imgArr.push(data['data'][i]['images'][0]);
            nameArr.push(data['data'][i]['name']);
            mrtArr.push(data['data'][i]['mrt']);
            categoryArr.push(data['data'][i]['category']);
        }
        attractionItems(0, 12)
    })
})

// 註冊 scroll 按鈕事件
// let load = document.getElementById("load");
// load.addEventListener("click", () => {
//     let titleNums = document.querySelectorAll(".title"); // 查詢 .title 的數量
//     // let titleNum=document.querySelector(".title")
//     let newTitles = 0;
//     if (titleArr.length - titleNums.length >= 8) { // 判斷要產生多少新的「景點項目」
//         newTitles = 8; // 剩餘項目超過 8 筆新的就產生 8筆
//     } else { // 不足 8 筆就產生剩餘的數量
//         newTitles = titleArr.length - titleNums.length;
//         document.getElementById("load").disabled = true; // 因不能再產生新的「景點項目」故 按鈕停用
//     }
//     attractionItems(titleNums.length, titleNums.length + newTitles) // 產生新的「景點項目」
// })