console.log("Hello jee");
const API_KEY="cf358040940b12979b31f11c32e0f050";

//Example 1
function renderWeatherDetails(data){
   let newPara=document.createElement('p');
    newPara.textContent=`${data?.main?.temp.toFixed(2)} °C`

    document.body.appendChild(newPara);
}
async function fetchWheatherDetails(){

    try{ //10 , 13 mai error aa sakta hain
    let city="goa";

    //api call
    const response =await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);

    //Response in json format
    const data=await response.json();

    console.log("Weather data:->" , data);

    //showing particular data part on UI
    renderWeatherDetails(data);
    }
    catch(err){
      //handle the error here 
    }
}



//Example 2
async function getCustomWeatherDetails(){
    try{

    let latitude=17.6333;
    let longitude=18.3333;

    let response =await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`);

    let data=await response.json();
    console.log("Weather Details ", data);
    }
    catch(error){
        console.log("Error Found" , error);
    }
}


function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }
  
  function showPosition(position) {
    let lat=position.coords.latitude;
    let longi=position.coords.longitude;

    console.log(lat);
    console.log(longi);
  }