(function () {
    'use strict';

    var app = angular.module('exerciseSystem', ['ui.router', 'ui.bootstrap', 'chieffancypants.loadingBar']);

    app.controller('adminPanel', function($scope, $http) {

        $scope.radio_question = 'domandeSQL';
        $scope.question = '';

        $scope.getArguments = function() {
            $http.get("API/APIadmin.php?arguments")
            .success(function (data, status, header, config) {
                if (data.length > 0) {
                    $scope.arguments = data;
                    $scope.selected_argument =  $scope.arguments[0].id;
                    $scope.radio_typeArgument = 'ex_argument';
                    $scope.getSolutions($scope.radio_question);
                }else{
                    $scope.radio_typeArgument = 'new_argument';
                    $scope.disable_selectArgument = true;
                    $scope.radio_typeSolution = 'new_solution';
                    $scope.disable_selectSolution = true;
                } 
            })
                .error(function (data, status, header, config) {
                console.log("[ERROR] $http.get request failed!");
            });   
        };

        $scope.getSolutions = function(typeQuestion) {
            $http.get("API/APIadmin.php?solutions&argument="+$scope.selected_argument+"&question="+typeQuestion)
            .success(function (data, status, header, config) {
                if (data.length > 0) {
                    $scope.solutions = data;
                    $scope.selected_solution = $scope.solutions[0].id;
                    $scope.radio_typeSolution = 'ex_solution';
                    $scope.disable_selectSolution = false;
                }else{
                    $scope.radio_typeSolution = 'new_solution';
                    $scope.disable_selectSolution = true;
                }
            })
                .error(function (data, status, header, config) {
                console.log("[ERROR] $http.get request failed!");
            });
        };

        $scope.submitNewQuestion = function(){

            if($scope.question)

            if (radio_typeArgumentt == 'new_argument' && radio_typeSolution == 'new_solution') {
                $http.get("API/APIadmin.php?type="+$scope.radio_question+"&text="+$scope.question+"&new_argument="+$scope.argument+"&new_solution="+$scope.solution+"db=eh" )
                .success(function (data, status, header, config) {
                })
                    .error(function (data, status, header, config) {
                    console.log("[ERROR] $http.get request failed!");
                });  
            }

            if (radio_typeArgumentt == 'ex_argument' && radio_typeSolution == 'ex_solution') {
                $http.get("API/APIadmin.php?type="+$scope.radio_question+"&text="+$scope.question+"&ex_argument="+$scope.selected_argument+"&ex_solution="+$scope.selected_solution+"db=eh" )
                .success(function (data, status, header, config) {
                })
                    .error(function (data, status, header, config) {
                    console.log("[ERROR] $http.get request failed!");
                });
            }

            if (radio_typeArgumentt == 'ex_argument' && radio_typeSolution == 'new_solution') {
                $http.get("API/APIadmin.php?type="+$scope.radio_question+"&text="+$scope.question+"&ex_argument="+$scope.selected_argument+"&new_solution="+$scope.solution+"db=eh" )
                .success(function (data, status, header, config) {
                })
                    .error(function (data, status, header, config) {
                    console.log("[ERROR] $http.get request failed!");
                });
            }
        }

        $scope.getArguments();

    });

}());
