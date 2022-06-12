window.addEventListener("load", ()=>{
    let number=window.location.search.split("=");
    src=`/api/orders/${number[1]}`
    fetch("/api/user",{
        method: 'GET',
        credentials: 'include'
      }).then((response)=>{
          return response.json()
      }).then((data)=>{
          if(data['data']!==null){
            fetch(src).then(res=>res.json()).then((data)=>{
                if(data['error']){
                    window.location.href="..";
                }else if(data['data']===null){
                    // console.log(data);
                    document.getElementById("thankyou-start-content").innerHTML="";
                    let startContent=infoText(`，${data[`message`]}`)
                    document.getElementById("thankyou-start-content").appendChild(startContent);
                    document.getElementsByClassName("order-info")[0].innerHTML="";
                    document.querySelector("footer").style.height="726px";
                }else{
                    // console.log(data);
                    let orderNumber=infoText(data['data']['number'])
                    document.getElementsByClassName("order-number")[0].appendChild(orderNumber);
                    let orderAttraction=infoText(data['data']['trip']['attraction']['name'])
                    document.getElementsByClassName("order-attraction")[0].appendChild(orderAttraction);
                    let orderDate=infoText(data['data']['trip']['date'])
                    document.getElementsByClassName("order-date")[0].appendChild(orderDate);
                    let orderTime="";
                    if(data['data']['trip']['time']==="morning"){
                        orderTime=infoText("上午 9 點至上午 12 點 30 分");
                    }else{
                        orderTime=infoText("下午 2 點 30 分至下午 6 點 30 分");
                    }
                    document.getElementsByClassName("order-time")[0].appendChild(orderTime);
                    document.querySelector("footer").style.height="571px";
                }
            })
          }else{
            createMemberUI("signin", "登入會員帳號", "登入帳戶", "還沒有帳戶？點此註冊");
          }
      })
})