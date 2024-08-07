const typingForm= document.querySelector('.typing-form');
const chatList=document.querySelector('.chat-list')
const API_KEY='AIzaSyC89EvmPtrJSOYBMpGsTHeCH6GCJklNt3M';
const myApi=`https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`
const toggelThem=document.querySelector('#toggel-light')
const deletButton=document.querySelector('.delet-button')
const headers=document.querySelector('.header')
let gemingApi='';
let isresponseGenerating=false;
const suggsestions=document.querySelectorAll('.suggtion-cards')
let userMassage=null;
const loadLocalStoarge=()=>{
    const saveCat=localStorage.getItem('save-chat')
    const isLightMode=(localStorage.getItem("themeColor")==="light_mode"?document.body.classList.toggle("light-mode"):'')
    toggelThem.innerText=isLightMode?"dark_mode":"light_mode"
    chatList.innerHTML=saveCat||'';
    headers.classList.remove('d-none')
    document.body.classList.toggle('hideheader',saveCat)
    chatList.scrollTo(0,chatList.scrollHeight)
}
loadLocalStoarge();
 const handelOutgoingchat=()=>{
 userMassage=document.querySelector('.input-typing').value.trim()||userMassage;
if(!userMassage||isresponseGenerating)return;
isresponseGenerating=true;
const cartona=`
     <div class="massage-content">
          <img src="gemini-clone-html-css-javascript-images/images/user.jpg" alt="">
          <p>${userMassage}</p>
        </div>
    `
    let newElement =document.createElement('div')
    newElement.classList.add('massage','incoming')
newElement.innerHTML+=cartona
    chatList.appendChild(newElement)
    typingForm.reset();
    headers.classList.remove('d-none')
    document.body.classList.add('hideheader')
    chatList.scrollTo(0,chatList.scrollHeight)
    setTimeout(showAnimation,500)
}

const typingEffect=(text,textElement,newElement)=>{
const words=text.split(' ')    
let currntIndex=0;
const typinInterval=setInterval(()=>{
    textElement.innerText+=(currntIndex===0?'':' ')+words[currntIndex++]
    if (currntIndex===words.length) {
     clearInterval(typinInterval) 
     isresponseGenerating=false;
     localStorage.setItem('save-chat',chatList.innerHTML)  
     newElement.querySelector('.iconn').classList.remove("d-none")
     chatList.scrollTo(0,chatList.scrollHeight)
    }
},75)
}

const showAnimation=()=>{
   const cartona =` <div class="massage-content">
          <img class="avatar" src="gemini-clone-html-css-javascript-images/images/gemini.svg" alt="">
          <p class="text"></p>
          <div class="loding-indicator">
            <div class="loading-bar"></div>
            <div class="loading-bar"></div>
            <div class="loading-bar last"></div>
          </div>
        </div>  
          <span onClick="copyMassage(this)" class="iconn d-none material-symbols-outlined"> content_copy </span>
        `
        let newElement =document.createElement('div')
        newElement.classList.add('massage','incoming','loading')
    newElement.innerHTML+=cartona
        chatList.appendChild(newElement)
        chatList.scrollTo(0,chatList.scrollHeight)
        getApi(newElement)
}
const copyMassage=(copyElement)=>{
    const massageText=chatList.querySelector(".text").innerHTML 
    navigator.clipboard.writeText(massageText);
    copyElement.innerText="done"
    setTimeout(()=>{
        copyElement.innerText="content_copy"
    },1000)
}
const getApi=async (newElement)=>{
    const textElement=newElement.querySelector(".text")
    try{
        const response=await fetch(myApi,{
            method:'post',
            headers:{'content-Type':'aplication-json'},
            body:JSON.stringify(
                {
                    contents:[{
                        role:'user',
                        parts:[{text: userMassage}]
                    }]
                }
            )
        })
        const myData = await response.json()
        const gemingApi=myData.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g,'$1')
        typingEffect(gemingApi,textElement,newElement)  
    }catch(error){
        console.log(error)
    }finally{
       newElement.classList.remove("loading")
    }
}
suggsestions.forEach((suggtion)=>{
    suggtion.addEventListener('click',()=>{
        userMassage=suggtion.querySelector('h4').innerText;
        handelOutgoingchat()
        
    })
})
toggelThem.addEventListener('click',()=>{
   const isLightMode= document.body.classList.toggle('light-mode');
   localStorage.setItem("themeColor",isLightMode?'light_mode':'dark_mode')
   toggelThem.innerText=isLightMode?"dark_mode":"light_mode"
})
deletButton.addEventListener('click',()=>{
if (confirm('are you sure to delet all massage?')) {
        localStorage.removeItem('save-chat')
        loadLocalStoarge()
}})

 typingForm.addEventListener('submit',function (e) {
    e.preventDefault();
    const userMessage = handelOutgoingchat();
    if (userMessage) {
        handelOutgoingchat()
        showAnimation()
        
        
    }

}
)
