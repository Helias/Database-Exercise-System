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

    app.controller('dbManager', function($scope, $http, $uibModal, $log) {

        $scope.nTables = 1;

        $scope.table = {
            name: "",
            rows: 1,
            columns: 1,
            attr: new Array(),
            matrix: new Array(),

            inizializeMatrix: function () {
                for (var i = 0; i < 5; i++) {
                    this.matrix[i] = new Array();
                }
            }

        };

        $scope.tables = new Array();

        $scope.inizializeTables = function() {
            for (var i = 0; i < 5; i++) {
                $scope.tables[i] = angular.copy($scope.table);
                $scope.tables[i].inizializeMatrix();
            }
        };

        $scope.inizializeTables();

        $scope.getNumber = function(num) {
            return new Array(num);   
        };

        $scope.logTable = function() {
            for (var i = 0; i<$scope.nTables; i++) {
                console.log("Tabella n: "+i);
                console.log("Nome: "+$scope.tables[i].name);
                console.log("Righe: "+$scope.tables[i].rows);
                console.log("Colonne: "+$scope.tables[i].columns);
                for (var j=0; j<$scope.tables[i].columns; j++) {
                    console.log("Attr n: "+j+ " = "+$scope.tables[i].attr[j]);
                }
                for (var b=0; b<$scope.tables[i].rows; b++){
                    for (var a=0; a<$scope.tables[i].columns; a++) {
                        console.log("Riga n: "+b+" Attr n: "+a+ " = "+$scope.tables[i].matrix[b][a]);
                    }               
                } 
            }
        };


        /* Modals */
        $scope.open = function (size) {

            var modalInstance = $uibModal.open({
                animation: true,
                template: '<br><br>Vuoi rendere questo campo chaive esterna? <br> (Foreign Key)?<br><br> <button class="btn-danger">Cancel</button> <button class="btn-warning">OK</button>',
                controller: 'ModalInstanceCtrl',
                size: size
            });

            modalInstance.result.then(function (result) {
                $log(selectedItem);
                $scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

    });

    app.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance) {

        $scope.ok = function () {
            $uibModalInstance.close("OK"); //result
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });


}());
