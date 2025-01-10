
import { useEffect, useState } from 'react';
import './App.css';

const Select = ({data, setter, isDiable, option}) =>{

  const handleChange = (e) => {
    e.preventDefault();
      setter(e.target.value)
  }

  return(
    <div>
      <select onChange={handleChange} disabled = {isDiable} style={{
      height:'30px'
    }}>
        <option >Select {option}</option>
        {data.map((ele, idx)=> <option key={idx}>{ele}</option>)}
      </select>
    </div>
  )
}

function App() {

  const [country, setCountry] =useState([]);
  const [selectedCountry , setSelectedCountry] = useState('');
  const [state, setState] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [city, setCity] = useState([]);
  const [selectedCity , setSelectedCity] = useState('');

  useEffect(()=> {
  
    const fetchState = async (selectedCountry) => {
      const response = await fetch(`https://crio-location-selector.onrender.com/country=${selectedCountry}/states`)
      const data = await response.json();
      setState(data);
    }
    fetchState(selectedCountry)
  }, [selectedCountry])

  useEffect(()=>{

    const fetchCity = async (countryName, stateName) => {
      const response = await fetch(`https://crio-location-selector.onrender.com/country=${countryName}/state=${stateName}/cities`)
      const data = await response.json();
      setCity(data);
    }
    fetchCity(selectedCountry,selectedState)
  },[selectedCountry,selectedState]);



  useEffect(()=>{
    // fetch country
    const fetchCountry = async () => {
      const response = await fetch('https://crio-location-selector.onrender.com/countries')
      const data = await response.json();
      setCountry(data);
    }

    fetchCountry();

  },[])

  return (
    <div className="App">
      <div>XState</div>
      <div style={{
        display:'flex',
        padding: '10px',
        justifyContent: 'center',
        gap: '10px'
      }}>
        
          <Select data={country} setter = {setSelectedCountry} isDiable = {country.length === 0} option = {'Country'}/>
          <Select data={state} setter={setSelectedState} isDiable = {state.length === 0} option = {'State'}/>
          <Select data={city} setter={setSelectedCity} isDiable = {city.length === 0} option = {'City'}/>
        </div>

        {selectedCity && selectedCountry && selectedState ? <div>You selected {selectedCity}, {selectedState}, {selectedCountry}  </div> : null}
      
    </div>
  );
}

export default App;
