(function () {
    'use strict';

    var app = angular.module('exerciseSystem', ['ui.router', 'ui.bootstrap', 'chieffancypants.loadingBar', 'ngAnimate']);

    app.controller('argumentsCrtl', function($scope, $http, $stateParams) {

        /* Retrieve all algebra arguments */
        $http.get( "API/API.php?arguments" )
            .success(function (data, status, header, config) {
            $scope.arguments = data;
        })
            .error(function (data, status, header, config) {
            console.log("[ERROR] $http.get request failed!");
        });

        $scope.type = $stateParams.arg;
    });

    app.controller('algExCtrl', function($scope, $http, $stateParams) {

        $http.get( "API/API.php?exerciseALG=" + $stateParams.id )
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

                $scope.db = $scope.exercises[$scope.currentPage-1].db_connesso;
                $http.get( "API/API.php?db_tables=" + $scope.exercises[$scope.currentPage-1].db_connesso)
                    .success(function (data, status, header, config) {

                    $scope.tables = data;

                })
                    .error(function (data, status, header, config) {
                    console.log("[ERROR] $http.get request failed!");
                });
            });
        })
            .error(function (data, status, header, config) {
            console.log("[ERROR] $http.get request failed!");
        });

        $scope.queryAlg = "";
        $scope.addOpAlg = function(op) {
            $scope.queryAlg = $scope.queryAlg+op;
        };

    });

    app.controller('ExerciseCtrl', function($scope, $http, $stateParams) {

        /* pagination settings */
        $scope.filteredEx = [];
        $scope.currentPage = 1;
        $scope.numPerPage = 1;
        $scope.maxSize = 12;
        $scope.itemsPerPage = 1;
        
        if ($stateParams.arg == "sql")
            $scope.type = "SQL";
        else if ($stateParams.arg == "algebra")
            $scope.type = "ALG";

        $http.get( "API/API.php?exercise" + $scope.type + "=" + $stateParams.id )
            .success(function (data, status, header, config) {
            $scope.exercises = data;

            $scope.exs = [];
            for (var i = 0; i < $scope.exercises.length; i++) {
                $scope.exs.push({ text: $scope.exercises[i].testo, done:false, id: i+1, db_connesso: $scope.exercises[i].db_connesso});
            }

            $scope.$watch('currentPage + numPerPage', function() {
                var begin = (($scope.currentPage - 1) * $scope.numPerPage)
                var end = begin + $scope.numPerPage;

                $scope.filteredEx = $scope.exs.slice(begin, end);

                if ($scope.exercises.length != 0) {

                    $scope.db = $scope.exercises[$scope.currentPage-1].db_connesso;
                    $http.get( "API/API.php?db_tables=" + $scope.exercises[$scope.currentPage-1].db_connesso)
                        .success(function (data, status, header, config) {

                        $scope.tables = data;

                    })
                        .error(function (data, status, header, config) {
                        console.log("[ERROR] $http.get request failed!");
                    });
                }

            });
        })
            .error(function (data, status, header, config) {
            console.log("[ERROR] $http.get request failed!");
        });

        $scope.query = "";
        $scope.addOp = function(op) {
            $scope.query = $scope.query+op;
            console.log("asd");
        };

    });

    /* Admin panel */

    app.controller('dbManager', function($scope, $http, $uibModal, $state) {

        $scope.nTables = 0;

        $scope.table = {
            name: "",
            rows: 1,
            columns: 1,
            attr: new Array(),
            matrix: new Array(),

            fk_matrix: new Array(),
            fk_attr: new Array(),

            inizializeMatrix: function () {
                for (var i = 0; i < 5; i++) { //Anzichè 5, mettere rows?
                    this.matrix[i] = new Array();
                }
            }
        };

        $scope.tables = new Array();

        for (var i = 0; i < 5; i++) {
            $scope.tables[i] = angular.copy($scope.table);
            $scope.tables[i].inizializeMatrix();
        }

        $scope.getNumber = function(num) {
            return new Array(num);
        };

        $scope.logTable = function() {
            for (var i = 0; i < $scope.nTables; i++) {
                console.log("Tabella n: " + i);
                console.log("Nome: " + $scope.tables[i].name);
                console.log("Righe: " + $scope.tables[i].rows);
                console.log("Colonne: " + $scope.tables[i].columns);
                for (var j = 0; j < $scope.tables[i].columns; j++) {
                    console.log("Attr n: " + j + " = " + $scope.tables[i].attr[j]);
                }
                for (var b = 0; b < $scope.tables[i].rows; b++){
                    for (var a = 0; a < $scope.tables[i].columns; a++) {
                        console.log("Riga n: " + b + " Attr n: " + a + " = " + $scope.tables[i].matrix[b][a]);
                        console.log("Fk: "+$scope.tables[i].fk_matrix[b][a]);
                    }
                }
            }
        };

        $scope.sameTableName = function(){
            for (var i = 0; i < $scope.nTables-1; i++) {
                for (var j = i+1; j < $scope.nTables; j++) {
                    if ( $scope.tables[i].name == $scope.tables[j].name )
                        return true;
                }
            }
            return false;
        };

        $scope.sameAttrName = function(){
            for (var k = 0; k < $scope.nTables; k++) {
                for (var i = 0; i < $scope.tables[k].columns; i++) {
                    for (var j = i+1; j < $scope.tables[k].columns; j++) {
                        if ( $scope.tables[k].attr[i] == $scope.tables[k].attr[j] )
                            return true;
                    }
                }
            }
            return false;
        };

        $scope.writeQueryCreate = function(){
            $scope.queryResult = new Array();
            for (var i = 0; i < $scope.nTables; i++) {
                $scope.queryResult[i] = "CREATE TABLE IF NOT EXISTS des." + $scope.nameDatabase + "_" + $scope.tables[i].name + " ( ";
                for (var j = 0; j < $scope.tables[i].columns; j++) {
                    $scope.queryResult[i] += $scope.tables[i].attr[j] + " varchar(255) NOT NULL ";
                    if ( j < $scope.tables[i].columns-1 )
                        $scope.queryResult[i] += ", ";
                }
                $scope.queryResult[i] += " ); ";
            }
            return $scope.queryResult;
        };

        $scope.writeQueryInsert = function(){
            $scope.queryResult = new Array();
            for (var i = 0; i < $scope.nTables; i++) {
                $scope.queryResult[i] = "INSERT INTO des." + $scope.nameDatabase + "_" + $scope.tables[i].name + " ( ";
                for (var j = 0; j < $scope.tables[i].columns; j++) {
                    $scope.queryResult[i] += $scope.tables[i].attr[j] ;
                    if ( j < $scope.tables[i].columns-1)
                        $scope.queryResult[i] += ", ";
                }
                $scope.queryResult[i] = $scope.queryResult[i] + " ) VALUES ";

                for (var b = 0; b < $scope.tables[i].rows; b++){
                    $scope.queryResult[i] += " ( ";
                    for (var a = 0; a < $scope.tables[i].columns; a++) {
                        $scope.queryResult[i] += " '" + $scope.tables[i].matrix[b][a] + "' ";
                        if ( a < $scope.tables[i].columns-1)
                            $scope.queryResult[i] += ", ";
                    }
                    if ( b < $scope.tables[i].rows-1)
                        $scope.queryResult[i] += " ), ";
                }
                $scope.queryResult[i] += " ); ";
            }
            return $scope.queryResult;
        };

        $scope.writeQueryFK = function(){
            $scope.queryResult = new Array();
            for (var i=0; i<$scope.nTables; i++) {
                for (var j=0; j<$scope.tables[i].columns; j++){
                    if ( $scope.tables[i].fk_attr[j] ){
                        $scope.queryResult[i] = "ALTER TABLE des." + $scope.nameDatabase + "_" + $scope.tables[$scope.tables[i].fk_matrix[j][0]].name +
                                                " ADD PRIMARY KEY ( " + $scope.tables[$scope.tables[i].fk_matrix[j][0]].attr[$scope.tables[i].fk_matrix[j][1]] + " );";

                        $scope.queryResult[i] += " ALTER TABLE des." + $scope.nameDatabase + "_" + $scope.tables[i].name + 
                                                " ADD FOREIGN KEY ( " + $scope.tables[i].attr[j] + " )" +
                                                " REFERENCES des." + $scope.nameDatabase + "_" + $scope.tables[$scope.tables[i].fk_matrix[j][0]].name + 
                                                "( "+ $scope.tables[$scope.tables[i].fk_matrix[j][0]].attr[$scope.tables[i].fk_matrix[j][1]] +" );";
                    }
                }
            }
            return $scope.queryResult;
        };

        $scope.buildQuery = function(){

            $scope.queryCreate = new Array();
            $scope.queryInsert = new Array();
            $scope.queryFK = new Array();

            $scope.queryCreate = $scope.writeQueryCreate();
            for( var i=0; i<$scope.nTables; i++ )
                console.log($scope.queryCreate[i]);

            $scope.queryFK = $scope.writeQueryFK();
            for( var i=0; i<$scope.queryFK.length; i++ )
                console.log($scope.queryFK[i]);

            $scope.queryInsert = $scope.writeQueryInsert();
            for( var i=0; i<$scope.nTables; i++ )
                console.log($scope.queryInsert[i]);

            //Order insert
            console.log("orderList");

            var orderList = new Array();
            var k = 0;

            for (var i=0; i<$scope.nTables; i++) {
                for (var j=0; j<$scope.tables[i].columns; j++){
                    if ( $scope.tables[i].fk_attr[j] ){
                        orderList[k] = i;
                        k++;      
                    }
                }
            }

            console.log("Chiave esterna presente in tab: ");
            for (var j=0; j<k; j++){
                console.log(orderList[j]);
            }

        };

         /* Modals */
        $scope.openModalSetupT = function (indexTable) {

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'setupTable.html',
                controller: 'ctrlSetupTmodal',
                size: 'small',
                resolve: {
                    tables: function() { return $scope.tables },
                    nTables: function() { return $scope.nTables },
                    _indexTable: function() { return indexTable }
                }
            });

            modalInstance.result.then(function (result) {
                $scope.selected = result;
            });
        };

        /* Modals */
        $scope.openModalFK = function (indexTable, row, col) {

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'ForeignKey.html',
                controller: 'ctrlFKmodal',
                size: 'small',
                resolve: {
                    tables: function() { return $scope.tables },
                    nTables: function() { return $scope.nTables },
                    _indexTable: function() { return indexTable },
                    _row: function() { return row},
                    _col: function() { return col}
                }
            });

            modalInstance.result.then(function (result) {
                $scope.selected = result;
            });
        };

        $scope.checkLogin = function() {
            $http.get("API/APIadmin.php?checklogin")
                .success(function (data, status, header, config) {

                $scope.res = data.Error;
                if ($scope.res != "" && $scope.res != null)
                    $state.go('auth', {ref: 1});
            })
                .error(function (data, status, header, config) {
                console.log("[ERROR] $http.get request failed!");
            });
        };

        $scope.checkLogin();

        $scope.alerts = [];

        $scope.addAlert = function(type, msg) {
            $scope.alerts.push({type: type, msg: msg});
        };

        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };

        $scope.checkErrQuestion = function(error) {
            $scope.res = error;
            console.log($scope.res);
            if ($scope.res != "" && $scope.res != null)
                $scope.addAlert('danger', $scope.res);
            else
                $scope.addAlert('success', 'Domanda aggiunta!');
        };

    });

    app.controller('ctrlFKmodal', function ($scope, $uibModalInstance, tables, nTables, _indexTable, _row, _col) {

        $scope.indexTable = _indexTable;
        $scope.col = _col;

        $scope.modalTables = tables;
        $scope.numTables = new Array(nTables);

        if ($scope.modalTables[_indexTable].fk_matrix[_col] != null){
            $scope.selected_table = $scope.modalTables[_indexTable].fk_matrix[_col][0];
            $scope.selected_attr = $scope.modalTables[_indexTable].fk_matrix[_col][1];
        }

        $scope.ok = function () {
            $scope.modalTables[_indexTable].matrix[_row][_col] = $scope.modalTables[$scope.selected_table].matrix[$scope.selected_value][$scope.selected_attr];

            if ($scope.modalTables[_indexTable].fk_matrix[_col] == null)
                $scope.modalTables[_indexTable].fk_matrix[_col] = new Array();

            $scope.modalTables[_indexTable].fk_matrix[_col][0] = $scope.selected_table;
            $scope.modalTables[_indexTable].fk_matrix[_col][1] = $scope.selected_attr;

            $uibModalInstance.close("OK"); //result
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

    app.controller('ctrlSetupTmodal', function ($scope, $uibModalInstance, tables, nTables, _indexTable) {

        $scope.indexTable = _indexTable;
        $scope.numTables = new Array(nTables);

        $scope.modalTables = tables;
        $scope.numColum = new Array(tables[_indexTable].columns);

        $scope.autoLoads = new Array('Nome', 'Cognome', 'Colore', 'Città', "Saldo");

        $scope.autoLoadList = new Array();
        $scope.autoLoadList[0] = new Array('Aldo', 'Giovanni', 'Giacomo', 'Mario', 'Alessandro', 'Stefano', 'Salvatore', 'Alfredo');
        $scope.autoLoadList[1] = new Array('Rossi', 'Borzì', 'Pulvirenti', 'Maggio', 'Calabrò', 'Foti');
        $scope.autoLoadList[2] = new Array('Giallo', 'Rosso', 'Verde', 'Blu', 'Arancione', 'Celeste', 'Viola');
        $scope.autoLoadList[3] = new Array('Roma', 'Catania', 'Messina', 'Barcellona PG', 'Caltagirone');
        $scope.autoLoadList[4] = new Array('21.50', '596.20', '444121.00', '12');

        $scope.autoLoader = function(column,selectedAutoLoad){
            for (var i = 0; i < $scope.modalTables[_indexTable].rows; i++) {
                $scope.rndNumber = Math.floor(Math.random() * $scope.autoLoadList[selectedAutoLoad].length-1) + 1  ;
                $scope.modalTables[_indexTable].matrix[i][column] = $scope.autoLoadList[selectedAutoLoad][$scope.rndNumber];
            }
        };

        $scope.ok = function () {
            $uibModalInstance.close("OK"); //result
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

    app.controller('adminPanel', function($scope, $http, $state) {

        $scope.checkLogin = function() {
            $http.get("API/APIadmin.php?checklogin")
                .success(function (data, status, header, config) {

                $scope.res = data.Error;
                if ($scope.res != "" && $scope.res != null)
                    $state.go('auth', {ref: 0});
            })
                .error(function (data, status, header, config) {
                console.log("[ERROR] $http.get request failed!");
            });
        };

        $scope.checkLogin();

        $scope.radio_question = 'domandeSQL';
        $scope.question = '';

        $scope.radio_typeArgument = 'ex_argument';
        $scope.radio_typeSolution = 'ex_solution';

        $scope.updateArguments = function() {

            $http.get("API/APIadmin.php?arguments")
                .success(function (data, status, header, config) {
                if (data.length > 0) {
                    $scope.arguments = data;
                    $scope.selected_argument = $scope.arguments[0].id;
                    $scope.radio_typeArgument = 'ex_argument';
                    $scope.getSolutions($scope.radio_question);
                } else {
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
        $scope.updateArguments();

        $scope.getSolutions = function() {
            $http.get("API/APIadmin.php?solutions&argument=" + $scope.selected_argument + "&question=" + $scope.radio_question)
                .success(function (data, status, header, config) {
                if (data.length > 0) {
                    $scope.solutions = data;
                    $scope.selected_solution = $scope.solutions[0].id;
                    $scope.radio_typeSolution = 'ex_solution';
                    $scope.disable_selectSolution = false;
                } else {
                    $scope.radio_typeSolution = 'new_solution';
                    $scope.disable_selectSolution = true;
                }
            })
                .error(function (data, status, header, config) {
                console.log("[ERROR] $http.get request failed!");
            });
        };

        $scope.submitNewQuestion = function() {

            if ($scope.radio_typeArgument == 'new_argument' && $scope.radio_typeSolution == 'new_solution') {
                $http.get("API/APIadmin.php?type=" + $scope.radio_question + "&text=" + $scope.question + "&new_argument=" + $scope.argument + "&new_solution=" + $scope.solution + "&db=eh" )
                    .success(function (data, status, header, config) {

                    $scope.checkErrQuestion(data.Error);

                })
                    .error(function (data, status, header, config) {
                    console.log("[ERROR] $http.get request failed!");
                });
            }

            if ($scope.radio_typeArgument == 'ex_argument' && $scope.radio_typeSolution == 'ex_solution') {
                $http.get("API/APIadmin.php?type=" + $scope.radio_question + "&text=" + $scope.question + "&ex_argument=" + $scope.selected_argument + "&ex_solution=" + $scope.selected_solution + "&db=eh" )
                    .success(function (data, status, header, config) {

                    $scope.checkErrQuestion(data.Error);

                })
                    .error(function (data, status, header, config) {
                    console.log("[ERROR] $http.get request failed!");
                });
            }

            if ($scope.radio_typeArgument == 'ex_argument' && $scope.radio_typeSolution == 'new_solution') {

                $http.get("API/APIadmin.php?type=" + $scope.radio_question + "&text=" + $scope.question + "&ex_argument=" + $scope.selected_argument + "&new_solution=" + $scope.solution + "&db=eh" )
                    .success(function (data, status, header, config) {

                    $scope.checkErrQuestion(data.Error);

                })
                    .error(function (data, status, header, config) {
                    console.log("[ERROR] $http.get request failed!");
                });
            }
        };

        $scope.alerts = [];

        $scope.addAlert = function(type, msg) {
            $scope.alerts.push({type: type, msg: msg});
        };

        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };

        $scope.checkErrQuestion = function(error) {
            $scope.res = error;
            if ($scope.res != "" && $scope.res != null)
                $scope.addAlert('danger', $scope.res);
            else
                $scope.addAlert('success', 'Domanda aggiunta!');
        };

    });

    app.controller('auth', function($scope, $http, $state, $stateParams) {

        $scope.loginAdmin = function() {
            $http.get("API/APIadmin.php?username=" + $scope.loginUsername + "&password=" + $scope.loginPassword)
                .success(function (data, status, header, config) {

                $scope.checkErrLogin(data.Error);

            })
                .error(function (data, status, header, config) {
                console.log("[ERROR] $http.get request failed!");
            });
        };

        $scope.alerts = [];

        $scope.addAlert = function(type, msg) {
            $scope.alerts.push({type: type, msg: msg});
        };

        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };

        $scope.checkErrLogin = function(error) {
            $scope.res = error;
            console.log($scope.res);
            if ($scope.res != "" && $scope.res != null)
                $scope.addAlert('danger', $scope.res);
            else {
                $scope.addAlert('success', 'Login effettuato!');
                if ($stateParams.ref == 1)
                    $state.go("dbManager");
                else
                    $state.go("admin");
            }

        };

    });

}());
