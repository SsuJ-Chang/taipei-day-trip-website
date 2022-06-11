// 查詢景點名稱
let search=document.getElementById("search");
search.addEventListener("click", ()=>{
    // console.log("KEYWORD QUERY")
    let input=document.getElementById("keyword-input");
    let keywordInput=input.value;  // 接收 input
    src="api/attractions?keyword="+keywordInput;
    input.value="";  // 清空 input

    // page=0 並清空所有 Array
    page=0;
    idArr=[];
    imgArr=[];
    nameArr=[];
    mrtArr=[]; 
    categoryArr=[]; 
    
    observer.observe(footer);  // 重新設定觀察目標 避免失效
    
    if(fetching===false){
        fetching===true;
        fetch(src).then((response)=>{
            return response.json();
        }).then((data)=>{
            // console.log("回應資料", data);
            mainContent=document.getElementById("main");
            mainContent.innerHTML=""; // 移除 main 的所有元素
            //mainContent.textContent="";
            if(data['error']===true){
                errorMsg(data['message']);
                observer.unobserve(footer);  // 沒有資料就取消觀察目標 避免觸發 load.js
            }else{
                for(i=0;i<data['data'].length;i++){
                    idArr.push(data['data'][i]['id']);
                    imgArr.push(data['data'][i]['images'][0]);
                    nameArr.push(data['data'][i]['name']);
                    mrtArr.push(data['data'][i]['mrt']);
                    categoryArr.push(data['data'][i]['category']);
                }
                // console.log(idArr)
                createAttractions(page*12, page*12+data['data'].length);
                page=data['nextPage'];
                // console.log("下一頁" ,page);
                src="api/attractions?page="+page+"&keyword="+keywordInput;
                fetching===false;
            }
        }).catch(error=>{
            console.log(error);
            fetching===false;
        })
    }
})
// 查詢景點 input 鍵盤 Enter 和 查詢按鈕連結
let enter=document.getElementById("keyword-input");
enter.addEventListener("keyup", (e)=>{
    if(e.key==="Enter"){
        e.preventDefault();  // 防止執行預設動作 不加暫時不會產生問題
        document.getElementById("search").click();
    }
})