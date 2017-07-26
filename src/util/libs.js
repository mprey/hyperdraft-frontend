import toastr from 'toastr'
import $ from 'jquery'
import './range'

toastr.options.positionClass = 'toast-bottom-center'
toastr.options.closeButton = true
toastr.options.closeDuration = 300
toastr.options.closeEasing = 'swing'
toastr.options.showEasing = 'swing'
toastr.options.showMethod = 'slideDown'
toastr.options.hideMethod = 'fadeOut'
toastr.options.closeMethod = 'fadeOut'
toastr.options.preventDuplicates = true
toastr.options.timeOut = 4000
toastr.options.extendedTimeOut = 800
toastr.options.progressBar = false

$.extend({
  playSound: function(file) {
    var audiofile = $(
      '<audio autoplay="autoplay" style="display:none;">' +
        '<source src="' + file + '" />' +
        '<embed src="' + file + '" hidden="true" autostart="true" loop="false" class="playSound" />' +
      '</audio>'
    ).appendTo('body').on('ended', () => $(audiofile).remove());
    return audiofile
  }
})
