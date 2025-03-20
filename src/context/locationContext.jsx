import { createContext } from "react";
import { useState } from "react";

export const LocationContext = createContext();

export const LocationProvider = ({children}) => {
    
    const [locationName, setLocationName] = useState("")
    const [locationLat, setLocationLat] = useState()
    const [locationLong, setLocationLong] = useState()



    const values = {
        locationName, 
        setLocationName,
        locationLat, 
        setLocationLat,
        locationLong, 
        setLocationLong
    }
    
    return (
        <LocationContext.Provider value={values}>{children}</LocationContext.Provider>
    )
}