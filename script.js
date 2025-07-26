const BASE_URL="https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");



for(let select of dropdowns){
    for(currCode in countryList){
        let newOption = document.createElement("option");
        newOption.innerText= currCode;
        newOption.value=currCode;
        if(select.name ==="from" && currCode==="USD"){
            newOption.selected="selected";
        }else if(select.name === "to" && currCode ==="INR"){
            newOption.selected="selected";
        }
        select.append(newOption);
    }
    select.addEventListener("change",(evt)=>{
        updateFlag(evt.target);
    });
}

const updateEchangeRate = async () => {
    let amount = document.querySelector(".amount input");
    let amtVal = amount.value;
    if (amtVal === "" || amtVal < 1) {
        amtVal = 1;
        amount.value = "1";
    }

    const from = fromCurr.value.toLowerCase();
    const to = toCurr.value.toLowerCase();

    const URL = `${BASE_URL}/${from}.json`;

    try {
        let response = await fetch(URL);
        let data = await response.json();

        // Debug log
        console.log("API Data:", data);

        let rate = data[from][to];
        if (!rate) {
            msg.innerText = "Conversion rate not available.";
            return;
        }

        let finalAmount = (amtVal * rate).toFixed(2);
        msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
    } catch (error) {
        msg.innerText = "Failed to fetch exchange rate.";
        console.error("API Error:", error);
    }
};



const updateFlag = (element)=>{
    let currCode = element.value;
    let countryCode= countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;  
}


btn.addEventListener("click", (evt)=>{
    evt.preventDefault();
    updateEchangeRate();
    
});

window.addEventListener("load", ()=>{
    updateEchangeRate();
});

const swapIcon = document.getElementById("swap-icon");

swapIcon.addEventListener("click", () => {
    // Add animation class
    swapIcon.classList.add("animate-swap");

    // Remove the animation class after it's done to allow re-trigger
    setTimeout(() => {
        swapIcon.classList.remove("animate-swap");
    }, 400);

    // Swap currencies
    const temp = fromCurr.value;
    fromCurr.value = toCurr.value;
    toCurr.value = temp;

    // Update flags
    updateFlag(fromCurr);
    updateFlag(toCurr);

    // Update exchange rate
    updateEchangeRate();
});

