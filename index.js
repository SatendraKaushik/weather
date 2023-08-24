const usertab = document.querySelector("[data-userweather]");
const searchtab = document.querySelector("[data-searchweather]");
const usercontainer = document.querySelector(".weather-container");
const notfound=document.querySelector("[Errorfound]");

const grantaccess = document.querySelector(".grant-location");
const searchform = document.querySelector("[data-searchform]");
const loadingscreen = document.querySelector(".loading-container");
const user = document.querySelector(".user-info-cantainer");

// initially variable need?
let current = usertab;
const API_KEY = "cc7c736bd37760b389467b5ffd85a0c1";
current.classList.add("current-tab");
getfromSessionStroage();

// switch the tab
function switchtab(clicktab) {
    if (clicktab != current) {
        current.classList.remove("current-tab");
        current = clicktab;
        current.classList.add("current-tab");
        if (!searchform.classList.contains("active")) {
            //   check wether search form is visible or not
            user.classList.remove("active");

            grantaccess.classList.remove("active");
            searchform.classList.add("active");
        }
        else {
            // maai phale search wale tab pr tha and i am switch from  it 
            searchform.classList.remove("active");
            user.classList.remove("active");
            // when i am not your weather i have show weather so to get coordinate call a function 
            getfromSessionStroage();
        }
    }

}
usertab.addEventListener("click", () => {
    // pass clicked tab as a input
    switchtab(usertab);
});
searchtab.addEventListener("click", () => {
    // pass clicked tab as a input
    switchtab(searchtab);
});
function getfromSessionStroage() {

    const localcoordinate = sessionStorage.getItem("user-coordinate");
    if (!localcoordinate) {
        // agar local coodinate is not present 
        grantaccess.classList.add("active");
    }
    else {
        const coordinate = JSON.parse(localcoordinate);
        fetchuserweather(coordinate);
    }
}
async function fetchuserweather(coordinate) {
    const { lat, lon } = coordinate;
    // make grantcontainer invisible
    grantaccess.classList.remove("active");
    // make loader visible
    loadingscreen.classList.add("active");
    // api call
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        loadingscreen.classList.remove("active");
        user.classList.add("active");
        renderweather(data);
    }
    catch (error) {
        loadingscreen.classList.remove("active");
        // error 
            // console.log("User - Api Fetch Error", error.message);
     
    
    notfound.style.display = "none";
    notfound.innerText = `Error: ${error?.message}`;
    notfound.addEventListener("click", fetchsearchweather);
    }
}
function renderweather(weatherinfo) {
    // fecth the element
    const cityname = document.querySelector("[data-cityname]");
    const country = document.querySelector("[data-countryicon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const wicon = document.querySelector("[data-weathericon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloud = document.querySelector("[data-cloudness]");
    // fetch value from weather info 
    cityname.innerText = weatherinfo?.name;
    country.src = `https://flagcdn.com/144x108/${weatherinfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherinfo?.weather?.[0]?.description;
    wicon.src = `http://openweathermap.org/img/w/${weatherinfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherinfo?.main?.temp} °C`
    windspeed.innerText = `${weatherinfo?.wind?.speed}m/s`;
    humidity.innerText = `${weatherinfo?.main?.humidity}%`;
    cloud.innerText = `${weatherinfo?.clouds?.all}%`;



}
function getlocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showpoistion);
    }
    else {
        // hw show an alter for no geolaction available
        grantaccessbtn.style.display = "none";
    messageText.innerText = "Geolocation is not supported by this browser.";
        
    }
}
function showpoistion(poistion) {
    const usercoordinate = {
        lat: poistion.coords.latitude,
        lon: poistion.coords.longitude  };
    sessionStorage.setItem("user-coordinate", JSON.stringify(usercoordinate));
    fetchuserweather(usercoordinate);
}

const grantaccessbtn = document.querySelector("[data-grantAccess]");
grantaccessbtn.addEventListener("click", getlocation);

const searchinput = document.querySelector("[data-searchinput]");
searchform.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityname = searchinput.value;
    if (cityname === "") { return; }
    else { fetchsearchweather(cityname); }
})
async function fetchsearchweather(city) {
    loadingscreen.classList.add("active");
    user.classList.remove("active");
    grantaccess.classList.remove("active");
    try {
        const response = await
            fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        loadingscreen.classList.remove("active");
        user.classList.add("active");
        renderweather(data);
    }
    catch (error) { 
        
        loadingscreen.classList.remove("active");
      notfound.classList.add("active");
      
    //   notfound.innerText = `${error?.message}`;
    }
}