'use strict';

angular.module('commonsCloudAdminApp')
  .controller('FeatureCreateCtrl', ['$rootScope', '$scope', '$routeParams', '$window', '$timeout', '$location', '$http', 'application', 'template', 'Feature', 'fields', 'user', 'geolocation', 'leafletData', function ($rootScope, $scope, $routeParams, $window, $timeout, $location, $http, application, template, Feature, fields, user, geolocation, leafletData) {

  //
  // VARIABLES
  //

    //
    // Placeholders for our on-screen content
    //
    $scope.application = application;
    $scope.template = template;
    $scope.fields = fields;
    $scope.feature = new Feature();
    $scope.files = [];
    $scope.feature.status = 'public';
    $scope.default_geometry = {};

    $scope.page = {
      template: '/views/feature-create.html',
      title: 'Add a ' + $scope.template.name,
      back: '/applications/' + $scope.application.id + '/collections/' + $scope.template.id + '/features/'
    }

    //
    // Start a new Alerts array that is empty, this clears out any previous
    // messages that may have been presented on another page
    //
    $rootScope.alerts = ($rootScope.alerts) ? $rootScope.alerts: [];

    $timeout(function () {
      $rootScope.alerts = [];
    }, 5000);

    $scope.ShowMap = true;

    //
    // Default Map parameters and necessary variables
    //
    var featureGroup = new L.FeatureGroup();
    L.Icon.Default.imagePath = '/scripts/images';

    $scope.defaults = {
      tileLayer: 'https://{s}.tiles.mapbox.com/v3/developedsimple.hl46o07c/{z}/{x}/{y}.png',
      tileLayerOptions: {
        detectRetina: true,
        reuseTiles: true,
      },
      scrollWheelZoom: false,
      zoomControl: false
    };

    $scope.controls = {
      draw: {
        circle: false,
        rectangle: false,
        polyline: {
          shapeOptions: {
            stroke: true,
            color: '#ffffff',
            weight: 4,
            opacity: 0.5,
            fill: true,
            fillColor: null,
            fillOpacity: 0.2,
            clickable: true
          }
        },
        polygon: {
          shapeOptions: {
            stroke: true,
            color: '#ffffff',
            weight: 4,
            opacity: 0.5,
            fill: true,
            fillColor: '#ffffff',
            fillOpacity: 0.2,
            clickable: true
          }
        },
        handlers: {
          marker: {
            tooltip: {
              start: 'Click map to place marker.'
            }
          },
          polygon: {
            tooltip: {
              start: 'Click to start drawing shape.',
              cont: 'Click to continue drawing shape.',
              end: 'Click first point to close this shape.'
            }
          },
          polyline: {
            error: '<strong>Error:</strong> shape edges cannot cross!',
            tooltip: {
              start: 'Click to start drawing line.',
              cont: 'Click to continue drawing line.',
              end: 'Click last point to finish line.'
            }
          },
          simpleshape: {
            tooltip: {
              end: 'Release mouse to finish drawing.'
            }
          }
        }
      },
      edit: {
        selectedPathOptions: {
          color: '#ffffff',
          opacity: 0.6,
          dashArray: '10, 10',
          fill: true,
          fillColor: '#ffffff',
          fillOpacity: 0.1
        },
        'featureGroup': featureGroup,
        'remove': true,
        handlers: {
          edit: {
            tooltip: {
              text: 'Drag handles, or marker to edit feature.',
              subtext: 'Click cancel to undo changes.'
            }
          },
          remove: {
            tooltip: {
              text: 'Click on a feature to remove'
            }
          }
        }
      }
    };

  //
  // CONTENT
  //

    $scope.getCurrentLocation = function () {
      geolocation.getLocation().then(function(data){
        $scope.default_geometry = {
          "type": "Point",
          "coordinates": [
            data.coords.longitude,
            data.coords.latitude
          ]
        };
      });
    };


    $scope.getEditableMap = function () {

      leafletData.getMap().then(function(map) {

        $scope.$watch('default_geometry', function() {
          if ($scope.default_geometry.hasOwnProperty('coordinates')) {
            map.setView([$scope.default_geometry.coordinates[1], $scope.default_geometry.coordinates[0]], 13);
          }
        });

        // var featureGroup = new L.FeatureGroup();
        map.addLayer(featureGroup);

        //
        // On Drawing Complete add it to our FeatureGroup
        //
        map.on('draw:created', function (e) {
          var newLayer = e.layer;
          featureGroup.addLayer(newLayer);

          $scope.feature.geometry = JSON.stringify(featureGroup.toGeoJSON());
        });

        map.on('draw:edited', function (e) {
          var editedLayers = e.layers;
          editedLayers.eachLayer(function (layer) {
            featureGroup.addLayer(layer);
          });

          $scope.feature.geometry = JSON.stringify(featureGroup.toGeoJSON());
        });

        map.on('draw:deleted', function (e) {
          var deletedLayers = e.layers;
          deletedLayers.eachLayer(function (layer) {
            featureGroup.removeLayer(layer);
          });

          $scope.feature.geometry = JSON.stringify(featureGroup.toGeoJSON());
        });

        new L.Control.Zoom({
          position: 'bottomright'
        }).addTo(map);

        //
        // We need to invalidate the size of the Mapbox container so that it
        // displays properly. This is annoying and ugly ... timeouts are evil.
        // However, it serves as a temporary solution until we can figure out
        // something better.
        //
        $timeout(function () {
          map.invalidateSize();
        }, 500);

      });

      $scope.MapLoaded = true;
    };


    $scope.geojsonToLayer = function (geojson, layer) {
      layer.clearLayers();
      function add(l) {
        l.addTo(layer);
      }
      L.geoJson(geojson).eachLayer(add);
    };


    //
    // Convert a FeatureCollection to a GeometryCollection so that it can be
    // saved to a Geometry field within the CommonsCloud API
    //
    $scope.convertFeatureCollectionToGeometryCollection = function (featureCollection) {

      var ExistingCollection = angular.fromJson(featureCollection);

      var NewFeatureCollection = {
        'type': 'GeometryCollection',
        'geometries': []
      };

      angular.forEach(ExistingCollection.features, function (feature, index) {
        NewFeatureCollection.geometries.push(feature.geometry);
      });

      return NewFeatureCollection;
    };

    //
    // Convert a GeometryCollection to a FeatureCollection so that it can be
    // saved to a Geometry field within the CommonsCloud Admin UI
    //
    $scope.convertGeometryCollectionToFeatureCollection = function (geometryCollection) {

      var ExistingCollection = angular.fromJson(geometryCollection);

      var NewFeatureCollection = {
        'type': 'FeatureCollection',
        'features': []
      };

      angular.forEach(ExistingCollection.geometries, function (feature, index) {
        var geometry_ = {
          'type': 'Feature',
          'geometry': feature
        };

        NewFeatureCollection.features.push(geometry_);
      });

      return NewFeatureCollection;
    };

    $scope.CreateFeature = function () {

      if ($scope.feature.geometry) {
        var geometry_object = $scope.convertFeatureCollectionToGeometryCollection($scope.feature.geometry);
        $scope.feature.geometry = JSON.stringify(geometry_object);
      }

      $scope.feature.$save({
        storage: $scope.template.storage
      }).then(function(response) {

        var fileData = new FormData();

        angular.forEach($scope.files, function(file, index) {
          fileData.append(file.field, file.file)
        });

        Feature.postFiles({
          storage: $scope.template.storage,
          featureId: response.resource_id
        }, fileData).$promise.then(function(response) {
          console.log('Update fired', response);
          $scope.feature = response.response

          $rootScope.alerts.push({
            'type': 'success',
            'title': 'Yes!',
            'details': 'Your new Features created.'
          });

          $location.path('/applications/' + $scope.application.id + '/collections/' + $scope.template.id + '/features/' + $scope.feature.id);
        }, function(error) {
          console.log('Update failed!!!!', error);
        });

      }, function(error) {
        $rootScope.alerts.push({
          'type': 'error',
          'title': 'Uh-oh!',
          'details': 'Mind trying that again? It looks like we couldn\'t create that Feature for you.'
        });
      });
    };


    $scope.onFileRemove = function(file, index) {
      $scope.files.splice(index, 1);
    };

    $scope.onFileSelect = function(files, field_name) {

      console.log('field_name', field_name);

      angular.forEach(files, function(file, index) {
        // Check to see if we can load previews
        if (window.FileReader && file.type.indexOf('image') > -1) {

          var fileReader = new FileReader();
          fileReader.readAsDataURL(file);
          fileReader.onload = function (event) {
            file.preview = event.target.result;
            $scope.files.push({
              'field': field_name,
              'file': file
            });
            $scope.$apply();
            console.log('files', $scope.files);
          };
        } else {
          $scope.files.push({
            'field': field_name,
            'file': file
          });
          $scope.$apply();
          console.log('files', $scope.files);
        }
      });

    };

    $scope.initGeocoder = function() {
      var requested_location = $scope.geocoder;

      console.log(requested_location);

      var geocode_service_url = '//api.tiles.mapbox.com/v4/geocode/mapbox.places-v1/' + requested_location + '.json';
      $http({
        method: 'get',
        url: geocode_service_url,
        params: {
          'callback': 'JSON_CALLBACK',
          'access_token': 'pk.eyJ1IjoiZGV2ZWxvcGVkc2ltcGxlIiwiYSI6Il9aYmF0eWMifQ.IKV2X58Q7rhaqVBEKPbJMw'
        },
        headers: {
          'Authorization': 'external'
        }
      }).success(function(data) {

        $scope.geocode_features = data.features;

      }).error(function(data, status, headers, config) {
        console.log('ERROR: ', data);
      });

    };

    $scope.centerMapOnGeocode = function(result) {

      //
      // Once we click on an address we need to clear out the search field and
      // the list of possible results so that we can see the map and allow the
      // click event to center the map.
      //
      $scope.geocoder = '';
      $scope.geocode_features = [];

      leafletData.getMap().then(function(map) {

        map.setView([result.center[1], result.center[0]], 18);

        map.fitBounds(map.getBounds());

      });
    };

    $scope.getEditableMap();

  }]);
