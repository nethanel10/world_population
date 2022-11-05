import axios from "axios"
import { Chart } from "chart.js"
const CITIES_POPULATION_BY_COUNTRIES_URL = "https://countriesnow.space/api/v0.1/countries/population/cities/filter"

const P_graph = document.getElementById("graph").getContext("2d")

const CitiesByCountry = async (country, toggleSpinner) => {

    //vars
    var citiesPopulation = []

    //enable isLoading - show spinner
    toggleSpinner=true
    setSpinner(toggleSpinner)


    //fetch all of the country cities population data
    try {
        const res = await axios.post(CITIES_POPULATION_BY_COUNTRIES_URL, {country})
        citiesPopulation = res.data.data
    }
    catch(err) {
        throw err
    }

    let ds = []
    for(let i = 2000; i<2019; i++) {
        ds.push({
            label: i,
            data: citiesPopulation.map(res => {
                const isMatch = res.populationCounts.filter(r => r.year == i)
                if(isMatch.length > 0) return isMatch[0].value
                else return null
            })
        })
    }

    //load it as a chart
    let resChart = new Chart(P_graph, {
        type: "bar",
        data: {
            labels: citiesPopulation.map(res => res.city), //countries
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


export default CitiesByCountry