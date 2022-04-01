function createMemberUI(type, titleStr, btnStr, switchStr){ // 動態生成 signin/signup
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
    if(type==="signup"){  // 如果是 signup 就多加姓名 input
        let nameInput=document.createElement("input");
        setAttributes(
            nameInput, 
            {"type":"text", "placeholder":"輸入姓名", "class":"func-input", "id":`${type}-name`}
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
    
    // 結果訊息
    let funcMessage=document.createElement("div");
    funcMessage.setAttribute("id", "func-message");

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
    memberFuncDiv.appendChild(funcMessage);
    memberFuncDiv.appendChild(funcSwitch);

    document.addEventListener('touchmove', function(e) {
        e.preventDefault();
    }, { passive: false });
}

function closeUI(n){ // 移除最後 n 個子元素
    let header=document.getElementById("header-tag");
    for(let i=0;i<n;i++){
        header.lastChild.remove();
    }
}

function switchUI(typeId){ // 切換 登入 與 註冊 UI
    closeUI(2);
    if(typeId==="signin-switch"){
        createMemberUI("signup", "註冊會員帳號", "註冊新帳戶", "已經有帳戶了？點此登入");
    }else{
        createMemberUI("signin", "登入會員帳號", "登入帳戶", "還沒有帳戶？點此註冊");
    }
}

function showMessage(msg){ // 顯示 結果訊息
    let funcMessage=document.getElementById("func-message");
    if(funcMessage.lastChild){
        funcMessage.lastChild.remove();
    }
    let errorDiv=document.createElement("div");
    errorDiv.setAttribute("class", "message");
    let errorMsg=infoText(msg);
    errorDiv.appendChild(errorMsg);
    funcMessage.appendChild(errorDiv);
}

function clearInput(selector){  // 清空 input
    let input=document.querySelectorAll(selector);
    for(let i=0;i<input.length;i++){
        input[i].value="";
    }
}

// 右上角 登入/註冊
let funcBg=document.getElementsByClassName("header-func-bg");
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
        if(data['ok']){
            window.location.reload();
        }else{
            document.querySelector(".member-func").style.height="315px";
            let message=data['message'];
            showMessage(message);
        }
    }).catch((error)=>{
        console.log(error);
    })
    clearInput(".func-input");
}

function signup(){ // 註冊
    let name=document.getElementById("signup-name").value;
    let email=document.getElementById("signup-email").value;
    let pw=document.getElementById("signup-pw").value;
    let valid=0;
    if(/^[\u4E00-\u9FA50-9A-Za-z_]{2,20}$/i.test(name)){
        valid++;
    }else{
        document.querySelector(".member-func").style.height="372px";
        showMessage("請依格式輸入姓名");
    }
    if(/^[\w.-]+@[\w.-]+\.[A-Za-z]{2,6}$/i.test(email)){
        valid++;
    }else{
        document.querySelector(".member-func").style.height="372px";
        showMessage("請依格式輸入 Email");
    }
    if(/[0-9a-zA-Z]{4,20}$/i.test(pw)){
        valid++;
    }else{
        document.querySelector(".member-func").style.height="372px";
        showMessage("請依格式輸入密碼");
    }
    if(valid===3){
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
            document.querySelector(".member-func").style.height="372px";
            if(data['ok']){
                showMessage("註冊成功");
            }else{
                let message=data['message'];
                showMessage(message);
            }
        }).catch((error)=>{
            console.log(error);
        })
        clearInput(".func-input");
    }
}

function logout(){ // 登出
    fetch("/api/user", {
        method:"DELETE",
        credentials: 'include'
    }).then((response)=>{
        return response.json();
    }).then((data)=>{
        if(data['ok']){
            let header=document.getElementById("header");
            header.lastChild.remove();
            window.location.reload();
        }
    }).catch((error)=>{
        console.log(error);
    })
}