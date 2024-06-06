let dynamicList = {
    Kolkata: ["Visakhapatnam", "Patna", "Ranchi"],
    Chennai: ["Bengaluru", "Coimbatore", "Hyderabad"],
    Bengaluru: ["Kochi", "Chennai", "Mumbai"],
    Mumbai: ["Panaji", "Bengaluru", "Ahmedabad"],
    Delhi: ["Ahmedabad", "Amritsar", "Lucknow"],
    Ahmedabad: ["Delhi", "Mumbai"],
    Kochi: ["Bengaluru", "Panaji"],
    Panaji: ["Mumbai", "Kochi"],
    Hyderabad: ["Visakhapatnam", "Chennai"],
    Visakhapatnam: ["Hyderabad", "Kolkata"],
    Ranchi: ["Kolkata"],
    Coimbatore: ["Chennai"],
    Amritsar: ["Delhi"],
    Lucknow: ["Delhi"],
};

async function getCity(cityName) {
    const res = await fetch('/mongo/get-location', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'city': cityName
        })
    })
    const data = await res.json()
    return [data.latitude, data.longitude]
}

async function getStation(cityName) {
    const res = await fetch('/mongo/get-station', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'city': cityName
        })
    })
    const data = await res.json()
    return [data.latitude, data.longitude]
}

function changeSource(value) {
    if (value.length === 0)
        document.getElementById("destination").innerHTML = "<options><options>";
    else {
        let options = "";
        for (categoryId in dynamicList[value]) {
            options +=
                "<option value = " +
                dynamicList[value][categoryId] +
                ">" +
                dynamicList[value][categoryId] +
                "</options>";
        }
        document.getElementById("destination").innerHTML = options;
    }
}

let currentCity = '';

async function routeSelection(place1, place2) {

    let sourceCity = document.getElementById("source").value;
    let destinationCity = document.getElementById("destination").value;

    currentCity = sourceCity;

    if (sourceCity === "---Choose Source---" || destinationCity === "---Choose Destination---") {
        document.getElementById("routeDisplay").innerHTML = "<p style='color : red;'>* Required Field</p>";
        return;
    }
    if (sourceCity === place1) {
        if (destinationCity === place2)
            await mumbaipanaji();
        else if (destinationCity === "Bengaluru")
            await mumbaibengaluru();
        else if (destinationCity === "Ahmedabad")
            mumbaiahmedabad();
    }

    if (sourceCity === "Mumbai") {
        if (destinationCity === "Panaji")
            await mumbaipanaji();
        else if (destinationCity === "Bengaluru")
            await mumbaibengaluru();
        else if (destinationCity === "Ahmedabad")
            mumbaiahmedabad();
    }

    else if (sourceCity === "Kolkata") {
        if (destinationCity === "Ranchi")
            await kolkataranchi();
        else if (destinationCity === "Visakhapatnam")
            await kolkatavisakhapatnam();
        else if (destinationCity === "Patna")
            kolkatapatna();
    }

    else if (sourceCity === "Delhi") {
        if (destinationCity === "Ahmedabad")
            await delhiahmedabad();
        else if (destinationCity === "Amritsar")
            await delhiamritsar();
        else if (destinationCity === "Lucknow")
            await delhilucknow();
    }

    else if (sourceCity === "Chennai") {
        if (destinationCity === "Bengaluru")
            await chennaibengaluru();
        else if (destinationCity === "Coimbatore")
            await chennaicoimbatore();
        else if (destinationCity === "Hyderabad")
            await chennaihyderabad();
    }

    else if (sourceCity === "Bengaluru") {
        if (destinationCity === "Chennai")
            await chennaibengaluru();
        else if (destinationCity === "Kochi")
            await bengalurukochi();
        else if (destinationCity === "Mumbai")
            await mumbaibengaluru();
    }

    else if (sourceCity === "Kochi") {
        if (destinationCity === "Panaji")
            await kochipanaji();
        else if (destinationCity === "Bengaluru")
            await bengalurukochi();
    }

    else if (sourceCity === "Panaji") {
        if (destinationCity === "Kochi")
            await kochipanaji();
        else if (destinationCity === "Mumbai")
            await mumbaipanaji();
    }

    else if (sourceCity === "Ahmedabad") {
        if (destinationCity === "Delhi")
            await delhiahmedabad();
        else if (destinationCity === "Mumbai")
            await mumbaiahmedabad();
    }

    else if (sourceCity === "Hyderabad") {
        if (destinationCity === "Chennai")
            await chennaihyderabad();
        else if (destinationCity === "Visakhapatnam")
            await hyderabadvisakhapatnam();
    }

    else if (sourceCity === "Visakhapatnam") {
        if (destinationCity === "Hyderabad")
            await hyderabadvisakhapatnam();
        else if (destinationCity === "Kolkata")
            await kolkatavisakhapatnam();
    }

    else if (sourceCity === "Hyderabad") {
        if (destinationCity === "Chennai")
            await chennaihyderabad();
        else if (destinationCity === "Visakhapatnam")
            await hyderabadvisakhapatnam();
    }

    else if (sourceCity === "Ranchi" && destinationCity === "Kolkata")
        await kolkataranchi();
    else if (sourceCity === "Coimbatore" && destinationCity === "Chennai")
        await chennaicoimbatore();
    else if (sourceCity === "Amritsar" && destinationCity === "Delhi")
        await delhiamritsar();
    else if (sourceCity === "Lucknow" && destinationCity === "Delhi")
        delhilucknow();
    else if (sourceCity === "Patna" && destinationCity === "Kolkata")
        await kolkatapatna();

    document.getElementById("routeDisplay").innerHTML = "Route -> " + sourceCity + " to " + destinationCity;
    window.scrollTo(0, document.body.scrollHeight);
    lookup();
}

