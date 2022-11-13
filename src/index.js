import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import './css/styles.css';
import { fetchCountries } from './fetchCountries'


const DEBOUNCE_DELAY = 300;

const inputQuery = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');


inputQuery.addEventListener('input', debounce(onInputSeach, DEBOUNCE_DELAY));

function onInputSeach(evt) {
    const query = evt.target.value.trim();

    if (query !== '') {
        fetchCountries(query).then(data => countriesFound(data)).catch(errorMessage);
    } 
    resetMarkup();
}

function countriesFound(countries) {
    if (countries.length > 10) {
        Notify.info('Too many matches found. Please enter a more specific name.');
    } else if (countries.length >= 2 && countries.length <= 10) {
        renderCountriesList(countries);
    } else {
        renderSingleCountry(countries);
    }
}


// функция для отображения списка стран (от 2 до 10)

function renderCountriesList(countries) {
    resetMarkup()

    const countriesList = countries.map(country => {
        return `<li class="country-list-item"><img src="${country.flags.svg}" alt="Flag" width="20" height="16"></img> ${country.name.official} </li>`
    }).join('');

    countryList.insertAdjacentHTML("afterbegin", countriesList); 
}


// функция для отображения одной страны

function renderSingleCountry(country) {
    resetMarkup()
    
    const singleCountry = country.map(country => {
        return `<img src="${country.flags.svg}" alt="Flag" width="20" height="16"></img><h2>${country.name.official}</h2>
        <p> Capital: ${country.capital}</p>
        <p> Population: ${country.population}</p>
        <p> Languages: ${Object.values(country.languages)} </p>`
    })

    countryInfo.insertAdjacentHTML("afterbegin", singleCountry); 
}


// функция кт очищает HTML, чтобы след разметка не наслаивалась

function resetMarkup() {
    countryInfo.innerHTML = '';
    countryList.innerHTML = '';
}



function errorMessage() {
    Notify.failure('Oops, there is no country with that name')
}