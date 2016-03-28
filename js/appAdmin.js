(function () {
    'use strict';

    var app = angular.module('exerciseSystem', ['ui.router', 'ui.bootstrap', 'chieffancypants.loadingBar', 'ngAnimate']);

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
        $scope.open = function () {

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'ForeignKey.html',
                controller: 'ModalInstanceCtrl',
                size: 'small'
            });

            modalInstance.result.then(function (result) {
                $scope.selected = result;
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
