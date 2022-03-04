window.addEventListener("load", ()=>{
    // 查詢景點名稱
    let query=document.getElementById("queryBtn")
    query.addEventListener("click", ()=>{
        let queryInput=document.getElementById("queryKeyword").value;  // 接收 input
        let src="http://192.168.50.177:3000/api/attractions?keyword="+queryInput
        // let src="http://18.213.157.118:3000/api/attractions?keyword="+queryInput
        fetch(src).then((response)=>{
            return response.json();  // 取得回應物件並轉為 JSON 格式
        }).then((data)=>{
            console.log(data)
        })
    })
})