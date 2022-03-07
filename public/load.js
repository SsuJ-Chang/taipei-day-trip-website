// 觀察畫面是否到底部 以 footer 為目標
let options={  // 觸發條件
    root:document.querySelector("#scroll"),  // 範圍
    rootMargin: '0px',  // 範圍的 margin
    threshold: 0.9,  // 目標進入範圍多少比例
};
let callback=(e)=>{ // 觸發條件後要處理的回呼函式
    if(e[0].isIntersecting){
        if(page!==null){  // 判斷 page 是否為 null
            fetch(src).then(response=>{
                return response.json();
            }).then((data)=>{
                console.log("回應資料", data);
                for(let i=0;i<data['data'].length;i++){
                    imgArr.push(data['data'][i]['images'][0]);
                    nameArr.push(data['data'][i]['name']);
                    mrtArr.push(data['data'][i]['mrt']);
                    categoryArr.push(data['data'][i]['category']);
                }
                createAttractions(page*12, page*12+data['data'].length)
                page=data['nextPage'];
                console.log("下一頁" ,page);
                // src="http://192.168.1.116:3000/api/attractions?page="+page;
                src="http://18.213.157.118:3000/api/attractions?page="+page;
            }).catch((error)=>{
                console.log("連線失敗", error);
            })
        }else{
            observer.unobserve(footer);  // 取消觀察目標
        }
    }
}; 
let observer = new IntersectionObserver(callback, options);  // 建立 IntersectionObserver
const footer=document.querySelector("footer");  // 範圍內目標
observer.observe(footer);  // 設定觀察目標