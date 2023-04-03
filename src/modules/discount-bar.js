import $ from 'jquery';

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
  
function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}
  
$(".discount-bar").on('click', function() {
    var $this = $(this);
    $this.hide();
    setCookie("discount-bar-hide", 1, 1)
});

var discount = getCookie("discount_code")
var discountHide = getCookie("discount-bar-hide")
var $discountBar = $(".discount-bar")
if(discount && discountHide != true) {
  $discountBar.show();
} else {
  $discountBar.hide();
}
