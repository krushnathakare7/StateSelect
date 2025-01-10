import { useEffect, useState } from 'react';
import './App.css';

const Select = ({ data, setter, isDisabled, option }) => {
  const handleChange = (e) => {
    setter(e.target.value);
  };

  return (
    <div>
      <select
        onChange={handleChange}
        disabled={isDisabled}
        style={{ height: '30px' }}
      >
        <option>Select {option}</option>
        {data.map((ele, idx) => (
          <option key={idx} value={ele}>
            {ele}
          </option>
        ))}
      </select>
    </div>
  );
};

function App() {
  const [country, setCountry] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [state, setState] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [city, setCity] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://crio-location-selector.onrender.com/countries');
        if (!response.ok) throw new Error('Failed to fetch countries');
        const data = await response.json();
        setCountry(data);
      } catch (err) {
        setCountry([]);
        setError('Unable to fetch countries.');
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchStates = async () => {
      if (!selectedCountry) {
        setState([]);
        return;
      }
      try {
        const response = await fetch(`https://crio-location-selector.onrender.com/country=${selectedCountry}/states`);
        if (!response.ok) throw new Error('Failed to fetch states');
        const data = await response.json();
        setState(data);
      } catch (err) {
        setState([]);
        setError('Unable to fetch states.');
      }
    };

    fetchStates();
  }, [selectedCountry]);

  useEffect(() => {
    const fetchCities = async () => {
      if (!selectedCountry || !selectedState) {
        setCity([]);
        return;
      }
      try {
        const response = await fetch(
          `https://crio-location-selector.onrender.com/country=${selectedCountry}/state=${selectedState}/cities`
        );
        if (!response.ok) throw new Error('Failed to fetch cities');
        const data = await response.json();
        setCity(data);
      } catch (err) {
        setCity([]);
        setError('Unable to fetch cities.');
      }
    };

    fetchCities();
  }, [selectedCountry, selectedState]);

  return (
    <div className="App">
      <div>XState</div>
      <div
        style={{
          display: 'flex',
          padding: '10px',
          justifyContent: 'center',
          gap: '10px',
        }}
      >
        <Select
          data={country}
          setter={(val) => {
            setSelectedCountry(val);
            setSelectedState('');
            setSelectedCity('');
            setState([]);
            setCity([]);
          }}
          isDisabled={country.length === 0}
          option="Country"
        />
        <Select
          data={state}
          setter={(val) => {
            setSelectedState(val);
            setSelectedCity('');
            setCity([]);
          }}
          isDisabled={state.length === 0}
          option="State"
        />
        <Select
          data={city}
          setter={setSelectedCity}
          isDisabled={city.length === 0}
          option="City"
        />
      </div>
      {selectedCity && selectedCountry && selectedState ? (
        <div>
          You selected {selectedCity}, {selectedState}, {selectedCountry}
        </div>
      ) : null}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
}

export default App;
