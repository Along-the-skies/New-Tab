timeElement = document.getElementById("timeLbl");
weatherCard = document.querySelector(".weather-card")

const rawTime = new Date();
let hours = rawTime.getHours();
let am = false

if (hours <= 12){
    am = true
}else{
    am = false
}

hours = hours-12

let minutes = rawTime.getMinutes();
if (String(minutes).length<2){
    minutes = `0${minutes}`;
} 


let time = `${hours}:${minutes}`;
console.log(rawTime);
console.log(time);

if (am===true){
    document.getElementById("apm").innerHTML=`am`
} else {
    document.getElementById("apm").innerHTML=`pm`
}

timeElement.innerHTML = time;


document.addEventListener("mousemove",function(event){
    if (event.clientX>window.innerWidth - 20){
    weatherCard.classList.add("show")
    weatherCard.style.top=`${event.clientY}px`;
    }

    else {
        weatherCard.classList.remove("show")
    }
})



fetch("/api/wallpaper")
    .then(response => response.json())
    .then(data => {
        document.body.style.backgroundImage = `url("${data.url}")`;
    });

function getWeatherStatus(code){
    if (code === 0 ) {
        return "Sunny";
    }

    if (code >= 1 && code <= 3){
        return "Cloudy";
    }

    if (code >= 45 && code <= 48){
        return "Foggy";
    }

    if (code >= 51 && code <= 67){
        return "Rain";
    }

    if (code >= 71 && code <= 77){
        return "Snow";
    }

    if (code >= 80 && code <= 82) {
        return "Rain Showers";
    }

    if (code >= 95) {
        return "Thunderstorm";
    }

    return "Unknown"
}

navigator.geolocation.getCurrentPosition(function(position){
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    fetch(`/api/weather?lat=${lat}&lon=${lon}`)
        .then(response => response.json())
        .then(data => {
            const status = getWeatherStatus(data.weather_code);
            console.log(data);
            console.log(status)
            document.getElementById("status").innerHTML = `${status}`;
            document.getElementById("location").innerHTML = `${data.location}`;
            document.getElementById("temperature").innerHTML = `${data.temperature}°C`;
        })
})