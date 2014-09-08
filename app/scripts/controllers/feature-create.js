'use strict';

angular.module('commonsCloudAdminApp')
  .controller('FeatureCreateCtrl', ['$rootScope', '$scope', '$routeParams', '$window', '$timeout', '$location', '$http', 'Application', 'Template', 'Feature', 'Field', 'User', 'geolocation', 'leafletData', function ($rootScope, $scope, $routeParams, $window, $timeout, $location, $http, Application, Template, Feature, Field, User, geolocation, leafletData) {

  //
  // VARIABLES
  //

    //
    // Placeholders for our on-screen content
    //
    $scope.application = {};
    $scope.template = {};
    $scope.features = [];
    $scope.fields = [];
    $scope.feature = new Feature();
    $scope.files = [];
    $scope.feature.status = 'public';
    $scope.default_geometry = {};

    //
    // Start a new Alerts array that is empty, this clears out any previous
    // messages that may have been presented on another page
    //
    $rootScope.alerts = ($rootScope.alerts) ? $rootScope.alerts: [];

    $timeout(function () {
      $rootScope.alerts = [];
    }, 5000);

    $rootScope.user = User.getUser();

    $scope.ShowMap = true;


    //
    // Define the Breadcrumbs that appear at the top of the page in the nav bar
    //
    $scope.breadcrumbs = [
      {
        'label': 'Applications',
        'title': 'View my applications',
        'url': '/applications',
        'class': ''
      }
    ];

    //
    // Default query parameters
    //
    $scope.query_params = {
      'order_by': [
        {
          'field': 'id',
          'direction': 'desc'
        }
      ]
    };

    //
    // Default Map parameters and necessary variables
    //
    var featureGroup = new L.FeatureGroup();

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
        options: {
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
        }
      }
    };

  //
  // CONTENT
  //
    $scope.GetFields = function() {
      Field.query({
          templateId: $scope.template.id,
          updated: new Date().getTime()
        }).$promise.then(function(response) {
          $scope.fields = response;

          // $scope.getEnumeratedValues($scope.fields);

          $scope.getEditableMap();
        });
    };

    $scope.GetTemplate = function(template_id) {
      Template.get({
          templateId: $routeParams.templateId,
          updated: new Date().getTime()
        }).$promise.then(function(response) {
          $scope.template = response.response;

          $scope.GetFields();

          $scope.breadcrumbs.push({
            'label': $scope.template.name,
            'title': 'View ' + $scope.template.name,
            'url': '/applications/' + $scope.application.id + '/collections/' + $scope.template.id,
            'class': ''
          });

          $scope.breadcrumbs.push({
            'label': 'Features',
            'title': 'Viewing all features in ' + $scope.template.name,
            'url': '/applications/' + $scope.application.id + '/collections/' + $scope.template.id + '/features',
            'class': 'active'
          });

        });
    };

    $scope.GetApplication = function() {
      //
      // Get the single application that the user wants to view
      //
      Application.get({
          id: $routeParams.applicationId,
          updated: new Date().getTime()
        }).$promise.then(function(response) {

          //
          // Assign the response to the Application object and end loading
          //
          $scope.application = response.response;
          $scope.loading = false;

          //
          // Update the breadcrumbs based on the response from the application
          //
          $scope.breadcrumbs.push({
            'label': $scope.application.name,
            'title': 'View ' + $scope.application.name,
            'url': '/applications/' + $scope.application.id,
            'class': ''
          });

          $scope.breadcrumbs.push({
            'label': 'Feature Collections',
            'title': 'View all of ' + $scope.application.name + '\'s feature collections',
            'url': '/applications/' + $scope.application.id,
            'class': ''
          });

          $scope.GetTemplate();
        }, function(error) {
          $rootScope.alerts.push({
            'type': 'error',
            'title': 'Uh-oh!',
            'details': 'Mind reloading the page? It looks like we couldn\'t get that Application for you.'
          });
        });
    };

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
    // Build enumerated values for drop downs
    //
    // $scope.getEnumeratedValues = function (field_list) {
    //
    //   angular.forEach(field_list, function (field_, index) {
    //     if (field_.data_type === 'relationship') {
    //       Feature.query({
    //           storage: field_.relationship
    //         }).$promise.then(function (response) {
    //           $scope.fields[index].values = response.response.features;
    //         }, function(error) {
    //           $rootScope.alerts.push({
    //             'type': 'error',
    //             'title': 'Uh-oh!',
    //             'details': 'Something stranged happened, please reload the page.'
    //           });
    //         });
    //     }
    //   });
    //
    // };

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

      // angular.forEach($scope.fields, function(field, index) {
      //   if (field.data_type === 'relationship') {
      //     if (angular.isArray($scope.feature[field.relationship]) && $scope.feature[field.relationship].length >= 1) {
      //
      //       var relationship_array_ = [];
      //
      //       angular.forEach($scope.feature[field.relationship], function (value, index) {
      //         relationship_array_.push({
      //           'id': value
      //         });
      //       });
      //
      //       $scope.feature[field.relationship] = relationship_array_;
      //     } else if (angular.isNumber($scope.feature[field.relationship])) {
      //
      //       var value = $scope.feature[field.relationship];
      //
      //       $scope.feature[field.relationship] = [{
      //         'id': value
      //       }];
      //
      //     }
      //   }
      // });

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

        console.log('data', data);
        $scope.geocode_features = data.features;

        // if (data === 'JSON_CALLBACK({});') {
        //   console.log('No geocode found');
        // }

        // var coordinates = data.results[0].centroid.coordinates;
        // var lat = data.results[0][0].lat;
        // var lon = data.results[0][0].lon;
        // var centroid = {
        //   'type': 'POINT',
        //   'coordinates': [
        //     lon,
        //     lat
        // ]};
        // var coordinates = centroid.coordinates;
        // console.log('coordinates', coordinates);
        // if (coordinates) {
        //   PersistData.AddCoordinates(coordinates);
        //   createMap(PersistData.property.coordinates);
        // } else {
        //   console.log('cant find the property', data);
        // }
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

    //
    // Now that we've got the everything prepared, let's go ahead and start
    // the controller by instantiating the GetApplication method
    //
    $scope.GetApplication();
  }]);
