const flipSound = new Audio("pageturn.mp3");
const fireSound = new Audio("fireworks.mp3");

const pool=[

...Array(2).fill("SSS상"),

...Array(2).fill("SS상"),

...Array(8).fill("A상"),

...Array(2).fill("B상"),

...Array(16).fill("C상"),

...Array(16).fill("D상"),

...Array(16).fill("E상"),

...Array(16).fill("F상")

];

pool.sort(()=>Math.random()-0.5);


const card=document.getElementById("card");

const reward = document.getElementById("reward");

const reset = document.getElementById("reset");

card.onclick=()=>{

const cardInner = document.querySelector(".card-inner");

// 이미 뒷면이면 앞면으로 되돌리기
if(cardInner.classList.contains("flipped")){

    cardInner.classList.remove("flipped");

    reward.textContent="";

    return;

}

if(pool.length==0){

reward.innerHTML="쿠지 소진!";

reset.style.display="block";

return;

}

flipSound.play();

cardInner.classList.add("flipped");

setTimeout(()=>{

const r=pool.pop();

reward.textContent=r;

if(["SSS상","SS상","A상","B상"].includes(r)){

fireSound.play();

confetti({

particleCount:250,

spread:180,

origin:{y:0.6}

});

}

},350);

}

document.body.onclick=(e)=>{

if(e.target.closest("#card")) return;

const cardInner = document.querySelector(".card-inner");

if (cardInner.classList.contains("flipped")) {

    cardInner.classList.remove("flipped");

    reward.textContent = "";

}

}

reset.onclick=()=>{

location.reload();

}