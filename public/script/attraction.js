// 抓到 click 事件的 id 後跳轉 attraction/<id>
// id 帶入 src fetch 取得資料 

window.addEventListener("load", ()=>{
    let path=window.location.pathname.split('/');
    id=path[2];
    src=`/api/attraction/${id}`
    console.log(src)
    // 依照景點編號 fetch
    fetch(src).then((response)=>{
        return response.json();
    }).then((data)=>{
        console.log(data);
    }).catch((error)=>{
        console.log(error)
    })
})