let routeURL;       // For easier process of JSON data in line 505

//  BUILDING ROUTES FUNCTIONS
let mumbaipanaji = async function (event) {
    const mumbai = await getCity('Mumbai')
    const panaji = await getCity('Panaji')
    const pune = await getStation('Pune')
    const kolhapur = await getStation('Kolhapur')
    let routeOptions = {
        key: apikey,
        locations: `${mumbai[1]},${mumbai[0]}` + ":" + `${pune[1]},${pune[0]}` + ":" + `${kolhapur[1]},${kolhapur[0]}` + ":" + `${panaji[1]},${panaji[0]}`,     //2
    };

    const marks = [pune, kolhapur];
    marks.forEach(item => (
        stations = new tt.Marker().setLngLat(item).addTo(map)
    ))

    document.getElementById("stationDisplay").innerHTML = "Charging Stations at -> Pune, Kolhapur";
    createRoute(routeOptions);
    routeURL = `${mumbai[0]},${mumbai[1]}` + ":" + `${pune[0]},${pune[1]}` + ":" + `${kolhapur[0]},${kolhapur[1]}` + ":" + `${panaji[0]},${panaji[1]}`;
};

let mumbaibengaluru = async function (event) {
    const mumbai = await getCity('Mumbai');
    const bengaluru = await getCity('Bengaluru');
    const pune = await getStation('Pune'); // Fetch station data for Pune
    const kolhapur = await getStation('Kolhapur'); // Fetch station data for Kolhapur
    const hubli = await getStation('Hubli'); // Fetch station data for Hubli
    const davanagere = await getStation('Davanagere'); // Fetch station data for Davanagere

    let routeOptions = {
        key: apikey,
        locations: `${mumbai[1]},${mumbai[0]}` + ":" + `${pune[1]},${pune[0]}` + ":" + `${kolhapur[1]},${kolhapur[0]}` + ":" +
            `${hubli[1]},${hubli[0]}` + ":" + `${davanagere[1]},${davanagere[0]}` + ":" + `${bengaluru[1]},${bengaluru[0]}`, // Include all stations
    };

    const marks = [pune, kolhapur, hubli, davanagere];
    marks.forEach(item => (
        stations = new tt.Marker().setLngLat(item).addTo(map)
    ));

    document.getElementById("stationDisplay").innerHTML = "Charging Stations at -> Pune, Kolhapur, Hubli, Davanagere";
    createRoute(routeOptions);
    routeURL = `${mumbai[0]},${mumbai[1]}` + ":" + `${pune[0]},${pune[1]}` + ":" + `${kolhapur[0]},${kolhapur[1]}` + ":" +
        `${hubli[0]},${hubli[1]}` + ":" + `${davanagere[0]},${davanagere[1]}` + ":" + `${bengaluru[0]},${bengaluru[1]}`;
};

