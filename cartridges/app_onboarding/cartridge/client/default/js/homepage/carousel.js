'use strict'

module.exports = {
  carousel: function () {
    var carouselSettings = document.getElementsByClassName('carousel')[0].attributes["data-attribute"].value
    $('.carousel').carousel(JSON.parse(carouselSettings))
  }
}