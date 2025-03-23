import React, { useEffect, useRef, useContext } from 'react';
import { LocationContext } from "../context/locationContext";
import { WeatherContext } from "../context/weatherContext";
import '../styles/_map.scss';

function Map() {
  const mapRef = useRef(null);
  const inputRef = useRef(null);
  const markerRef = useRef(null);

  const {setLocationName, setLocationLat, setLocationLong} = useContext(LocationContext)
  const {setIsWeatherShow} = useContext(WeatherContext)
  useEffect(() => {
    if (!window.google) {
      console.error('Google Maps not loaded');
      return;
    }

    // Önce kontrol div'ini oluştur
    const controlsDiv = document.createElement("div");
    controlsDiv.className = "map-controls";

    const searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.placeholder = "Enter a location";
    inputRef.current = searchInput;

    const searchButton = document.createElement("input");
    searchButton.type = "button";
    searchButton.value = "Go";
    searchButton.classList.add("button", "button-primary");
    
    const scrollToWeather = () => {
        const weatherElement = document.getElementById('weatherValues');
        if (weatherElement) {
            weatherElement.scrollIntoView({ behavior: 'smooth' });
        }
        setIsWeatherShow(true);
    };

    searchButton.onclick = scrollToWeather;
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            scrollToWeather();
        }
    });

    const clearButton = document.createElement("input");
    clearButton.type = "button";
    clearButton.value = "Back";
    clearButton.classList.add("button", "button-secondary");

    // Kontrolleri div'e ekle
    const buttonsContainer = document.createElement("div");
    buttonsContainer.className = "buttons-container";
    buttonsContainer.appendChild(searchButton);
    buttonsContainer.appendChild(clearButton);

    controlsDiv.appendChild(searchInput);
    controlsDiv.appendChild(buttonsContainer);

    mapRef.current.parentElement.appendChild(controlsDiv);

    const map = new window.google.maps.Map(mapRef.current, {
      zoom: 8,
      center: { lat: 41.0082, lng: 28.9784 },
      mapTypeControl: false,
      streetViewControl: false,
      styles: [
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{ color: "#a3ccff" }]
        },
        {
          featureType: "landscape",
          elementType: "geometry",
          stylers: [{ color: "#f5f5f5" }, { lightness: 20 }]
        },
        {
          featureType: "administrative",
          elementType: "labels.text.fill",
          stylers: [{ color: "#444444" }]
        }
      ]
    });

    const geocoder = new window.google.maps.Geocoder();
    markerRef.current = new window.google.maps.Marker({ map });

    const clear = () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
      searchInput.value = '';
    };

    const geocode = (request) => {
      clear();
      geocoder
        .geocode(request)
        .then((result) => {
          const results = result.results;
          map.setCenter(results[0].geometry.location);
          markerRef.current.setPosition(results[0].geometry.location);
          markerRef.current.setMap(map);
          
          // JSON string'i parse et
          const resultJson = JSON.parse(JSON.stringify(result));
          //console.log(result.results[0].formatted_address)
          const coordinates = resultJson.results[0].geometry.location;
          setLocationName(result.results[0].formatted_address);
          setLocationLat(coordinates.lat);
          setLocationLong(coordinates.lng)
          
          return result;
        })
        .catch((e) => {
          console.error("Geocoding error:", e);
          alert("Geocoding was not successful");
        });
    };

    map.addListener("click", (e) => {
      geocode({ location: e.latLng });
    });

    searchButton.addEventListener("click", () => {
      if (searchInput.value) {
        geocode({ address: searchInput.value });
      }
    });

    // Refresh butonuna tıklandığında sayfayı yenile
    clearButton.addEventListener("click", () => {
      clear();
      setIsWeatherShow(false);
    });

    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && searchInput.value) {
        geocode({ address: searchInput.value });
      }
    });

    return () => {
      // Cleanup
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
      if (controlsDiv.parentElement) {
        controlsDiv.parentElement.removeChild(controlsDiv);
      }
    };
  }, [setLocationName, setLocationLat, setLocationLong]);

  return (
    <div className="map-container">
      <div id="map" ref={mapRef} />
    </div>
  );
}

export default Map;