let mumbaiahmedabad = async function (event) {
    const mumbai = await getCity('Mumbai');
    const ahmedabad = await getCity('Ahmedabad');
    const surat = await getStation('Surat'); // Fetch station data for Surat

    let routeOptions = {
        key: apikey,
        locations: `${mumbai[1]},${mumbai[0]}` + ":" + `${surat[1]},${surat[0]}` + ":" + `${ahmedabad[1]},${ahmedabad[0]}`, // 1
    };

    stations = new tt.Marker().setLngLat(surat).addTo(map); // Marker only for Surat

    document.getElementById("stationDisplay").innerHTML = "Charging Stations at -> Surat";
    createRoute(routeOptions);
    routeURL = `${mumbai[0]},${mumbai[1]}` + ":" + `${surat[0]},${surat[1]}` + ":" + `${ahmedabad[0]},${ahmedabad[1]}`;
};

let kolkatavisakhapatnam = async function (event) {
    const kolkata = await getCity('Kolkata');
    const visakhapatnam = await getCity('Visakhapatnam');
    const bhubaneswar = await getStation('Bhubaneswar'); // Fetch station data for Bhubaneswar

    let routeOptions = {
        key: apikey,
        locations: `${kolkata[1]},${kolkata[0]}` + ":" + `${bhubaneswar[1]},${bhubaneswar[0]}` + ":" + `${visakhapatnam[1]},${visakhapatnam[0]}`, // 1
    };

    stations = new tt.Marker().setLngLat(bhubaneswar).addTo(map); // Marker only for Bhubaneswar

    document.getElementById("stationDisplay").innerHTML = "Charging Stations at -> Bhubaneswar";
    createRoute(routeOptions);
    routeURL = `${kolkata[0]},${kolkata[1]}` + ":" + `${bhubaneswar[0]},${bhubaneswar[1]}` + ":" + `${visakhapatnam[0]},${visakhapatnam[1]}`;
};

let kolkataranchi = async function (event) {
    const kolkata = await getCity('Kolkata');
    const ranchi = await getCity('Ranchi');
    const burdwan = await getStation('Burdwan'); // Fetch station data for Burdwan

    let routeOptions = {
        key: apikey,
        locations: `${kolkata[1]},${kolkata[0]}` + ":" + `${burdwan[1]},${burdwan[0]}` + ":" + `${ranchi[1]},${ranchi[0]}`, // 1
    };

    stations = new tt.Marker().setLngLat(burdwan).addTo(map); // Marker only for Burdwan

    document.getElementById("stationDisplay").innerHTML = "Charging Stations at -> Burdwan";
    createRoute(routeOptions);
    routeURL = `${kolkata[0]},${kolkata[1]}` + ":" + `${burdwan[0]},${burdwan[1]}` + ":" + `${ranchi[0]},${ranchi[1]}`;
};

let kolkatapatna = async function (event) {
    const kolkata = await getCity('Kolkata');
    const patna = await getCity('Patna');
    const burdwan = await getStation('Burdwan'); // Fetch station data for Burdwan
    const bodhgaya = await getStation('Bodh Gaya'); // Fetch station data for Bodh Gaya

    let routeOptions = {
        key: apikey,
        locations: `${kolkata[1]},${kolkata[0]}` + ":" + `${burdwan[1]},${burdwan[0]}` + ":" + `${bodhgaya[1]},${bodhgaya[0]}` + ":" + `${patna[1]},${patna[0]}`, // 2
    };

    const marks = [burdwan, bodhgaya].map(station => new tt.Marker().setLngLat(station).addTo(map)); // Markers for both Burdwan & Bodh Gaya

    document.getElementById("stationDisplay").innerHTML = "Charging Stations at -> Burdwan, Bodh Gaya";
    createRoute(routeOptions);
    routeURL = `${kolkata[0]},${kolkata[1]}` + ":" + `${burdwan[0]},${burdwan[1]}` + ":" + `${bodhgaya[0]},${bodhgaya[1]}` + ":" + `${patna[0]},${patna[1]}`;
};

