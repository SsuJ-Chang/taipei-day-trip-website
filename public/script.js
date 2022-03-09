function infoText(s) { // 用 createTextNode 建立文字節點 
    let text=document.createTextNode(s);
    return text;
}

function createAttractions(first, n){ // 建立「景點項目」
    for (let i=first;i<n;i++){
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
        let mrt=infoText(mrtArr[i]+"站")
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

function errorMsg(message){  // 顯示錯誤
    let messageDiv=document.createElement("div");
    messageDiv.setAttribute("class", "errorMsg")
    let errorMessage=infoText(message)
    messageDiv.appendChild(errorMessage)
    let main=document.getElementById("main");
    main.appendChild(messageDiv);
}