'use strict';

angular.module('commonsCloudAdminApp')
  .controller('FeatureEditCtrl', ['$rootScope', '$scope', '$route', '$routeParams', '$window', '$timeout', '$location', '$http', 'Application', 'Template', 'Feature', 'Field', 'geolocation', 'leafletData', function ($rootScope, $scope, $route, $routeParams, $window, $timeout, $location, $http, Application, Template, Feature, Field, geolocation, leafletData) {

  //
  // VARIABLES
  //

    //
    // Placeholders for our on-screen content
    //
    $scope.application = {};
    $scope.template = {};
    $scope.fields = [];
    $scope.feature = {};
    $scope.files = [];

    //
    // Controls for showing/hiding specific page elements that may not be
    // fully loaded or when a specific user interaction has not yet happened
    //
    $rootScope.alerts = ($rootScope.alerts) ? $rootScope.alerts: [];
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
      scrollWheelZoom: false
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
    $scope.GetFeature = function(feature_id) {

      Feature.get({
          storage: $scope.template.storage,
          featureId: feature_id
        }).$promise.then(function(response) {
          $scope.feature = response.response;
          $scope.getEnumeratedValues($scope.fields);
          $scope.getEditableMap(response.response.geometry);
        }, function(error) {
          $rootScope.alerts.push({
            'type': 'error',
            'title': 'Uh-oh!',
            'details': 'Mind trying that again? We couldn\'t find the Feature you were looking for.'
          });

          $location.path('/applications/' + $scope.application.id + '/collections/' + $scope.template.id + '/features');
        });

    };

    $scope.GetFields = function() {
      Field.query({
          templateId: $scope.template.id
        }).$promise.then(function(response) {
          $scope.fields = response;

          if ($routeParams.featureId) {
            $scope.GetFeature($routeParams.featureId);
          }
        });
    };

    $scope.GetTemplate = function(template_id) {
      Template.get({
          templateId: $routeParams.templateId
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
          id: $routeParams.applicationId
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


    $scope.getEditableMap = function (default_geometry) {

      leafletData.getMap().then(function(map) {

        if (default_geometry) {
          console.debug('$scope.feature.geometry', $scope.feature.geometry);
          $scope.feature.geometry = $scope.convertGeometryCollectionToFeatureCollection(default_geometry);
          $scope.geojsonToLayer($scope.feature.geometry, featureGroup);

          console.debug('Setting default geometry with $scope.feature.geometry', $scope.feature.geometry);

          map.fitBounds(featureGroup.getBounds());
        } else {
          console.log('No default_geometry provided', default_geometry);
        }

        $scope.$watch('default_geometry', function() {
          if ((!angular.isUndefined($scope.default_geometry)) && ($scope.default_geometry !== null) && ($scope.default_geometry.hasOwnProperty('coordinates'))) {
            console.debug('Updating to user\'s current location with $scope.default_geometry', default_geometry);
            map.setView([$scope.default_geometry.coordinates[1], $scope.default_geometry.coordinates[0]], 13);
          }
        });

        // $scope.$watch('feature', function() {
        //   if (($scope.feature !== null) && ($scope.feature.hasOwnProperty('geometry'))) {
        //     $scope.feature.geometry = $scope.convertGeometryCollectionToFeatureCollection($scope.feature.geometry);
        //     $scope.geojsonToLayer($scope.feature.geometry, featureGroup);
        //     map.fitBounds(featureGroup.getBounds());
        //   } else {
        //     console.log('No $scope.feature.geometry found', $scope.feature.geometry);
        //   }
        // });

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
    $scope.getEnumeratedValues = function (field_list) {

      angular.forEach(field_list, function (field_, index) {
        if (field_.data_type === 'relationship') {
          Feature.query({
              storage: field_.relationship
            }).$promise.then(function (response) {
              $scope.fields[index].values = response.response.features;

              var default_values = [];

              angular.forEach($scope.feature[field_.relationship], function (feature, index) {
                default_values.push(feature.id);
              });

              $scope.feature[field_.relationship] = default_values;

            }, function(error) {
              $rootScope.alerts.push({
                'type': 'error',
                'title': 'Uh-oh!',
                'details': 'Something stranged happened, please reload the page.'
              });
            });
        }
      });

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

      if (ExistingCollection !== null && ExistingCollection !== undefined && ExistingCollection.hasOwnProperty('geometries')) {
        console.log('We got a geometry collection');
        angular.forEach(ExistingCollection.geometries, function (feature, index) {
          var geometry_ = {
            'type': 'Feature',
            'geometry': feature
          };

          NewFeatureCollection.features.push(geometry_);
        });
      } else if (ExistingCollection !== null && ExistingCollection !== undefined && ExistingCollection.hasOwnProperty('coordinates')) {
        console.log('Better just add this to the Feature collection and call it a day');
        NewFeatureCollection.features.push(ExistingCollection);
      }


      return NewFeatureCollection;

    };


    //
    // Update the attributes of an existing Template
    //
    $scope.UpdateFeature = function () {

      if ($scope.feature.geometry) {
        $scope.feature.geometry = $scope.convertFeatureCollectionToGeometryCollection($scope.feature.geometry);
      }

      angular.forEach($scope.fields, function(field, index) {
        if (field.data_type === 'relationship') {
          if (angular.isArray($scope.feature[field.relationship]) && $scope.feature[field.relationship].length >= 1) {
            
            var relationship_array_ = [];

            angular.forEach($scope.feature[field.relationship], function (value, index) {
              relationship_array_.push({
                'id': value
              });
            });

            $scope.feature[field.relationship] = relationship_array_;
          } else if (angular.isNumber($scope.feature[field.relationship])) {

            var value = $scope.feature[field.relationship];

            $scope.feature[field.relationship] = [{
              'id': value
            }];

          }
        }
      });

      Feature.update({
        storage: $scope.template.storage,
        featureId: $scope.feature.id
      }, $scope.feature).$promise.then(function(response) {

        var fileData = new FormData();

        angular.forEach($scope.files, function(file, index) {
          fileData.append(file.field, file.file)
        });

        Feature.postFiles({
          storage: $scope.template.storage,
          featureId: $scope.feature.id
        }, fileData).$promise.then(function(response) {
          console.log('Update fired', response);
        }, function(error) {
          console.log('Update failed!!!!', error);
        });

        $rootScope.alerts.push({
          'type': 'success',
          'title': 'Awesome!',
          'details': 'Your Feature updates were saved successfully!'
        });

        $route.reload();
      }, function(error) {
        $rootScope.alerts.push({
          'type': 'error',
          'title': 'Uh-oh!',
          'details': 'Mind trying that again? It looks like we couldn\'t update that Feature for you.'
        });
      });
    };

    //
    // Delete an existing Field from the API Database
    //
    $scope.DeleteFeature = function () {

      //
      // Send the 'DELETE' method to the API so it's removed from the database
      //
      Feature.delete({
        storage: $scope.template.storage,
        featureId: $scope.feature.id
      }).$promise.then(function(response) {
  
        $rootScope.alerts.push({
          'type': 'success',
          'title': 'Awesome!',
          'details': 'Your Feature updates were saved successfully!'
        });

        $location.path('/applications/' + $scope.application.id + '/collections/' + $scope.template.id + '/features');
      }, function(error) {
        $rootScope.alerts.push({
          'type': 'error',
          'title': 'Uh-oh!',
          'details': 'Mind trying that again? It looks like we couldn\'t update that Feature for you.'
        });
      });

    };

    $scope.onFileRemove = function(file, index) {
      console.log('Need to delete', file)
      // $scope.files.splice(index, 1);
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
            var new_file = {
              'field': field_name,
              'file': file
            };
            $scope.files.push(new_file);
            $scope.feature[field_name].push(new_file);
            $scope.$apply();
            console.log('files', $scope.files);
            console.log('$scope.feature[' + field_name + ']', $scope.feature[field_name]);
          };
        } else {
          var new_file = {
            'field': field_name,
            'file': file
          };
          $scope.files.push(new_file);
          $scope.feature[field_name].push(new_file);
          $scope.$apply();
          console.log('files', $scope.files);
          console.log('$scope.feature[' + field_name + ']', $scope.feature[field_name]);
        }
      });

    };


    //
    // Now that we've got the everything prepared, let's go ahead and start
    // the controller by instantiating the GetApplication method
    //
    $scope.GetApplication();
  }]);