let delhiahmedabad = async function (event) {
    const delhi = await getCity('Delhi');
    const ahmedabad = await getCity('Ahmedabad');
    const jaipur = await getStation('Jaipur'); // Fetch station data for Jaipur
    const ajmer = await getStation('Ajmer'); // Fetch station data for Ajmer
    const sirohi = await getStation('Sirohi'); // Fetch station data for Sirohi

    let routeOptions = {
        key: apikey,
        locations: `${delhi[1]},${delhi[0]}` + ":" + `${jaipur[1]},${jaipur[0]}` + ":" + `${ajmer[1]},${ajmer[0]}` + ":" + `${sirohi[1]},${sirohi[0]}` + ":" + `${ahmedabad[1]},${ahmedabad[0]}`, // 3
    };

    const marks = [jaipur, ajmer].map(station => new tt.Marker().setLngLat(station).addTo(map)); // Markers for Jaipur & Ajmer

    document.getElementById("stationDisplay").innerHTML = "Charging Stations at -> Jaipur, Ajmer"; // Update displayed stations (Sirohi not included)
    createRoute(routeOptions);
    routeURL = `${delhi[0]},${delhi[1]}` + ":" + `${jaipur[0]},${jaipur[1]}` + ":" + `${ajmer[0]},${ajmer[1]}` + ":" + `${sirohi[0]},${sirohi[1]}` + ":" + `${ahmedabad[0]},${ahmedabad[1]}`;
};

let delhiamritsar = async function (event) {
    const delhi = await getCity('Delhi');
    const amritsar = await getCity('Amritsar'); // Corrected spelling

    const karnal = await getStation('Karnal'); // Fetch station data for Karnal
    const ludhiana = await getStation('Ludhiana'); // Fetch station data for Ludhiana

    let routeOptions = {
        key: apikey,
        locations: `${delhi[1]},${delhi[0]}` + ":" + `${karnal[1]},${karnal[0]}` + ":" + `${ludhiana[1]},${ludhiana[0]}` + ":" + `${amritsar[1]},${amritsar[0]}`, // 2
    };

    const marks = [karnal, ludhiana].map(station => new tt.Marker().setLngLat(station).addTo(map)); // Markers for Karnal & Ludhiana

    document.getElementById("stationDisplay").innerHTML = "Charging Stations at -> Karnal, Ludhiana";
    createRoute(routeOptions);
    routeURL = `${delhi[0]},${delhi[1]}` + ":" + `${karnal[0]},${karnal[1]}` + ":" + `${ludhiana[0]},${ludhiana[1]}` + ":" + `${amritsar[0]},${amritsar[1]}`;
};

let delhilucknow = async function (event) {
    const delhi = await getCity('Delhi');
    const lucknow = await getCity('Lucknow');
    const agra = await getStation('Agra'); // Fetch station data for Agra

    let routeOptions = {
        key: apikey,
        locations: `${delhi[1]},${delhi[0]}` + ":" + `${agra[1]},${agra[0]}` + ":" + `${lucknow[1]},${lucknow[0]}`, // 1
    };

    stations = new tt.Marker().setLngLat(agra).addTo(map); // Marker only for Agra

    document.getElementById("stationDisplay").innerHTML = "Charging Stations at -> Agra";
    createRoute(routeOptions);
    routeURL = `${delhi[0]},${delhi[1]}` + ":" + `${agra[0]},${agra[1]}` + ":" + `${lucknow[0]},${lucknow[1]}`;
};

let chennaibengaluru = async function (event) {
    const chennai = await getCity('Chennai');
    const bengaluru = await getCity('Bengaluru');
    const vellore = await getStation('Vellore'); // Fetch station data for Vellore
    const krishnagiri = await getStation('Krishnagiri'); // Fetch station data for Krishnagiri

    let routeOptions = {
        key: apikey,
        locations: `${chennai[1]},${chennai[0]}` + ":" + `${vellore[1]},${vellore[0]}` + ":" + `${krishnagiri[1]},${krishnagiri[0]}` + ":" + `${bengaluru[1]},${bengaluru[0]}`, // 2
    };

    const marks = [vellore, krishnagiri].map(station => new tt.Marker().setLngLat(station).addTo(map)); // Markers for Vellore & Krishnagiri

    document.getElementById("stationDisplay").innerHTML = "Charging Stations at -> Vellore, Krishnagiri";
    createRoute(routeOptions);
    routeURL = `${chennai[0]},${chennai[1]}` + ":" + `${vellore[0]},${vellore[1]}` + ":" + `${krishnagiri[0]},${krishnagiri[1]}` + ":" + `${bengaluru[0]},${bengaluru[1]}`;
};

