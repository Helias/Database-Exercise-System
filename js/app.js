(function () {
    'use strict';

    var app = angular.module('exerciseSystem', ['ui.router', 'ui.bootstrap', 'chieffancypants.loadingBar']);

    app.controller('algCrtl', function($scope, $http) {

        /* Retrieve all algebra arguments */
        $http.get( "API/API.php?arguments" )
            .success(function (data, status, header, config) {
            $scope.arguments = data;
        })
            .error(function (data, status, header, config) {
            console.log("[ERROR] $http.get request failed!");
        });

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

    });

    app.controller('sqlExCtrl', function($scope, $http, $stateParams) {

        /* pagination settings */
        $scope.filteredEx = [];
        $scope.currentPage = 1;
        $scope.numPerPage = 1;
        $scope.maxSize = 12;
        $scope.itemsPerPage = 1;

        $http.get( "API/API.php?exerciseSQL=" + $stateParams.id )
            .success(function (data, status, header, config) {
            $scope.exercises = data;

            $scope.exs = [];
            for (var i = 0; i < $scope.exercises.length; i++) {
                $scope.exs.push({ text: $scope.exercises[i].testo, done:false, id: i+1});
            }

            $scope.$watch('currentPage + numPerPage', function() {
                var begin = (($scope.currentPage - 1) * $scope.numPerPage)
                var end = begin + $scope.numPerPage;

                $scope.filteredEx = $scope.exs.slice(begin, end);
            });
        })
            .error(function (data, status, header, config) {
            console.log("[ERROR] $http.get request failed!");
        });

    });

}());
