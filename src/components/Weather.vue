<template lang="jade">
  div#weather.item.basic
      div#weather-today
        canvas#todayIcon(width='64' height='64')
        span#todayTemp {{ weather.currently.temperature + '&deg; F' }}
      div#weather-description
        span#weatherText {{ weather.daily.summary }}
      div.weather-week(v-for='(index, day) in weather.daily.data')
        canvas(id='weekIcon{{ index }}' width='24' height='24')
        span.day {{ day.day }}
        span.temperature {{ day.temperatureMax.toFixed(2) }}
        span.temperature {{ day.temperatureMin.toFixed(2) }}
</template>

<script>
import moment from 'moment'
import '../js/skycons'
import { FORECASTIO_APIKEY } from '../js/local.config.js'

export default {
  data () {
    return {
      weather: '',
      location: '',
      apikey: FORECASTIO_APIKEY,
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
    setWeather: function (data) {
      var self = this
      self.weather = data
      for (var i = 0; i < self.weather.daily.data.length; i++) {
        self.weather.daily.data[i].day = moment.unix(self.weather.daily.data[i].time).format('ddd')
      }
    },
    setSkycons: function () {
      var self = this
      if (window.Skycons) {
        var skycons = new window.Skycons({'color': 'white'})
        skycons.add('todayIcon', self.weather.currently.icon)
        for (var j = 0; j < self.weather.daily.data.length; j++) {
          skycons.add('weekIcon' + j, self.weather.daily.data[j].icon)
        }
        skycons.play()
      }
    },
    setLocation: function (location) {
      console.debug('Location: ', location)
      this.location = location
      this.fetchWeather()
    },
    getLocation: function () {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.setLocation)
      } else {
        console.error('Geolocation is not supported by this browser.')
      }
    }
  },
  created: function () {
    setTimeout(function () {
      this.updateWidget()
    }.bind(this), 1000)
    setInterval(function () {
      this.updateWidget()
    }.bind(this), this.refreshTime)
  },
  watch: {
    'weather': function () {
      var self = this
      self.setSkycons()
    }
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
    margin-left auto
    margin-bottom 20px
    text-align justify

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