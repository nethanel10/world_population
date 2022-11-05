import 'regenerator-runtime/runtime';
import axios from "axios"
import CountriesByContinent from './charts/CountriesByContinent'
import CitiesByCountry from './charts/CitiesByCountry'
import { Chart } from 'chart.js';

//Pointers
const P_continentsContainer = document.getElementById("continentsContainer")
const P_graph = document.getElementById("graph").getContext("2d")
const P_countriesContainer = document.getElementById("countriesContainer")
const P_spinner = document.getElementById("spinner")

//URIs
const GET_CONTINENT_COUNTRIES_URL = (continent) => `https://restcountries.com/v3.1/region/${continent}`

//vars
var continents = ["Africa", "Americas", "Asia", "Europe", "Oceania"]
var spinnerStatus = false
var selectedContinent = ""
var continentCountries = []
 var selectedCountry = "Poland"

const toggleSpinner = (status) => {
    spinnerStatus = status
}

const getContinentCountries = async () => {
    toggleSpinner(true)
    try {
        const res = await axios.get(GET_CONTINENT_COUNTRIES_URL(selectedContinent))
        continentCountries = res.data.map(country => country.name.common.toLowerCase())
    }
    catch(err) {
        throw err
    }
    toggleSpinner(false)
}

const loadContinentsButtons = () => {
    P_continentsContainer.innerHTML = ""
    continents.map(continent => {
        const continentBtn = document.createElement("button")
        continentBtn.innerHTML = continent
        continentBtn.classList.add("continent__btn")
        continentBtn.onclick = () => {changeSelectedContinent(continent)}
        P_continentsContainer.appendChild(continentBtn)
    })
}

const loadCountriesButtons = () => {
    P_countriesContainer.innerHTML = ""
    continentCountries.map((country, i) => {
        const countryBtn = document.createElement("button")
        countryBtn.innerHTML = country
        countryBtn.classList.add("continent__btn")
        countryBtn.onclick = () => {changeSelectedCountry(country)}
        P_countriesContainer.appendChild(countryBtn)
    })
}

const loadGraph = (type, arg) => {
    let chartStatus = Chart.getChart("graph"); // <canvas> id
    if (chartStatus != undefined) {
    chartStatus.destroy();
    }
    switch(type) {
        case "CitiesByCountry":
            CitiesByCountry(arg, toggleSpinner)
            break
        case "countriesByContinent":
            CountriesByContinent(arg, toggleSpinner)
            break
        default:
           toggleSpinner(true) 
    }
}

const changeSelectedContinent = async (continent) => {
    selectedContinent = continent
    await getContinentCountries()
    loadContinentsButtons()
    loadCountriesButtons()
    loadGraph("countriesByContinent", continent)
}

const changeSelectedCountry = (country) => {
    
    selectedCountry = country
    loadGraph("CitiesByCountry", country)
}

const appInit = () => {
    changeSelectedContinent("europe")
}


document.onload = appInit()
//display list of buttons which represents the continents
//onclick: load CountriesByContinent graph with the selected continent &&
//fetch the countries that belongs to the spesific continent
//GET https://restcountries.com/v3.1/region/europe
//load in the buttom list of buttons that represents the countries in the selected continent
//onclick: load CitiesByCountry graph with the selected country


