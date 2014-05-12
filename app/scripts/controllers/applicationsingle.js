'use strict';

angular.module('commonsCloudAdminApp')
  .controller('ApplicationSingleCtrl', ['$route', '$rootScope', '$scope', '$routeParams', '$location', '$timeout', '$http', '$upload', 'Application', 'Template', 'Feature', 'Field', 'Statistic', 'User', 'leafletData', function ($route, $rootScope, $scope, $routeParams, $location, $timeout, $http, $upload, Application, Template, Feature, Field, Statistic, User, leafletData) {

  //
  // VARIABLES
  //

    //
    // Placeholders for our on-screen content
    //
    $scope.application = {};
    $scope.templates = [];
    $scope.template = {};
    $scope.fields = [];
    $scope.field = {};
    $scope.features = [];
    $scope.statistics = [];
    $scope.statistic = {};

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
    // Placeholders for non-existent content
    //
    $scope.newTemplate = new Template();
    $scope.newField = new Field();
    $scope.newStatistic = new Statistic();
    $scope.feature = new Feature();
    $scope.files = [];
    $scope.user = new User();
    // $scope.newTemplate = {
    //   'is_public': true,
    //   'is_crowdsourced': true,
    //   'is_moderated': true,
    //   'is_geospatial': true
    // };

    //
    // Controls for showing/hiding specific page elements that may not be
    // fully loaded or when a specific user interaction has not yet happened
    //
    $rootScope.alerts = ($rootScope.alerts) ? $rootScope.alerts: [];
    $scope.loading = true;
    $rootScope.navigation = false;
    $scope.EditApplication = false;
    $scope.AddTemplate = false;
    $scope.orderByField = null;
    $scope.reverseSort = false;
    $scope.FieldEdit = false;
    $scope.FieldAdd = false;
    $scope.ShowMap = true;
    $scope.ShowGeoJSONEditor = false;
    $scope.MapLoaded = false;

  //
  // CONTENT
  //

    //
    // Make sure all of our alerts go away after a few seconds
    //
    $timeout(function () {
      $rootScope.alerts = [];
    }, 4000);

    $scope.GetUser = function() {
      User.get().$promise.then(function(response) {
        $scope.user = response.response;
      });
    };

    $scope.GetTemplateList = function() {
      //
      // Get a list of templates associated with the current application
      //
      Template.query({
          applicationId: $routeParams.applicationId
        }).$promise.then(function(response) {
          $scope.templates = response;

          angular.forEach($scope.templates, function(template, index) {

            $scope.templates[index].features = [];

            //
            // Get a list of all features
            //
            Feature.query({
                storage: template.storage
              }).$promise.then(function(response) {
                $scope.templates[index].features = response;
              });

            //
            // Get a list of Features awaiting moderation
            //
            Feature.query({
                storage: template.storage,
                q: {
                  'filters': [
                    {
                      'name': 'status',
                      'op': 'eq',
                      'val': 'crowd'
                    }
                  ]
                }
              }).$promise.then(function(response) {
                $scope.templates[index].moderation = response;
                if ($scope.templates[index].moderation.properties.total_features > 0) {
                  $scope.templates[index].moderation = true;
                }
              });

          });

        });
    };

    $scope.GetTemplate = function(template_id) {
      Template.get({
          id: $routeParams.templateId
        }).$promise.then(function(response) {
          $scope.template = response.response;
          $scope.loading = false;

          if ($routeParams.page) {
            Feature.query({
              storage: $scope.template.storage,
              page: $routeParams.page,
              q: {
                'order_by': [
                  {
                    'field': 'created',
                    'direction': 'desc'
                  }
                ]
              }
            }).$promise.then(function(response) {
              $scope.featureproperties = response.properties;
              $scope.features = response.response.features;
            });
          } else {
            Feature.query({
              storage: $scope.template.storage,
              q: {
                'order_by': [
                  {
                    'field': 'created',
                    'direction': 'desc'
                  }
                ]
              }
            }).$promise.then(function(response) {
              $scope.featureproperties = response.properties;
              $scope.features = response.response.features;
            });
          }

          Field.query({
            templateId: $scope.template.id
          }).$promise.then(function(response) {
            $scope.fields = response;
            $scope.getEnumeratedValues($scope.fields);

            if ($routeParams.featureId) {
              Feature.get({
                storage: $scope.template.storage,
                featureId: $routeParams.featureId
              }).$promise.then(function(response) {
                $scope.feature = response;
                $scope.getEditableMap();
              });
            } else {
              $scope.getEditableMap();
            }
          });

          Statistic.query({
            templateId: $scope.template.id
          }).$promise.then(function(response) {
            $scope.statistics = response;
          });
        });
    };

    $scope.GetApplicationPage = function() {

      //
      // Get the User's information
      //
      $scope.GetUser();

      //
      // Get a list of Templates belonging to this Application
      //
      $scope.GetTemplateList();

      //
      // If we're viewing a single Template, get more information about it
      //
      if ($routeParams.templateId) {
        $scope.GetTemplate();
      }

      //
      // If we're viewing a single Statistic, get more information about it
      //
      if ($routeParams.statisticId) {
        $scope.GetStatistic();
      }

    };

  //
  // CONTENT MUTATIONS
  //

    $scope.GetApplication = function() {
      //
      // Get the single application that the user wants to view
      //
      Application.get({
          id: $routeParams.applicationId
        }).$promise.then(function(response) {

          $scope.application = response.response;
          $scope.loading = false;

          $scope.GetApplicationPage();
        }, function(error) {
          $rootScope.alerts.push({
            'type': 'error',
            'title': 'Uh-oh!',
            'details': 'Mind reloading the page? It looks like we couldn\'t get that Application for you.'
          });
        });
    };

    //
    // Save a new Application to the API Database
    //
    $scope.UpdateApplication = function () {

      if ($scope.application.id) {
        $scope.EditApplication = false;
        Application.update({
          id: $scope.application.id
        }, $scope.application).$promise.then(function(response) {
          $rootScope.alerts.push({
            'type': 'success',
            'title': 'Awesome!',
            'details': 'We saved your Application updates for you.'
          });
        }, function(error) {
          $rootScope.alerts.push({
            'type': 'error',
            'title': 'Uh-oh!',
            'details': 'Mind trying that again? It looks like we couldn\'t save those Application updates for you.'
          });
        });
      }

    };

    //
    // Delete an existing Application from the API Database
    //
    $scope.DeleteApplication = function (application) {

      //
      // Construct an object containing only the Application ID so that we
      // aren't sending along Application parameters in the URL
      //
      var application_ = {
        id: application.id
      };

      //
      // Send the 'DELETE' method to the API so it's removed from the database
      //
      Application.delete({
        id: application_.id
      }, application_).$promise.then(function(response) {
        $rootScope.alerts.push({
          'type': 'success',
          'title': 'Deleted!',
          'details': 'Your Application was deleted successfully!'
        });

        $location.path('/applications');
      }, function(error) {
        $rootScope.alerts.push({
          'type': 'error',
          'title': 'Uh-oh!',
          'details': 'Mind trying that again? It looks like we couldn\'t delete that Application for you.'
        });
      });

    };

    //
    // Create a new Template that does not yet exist in the API database
    //
    $scope.CreateTemplate = function() {
      $scope.newTemplate.$save({
        applicationId: $scope.application.id
      }).then(function(response) {
        $scope.AddTemplate = false;
        $scope.templates.push(response.response);
        $rootScope.alerts.push({
          'type': 'success',
          'title': 'Great!',
          'details': 'We built that Template for you, now add some Fields to it.'
        });
      }, function(error) {
        $rootScope.alerts.push({
          'type': 'error',
          'title': 'Uh-oh!',
          'details': 'Mind trying that again? It looks like we couldn\'t save that Template for you.'
        });
      });
    };

    //
    // Update the attributes of an existing Template
    //
    $scope.UpdateTemplate = function() {
      Template.update({
        id: $scope.template.id
      }, $scope.template).$promise.then(function(response) {
        $rootScope.alerts.push({
          'type': 'success',
          'title': 'Updated',
          'details': 'Your template updates were saved successfully!'
        });
      }, function(error) {
        $rootScope.alerts.push({
          'type': 'error',
          'title': 'Uh-oh!',
          'details': 'Mind trying that again? It looks like we couldn\'t update that Template for you.'
        });
      });

    };

    //
    // Delete an existing Template from the API Database
    //
    $scope.DeleteTemplate = function (template) {

      //
      // Construct an object containing only the Application ID so that we
      // aren't sending along Application parameters in the URL
      //
      var template_ = {
        id: template.id
      };

      //
      // Send the 'DELETE' method to the API so it's removed from the database
      //
      Template.delete({
        id: template_.id
      }, template_).$promise.then(function(response) {
        $rootScope.alerts.push({
          'type': 'success',
          'title': 'Updated',
          'details': 'Your template was deleted!'
        });

        $location.path('/applications/' + $scope.application.id + '/templates');
      }, function(error) {
        $rootScope.alerts.push({
          'type': 'error',
          'title': 'Uh-oh!',
          'details': 'Mind trying that again? It looks like we couldn\'t delete that Template for you.'
        });
      });
    };

    //
    // Create a new Field that does not yet exist in the API database
    //
    $scope.CreateField = function () {


      console.log('$scope.newField', $scope.newField);

      $scope.newField.$save({
        templateId: $scope.template.id
      }).then(function(response) {
        $scope.fields.push(response.response);
        $rootScope.alerts.push({
          'type': 'success',
          'title': 'Great!',
          'details': 'Your new Field was added to the Template.'
        });
      }, function(error) {
        $rootScope.alerts.push({
          'type': 'error',
          'title': 'Uh-oh!',
          'details': 'Mind trying that again? It looks like we couldn\'t create that Field for you.'
        });
      });
    };

    $scope.ActionEditField = function (field_) {
      $scope.editField = field_;
      $scope.FieldEdit = true;
      $scope.FieldAdd = false;
    };

    //
    // Update the attributes of an existing Template
    //
    $scope.UpdateField = function () {
      Field.update({
        templateId: $scope.template.id,
        fieldId: $scope.editField.id
      }, $scope.editField).$promise.then(function(response) {
        $rootScope.alerts.push({
          'type': 'success',
          'title': 'Updated!',
          'details': 'Your Field updates were saved successfully!'
        });
      }, function(error) {
        $rootScope.alerts.push({
          'type': 'error',
          'title': 'Uh-oh!',
          'details': 'Mind trying that again? It looks like we couldn\'t update that Field for you.'
        });
      });

      $scope.editField = {};
      $scope.FieldEdit = false;
      $scope.FieldAdd = true;
    };

    //
    // Delete an existing Field from the API Database
    //
    $scope.DeleteField = function (field) {

      //
      // Send the 'DELETE' method to the API so it's removed from the database
      //
      Field.delete({
        templateId: $scope.template.id,
        fieldId: field.id
      }, field).$promise.then(function(response) {
        $rootScope.alerts.push({
          'type': 'success',
          'title': '',
          'details': 'Your Field was deleted!'
        });
        $scope.fields.pop(field);
        $scope.editField = {};
        $scope.FieldEdit = false;

        if ($scope.fields.length) {
          $scope.FieldAdd = true;
        }
      }, function(error) {
        $rootScope.alerts.push({
          'type': 'error',
          'title': 'Uh-oh!',
          'details': 'Mind trying that again? It looks like we couldn\'t delete that Field for you.'
        });
      });

    };



    $scope.CreateFeature = function () {

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

      $scope.feature.$save({
        storage: $scope.template.storage
      }).then(function(response) {
        $rootScope.alerts.push({
          'type': 'success',
          'title': 'Yes!',
          'details': 'Your new Features created.'
        });

        $location.path('/applications/' + $scope.application.id + '/templates/' + $scope.template.id + '/features');
      }, function(error) {
        $rootScope.alerts.push({
          'type': 'error',
          'title': 'Uh-oh!',
          'details': 'Mind trying that again? It looks like we couldn\'t create that Feature for you.'
        });
      });
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
    $scope.DeleteFeature = function (feature) {

      console.log('$scope.template', $scope.template);

      //
      // Construct an object containing only the Application ID so that we
      // aren't sending along Application parameters in the URL
      //
      var field_ = {
        storage: $scope.template.storage,
        featureId: feature.id
      };

      //
      // Send the 'DELETE' method to the API so it's removed from the database
      //
      Feature.delete(field_);

      $scope.features.pop(feature);

      $location.path('/applications/' + $scope.application.id + '/templates/' + $scope.template.id + '/features');

      //
      // @todo
      //
      // We need to make sure that we aren't removing the Application from the
      // user interface, unless it's really been deleted from the database. I
      // don't believe the API is returning the appropriate response, and
      // therefore we have no way to catch it
      //
    };

    $scope.GetStatistic = function() {
      Statistic.get({
        templateId: $routeParams.templateId,
        statisticId: $routeParams.statisticId
      }).$promise.then(function (response) {
        $scope.statistic = response;
      });
    };

    $scope.CreateStatistic = function (statistic) {
      $scope.newStatistic.$save({
        templateId: $routeParams.templateId
      }).then(function (response) {
        $location.path('/applications/' + $scope.application.id + '/templates/' + $scope.template.id + '/statistics');
      });
    };

    $scope.UpdateStatistic = function (statistic) {
      Statistic.update({
        templateId: $scope.template.id,
        statisticId: statistic.id
      }, statistic);

      //
      // Once the template has been updated successfully we should give the
      // user some on-screen feedback and then remove it from the screen after
      // a few seconds as not to confuse them or force them to reload the page
      // to dismiss the message
      //
      var alert = {
        'type': 'success',
        'title': 'Updated',
        'details': 'We saved the updates you made to your statistic!'
      };

      $rootScope.alerts.push(alert);

      $timeout(function () {
        $rootScope.alerts = [];
      }, 3000);
    };

    $scope.DeleteStatistic = function (statistic) {

      var statistic_ = {
        templateId: $scope.template.id,
        statisticId: statistic.id
      };

      //
      // Send the 'DELETE' method to the API so it's removed from the database
      //
      Statistic.delete(statistic_);

      //
      // Update the Statistics list so that it no longer displays the deleted
      // items
      //
      $scope.statistics.pop(statistic);
      $location.path('/applications/' + $scope.application.id + '/templates/' + $scope.template.id + '/statistics');
    };

    $scope.getEditableMap = function () {

      leafletData.getMap().then(function(map) {

        // var featureGroup = new L.FeatureGroup();
        map.addLayer(featureGroup);

        //
        // Check to see if existing map layers exist for this API Feature
        //
        if ($scope.feature.geometry) {
          $scope.feature.geometry = $scope.convertGeometryCollectionToFeatureCollection($scope.feature.geometry);
          $scope.geojsonToLayer($scope.feature.geometry, featureGroup);

          map.fitBounds(featureGroup.getBounds());
        }

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
        // Load and Prepare the Mapbox Basemap Tiles
        //
        // var MapboxBasemap = L.tileLayer('https://{s}.tiles.mapbox.com/v3/developedsimple.hl46o07c/{z}/{x}/{y}.png', {
        //   attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>'
        // });

        // map.addLayer(MapboxBasemap);


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
              if ($routeParams.featureId) {
                var values_ = $scope.getDefaultEnumeratedValue(field_.relationship);
              }
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

    $scope.getDefaultEnumeratedValue = function (relationship) {
      $http({
        method: 'GET',
        url: '//api.commonscloud.org/v2/' + $scope.template.storage + '/' + $routeParams.featureId + '/' + relationship + '.json'
      }).success(function(data, status, headers, config) {

          var default_values = [];

          angular.forEach(data.response.features, function (feature, index) {
            default_values.push(feature.id);
          });

          $scope.feature[relationship] = default_values;

          return default_values;
        }).
        error(function(data, status, headers, config) {
          console.log('data', data, status);
        });
    };


    //
    // Update how Features are sorted based on Field/Header clicked and
    // react to a second click by inverting the order
    //
    $scope.ChangeOrder = function (value) {
      $scope.orderByField = value;
      $scope.reverseSort =! $scope.reverseSort;
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

    $scope.file_list = [];

    $scope.onFileRemove = function(file, index) {
      $scope.files.splice(index, 1);
    };

    $scope.onFileSelect = function(files) {

      angular.forEach(files, function(file, index) {
        // Check to see if we can load previews
        if (window.FileReader && file.type.indexOf('image') > -1) {

          var fileReader = new FileReader();
          fileReader.readAsDataURL(file);
          fileReader.onload = function (event) {
            file.preview = event.target.result;
            $scope.files.push(file);
            $scope.$apply();
          };
        } else {
          $scope.files.push(file);
          $scope.$apply();
        };
      });

      console.log('files', $scope.files);


      // $scope.dataUrls = [];
      // $scope.file_list = [];
      //$files: an array of files selected, each file has name, size, and type.
      // for (var i = 0; i < $files.length; i++) {
      //   var $file = $files[i];
      //   $scope.file_list.push($file);
      //   if (window.FileReader && $file.type.indexOf('image') > -1) {
      //     var fileReader = new FileReader();
      //     fileReader.readAsDataURL($files[i]);
      //     var loadFile = function(fileReader, index) {
      //       fileReader.onload = function(e) {
      //         $timeout(function() {
      //           $scope.dataUrls[index] = e.target.result;
      //         });
      //       }
      //     }(fileReader, i);
      //   }
      //   // $scope.progress[i] = -1;
      //   // if ($scope.uploadRightAway) {
      //   //   $scope.start(i);
      //   // }

      //   // $scope.upload = $upload.upload({
      //   //   url: 'server/upload/url', //upload.php script, node.js route, or servlet url
      //   //   // method: 'POST' or 'PUT',
      //   //   // headers: {'header-key': 'header-value'},
      //   //   // withCredentials: true,
      //   //   data: {myObj: $scope.myModelObj},
      //   //   file: file, // or list of files: $files for html5 only
      //   //   /* set the file formData name ('Content-Desposition'). Default is 'file' */
      //   //   //fileFormDataName: myFile, //or a list of names for multiple files (html5).
      //   //   /* customize how data is added to formData. See #40#issuecomment-28612000 for sample code */
      //   //   //formDataAppender: function(formData, key, val){}
      //   // }).progress(function(evt) {
      //   //   console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
      //   // }).success(function(data, status, headers, config) {
      //   //   // file is uploaded successfully
      //   //   console.log(data);
      //   // });
      //   //.error(...)
      //   //.then(success, error, progress); 
      //   //.xhr(function(xhr){xhr.upload.addEventListener(...)})// access and attach any event listener to XMLHttpRequest.
      // }



      console.log('$scope.files', $scope.files);
    };


      //
    // Now that we've got the everything prepared, let's go ahead and start
    // the controller by instantiating the GetApplication method
    //
    $scope.GetApplication();
  }]);
