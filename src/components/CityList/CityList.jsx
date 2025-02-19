import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import Alert from '@material-ui/lab/Alert'
import Grid from '@material-ui/core/Grid'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import useCityList from './../../hooks/useCityList'
import CityInfo from './../CityInfo'
import Weather from './../Weather'
import { getCityCode } from './../../utils/utils'
import { useWeatherDispatchContext, useWeatherStatecontext } from '../../WeatherContext'

const areEqual = (prev, next) => {
    debugger
    console.log("city", prev.city === next.city)
    console.log("countryCode", prev.countryCode === next.countryCode)
    console.log("country", prev.country === next.country)
    console.log("weather", prev.weather === next.weather)
    console.log("eventOnClickCity", prev.eventOnClickCity === next.eventOnClickCity)
    return false
}

const CityListItem = React.memo(({ city, countryCode, country, eventOnClickCity, weather }) => {
    return (
        <ListItem
            button

            onClick={() => eventOnClickCity(city, countryCode)} >
            <Grid container
                justify="center"
                alignItems="center"
            >
                <Grid item
                    md={9}
                    xs={12}>
                    <CityInfo city={city} country={country} />
                </Grid>
                <Grid item
                    md={3}
                    xs={12}>
                    <Weather
                        temperature={weather && weather.temperature}
                        state={weather && weather.state} />
                </Grid>
            </Grid>
        </ListItem>
    )
}, areEqual)
CityListItem.displayName = 'CityListItem'

// li: es un item (según tag html, tiene el role "listitem")
// renderCityAndCountry se va a convertir en una función que retorna otra función
const renderCityAndCountry = eventOnClickCity => (cityAndCountry, weather) => {
    const { city, countryCode } = cityAndCountry
    // const { temperature, state } = weather
    //pasar ...cityAndCountry es igual que pasarlo const { city, countryCode, country } = cityAndCountry
    return (< CityListItem key={getCityCode(city, countryCode)}
        eventOnClickCity={eventOnClickCity}
        weather={weather}
        {...cityAndCountry} />)

}

// cities: es un array, y en cada item tiene que tener la ciudad, pero además el country
// ul: tag html para listas no ordenadas
const CityList = ({ cities, onClickCity }) => {
    const actions = useWeatherDispatchContext()
    const data = useWeatherStatecontext()
    const { allWeather } = data
    // const { onSetAllWeather } = actions

    const { error, setError } = useCityList(cities, allWeather, actions)

    return (
        <div>
            {
                error && <Alert onClose={() => setError(null)} severity="error">{error}</Alert>
            }
            <List>
                {
                    cities.map(cityAndCountry => renderCityAndCountry(onClickCity)(cityAndCountry,
                        allWeather[getCityCode(cityAndCountry.city, cityAndCountry.countryCode)]))
                }
            </List>
        </div>

    )
}



CityList.propTypes = {
    cities: PropTypes.arrayOf(
        PropTypes.shape({
            city: PropTypes.string.isRequired,
            country: PropTypes.string.isRequired,
            countryCode: PropTypes.string.isRequired,
        })
    ).isRequired,
    onClickCity: PropTypes.func.isRequired,
}
//OJO este pedazo
export default React.memo(CityList)