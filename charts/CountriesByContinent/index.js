

import axios from "axios"
import { Chart, registerables } from "chart.js"
Chart.register(...registerables);
const GET_CONTINENT_COUNTRIES_URL = (continent) => `https://restcountries.com/v3.1/region/${continent}`
const GET_WORLDWIDE_POPULATION_URL = "https://countriesnow.space/api/v0.1/countries/population"

const P_graph = document.getElementById("graph").getContext("2d")

const CountriesByContinent = async (continent, toggleSpinner) => {

    //vars
    var continentCountries = []
    var worldwidePopulation = []
    var results = []
    //enable isLoading - show spinner
    toggleSpinner=true
    setSpinner(toggleSpinner)
    
    //fetch all of the countries from a selected continent
    try {
        const res = await axios.get(GET_CONTINENT_COUNTRIES_URL(continent))
        continentCountries = res.data.map(country => country.cioc)
    }
    catch(err) {
        throw err
    }

    //fetch all of the countries population data
    try {
        const res = await axios.get(GET_WORLDWIDE_POPULATION_URL)
        worldwidePopulation = res.data.data
    }
    catch(err) {
        throw err
    }

    //filter the population data (cioc) with the wanted country (code) (from the selected continent)
    results = worldwidePopulation.filter(item => continentCountries.includes(item.code))

    let ds = []
    for(let i = 1980; i<2019; i++) {
        ds.push({
            label: i,
            data: results.map(res => {
                const isMatch = res.populationCounts.filter(r => r.year == i)
                if(isMatch.length > 0) return isMatch[0].value
                else return null
                
            })
        })
    }
    //load it as a chart
    console.log(ds)
    let resChart = new Chart(P_graph, {
        type: "bar",
        data: {
            labels: results.map(res => res.country), //countries
            datasets: ds
        },
        options: {
            interaction: {
                mode: 'index'
            }
        }
    })
    //disable isLoading - hide spinner
    toggleSpinner=false
    setSpinner(toggleSpinner)

}

const setSpinner = (bool) => {
    if (bool ) {
      const spinner = document.createElement('h3');
      spinner.textContent = 'Loading';
      continentsContainer.appendChild(spinner);
    } else {
      const spinner = document.querySelector('h3');
      continentsContainer.removeChild(spinner);
    }
  };
  
  

export default CountriesByContinent