let chennaicoimbatore = async function (event) {
    const chennai = await getCity('Chennai');
    const coimbatore = await getCity('Coimbatore');
    const salem = await getStation('Salem'); // Fetch station data for Salem

    let routeOptions = {
        key: apikey,
        locations: `${chennai[1]},${chennai[0]}` + ":" + `${salem[1]},${salem[0]}` + ":" + `${coimbatore[1]},${coimbatore[0]}`, // 1
    };

    stations = new tt.Marker().setLngLat(salem).addTo(map); // Marker for Salem

    document.getElementById("stationDisplay").innerHTML = "Charging Stations at -> Salem";
    createRoute(routeOptions);
    routeURL = `${chennai[0]},${chennai[1]}` + ":" + `${salem[0]},${salem[1]}` + ":" + `${coimbatore[0]},${coimbatore[1]}`;
};

let chennaihyderabad = async function (event) {
    const chennai = await getCity('Chennai');
    const hyderabad = await getCity('Hyderabad');
    const vijaywada = await getStation('Vijaywada'); // Fetch station data for Vijaywada

    let routeOptions = {
        key: apikey,
        locations: `${chennai[1]},${chennai[0]}` + ":" + `${vijaywada[1]},${vijaywada[0]}` + ":" + `${hyderabad[1]},${hyderabad[0]}`, // 1
    };

    stations = new tt.Marker().setLngLat(vijaywada).addTo(map); // Marker for Vijaywada

    document.getElementById("stationDisplay").innerHTML = "Charging Stations at -> Vijaywada";
    createRoute(routeOptions);
    routeURL = `${chennai[0]},${chennai[1]}` + ":" + `${vijaywada[0]},${vijaywada[1]}` + ":" + `${hyderabad[0]},${hyderabad[1]}`;
};

let bengalurukochi = async function (event) {
    const bengaluru = await getCity('Bengaluru');
    const kochi = await getCity('Kochi');
    const salem = await getStation('Salem'); // Fetch station data for Salem
    const coimbatore = await getStation('Coimbatore'); // Fetch station data for Coimbatore

    let routeOptions = {
        key: apikey,
        locations: `${bengaluru[1]},${bengaluru[0]}` + ":" + `${salem[1]},${salem[0]}` + ":" + `${coimbatore[1]},${coimbatore[0]}` + ":" + `${kochi[1]},${kochi[0]}`, // 2
    };

    const marks = [salem, coimbatore].map(station => new tt.Marker().setLngLat(station).addTo(map)); // Markers for Salem & Coimbatore

    document.getElementById("stationDisplay").innerHTML = "Charging Stations at -> Salem, Coimbatore";
    createRoute(routeOptions);
    routeURL = `${bengaluru[0]},${bengaluru[1]}` + ":" + `${salem[0]},${salem[1]}` + ":" + `${coimbatore[0]},${coimbatore[1]}` + ":" + `${kochi[0]},${kochi[1]}`;
};

let kochipanaji = async function (event) {
    const kochi = await getCity('Kochi');
    const panaji = await getCity('Panaji');
    const kozhikode = await getStation('Kozhikode'); // Fetch station data for Kozhikode
    const mangaluru = await getStation('Mangaluru'); // Fetch station data for Mangaluru

    let routeOptions = {
        key: apikey,
        locations: `${kochi[1]},${kochi[0]}` + ":" + `${kozhikode[1]},${kozhikode[0]}` + ":" + `${mangaluru[1]},${mangaluru[0]}` + ":" + `${panaji[1]},${panaji[0]}`, // 2
    };

    const marks = [kozhikode, mangaluru].map(station => new tt.Marker().setLngLat(station).addTo(map)); // Markers for Kozhikode & Mangaluru

    document.getElementById("stationDisplay").innerHTML = "Charging Stations at -> Kozhikode, Mangaluru"; // Update displayed stations

    createRoute(routeOptions);
    routeURL = `${kochi[0]},${kochi[1]}` + ":" + `${kozhikode[0]},${kozhikode[1]}` + ":" + `${mangaluru[0]},${mangaluru[1]}` + ":" + `${panaji[0]},${panaji[1]}`;
};

