let fetching=false; // 是否正在 fetch 

// 觀察畫面是否到底部 以 footer 為目標
let options={  // 觸發條件
    root:document.querySelector("#scroll"),  // 範圍
    rootMargin: '0px',  // 範圍的 margin
    threshold: 0.9,  // 目標進入範圍多少比例
};
let callback=(e)=>{ // 觸發條件後要處理的回呼函式
    if(e[0].isIntersecting){  // 
        console.log("Fetching前狀態", fetching);
        if(page!==null && fetching===false){  // 判斷 page 是否為 null 且 沒有發出請求狀態為 false
            fetching=true;  // 可以發出請求就把請求狀態改為 true
            console.log("Fetching後狀態", fetching);
            fetch(src).then(response=>{
                return response.json();
            }).then((data)=>{
                console.log("回應資料", data);
                for(let i=0;i<data['data'].length;i++){
                    idArr.push(data['data'][i]['id']);
                    imgArr.push(data['data'][i]['images'][0]);
                    nameArr.push(data['data'][i]['name']);
                    mrtArr.push(data['data'][i]['mrt']);
                    categoryArr.push(data['data'][i]['category']);
                }
                createAttractions(page*12, page*12+data['data'].length)
                page=data['nextPage'];
                console.log("下一頁" ,page);
                src="api/attractions?page="+page;
                fetching=false;  // 當此次 fetch 的結果都處理完成 就把請求狀態改為 false
                console.log("完成 response 處理 切換請求狀態", fetching);
            }).catch((error)=>{
                console.log("連線失敗", error);
                fetching=false;  // 當此次 fetch 的結果都處理完成 就把請求狀態改為 false
                console.log("完成 response 處理 切換請求狀態", fetching);
            })
        }else{
            observer.unobserve(footer);  // 取消觀察目標
        }
    }
}; 
// callback, options 要在前建立 IntersectionObserver API 之前
let observer = new IntersectionObserver(callback, options);  // 建立 IntersectionObserver
const footer=document.querySelector("footer");  // 範圍內目標
observer.observe(footer);  // 設定觀察目標