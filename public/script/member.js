function createMemberUI(type, titleStr, btnStr, switchStr){ // 動態生成 signin
    let header=document.getElementById("header-tag");
    // 半透明黑底
    let funcBg=document.createElement("div");
    setAttributes(funcBg, {"class":"header-func-bg"});
    header.appendChild(funcBg);
    // 會員 form 最外層
    let memberFuncDiv=document.createElement("div");
    setAttributes(memberFuncDiv, {"class":"member-func"});
    header.appendChild(memberFuncDiv)

     // 最上面裝飾
    let funcDeco=document.createElement("div");
    setAttributes(funcDeco, {"class":"func-deco"});
    // 功能 Title
    let funcTitle=document.createElement("div");
    funcTitle.setAttribute("class", "func-title");
    let title=infoText(`${titleStr}`);
    funcTitle.appendChild(title);

    // 關閉按鈕
    let funcClose=document.createElement("img");
    setAttributes(funcClose ,{"src":"/pic/icon_close.png", "class":"func-close", "onclick":"closeUI(2)"});    

    // 表單：輸入內容與傳送按鈕
    let funcForm=document.createElement("div");
    setAttributes(funcForm, {"class":"func-form"});
    if(type==="signup"){
        let nameInput=document.createElement("input");
        setAttributes(
            nameInput, 
            {"type":"email", "placeholder":"輸入姓名", "class":"func-input","id":`${type}-name`}
        )
        let memberFunc=document.querySelector(".member-func");
        memberFunc.style.height="332px";
        funcForm.appendChild(nameInput);
    }
    let emailInput=document.createElement("input");
    setAttributes(
        emailInput, 
        {"type":"email", "placeholder":"輸入電子信箱", "class":"func-input","id":`${type}-email`}
    )
    let pwInput=document.createElement("input");
    setAttributes(
        pwInput, 
        {"type":"password", "placeholder":"輸入密碼", "class":"func-input", "id":`${type}-pw`}
    )
    let btn=document.createElement("button");
    setAttributes(btn, {"class":"func-btn", "id":`${type}-btn`, "onclick":`${type}()`});
    let btnText=infoText(`${btnStr}`);
    btn.appendChild(btnText);
    funcForm.appendChild(emailInput);
    funcForm.appendChild(pwInput);
    funcForm.appendChild(btn);

    // 切換功能
    let funcSwitch=document.createElement("div");
    setAttributes(funcSwitch, {"class":"switch", "id":`${type}-switch`, "onclick":"switchUI(this.id)"})
    let switchP=document.createElement("p");
    funcSwitch.appendChild(switchP);
    let switchText=infoText(`${switchStr}`);
    switchP.appendChild(switchText);

    memberFuncDiv.appendChild(funcDeco);
    memberFuncDiv.appendChild(funcTitle);
    memberFuncDiv.appendChild(funcClose);
    memberFuncDiv.appendChild(funcForm);
    memberFuncDiv.appendChild(funcSwitch);
}

function closeUI(n){ // 移除最後 n 個子元素 來關閉 UI
    let header=document.getElementById("header-tag");
    for(let i=0;i<n;i++){
        header.lastChild.remove();
    }
}

function switchUI(typeId){
    closeUI(2);
    if(typeId==="signin-switch"){
        createMemberUI("signup", "註冊會員帳號", "註冊新帳戶", "已經有帳戶了？點此登入");
    }else{
        createMemberUI("signin", "登入會員帳號", "登入帳戶", "還沒有帳戶？點此註冊");
    }
}

// 右上角 登入/註冊
let funcBg=document.getElementsByClassName("header-func-bg");
let signinUI=document.getElementById("signin-hide");
let signinup=document.getElementById("signinup");
signinup.addEventListener("click", ()=>{
    createMemberUI("signin", "登入會員帳號", "登入帳戶", "還沒有帳戶？點此註冊")
});

function signin(){ // 登入
    let email=document.getElementById("signin-email").value;
    let pw=document.getElementById("signin-pw").value;
    fetch("/api/user", {
        method:"PATCH",
        body: JSON.stringify({
            "email": `${email}`,
            "password": `${pw}`
          }),
        headers: {
            "Content-type": "application/json"
        }
    }).then((response)=>{
        return response.json();
    }).then((data)=>{
        console.log(data);
        if(data['ok']){
            closeUI(2);
            // 顯示登出顯示與功能
            let header=document.getElementById("header");
            header.removeChild(header.children[2]);
            // header.lastChild.remove(); // 不知道為何要砍兩次 這才生效
            let logout=document.createElement("div");
            setAttributes(logout, {"class":"item", "id":"logout", "onclick":"logout()"});
            let logoutText=infoText("登出");
            logout.appendChild(logoutText);
            header.appendChild(logout);
        }
    }).catch((error)=>{
        console.log(error);
    })
    document.getElementById("signin-email").value="";
    document.getElementById("signin-pw").value="";
}

function signup(){ // 註冊
    let name=document.getElementById("signup-name").value;
    let email=document.getElementById("signup-email").value;
    let pw=document.getElementById("signup-pw").value;
    fetch("/api/user", {
        method:"POST",
        body: JSON.stringify({
            "name": `${name}`,
            "email": `${email}`,
            "password": `${pw}`
          }),
        headers: {
            "Content-type": "application/json"
        }
    }).then((response)=>{
        return response.json();
    }).then((data)=>{
        console.log(data);
        if(data['ok']){
            closeUI(2);
        }
    }).catch((error)=>{
        console.log(error);
    })
}

function logout(){ // 登出
    fetch("/api/user", {
        method:"DELETE"
    }).then((response)=>{
        return response.json();
    }).then((data)=>{
        let header=document.getElementById("header");
        header.lastChild.remove();
        window.location.reload();
    }).catch((error)=>{
        console.log(error);
    })
}

// 預定行程
let switchBooking=document.getElementById("itinerary");
switchBooking.addEventListener("click", ()=>{
    fetch("/api/user").then((response)=>{
        return response.json();
    }).then((data)=>{
        console.log(data);
    }).catch((error)=>{
        console.log(error);
    })
})