let hyderabadvisakhapatnam = async function (event) {
    const hyderabad = await getCity('Hyderabad');
    const visakhapatnam = await getCity('Visakhapatnam');
    const vijaywada = await getStation('Vijaywada'); // Fetch station data for Vijaywada
    const rajahmundry = await getStation('Rajahmundry'); // Fetch station data for Rajahmundry

    let routeOptions = {
        key: apikey,
        locations: `${hyderabad[1]},${hyderabad[0]}` + ":" + `${vijaywada[1]},${vijaywada[0]}` + ":" + `${rajahmundry[1]},${rajahmundry[0]}` + ":" + `${visakhapatnam[1]},${visakhapatnam[0]}`, // 2
    };

    const marks = [vijaywada, rajahmundry].map(station => new tt.Marker().setLngLat(station).addTo(map)); // Markers for Vijayawada & Rajahmundry

    document.getElementById("stationDisplay").innerHTML = "Charging Stations at -> Vijaywada, Rajahmundry";
    createRoute(routeOptions);
    routeURL = `${hyderabad[0]},${hyderabad[1]}` + ":" + `${vijaywada[0]},${vijaywada[1]}` + ":" + `${rajahmundry[0]},${rajahmundry[1]}` + ":" + `${visakhapatnam[0]},${visakhapatnam[1]}`;
};
// BUILDING MAP & ADDING LAYERS
let apikey = "nMq5c5JQxz8jjuwTEpo4YHYhZ7Lqlly3";

let map;

const locateCurrentPosition = () => new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
        position => {
            currLoc = [position["coords"]["longitude"], position["coords"]["latitude"]];
            resolve(position);
        },
        error => {
            console.log(error.message);
            reject(error);
        },
        {
            enableHighAccuracy: true,
            timeout: 50000
        }
    );
});

locateCurrentPosition().then(position => {
    map = tt.map({
        key: apikey,
        container: "map",
        center: currLoc,       // zeromile(nagpur)
        zoom: 13,
        interactive: true,
        style: {
            map: "basic_night", // basic_main, basic_night
        },

        stylesVisibility: {
            trafficFlow: true,
            trafficIncidents: false,
        },
    });
    userLocation = new tt.Marker().setLngLat(currLoc).addTo(map);
});

// map.dragRotate.enable(); -> error

let createRoute = function (options) {
    tt.services.calculateRoute(options).then(function (response) {
        let geojson = response.toGeoJson();
        //console.log(geojson);  
        map.addLayer({
            id: "route",
            type: "line",
            source: {
                type: "geojson",
                data: geojson,
            },
            paint: {
                "line-color": "#4285F4",
                "line-width": 6,
            },
        });
    });
};

let moveMap = function (lnglat) {
    map.flyTo({
        center: lnglat,
        zoom: 10
    })
}

function handleResults(result) {
    //console.log(result);
    if (result.results) {
        moveMap(result.results[0].position)
    }
}

function lookup() {
    tt.services.fuzzySearch({
        key: apikey,
        query: document.getElementById("source").value
    }).then(handleResults)
}

function routeDetails() {
    const getJSON = async url => {
        const response = await fetch(url);
        if (!response.ok) // check if response worked (no 404 errors etc...)
            throw new Error(response.statusText);

        const data = response.json(); // get JSON from the response
        return data; // returns a promise, which resolves to this data value
    }

    getJSON("https://api.tomtom.com/routing/1/calculateRoute/" + routeURL + "/json?key=" + apikey).then(data => {
        let distance = data["routes"]["0"]["summary"]["lengthInMeters"] / 1000;
        document.getElementById("distanceDisplay").innerHTML = "Route Length = " + distance + " Kms";
    }).catch(error => {
        //console.error(error);
    });

    getJSON("https://api.tomtom.com/routing/1/calculateRoute/" + routeURL + "/json?key=" + apikey).then(data => {
        let time = data["routes"]["0"]["summary"]["travelTimeInSeconds"];
        let hours = Math.floor(time / 3600);
        let mins = Math.ceil((time - hours * 3600) / 60);
        document.getElementById("timeDisplay").innerHTML = "Estimated Time = " + hours + " hours " + mins + " mins";
    }).catch(error => {
        //console.error(error);
    });
}
