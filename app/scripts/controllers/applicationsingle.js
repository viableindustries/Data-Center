'use strict';

angular.module('commonsCloudAdminApp')
  .controller('ApplicationSingleCtrl', ['$rootScope', '$scope', '$routeParams', '$location', '$timeout', 'Application', 'Template', 'Feature', 'Field', 'Statistic', 'leafletData', function ($rootScope, $scope, $routeParams, $location, $timeout, Application, Template, Feature, Field, Statistic, leafletData) {

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

    //
    // Placeholders for non-existent content
    //
    $scope.newTemplate = new Template();
    $scope.newField = new Field();
    $scope.newStatistic = new Statistic();
    $scope.feature = new Feature();
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
    $scope.loading = true;
    $scope.alerts = [];
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
    // Get the single application that the user wants to view
    //
    Application.get({
        id: $routeParams.applicationId
      }).$promise.then(function(response) {
        $scope.application = response.response;
        $scope.loading = false;
      });

    //
    // Get a list of templates associated with the current application
    //
    Template.query({
        applicationId: $routeParams.applicationId
      }).$promise.then(function(response) {
        $scope.templates = response;

        angular.forEach($scope.templates, function (template, index) {

          $scope.templates[index].features = [];

          //
          // Get a list of all features
          //
          Feature.query({
              storage: template.storage
            }).$promise.then(function (response) {
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
            }).$promise.then(function (response) {
              $scope.templates[index].moderation = response;
              if ($scope.templates[index].moderation.properties.total_features > 0) {
                $scope.templates[index].moderation = true;
              }
            });

        });

      });

    //
    // When the URL contains a Template ID that means we need to load the
    // template and all of it's associated realtionships, such as Fields
    // and Features
    //
    if ($routeParams.templateId) {
      Template.get({
          id: $routeParams.templateId
        }).$promise.then(function(response) {
          $scope.template = response.response;
          $scope.loading = false;

          Feature.query({
            storage: $scope.template.storage
          }).$promise.then(function (response) {
            $scope.features = response.response.features;
          });

          Field.query({
            templateId: $scope.template.id
          }).$promise.then(function (response) {
            $scope.fields = response;
            $scope.getEnumeratedValues($scope.fields);

            if ($routeParams.featureId) {
              Feature.get({
                storage: $scope.template.storage,
                featureId: $routeParams.featureId
              }).$promise.then(function (response) {
                $scope.feature = response;
              });
            }
            $scope.getEditableMap();
          });

          Statistic.query({
            templateId: $scope.template.id
          }).$promise.then(function (response) {
            $scope.statistics = response;
          });
        });
    }

    if ($routeParams.statisticId) {
      Statistic.get({
        templateId: $routeParams.templateId,
        statisticId: $routeParams.statisticId
      }).$promise.then(function (response) {
        $scope.statistic = response;
      });
    }


  //
  // CONTENT MUTATIONS
  //

    //
    // Save a new Application to the API Database
    //
    $scope.UpdateApplication = function () {

      if ($scope.application.id) {
        $scope.EditApplication = false;
        Application.update({
          id: $scope.application.id
        }, $scope.application);
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
      Application.delete(application_);

      $location.path('/applications');

      //
      // @todo
      //
      // We need to make sure that we aren't removing the Application from the
      // user interface, unless it's really been deleted from the database. I
      // don't believe the API is returning the appropriate response, and
      // therefore we have no way to catch it
      //
    };

    //
    // Create a new Template that does not yet exist in the API database
    //
    $scope.CreateTemplate = function () {
      $scope.newTemplate.$save({
        applicationId: $scope.application.id
      }).then(function (response) {
        $scope.templates.push(response.response);
      });
    };

    //
    // Update the attributes of an existing Template
    //
    $scope.UpdateTemplate = function () {
      Template.update({
        id: $scope.template.id
      }, $scope.template);

      //
      // Once the template has been updated successfully we should give the
      // user some on-screen feedback and then remove it from the screen after
      // a few seconds as not to confuse them or force them to reload the page
      // to dismiss the message
      //
      var alert = {
        'type': 'success',
        'title': 'Updated',
        'details': 'Your template updates were saved successfully!'
      };

      $scope.alerts.push(alert);

      $timeout(function () {
        $scope.alerts = [];
      }, 3000);

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
      Template.delete(template_);

      $location.path('/applications/' + $scope.application.id + '/templates');

      //
      // @todo
      //
      // We need to make sure that we aren't removing the Application from the
      // user interface, unless it's really been deleted from the database. I
      // don't believe the API is returning the appropriate response, and
      // therefore we have no way to catch it
      //
    };

    //
    // Create a new Field that does not yet exist in the API database
    //
    $scope.CreateField = function () {
      $scope.newField.$save({
        templateId: $scope.template.id
      }).then(function (response) {
        $scope.fields.push(response.response);
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
      }, $scope.editField);

      //
      // Once the template has been updated successfully we should give the
      // user some on-screen feedback and then remove it from the screen after
      // a few seconds as not to confuse them or force them to reload the page
      // to dismiss the message
      //
      var alert = {
        'type': 'success',
        'title': 'Updated',
        'details': 'Your field updates were saved successfully!'
      };

      $scope.alerts.push(alert);

      $timeout(function () {
        $scope.alerts = [];
      }, 3000);

      $scope.editField = {};
      $scope.FieldEdit = false;
      $scope.FieldAdd = true;
    };

    //
    // Delete an existing Field from the API Database
    //
    $scope.DeleteField = function (field) {

      //
      // Construct an object containing only the Application ID so that we
      // aren't sending along Application parameters in the URL
      //
      var field_ = {
        templateId: $scope.template.id,
        fieldId: field.id
      };

      //
      // Send the 'DELETE' method to the API so it's removed from the database
      //
      Field.delete(field_);

      $scope.fields.pop(field);
      $scope.editField = {};
      $scope.FieldEdit = false;

      if ($scope.fields.length) {
        $scope.FieldAdd = true;
      }

      // $location.path('/applications/' + $scope.application.id + '/templates/' + $scope.template.id + '/fields');

      //
      // @todo
      //
      // We need to make sure that we aren't removing the Application from the
      // user interface, unless it's really been deleted from the database. I
      // don't believe the API is returning the appropriate response, and
      // therefore we have no way to catch it
      //
    };

    $scope.CreateFeature = function () {

      if ($scope.feature.geometry) {
        $scope.feature.geometry = $scope.convertFeatureCollectionToGeometryCollection($scope.feature.geometry);
      }

      $scope.feature.$save({
        storage: $scope.template.storage
      }).then(function (response) {
        leafletData.unresolveMap();
        $location.path('/applications/' + $scope.application.id + '/templates/' + $scope.template.id + '/features');
      });
    };

    //
    // Update the attributes of an existing Template
    //
    $scope.UpdateFeature = function () {
      Feature.update({
        storage: $scope.template.storage,
        featureId: $scope.feature.id
      }, $scope.feature);

      //
      // Once the template has been updated successfully we should give the
      // user some on-screen feedback and then remove it from the screen after
      // a few seconds as not to confuse them or force them to reload the page
      // to dismiss the message
      //
      var alert = {
        'type': 'success',
        'title': 'Updated',
        'details': 'Your feature updates were saved successfully!'
      };

      $scope.alerts.push(alert);

      $timeout(function () {
        $scope.alerts = [];
      }, 3000);

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

      $scope.alerts.push(alert);

      $timeout(function () {
        $scope.alerts = [];
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

      // leafletData.getMap().then(function(map) {

      //   //
      //   // Prepare a drawing layer for our FeatureGroup
      //   //
      //   var featureGroup = L.featureGroup();
      //   map.addLayer(featureGroup);

      //   //
      //   //
      //   // Enable Drawing Controls
      //   var drawControl = new L.Control.Draw({

      //     edit: {
      //       featureGroup: featureGroup,
      //       remove: true
      //     }
      //   });

      //   map.addControl(drawControl);

      //   //
      //   // Check to see if existing map layers exist for this API Feature
      //   //
      //   if ($scope.feature.geometry) {
      //     $scope.geojsonToLayer($scope.feature.geometry, featureGroup);
      //     $scope.feature.geometry = JSON.stringify(featureGroup.toGeoJSON());
      //   }

      //   //
      //   // On Drawing Complete add it to our FeatureGroup
      //   //
      //   map.on('draw:created', function (e) {
      //     var newLayer = e.layer;
      //     featureGroup.addLayer(newLayer);

      //     $scope.feature.geometry = JSON.stringify(featureGroup.toGeoJSON());
      //   });

      //   map.on('draw:edited', function (e) {
      //     var editedLayers = e.layers;
      //     editedLayers.eachLayer(function (layer) {
      //       featureGroup.addLayer(layer);
      //     });

      //     $scope.feature.geometry = JSON.stringify(featureGroup.toGeoJSON());
      //   });

      //   map.on('draw:deleted', function (e) {
      //     var deletedLayers = e.layers;
      //     deletedLayers.eachLayer(function (layer) {
      //       featureGroup.removeLayer(layer);
      //     });

      //     $scope.feature.geometry = JSON.stringify(featureGroup.toGeoJSON());
      //   });

      //   //
      //   // Load and Prepare the Mapbox Basemap Tiles
      //   //
      //   var MapboxBasemap = L.tileLayer('https://{s}.tiles.mapbox.com/v3/developedsimple.hl46o07c/{z}/{x}/{y}.png', {
      //     attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>'
      //   });

      //   map.addLayer(MapboxBasemap);


      //   //
      //   // We need to invalidate the size of the Mapbox container so that it
      //   // displays properly. This is annoying and ugly ... timeouts are evil.
      //   // However, it serves as a temporary solution until we can figure out
      //   // something better.
      //   //
      //   $timeout(function () {
      //     map.invalidateSize();
      //   }, 500);
        
      //   //
      //   // Listen for changes to the GeoJSON Editor
      //   //
      //   // $scope.$watch('feature.geometry', function(){
      //   //   if ($scope.feature.geometry) {
      //   //     $scope.geojsonToLayer($scope.feature.geometry, featureGroup);
      //   //     $scope.feature.geometry = JSON.stringify(featureGroup.toGeoJSON());
      //   //   }
      //   // });
      // });

      // $scope.MapLoaded = true;
    };


    // $scope.geojsonToLayer = function (geojson, layer) {
    //   layer.clearLayers();
    //   function add(l) {
    //     l.addTo(layer);
    //   }
    //   L.geoJson(geojson).eachLayer(add);
    // };

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
            });
        }
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

  }]);
