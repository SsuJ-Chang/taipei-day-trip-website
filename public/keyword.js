// 查詢景點名稱
let search=document.getElementById("search");
search.addEventListener("click", ()=>{
    let keywordInput=document.getElementById("keywordInput").value;  // 接收 input
    // src="http://192.168.1.116:3000/api/attractions?keyword="+keywordInput;  // local
    src="http://18.213.157.118:3000/api/attractions?keyword="+keywordInput;  // EC2
    
    // page=0 並清空所有 Array
    page=0;
    imgArr=[];
    nameArr=[];
    mrtArr=[]; 
    categoryArr=[]; 

    observer.observe(footer);  // 重新設定觀察目標 避免失效

    fetch(src).then((response)=>{
        return response.json();
    }).then((data)=>{
        console.log("回應資料", data);
        mainContent=document.getElementById("main");
        mainContent.innerHTML=""; // 移除 main 的所有元素
        //mainContent.textContent="";
        if(data['error']===true){
            errorMsg(data['message']);
        }else{
            for(i=0;i<data['data'].length;i++){
                imgArr.push(data['data'][i]['images'][0]);
                nameArr.push(data['data'][i]['name']);
                mrtArr.push(data['data'][i]['mrt']);
                categoryArr.push(data['data'][i]['category']);
            }
            createAttractions(page*12, page*12+data['data'].length);
            page=data['nextPage'];
            console.log("下一頁" ,page);
            // src="http://192.168.1.116:3000/api/attractions?page="+page+"&keyword="+keywordInput;
            src="http://18.213.157.118:3000/api/attractions?page="+page+"&keyword="+keywordInput;
        }
    }).catch(error=>{
        console.log(error);
    })
})
// 查詢景點 input 鍵盤 Enter 和 查詢按鈕連結
let enter=document.getElementById("keywordInput");
enter.addEventListener("keyup", (e)=>{
    if(e.key==="Enter"){
        e.preventDefault();  // 防止執行預設動作 不加暫時不會產生問題
        document.getElementById("search").click();
    }
})