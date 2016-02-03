<template lang="jade">
  div.weather
      div#weather-today
        span#todayTemp {{ weather.currently.temperature + '&deg; F' }}
      div#weather-description
        span#weatherText {{ weather.daily.summary }}
      div.weather-week(v-for='day in weather.daily.data')
        span.day {{ day.day }}
        span.temperature {{ day.temperatureMax.toFixed(2) }}
        span.temperature {{ day.temperatureMin.toFixed(2) }}
</template>

<script>
import moment from 'moment'

export default {
  data () {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      weather: '',
      location: '',
      apikey: '',
      refreshTime: 1 * 3600 * 1000
    }
  },
  methods: {
    updateWidget: function () {
      var self = this
      self.getLocation()
    },
    fetchWeather: function () {
      var self = this
      var apiurl = 'https://api.forecast.io/forecast/'
      window.$.getJSON(apiurl + this.apikey + '/' + this.location.coords.latitude + ',' + this.location.coords.longitude + '?callback=?', function (data) {
        console.debug('Weather:', data)
        self.setWeather(data)
      })
    },
    setWeather (data) {
      var self = this
      self.weather = data
      for (var i = 0; i < data.daily.data.length; i++) {
        self.weather.daily.data[i].day = moment.unix(data.daily.data[i].time).format('ddd')
      }
    },
    setLocation (location) {
      console.debug('Location: ', location)
      this.location = location
      this.fetchWeather()
    },
    getLocation () {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.setLocation)
      } else {
        console.error('Geolocation is not supported by this browser.')
      }
    }
  },
  created: function () {
    this.updateWidget()
    setInterval(function () {
      this.updateWidget()
    }.bind(this), this.refreshTime)
  }
}
</script>


<style scoped lang="stylus">
#weather-today
  font-size 80px

#weather-description
  //padding-left 50%

#weather-description
  & > #weatherText
    font-size 14px
    //margin-left auto
    //margin-bottom 20px
    //text-align justify

.weather-week
  & > span
    margin-right 10px
    font-size 22px
  & > .day
    display inline-block
    margin-right 10px
    width 50px
  & > .tempreture
    display inline-block
    width 60px
  & > canvas
    vertical-align text-bottom

</style>