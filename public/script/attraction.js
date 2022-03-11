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
        let nameDiv=document.getElementById("name");
        let locationDiv=document.getElementById("location");
        let name=infoText(data['data']['name']);
        let location=infoText(data['data']['category']+" at "+data['data']['mrt']+"站")
        nameDiv.append(name);
        locationDiv.append(location);

        let descDiv=document.getElementById("description");
        let addressDiv=document.getElementById("address");
        let transportDiv=document.getElementById("transport");
        let description=infoText(data['data']['description']);
        let address=infoText(data['data']['address']);
        let transport=infoText(data['data']['transport']);
        descDiv.append(description);
        addressDiv.append(address);
        transportDiv.append(transport);

    }).catch((error)=>{
        console.log(error)
    })
})