      var map;

      var infowindow;

      var markers = [];
     
      

      function initMap() {

       map = new google.maps.Map(document.getElementById('map'), {
          center:{lat:37.7749 , lng:-122.4194},
          zoom: 13
        });
     
      
       
       var pos ={};
       
       
       
       var searcharea = document.getElementById('searcharea');

       

       var destination = document.getElementById('destination-input');

       var origin = document.getElementById('origin-input');

       var markerself = {};

       var service = new google.maps.places.PlacesService(map);

       var search = document.getElementById('search');

       var sub = document.getElementById('btn');

       var clear = document.getElementById('clear');

       

       
    

      	
        function toggleBounce() {
            if (markerself.getAnimation() !== null) {
            markerself.setAnimation(null);
            } else {
            markerself.setAnimation(google.maps.Animation.BOUNCE);
            }
            }


      	if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            markerself = new google.maps.Marker({
            map: map,
            animation: google.maps.Animation.DROP,
            draggable:false,
            position: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
            
            });
            
            markerself.addListener('click', toggleBounce);
            
            
           
           
           map.setCenter(pos);
           infowindow = new google.maps.InfoWindow();
           google.maps.event.addListener(markerself, 'click', function() {
           infowindow.setContent('You are Here');
           infowindow.open(map, this);
        });
        

           }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
          });
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
        }
        
        
        
        


       

      
       
       
       
       google.maps.event.addDomListener(markerself, 'click', toggleBounce);

        

        var centerself = document.getElementById('getcentered');

        map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(centerself);
        
        map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(searcharea);
        
        
        
        
        
        
       google.maps.event.addDomListener(centerself, 'click', function() {
         map.setCenter(pos);
        }); 
        
        
        google.maps.event.addDomListener(clear,'click',function(){
        	for (var i = 0; i < markers.length; i++) {
              markers[i].setMap(null);
        }
        })

        google.maps.event.addDomListener(sub, 'click', function(){
         if(search.value.toString().length == 0){
            alert('Please enter the location!');
            return;
          }else{
         for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(null);
        }
        }
        
         service.textSearch({
          types:['restaurant'],
          query: search.value.toString(),
          radius: 50000,
          location:pos,
          
        }, callback)


       });
        
        new AutocompleteDirectionsHandler(map);
    }



      function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
      }


        

        function callback(results, status) {
        
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          if(results.length ===0){
          	alert('Not found');
          }
          for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
          }
        }
      }

      function createMarker(place) {
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
          map: map,
          position: place.geometry.location,
          draggable: false,
          animation: google.maps.Animation.DROP,
        });

        google.maps.event.addListener(marker, 'click', function() {
          infowindow.setContent('<div><strong>'+place.name+'</strong>' +'<br>' +place.formatted_address + '</div>');
          infowindow.open(map, this);
        });
        markers.push(marker);
        }

      


        

         
        
        


        function AutocompleteDirectionsHandler(map) {
        this.map = map;
        this.originPlaceId = null;
        this.destinationPlaceId = null;
        this.travelMode = 'WALKING';
        var contain = document.getElementById('contain');
        var originInput = document.getElementById('origin-input');
        var destinationInput = document.getElementById('destination-input');
        var modeSelector = document.getElementById('mode-selector');
        this.directionsService = new google.maps.DirectionsService;
        this.directionsDisplay = new google.maps.DirectionsRenderer;
        this.directionsDisplay.setMap(map);
        this.directionsDisplay.setPanel(document.getElementById('right-panel'));


        var originAutocomplete = new google.maps.places.Autocomplete(
            originInput, {placeIdOnly: true});
        var destinationAutocomplete = new google.maps.places.Autocomplete(
            destinationInput, {placeIdOnly: true});

        this.setupClickListener('changemode-walking', 'WALKING');
        this.setupClickListener('changemode-bicycling', 'BICYCLING');
        this.setupClickListener('changemode-driving', 'DRIVING');
        this.setupClickListener('changemode-transit', 'TRANSIT');

        this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
        this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');
        
       this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(contain);
        // this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(originInput);
        // this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(destinationInput);
        // this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(modeSelector);
      }

      // Sets a listener on a radio button to change the filter type on Places
      // Autocomplete.
      AutocompleteDirectionsHandler.prototype.setupClickListener = function(id, mode) {
        var radioButton = document.getElementById(id);
        var me = this;
        radioButton.addEventListener('click', function() {
          me.travelMode = mode;
          me.route();
        });
      };

      AutocompleteDirectionsHandler.prototype.setupPlaceChangedListener = function(Autocomplete, mode) {
        var me = this;
        Autocomplete.bindTo('bounds', this.map);
        Autocomplete.addListener('place_changed', function() {

          var place = Autocomplete.getPlace();
          if (!place.place_id) {
            window.alert("Please select an option from the dropdown list.");
            return;
          }
          if (mode === 'ORIG') {
            me.originPlaceId = place.place_id;
          } else {
            me.destinationPlaceId = place.place_id;
          }
          me.route();
        });

      };

      AutocompleteDirectionsHandler.prototype.route = function() {
        if (!this.originPlaceId || !this.destinationPlaceId) {
          return;
        }
        var me = this;

       this.directionsService.route({
          origin: {'placeId': this.originPlaceId},
          destination: {'placeId': this.destinationPlaceId},
          travelMode: this.travelMode
        }, function(response, status) {
          if (status === 'OK') {
            me.directionsDisplay.setDirections(response);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
      };
        


         

    

        
        
      
  