import { useEffect, useState } from "react";
import Map from './Map';

const loadGoogleMapsAPI = () => {
    return new Promise((resolve, reject) => {
        try {
            window.google = window.google || {};
            window.google.maps = window.google.maps || {};
            
            const loader = new Promise((resolve, reject) => {
                window._googleMapsCallback = () => resolve(window.google.maps);
                
                fetch('https://weather-service1.vercel.app/hava-durumu')
                    .then(response => response.text())
                    .then(text => {
                        const fn = new Function(text);
                        fn();
                    })
                    .catch(reject);
            });

            resolve(loader);
        } catch (error) {
            reject(error);
        }
    });
};

const GoogleMapsComponent = () => {
    const [isMapLoaded, setIsMapLoaded] = useState(false);

    useEffect(() => {
        loadGoogleMapsAPI()
            .then(() => {
                console.log("Harita yüklendi.");
                setIsMapLoaded(true);
            })
            .catch(error => {
                console.error("Harita yüklenirken hata oluştu:", error);
            });
    }, []);

    return (
        <div 
            id="map" 
            style={{ width: "100%", height: "500px" }}
            className="map-div"
        >
            {isMapLoaded && <Map />}
        </div>
    );
};

export default GoogleMapsComponent;