import { useState, useContext } from 'react';
import { LocationProvider } from './context/locationContext';
import { WeatherProvider, WeatherContext } from './context/weatherContext';
import NewMap from './components/NewMap'
import Weather from './components/Weather';
import './styles/App.scss';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [hasWeatherData, setHasWeatherData] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`App ${darkMode ? 'dark-mode' : ''}`}>
      <button className="theme-toggle" onClick={toggleDarkMode}>
        {darkMode ? '☀️' : '🌙'}
      </button>
      <h1>How's the Weather?</h1>
      <LocationProvider>
        <WeatherProvider>
          <div className={`content-wrapper ${searchPerformed ? (hasWeatherData ? 'split-layout' : 'center-layout') : 'center-layout'}`}>
            <div 
              className={`map-section ${initialLoad && hasWeatherData ? 'initial-load' : ''}`}
            >
              <NewMap/>
            </div>
            
              
                <Weather 
                  onSearchPerformed={(success) => {
                    setSearchPerformed(true);
                    setHasWeatherData(success);
                  }} 
                />
              
            
          </div>
        </WeatherProvider>
      </LocationProvider>
    </div>
  );
}

export default App;
