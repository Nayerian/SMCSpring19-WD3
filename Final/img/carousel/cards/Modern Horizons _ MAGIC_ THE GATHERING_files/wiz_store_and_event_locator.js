/**
 * Created by itraore on 2017-05-29.
 */

(function ($, Drupal) {

  Drupal.behaviors.wiz_store_and_event_locator_block = {

    attach: function(context, settings) {
      if (settings.wiz_store_and_event_locator && settings.wiz_store_and_event_locator.service) {
        //Initialization of cookie and parameters for request.
        // Done first request if cookie is not empty
        Drupal.wiz_store_and_event_locator.init(context);

        $('#wiz-store-locator-form #edit-submit', context).once('edit-submit').click(function (e) {

          e.preventDefault();
          $(this).addClass('loading');
          var formSerialize = $('#wiz-store-locator-form').serializeArray();
          var address = Drupal.wiz_store_and_event_locator.getAddressToLocate(formSerialize);
          //Do nothing if address is empty
          if (!address) {
            $(this).removeClass('loading');
            return false;
          }
          //Search coordinate geo store by location input
          Drupal.wiz_store_and_event_locator.requestFindStoreEvents(address, context);

        });
      }
    }
  };

  /**
   * Class Store locator
   */
  Drupal.wiz_store_and_event_locator = {
    DEFAULT_RADIUS: 40,
    URL_STORE_DETAILS: 'wiz-store-locator/service/store-details',
    URL_STORE_FETCH: '/wiz-store-locator/service/find-stores',
    MAPS_ZOOM: 11,
    MAPS_ICON: 'http://classic.locator.wizards.com/image/map-pin-purple.png',
    MAPS_MARKER: '/sites/all/themes/wiz_mtg/img/map-markers/',
    MAPS_CONTAINER: 'wiz-store-locator-map',
    MAPS_RESULTS : "wiz-store-locator-results",
    MAPS_LIST : "wiz-store-locator-list",
    CENTER: null,
    mapInfoBubbles: [],
    mapInfoBubble: {},
    markers: [],
    bounds: {},

    parameter: {
      language: "en-us",
      request: {
        EarliestEventStartDate:null,
        LatestEventStartDate:null,
        ProductLineCodes: [''],
        SalesBrandCodes: ['']
      },
      page:1,
      count:2,
      filter_mass_markets:true,
      countryIsoCode:null
    },

    /**
     * Initializer
     */
    init: function(context) {
      if ("geolocation" in navigator) {
        var geolocationButton = document.querySelector("#wiz-store-locator-form .geolocate"),
            _this = this;

        if (geolocationButton) {
          geolocationButton.addEventListener("click", function() {
            document.getElementById("wiz-store-locator-results").classList.add("loading");
            document.getElementById("wiz-store-locator-results").classList.add("opened");

            navigator.geolocation.getCurrentPosition(function(__position) { _this.getCurrentPosition(context, _this, __position); }, function(__error) { _this.getCurrentPositionFailed(context, _this, __error); });
          });
        }
      } else {
        this.getCurrentPositionFailed();
      }

      // Details window close button
      var button = document.querySelector("#" + Drupal.wiz_store_and_event_locator.MAPS_RESULTS + " .module_store-locator--results--map--details > button");
      if (button) {
        button.addEventListener("click", function(){
          var listItems = document.querySelectorAll("#" + Drupal.wiz_store_and_event_locator.MAPS_LIST + " .current"),
              i;

          for ( i = 0; i < listItems.length; i++ ) {
            listItems[i].classList.remove("current");
          }

          this.parentNode.classList.remove("opened");
          document.body.classList.remove("module_store-locator-details-opened");
        });
      }

      var config = Drupal.settings.wiz_store_and_event_locator.data;

      if (config.event_types) {
        this.parameter.request.EventTypeCodes = config.event_types;
      }

      if (config.start) {
        this.parameter.request.EarliestEventStartDate = this.convertDate(config.start);
      }
      if (config.end) {
        this.parameter.request.LatestEventStartDate = this.convertDate(config.end);
      }

      if (config.store_count) {
        this.parameter.count = config.store_count;
      }

      this.parameter.request.LocalTime = this.getLocaleTime();
    },


    /**
     * Handles the geolocation event
     */
    getCurrentPosition: function(__context, __this, __position) {
      var location = new google.maps.LatLng(__position.coords.latitude, __position.coords.longitude);

      document.getElementById("wiz-store-locator-results").classList.add("loading");
      document.getElementById("wiz-store-locator-results").classList.add("opened");

      var geocoder = new google.maps.Geocoder();
      geocoder.geocode( { 'location': location}, function(results, status) {
        if (status == 'OK' && results[0]) {
          var address_components = results[0].address_components,
              address = address_components[7].long_name + ', ' + address_components[6].long_name + ', ' + address_components[8].long_name;

          $('.store_and_event_locator #edit-location').val(address);
          location += '|' + address;

          __this.requestFindStoreEvents(address, __context);
        }
        else {
          document.getElementById("wiz-store-locator-results").classList.remove("opened");
          document.getElementById("wiz-store-locator-results").classList.remove("loading");
        }
      });
    },

    /**
     * Handles the geolocation failed event
     */
    getCurrentPositionFailed: function(__context,  __this, __error) {
      var geolocationButton = document.querySelector("#wiz-store-locator-form .geolocate");
      if ( geolocationButton ) {
        geolocationButton.parentNode.removeChild(geolocationButton);
      }

      console.error(__error);

      document.getElementById("wiz-store-locator-results").classList.remove("opened");
      document.getElementById("wiz-store-locator-results").classList.remove("loading");

    },

    /**
     * Extract form values and set request paramter
     *
     * @param form
     * @returns {*}
     */
    getAddressToLocate: function(form) {
      var fieldValue = {};

      $.each(form, function(i, field) {
        if (field.value == 0) {
          field.value = '';
        }
        fieldValue[field.name] = field.value;
      });

      return $.trim(fieldValue.location);
    },

    /**
     * Return date UTC in format timestamp(millisecond)
     *
     * @returns {string}
     */
    getLocaleTime: function() {
      var date = new Date();
      return '\/Date(' + Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) + ')\/';
    },

    /**
     * Convert date to UTC
     *
     * @param d
     * @returns {string}
     */
    convertDate: function(d) {
      var date = new Date(d);
      return '\/Date(' + Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) + ')\/';
    },

    /**
     * Get Country ISO code
     *
     * @param obj
     */
    getCountryIsoCode: function(obj) {
      var code = '';
      $.each(obj, function(i, obj) {
        if (obj.types && obj.types[0] == 'country') {
          code = obj.short_name;
          return false;
        }
      });
      return code;
    },

    /**
     * Calculate four points coordinate (North, south, east, west)
     *
     * @param latlng
     * @param radius
     * @returns {{North: *, East: *, South: *, West: *}}
     */
    getFourPointsByCenterAndRadius: function (latlng, radius) {
      var destinationPoint = function(latlng, brng, dist) {
        dist = dist / 6371;
        brng = brng.toRad();
        var lat1 = latlng.lat().toRad(), lon1 = latlng.lng().toRad();
        var lat2 = Math.asin(Math.sin(lat1) * Math.cos(dist) + Math.cos(lat1) * Math.sin(dist) * Math.cos(brng));
        var lon2 = lon1 + Math.atan2(Math.sin(brng) * Math.sin(dist) * Math.cos(lat1), Math.cos(dist) - Math.sin(lat1) * Math.sin(lat2));
        if (isNaN(lat2) || isNaN(lon2)) return null;
        return new google.maps.LatLng(lat2.toDeg(), lon2.toDeg());
      };

      // radius : km
      var mile = 1.609344;
      if (this.useMileAsDistanceUnit()) {
        radius = radius / mile; // mile
      }
      var north = destinationPoint(latlng, 0, radius);
      var east = destinationPoint(latlng, 90, radius);
      var south = destinationPoint(latlng, 180, radius);
      var west = destinationPoint(latlng, -90, radius);
      return {North: north.lat(), East: east.lng(), South: south.lat(), West: west.lng()};
    },

    /**
     * Check unit of measure to display.
     *   - US : mi
     *   - other : km
     * @returns {boolean}
     */
    useMileAsDistanceUnit: function() {
      return this.parameter.countryIsoCode == 'US' ? true : false;
    },

    /**
     * Create or update a cookie domain
     *
     * @param name
     * @param value
     * @param optDomain
     */
    setCookie: function (name, value, optDomain) {
      if (/;=/g.test(name))
        return; // ';' '=' in name
      if (/;/g.test(value))
        return; // ';' in value

      var date = new Date();
      date.setDate(date.getDate() + 100);
      var cookie = name + "=" + value + ";expires=" + date.toUTCString() + ";path=" + Drupal.settings.basePath;
      if(optDomain) {
        cookie += ";domain=" + optDomain;
      }
      document.cookie = cookie;
    },

    /**
     * Verbatim copy of Drupal.comment.getCookie().
     */
    getCookie: function(name) {
      var search = name + '=';
      var returnValue = '';

      if (document.cookie.length > 0) {
        offset = document.cookie.indexOf(search);
        if (offset != -1) {
          offset += search.length;
          var end = document.cookie.indexOf(';', offset);
          if (end == -1) {
            end = document.cookie.length;
          }
          returnValue = decodeURIComponent(document.cookie.substring(offset, end).replace(/\+/g, '%20'));
        }
      }

      return returnValue;
    },

    /**
     * Find geo coordinate of address after send a request service to locator.wizards site
     * for extract stores and their events
     *
     * @param address Find locator
     * @param context Drupal HTML context
     */
    requestFindStoreEvents: function(address, context) {
      var that = Drupal.wiz_store_and_event_locator;

      var geocoder = new google.maps.Geocoder();
      geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == 'OK') {
          that.parameter.countryIsoCode = that.getCountryIsoCode(results[0].address_components);
          var location = results[0].geometry.location;
          var center = new google.maps.LatLng(location.lat(), location.lng());
          var points = that.getFourPointsByCenterAndRadius(center, Drupal.wiz_store_and_event_locator.DEFAULT_RADIUS);

          $.each(points, function(key, value) {
            that.parameter.request[key] = value;
          });

          that.CENTER = center;
          that.getStores();
        }
      });
    },

    /**
     * Find all store proximity to locate user or address input form
     */
    getStores: function() {
      var _this = this;

      document.getElementById(this.MAPS_RESULTS).classList.add("opened");
      document.getElementById(this.MAPS_RESULTS).classList.add("loading");


      $.ajax({
        type: 'POST',
        url: this.URL_STORE_FETCH,
        data: this.parameter,
        dataType: 'json',
        success: function( response ) {
          _this.createMaps(_this.CENTER, response.data);
          $('#edit-submit').removeClass('loading');

          _this.outputStoresList(_this, response.data);
        }
      });

      try {
        ga("send", "event", "locator-inpage", "submit", "location-search");
      } catch(e) {}
    },


    /**
     * Outputs the stores list
     */
    outputStoresList: function(__context, __stores) {
      var list = document.getElementById(this.MAPS_LIST),
          listItem;


      function listItemClicked() {
        if ( !this.classList.contains("current") ) {
          __context.showStoreDetails(this.storeInfo);
        }
      }


      while ( list.firstChild ) {
        list.removeChild(list.firstChild);
      }

      if ( __stores.length ) {
        var address;

        __stores.forEach(function(__store, __index) {
          var address = __store.address.replace(/\<br((\s)*?\/)?\>/i, "{#}");
          address = address.substring( address.indexOf("{#}") + 3 );

          while ( (/\<br((\s)*?\/)?\>\<br((\s)*?\/)?\>/gi).test(address) ) {
            address = address.replace(/\<br((\s)*?\/)?\>\<br((\s)*?\/)?\>/gi, "<BR/>")
          }
          address = address.replace(/\<br((\s)*?\/)?\>/gi, ", ");

          listItem = document.createElement("li");
          listItem.innerHTML = '' +
              '<p class="module_store-locator--results--list--marker">' +
              '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 72"><path d="M48.82,17.92A22.31,22.31,0,0,0,47.65,15C43,4,32.86,0,24.66,0,13.69,0,1.61,7.3,0,22.34v3.07c0,.13,0,1.28.11,1.86C1,34.43,6.71,42,11,49.22,15.55,56.9,20.31,64.45,25,72c2.9-4.93,5.8-9.92,8.63-14.72.77-1.41,1.67-2.82,2.45-4.16.52-.9,1.5-1.79,2-2.62,4.58-8.32,12-16.7,12-25V22.14A25.31,25.31,0,0,0,48.82,17.92Zm-24,15.42a8.87,8.87,0,0,1-8.5-6,8.28,8.28,0,0,1-.24-2.24v-2c0-5.63,4.82-8.19,9-8.19a9.1,9.1,0,0,1,9.15,9.22A9.34,9.34,0,0,1,24.86,33.34Z"/></svg>' +
              '<span>' + String.fromCharCode(65 + __index) + '</span>' +
              '</p>' +
              '<div class="module_store-locator--results--list--details">' +
              '<h3>' + __store.name + ' <span>(' + __store.distance + ')</span></h3>' +
              '<p>' + address +
              (__store.phone.length ? '<br />' + __store.phone : '' ) + '</p>' +
              '</div>';

          listItem.storeInfo = __store;
          listItem.addEventListener("click", listItemClicked);

          list.appendChild(listItem);
        });
      } else {
        listItem = document.createElement("li");
        listItem.classList.add("empty");
        listItem.innerHTML = list.getAttribute("data-empty-message") ? list.getAttribute("data-empty-message") : "No stores found";
        list.appendChild(listItem);
      }

      document.getElementById(this.MAPS_RESULTS).classList.remove("loading");
    },


    /**
     * Find all store proximity to locate user or address input form
     */
    showStoreDetails: function(__store) {
      var _this = this,
          storeInfo = __store,
          listItems = document.querySelectorAll("#" + Drupal.wiz_store_and_event_locator.MAPS_LIST + " li"),
          detailsWindow = document.querySelector("#" + Drupal.wiz_store_and_event_locator.MAPS_RESULTS + " .module_store-locator--results--map--details"),
          trackingLabel = Drupal.wiz_store_and_event_locator.convertToURLFriendly(__store.name),
          i;

      for ( i = 0; i < listItems.length; i++ ) {
        listItems[i].classList[listItems[i].storeInfo.organizationId === __store.organizationId ? "add" : "remove"]("current");
      }


      detailsWindow.classList.add("loading");
      detailsWindow.classList.add("opened");
      document.body.classList.add("module_store-locator-details-opened");

      detailsWindow.querySelector(".content").innerHTML = "";

      // Constructs request parameters for store locator service
      storeInfo.request = {
        BusinessAddressId: storeInfo.addressId,
        OrganizationId: storeInfo.organizationId,
        EventTypeCodes: Drupal.wiz_store_and_event_locator.parameter.request.EventTypeCodes,
        EarliestEventStartDate: Drupal.wiz_store_and_event_locator.parameter.request.EarliestEventStartDate,
        LatestEventStartDate: Drupal.wiz_store_and_event_locator.parameter.request.LatestEventStartDate,
        LocalTime: Drupal.wiz_store_and_event_locator.parameter.request.LocalTime
      };

      $.ajax({
        type: 'POST',
        url: '/' + Drupal.settings.pathPrefix + _this.URL_STORE_DETAILS,
        data: storeInfo,
        dataType: 'json',
        success: function( response ) {
          var detailsWindowContent = detailsWindow.querySelector(".content"),
              email,
              direction;

          detailsWindowContent.innerHTML = response.data;

          email = detailsWindowContent.querySelector(".details p.email a");
          if ( email ) {
            email.setAttribute("onclick", "ga('send', 'event', 'locator-inpage', 'click', 'email-" + trackingLabel + "');");
          }

          direction = detailsWindowContent.querySelector(".details p.actions a[href*='google.com/maps']");
          if ( direction ) {
            direction.setAttribute("onclick", "ga('send', 'event', 'locator-inpage', 'click', 'directions-" + trackingLabel + "');");
          }

          detailsWindow.classList.remove("loading");
        }
      });


      try {
        ga("send", "event", "locator-inpage", "select", "detail-" + trackingLabel);
      } catch(e) {}
    },


    /**
     * Converts a string to an URL friendly string (used for tracking)
     *
     * @param {string} __string - String to convert
     *
     * @return {string} str - URL friendly string
     */
    convertToURLFriendly : function(__string) {
      var str = __string.toLowerCase().trim().replace(/\s|'|’|\"|“|”|\(|\)|\{|\}|\&amp;/g, "-").replace(/\&/g, "-").replace(/\.|\,|\;/g, "").replace(/À|Â|Á|Ä|Ã|Å|Ā/gi, "a").replace(/É|È|Ê|Ë|Ę|Ė|Ē/gi, "e").replace(/Î|Ï|Ì|Í|Į|Ī/gi, "i").replace(/Ô|Ö|Ò|Ó|Õ|Ø|Ō/gi, "o").replace(/Û|Ù|Ü|Ú|Ū/gi, "u").replace(/Ÿ/gi, "y").replace(/Ç|Ć|Č/gi, "c").replace(/Æ/gi, "ae").replace(/Œ/gi, "oe").replace(/^\-/, "").replace(/\-$/, "");;

      while ((/\-\-/).test(str)) {
        str = str.replace(/\-\-/g, "-")
      }

      return str;
    },


    /**
     * Create Maps from page
     *
     * @param center
     * @param markers
     */
    createMaps: function(center, markers) {
      var that = this;
      var options = {
        center: center,
        zoom: this.MAPS_ZOOM,
        scrollwheel: false
      };

      // Constructor of the map that takes in parameter the HTML container
      // where the map should be displayed and the options
      var map = new google.maps.Map(document.getElementById(this.MAPS_CONTAINER), options);

      //Place the coordinate points around the center
      $.each(markers, function(i, store) {
        var index = i + 1;
        that.createMapsMarker(map, store, index);
      });

      //now fit the map to the newly inclusive bounds
      this.fitMapMarkers(map, center);

      //Resize Function
      google.maps.event.addDomListener(window, "resize", function() {
        var center = map.getCenter();
        google.maps.event.trigger(map, "resize");
        map.setCenter(center);
      });
    },

    /**
     * Create a store marker to map
     *
     * @param map
     * @param store
     */
    createMapsMarker: function (map, store, index) {
      var that = this,
          icon = that.MAPS_MARKER + index + ".png",
          position = new google.maps.LatLng(store.lat, store.lng),
          name = "store__" + Math.floor((Math.random() * 10000) + 1),
          contentString = '<a href="#" class="store-details" data-store-id="' + name + '">' + store.name + "</a>",
          infowindow = new google.maps.InfoWindow({ content: contentString }),
          marker = new google.maps.Marker({
            position: position,
            map: map,
            icon: icon
          });

      this.markers.push(marker);

      marker.addListener('click', function() {
        //Close all other info window open
        if (that.mapInfoBubble.infoWindow) {
          that.mapInfoBubble.infoWindow.close();
        }
        infowindow.open(map, marker);
        that.mapInfoBubble = {
          infoWindow: infowindow,
          map: map,
          marker: this
        };
      });
      $.data($("#" + this.MAPS_CONTAINER)[ 0 ], name, store);
    },

    /**
     * Auto-center map with multiple markers
     *
     * @param map
     * @param center
     */
    fitMapMarkers: function (map, center) {
      // zoom to fit all markers
      var bounds = new google.maps.LatLngBounds();
      bounds.extend(center);

      // go through each...
      $.each(this.markers, function(i, marker) {
        if (i == 5) return false;
        bounds.extend(marker.getPosition());
      });

      this.bounds = bounds;
      // fit these bounds to the map
      map.fitBounds(bounds);
    }

  };// End namespace wiz_store_and_event_locator

  $(document).on('click', 'a.store-details', function(e) {
    e.preventDefault();
    var $mapsContainer = $("#" + Drupal.wiz_store_and_event_locator.MAPS_CONTAINER)[ 0 ],
        dataName = $(this).data('store-id');
    storeInfo = $.data($mapsContainer, dataName);

    Drupal.wiz_store_and_event_locator.showStoreDetails(storeInfo);
  });

  if (typeof(Number.prototype.toRad) === "undefined") {
    Number.prototype.toRad = function() {
      return this * Math.PI / 180;
    };
  }

  if (typeof(Number.prototype.toDeg) === "undefined") {
    Number.prototype.toDeg = function() {
      return this * 180 / Math.PI;
    };
  }


})(jQuery, Drupal);
