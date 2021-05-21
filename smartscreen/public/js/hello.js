var mainCtr = $("#main-ctr"),
  hello = $("#hi"),
  main = $("#main"),
  image = $("#image"),
  deviceId = $("#device_id"),
  connWifiText = $("#connect_wifi"),
  code = $("#code");

var tl = new TimelineMax({
  repeat: 0,
  repeatDelay: .3,
  delay: .1
});


var isValidImage = function (url, callback) {
  $("<img>", {
    src: url,
    error: function () {
      callback(false);
    },
    load: function () {
      callback(true);
    }
  });
}


function introAnimation() {
  tl
    .to(mainCtr, .3, {
      opacity: 1
    })
    .to(hello, .3, {
      opacity: 1,
      delay: 3.4
    })
    .to(hello, .3, {
      opacity: 0,
      delay: 3.4
    }, "-=.3")
    .to(code, .3, {
      opacity: 1,
      delay: 0
    });
}
TweenMax.set([mainCtr, hello], {
  opacity: 0
});

$(function () {
  var SERVER_URL = "";
  var device_id = "0000";
  var image_url = undefined;
  var has_cache = false;
  $.get('/device_id',  // device_id
    function (data, textStatus, jqXHR) {
      if (data) {
        device_id = data;
      }
      deviceId.text(device_id);
    });
  $.get('/server_info',  // url
    function (data, textStatus, jqXHR) {
      if (data) {
        SERVER_URL = data.server_url;
      }
    });
  window.setInterval(function () {
    $.get(`${SERVER_URL}/get_image?device_id=${device_id}`,  // url
      function (data, textStatus, jqXHR) {
        var new_image = data.image_path
        console.log(image_url, new_image)
        if (image_url != new_image && new_image != undefined) {
          image_url = new_image
          $.get(`/store_image?url=${SERVER_URL}/${new_image}`)
        }
        if (image_url != undefined && new_image != undefined) {
          var fullpath = `${SERVER_URL}/${data.image_path}`
          image.attr("src", fullpath)
          main.hide()
          image.show()
        } else {
          main.show()
          image.hide()
        }
      }).fail(function () {
        isValidImage("/static/cache.jpg", function (isValid) {
          if (isValid) {
            has_cache = true;
            image.attr("src", "/static/cache.jpg")
            main.hide()
            image.show()
          } else {
            has_cache = false;
            main.show()
            image.hide()
          }
        });
      });
  }, 4000);
  window.setInterval(function () {
    $.getJSON('/has_internet',  // url
      function (data, textStatus, jqXHR) {
        if (data.has_reset) {
          // ?
        }
        if (!data.has_internet && !has_cache) {
          connWifiText.show();
        } else {
          connWifiText.hide();
        }
      });
  }, 5000);
  introAnimation();
});

