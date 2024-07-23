const userTab=document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const userContainer=document.querySelector(".weather-container");
const grantAccessContainer=document.querySelector(".grant-location-container");
const searchForm=document.querySelector("[data-searchForm]");
const loadingScreen=document.querySelector(".loading-container");
const userInfoContainer=document.querySelector(".user-info-container");

//initially variables
let currentTab=userTab;
const API_KEY="cf358040940b12979b31f11c32e0f050";
currentTab.classList.add("current-tab");
getfromSessionStorage();

//switching
function switchTab(clickedTab){
    if(currentTab!=clickedTab){
        //bg color remove or add
        currentTab.classList.remove("current-tab");
        currentTab=clickedTab;
        currentTab.classList.add("current-tab");


        if(!searchForm.classList.contains("active")){
            //kya search form wala container is invisible,if yes then make it visible
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            //search pe tha , your weather pe click
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            //ab main your weather mai aa gaya huin , toh weather bhi display karna hain , so let's check local storage first for coordinates , if we haved saved from there
            getfromSessionStorage();
        }
    }
}

userTab.addEventListener("click",()=>{
    //pass clicked tab as input parameter
    switchTab(userTab);
});

searchTab.addEventListener("click",()=>{
    //pass clicked tab as input parameter
    switchTab(searchTab);
});

//check if coordinates are already present in session storage
function getfromSessionStorage(){
    //local storage mai user coordinates hain ki nahi
    const localCoordinates=sessionStorage.getItem("user-coordinates");

    if(!localCoordinates){
        //agar localCoordinates nahi hain -> no location access
        grantAccessContainer.classList.add("active");
    }
    else{
        //present so api call
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

//api call
async function fetchUserWeatherInfo(coordinates){
    const {lat,lon}=coordinates;
    //make grant container invisible , loader show
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");

    //API CALL
    try{

        let response =await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        let data=await response.json();
        //data aa gaya hain -> remove loader
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        loadingScreen.classList.remove("active");
        console.log("rtyu");
        //HW
    }
}

function renderWeatherInfo(weatherInfo){
   //firstly , we have to fetch the elements
   const cityName=document.querySelector("[data-cityName]");
   const countryIcon=document.querySelector("[data-countryIcon]")
   const desc=document.querySelector("[data-weatherDesc]");
   const weatherIcon=document.querySelector("[data-weatherIcon]");
   const temp=document.querySelector("[data-temp]");
   const windspeed=document.querySelector("[data-windspeed]");
   const humidity=document.querySelector("[data-humidity]");
   const cloudiness=document.querySelector("[data-cloudiness]");

   //fetch values from weatherInfo object and put in UI
   cityName.innerText=weatherInfo?.name;
   countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
   desc.innerText = weatherInfo?.weather?.[0]?.description;
   weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
   temp.innerText=`${weatherInfo?.main?.temp}°C`;
   windspeed.innerText=`${weatherInfo?.wind?.speed}m/s`;
   humidity.innerText=`${weatherInfo?.main?.humidity}%`;
   cloudiness.innerText=`${weatherInfo?.clouds?.all}%`;


}

function getLocation(){
    //geolocation api supported or not
    if(navigator.geolocation){
         navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
    //HW show an alert for no geolocation support
    }
}

function showPosition(position){
    //user location find
    const userCoordinates={
        lat:position.coords.latitude,
        lon:position.coords.longitude
    }
    //store coordinate in sessionStorage
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    //show on UI
    fetchUserWeatherInfo(userCoordinates);
}
const grantAccessButton=document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener('click',getLocation);

let searchInput= document.querySelector("[data-searchInput]");
searchForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    let cityName=searchInput.value;
    if(cityName==="") 
      return;
    else
      fetchSearchWeatherInfo(cityName);
});

async function fetchSearchWeatherInfo(city){

    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    try{
        //api call
    const response =await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);

    //Response in json format
    const data=await response.json();

    loadingScreen.classList.remove("active");
    //weather show
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
    }
    catch(err){

    }
};