(function () {
    'use strict';

    var app = angular.module('exerciseSystem', ['ui.router', 'ui.bootstrap', 'chieffancypants.loadingBar']);

    app.controller('algCrtl', function($scope) {
        $scope.queryAlg = "";
        $scope.addOpAlg = function(op) {
            $scope.queryAlg = $scope.queryAlg+op;
        };
    });

    app.controller('sqlCtrl', function($scope, $http) {

        /* Retrieve all sql arguments */
        $http.get( "API/API.php?arguments" )
            .success(function (data, status, header, config) {
            $scope.arguments = data;
        })
            .error(function (data, status, header, config) {
            console.log("[ERROR] $http.get request failed!");
        });

        /* Retrieve all sql exercises per argument */
        $scope.exercises = [];
        $http.get( "API/API.php?exerciseSQL" )
            .success(function (data, status, header, config) {
            $scope.exercises = data;
        })
            .error(function (data, status, header, config) {
            console.log("[ERROR] $http.get request failed!");
        });

    });

    app.controller('sqlExCtrl', function($scope, $http, $stateParams) {
    });
}());
