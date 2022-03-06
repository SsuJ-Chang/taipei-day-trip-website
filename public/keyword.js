window.addEventListener("load", ()=>{
    // 查詢景點名稱
    let search=document.getElementById("search");
    search.addEventListener("click", ()=>{
        let keywordInput=document.getElementById("keywordInput").value;  // 接收 input
        let src="http://192.168.1.116:3000/api/attractions?keyword="+keywordInput;  // local
        // let src="http://18.213.157.118:3000/api/attractions?keyword="+keywordInput;  // EC2
        // 清空所有 Array
        imgArr=[];
        nameArr=[];
        mrtArr=[]; 
        categoryArr=[]; 
        fetch(src).then((response)=>{
            return response.json();
        }).then((data)=>{
            for(let i=0;i<12;i++){
                let remove_obj=document.getElementById("attraction-"+i);
                remove_obj.remove();
            }
            for(i=0;i<data['data'].length;i++){
                imgArr.push(data['data'][i]['images'][0]);
                nameArr.push(data['data'][i]['name']);
                mrtArr.push(data['data'][i]['mrt']);
                categoryArr.push(data['data'][i]['category']);
            }
            attractionItems(0, data['data'].length)
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
})