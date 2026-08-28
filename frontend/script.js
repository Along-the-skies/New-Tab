timeElement = document.getElementById("timeLbl");
weatherCard = document.querySelector(".weather-card")
const searchInput = document.querySelector(".search");
const addShortcut = document.getElementById("addShortcut");
const shortcutsContainer = document.querySelector(".shortcuts");

const rawTime = new Date();
let hours = rawTime.getHours();
let am = false

if (hours <= 12){
    am = true
}else{
    am = false
}
if (hours > 12){
    hours = hours-12
}

if (hours === 0) {
    hours = 12
}

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


searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        const query = searchInput.value.trim();
        if (query) {
            window.location.href =
                `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        }
    }
});




function loadShortcuts() {
    const savedShortcuts = JSON.parse(
        localStorage.getItem("quickLaunches") || "[]"
    );

    savedShortcuts.forEach(shortcut => {
        createShortcut(shortcut.name, shortcut.url);
    });
}

function createShortcut(name, url) {
    const shortcut = document.createElement("a");

    shortcut.className = "shortcut-card";
    shortcut.href = url;
    shortcut.target = "_blank";

    shortcut.innerHTML = `
        <img src="https://www.google.com/s2/favicons?domain=${encodeURIComponent(url)}&sz=64">
        <h1>${name}</h1>
    `;

    // Put new shortcut before the + button
    shortcutsContainer.insertBefore(shortcut, addShortcut);
}

addShortcut.addEventListener("click", () => {
    const name = prompt("Enter a name for the shortcut:");

    if (!name || !name.trim()) {
        return;
    };

    const urlInput = prompt("Enter the website URL:");

    if (!urlInput || !urlInput.trim()) {
        return;
    }

    let url = urlInput.trim();

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = `https://${url}`;
    }

    const savedShortcuts = JSON.parse(
        localStorage.getItem("quickLaunches") || "[]"
    );

    savedShortcuts.push({
        name: name.trim(),
        url: url
    });

    localStorage.setItem(
        "quickLaunches",
        JSON.stringify(savedShortcuts)
    );

    createShortcut(name.trim(), url);
});

loadShortcuts();

const micButton = document.getElementById("mic");

const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;

    micButton.addEventListener("click", (event) => {
        event.preventDefault();
        recognition.start();
    });

    recognition.addEventListener("result", (event) => {
        const transcript =
            event.results[0][0].transcript.trim();

        if (transcript) {
            searchInput.value = transcript;

            window.location.href =
                `https://www.google.com/search?q=${encodeURIComponent(transcript)}`;
        }
    });

    recognition.addEventListener("error", (event) => {
        console.error("Voice search error:", event.error);
    });
} else {
    micButton.addEventListener("click", (event) => {
        event.preventDefault();
        alert("Voice search is not supported in this browser.");
    });
}


const fileInput = document.getElementById("fileInput");
const addButton = document.getElementById("add");

addButton.addEventListener("click", () => {
    fileInput.click();
});

fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];

    if (!file) {
        return;
    }

    if (!file.type.startsWith("image/")) {
        alert("Only image files are supported.");
        fileInput.value = "";
        return;
    }

    window.open("https://lens.google.com/", "_blank");

    fileInput.value = "";
});