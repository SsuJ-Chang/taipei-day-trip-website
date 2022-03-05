window.addEventListener("load", ()=>{
    // 查詢景點名稱
    let search=document.getElementById("iconSearch")
    search.addEventListener("click", ()=>{
        let keywordInput=document.getElementById("keywordInput").value;  // 接收 input
        // let src="http://192.168.1.116:3000//api/attractions?keyword="+keywordInput
        let src="http://18.213.157.118:3000/api/attractions?keyword="+keywordInput
        fetch(src).then((response)=>{
            return response.json();  // 取得回應物件並轉為 JSON 格式
        }).then((data)=>{
            console.log(data)
        })
    })
})