// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery2
//= require jquery_ujs
//= require jquery-ui
//= require ./quartzmenu/script
//= require jquery.ui-contextmenu
//= require menu
$.ajaxSetup({
  headers: {
    'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
  },
  cache: false,
});	

$('document').on('ajax:success', function (e, d, s, xhr) {
   console.log("Ajax success!");
   console.log(e);
   console.log(d);
   console.log(s);
   console.log(xhr);
   
});

$('form .new_projects_user').on('ajax:success', function(event, data, status, xhr) {
    event.preventDefault();
    console.log(event);
    console.log(data);
    console.log(status);
    console.log(xhr);
  // Do your thing, data will be the response
});


$('form .new_projects_user').on('ajax:error', function(xhr, status, error) {
    console.log(xhr);
    console.log(status);
    console.log(error);
  // Do your thing, data will be the response
});

$(document).ready(function() {
    $(".menu_userDashboard").click(function() {
// 		var host = "http://"+window.location.hostname;
//         window.location.href = host + '/user';
        
    });
});