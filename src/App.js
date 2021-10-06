import { useRef, useState } from "react";
const key = "9b5bc6dd74eb4b7fb66e2eb7031b13f1";
const App = () => {
  const cityRef = useRef();
  const [weather, setWeather] = useState();
  const [loading, setLoading] = useState(false);
  const submitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    const city = cityRef.current.value;
    const { lat, lng } = await getLonLat(city);
    const data = await searchCity(lat, lng);
    setWeather(data);
    setLoading(false);
  };

  const getLonLat = async (city) => {
    try {
      const result = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${city}&key=${key}`
      );
      if (!result.ok) {
        throw new Error("Something went wrong!");
      }
      const data = await result.json();
      const lng = data.results[0].bounds.northeast.lng;
      const lat = data.results[0].bounds.northeast.lat;
      return { lat, lng };
    } catch (error) {
      console.log(error);
    }
  };

  const searchCity = async (lat, lng) => {
    try {
      const result = await fetch(
        `http://www.7timer.info/bin/api.pl?lon=${lng}&lat=${lat}&product=civil&output=json`
      );
      if (!result.ok) {
        throw new Error("Something went wrong!");
      }
      const data = await result.json();
      return data.dataseries.slice(0, 7);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <form id="form">
        <label htmlFor="city">City Name:</label>
        <input type="text" id="city" name="city" ref={cityRef}></input>
        <button type="submit" onClick={submitHandler}>
          Search!
        </button>
      </form>
      {loading && <div>Loading...</div>}
      {weather && (
        <div>
          {weather.map((forecast) => (
            <WeatherComponent
              key={Math.random()}
              weather={forecast.weather}
            ></WeatherComponent>
          ))}
        </div>
      )}
    </>
  );
};

const WeatherComponent = (props) => {
  return <div>{props.weather}</div>;
};

export default App;
