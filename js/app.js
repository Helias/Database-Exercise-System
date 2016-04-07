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
            $scope.query += op;

            if ($scope.type == "ALG")
                increaseQuery(op);   
            
        };

        $scope.querySQL = "";                                                           //SQL Query (Final).
        var type = new Array("select","where","from","newName","oldName");              //Type of query.

        //Struct of querySQL
        $scope.structQuerySQL = {
            
            flag : new Array(),                             //Flag for type.
            query : new Array(),                            //Query/string for type.
            indexOf : new Array(),                          //Last index of char (?).

            completeQuery : "",                             //Query completed.
            tmpQuery : "",                                  //Temp query.
            linker : "",                                    //Linker (Union, Intersect, Not in).

            //Inizialize method.
            inizializeStruct: function () {
                for (var i=0; i<type.length;i++){
                    this.flag[type[i]] = false;
                    this.query[type[i]] = "";
                    this.indexOf[type[i]] = 0;
                    this.linker = "";
                }
            }
        };

        var queryArray = new Array();                        //Array contains splittedQuery.                               
        var queryCounter = 0;                                //Number of splittedQuery.

        //If the index location in null||undefined -> inizialize.
        function checkIsUndefine (i) {
            if (queryArray[i] == null)  {
                queryArray[i] = angular.copy($scope.structQuerySQL);
            }
            queryArray[i].inizializeStruct();
        }

        //Increase the number of splitter query.
        function increaseQuery (op) {
            if ( op == '∪' || op == '∩' || op == '-' ){
                queryCounter++;  
                checkIsUndefine(queryCounter);      
            }
        }
                       
        //Convert query method ALG -> SQL.
        $scope.convertQuery = function () {
            if ($scope.type == "ALG" && $scope.query.length > 0 ){

                //Replace the ∪ ∩ - char with | and splitted by he.
                var querySplitted = $scope.query.replace('∪','|')       
                                                .replace('∩','|')
                                                .replace('-','|')
                                                .split('|');
                
                //Inizialize all query
                for (var i=0; i<=queryCounter; i++) {
                    checkIsUndefine(i);
                    queryArray[i].tmpQuery = " " + querySplitted[i];
                    if (queryArray[i].tmpQuery.length == 0)
                        queryCounter--;
                }

                for (var indexQuery=0; indexQuery<=queryCounter; indexQuery++){         //Flow all splitted query.

                    for (var i=0; i<queryArray[indexQuery].tmpQuery.length; i++){       //Flow all char of splitted query.

                        //Select π.
                        if ( queryArray[indexQuery].tmpQuery[i] == 'π' )
                            queryArray[indexQuery].flag["select"] = true; 
                        
                        if ( queryArray[indexQuery].tmpQuery[i] == '(' && queryArray[indexQuery].flag["select"] )
                            queryArray[indexQuery].flag["select"] = false;

                        if ( queryArray[indexQuery].flag["select"] )
                            queryArray[indexQuery].query["select"] += queryArray[indexQuery].tmpQuery[i]
                                                                                                    .replace('π','')
                                                                                                    .replace('(',''); 

                        //NewName ρ.
                        if ( queryArray[indexQuery].tmpQuery[i] == 'ρ' ){
                            queryArray[indexQuery].flag["newName"] = true;
                            queryArray[indexQuery].flag["from"] = false; 
                        }
                        
                        if ( queryArray[indexQuery].tmpQuery[i] == '←' && queryArray[indexQuery].flag["newName"] )
                            queryArray[indexQuery].flag["newName"] = false;

                        if ( queryArray[indexQuery].flag["newName"] )
                            queryArray[indexQuery].query["newName"] += queryArray[indexQuery].tmpQuery[i]
                                                                                                    .replace('ρ','')
                                                                                                    .replace('←',''); 

                        //OldName ←
                        if ( queryArray[indexQuery].tmpQuery[i] == '←' )
                            queryArray[indexQuery].flag["oldName"] = true; 
                        
                        if ( queryArray[indexQuery].tmpQuery[i] == '(' && queryArray[indexQuery].flag["oldName"] )
                            queryArray[indexQuery].flag["oldName"] = false;

                        if ( queryArray[indexQuery].flag["oldName"] )
                            queryArray[indexQuery].query["oldName"] += queryArray[indexQuery].tmpQuery[i]
                                                                                                    .replace('←','')
                                                                                                    .replace('(',''); 

                        //Where σ.
                        if ( queryArray[indexQuery].tmpQuery[i] == 'σ' ){
                            queryArray[indexQuery].flag["where"] = true;
                            queryArray[indexQuery].flag["from"] = false; 
                        }
                        
                        if ( queryArray[indexQuery].tmpQuery[i] == '(' && queryArray[indexQuery].flag["where"] )
                            queryArray[indexQuery].flag["where"] = false;

                        if ( queryArray[indexQuery].flag["where"] )   
                            queryArray[indexQuery].query["where"] += queryArray[indexQuery].tmpQuery[i]
                                                                                                    .replace('σ','')
                                                                                                    .replace('(',''); 

                        //From ( ).
                        if ( queryArray[indexQuery].tmpQuery[i] == '(' )
                            queryArray[indexQuery].flag["from"] = true;

                        if ( queryArray[indexQuery].tmpQuery[i] == ')' && queryArray[indexQuery].flag["from"] )
                            queryArray[indexQuery].flag["from"] = false;

                        if ( queryArray[indexQuery].flag["from"] )
                            queryArray[indexQuery].query["from"] += queryArray[indexQuery].tmpQuery[i]
                                                                                                    .replace('(','')
                                                                                                    .replace(')','')
                                                                                                    .replace('×',' , ')
                                                                                                    .replace('⋈',' JOIN '); 
                                 
                    }

                    //Rules for query.

                    //From ( ).
                    if (queryArray[indexQuery].query["from"] != "")
                        queryArray[indexQuery].query["from"] = " FROM " + queryArray[indexQuery].query["from"];

                    //Rename ρ ←.
                    if (queryArray[indexQuery].query["newName"] != "" && queryArray[indexQuery].query["oldName"]!= "" ){
                        var newName = queryArray[indexQuery].query["newName"].replace(' ','').split(",");
                        var oldName = queryArray[indexQuery].query["oldName"].replace(' ','').split(",");

                        var newSelect = "";
                        for (var j=0; j<newName.length;j++){
                            newSelect += newName[j] + " AS " + oldName[j];
                            if (j<newName.length-1)
                                newSelect += ", "; 
                        }

                        queryArray[indexQuery].query["select"] = newSelect;
                    }

                    //Select .
                    if (queryArray[indexQuery].query["select"] == "" && queryArray[indexQuery].query["from"] != "")
                        queryArray[indexQuery].query["select"] = " SELECT * ";

                    if (queryArray[indexQuery].query["select"] != "" && queryArray[indexQuery].query["select"] != " SELECT * ")
                        queryArray[indexQuery].query["select"] = " SELECT " + queryArray[indexQuery].query["select"];

                    //Where σ.
                    if (queryArray[indexQuery].query["where"] != "")
                        queryArray[indexQuery].query["where"] = " WHERE " + queryArray[indexQuery].query["where"];

                    //Check 'linker' char.
                    var tmpCounter = 0;
                    for(var i=0; i<$scope.query.length; i++){
                            
                            //Union ∪
                            if ( $scope.query[i] == '∪' ){
                                queryArray[tmpCounter].linker = " UNION ";
                                tmpCounter++;
                            }

                            //Intersect ∩
                            if ( $scope.query[i] == '∩' ){
                                queryArray[tmpCounter].linker = " INTERSECT ";
                                tmpCounter++;
                            }

                            //Not in -
                            if ( $scope.query[i] == '-' ){
                                queryArray[tmpCounter].linker = " NOT IN ";
                                tmpCounter++;
                            }
                    }

                    //Join all splitted query to write the completeQuery.
                    queryArray[indexQuery].completeQuery =  queryArray[indexQuery].query["select"] + 
                                                            queryArray[indexQuery].query["from"] +
                                                            queryArray[indexQuery].query["where"] +
                                                            queryArray[indexQuery].linker;

                }

                //Join all query to write the completeQuery.
                $scope.querySQL ="";
                for (var i=0; i<=queryCounter; i++)
                    $scope.querySQL+=queryArray[i].completeQuery;   

                //Replace the logic operator.
                $scope.querySQL = replacerLogOP( $scope.querySQL );
            }
        }

        //Replace logic operator.
        function replacerLogOP(query) {
            return query.replace('∧',' AND ')
                        .replace('∨',' OR ')
                        .replace('¬',' NOT ')
                        .replace('≠','<>')
                        .replace('≥','>=')
                        .replace('≤','<=');
        };

        $scope.sendQuery = function() {
            $http.get( "API/APIadmin.php?sql=" + $scope.query)
                .success(function (data, status, header, config) {

                console.log(data);

            })
                .error(function (data, status, header, config) {
                console.log("[ERROR] $http.get request failed!");
            });
        };

    });

    app.controller('dbManager', function($scope, $http, $uibModal, $state) {

        $scope.nTables = 0;                     //Numbers of table.

        //Table structure.
        $scope.table = {
            name: "",                           //TableName.
            rows: 1,                            //Number of row.
            columns: 1,                         //Number of columns.
            attr: new Array(),                  //Array with the name of attr.
            matrix: new Array(),                //Matrix contains the value of table.

            fk_matrix: new Array(),             //Matrix with indexTable, columns linked by FK.
            fk_attr: new Array()                //fk_attr (Boolean) --> the index is the same of attr.
        };

        //Create and inizialize array of table.
        $scope.tables = new Array();            

        $scope.inizializeTable = function() {
            $scope.tables[$scope.nTables-1] = angular.copy($scope.table);
            $scope.inizializeNewRow($scope.nTables-1);
        }

        $scope.inizializeNewRow = function(table) {
            if ($scope.tables[table].matrix[$scope.tables[table].rows-1] == null)
                $scope.tables[table].matrix[$scope.tables[table].rows-1] = new Array();   
        }

        //Function for ng-repeat.
        $scope.getNumber = function(num) {
            return new Array(num);
        };

        //Check if there are table with the same name.
        $scope.sameTableName = function(){
            for (var i = 0; i < $scope.nTables-1; i++) {
                for (var j = i+1; j < $scope.nTables; j++) {
                    if ($scope.tables[i].name == $scope.tables[j].name)
                        return true;
                }
            }
            return false;
        };

        //Check if there are attributes with the same name in the same table.
        $scope.sameAttrName = function(){
            for (var k = 0; k < $scope.nTables; k++) {
                for (var i = 0; i < $scope.tables[k].columns; i++) {
                    for (var j = i+1; j < $scope.tables[k].columns; j++) {
                        if ($scope.tables[k].attr[i] == $scope.tables[k].attr[j])
                            return true;
                    }
                }
            }
            return false;
        };

        //Check if there are empty fields.
        $scope.emptyField = function(){
            for (var k = 0; k < $scope.nTables; k++) {
                for (var i = 0; i < $scope.tables[k].rows; i++) {
                    for (var j = 0; j < $scope.tables[k].columns; j++) {
                        if ($scope.tables[k].matrix[i][j] == '' || $scope.tables[k].matrix[i][j] == null)
                            return true;
                    }    
                }
            }
            return false;
        }

        //Write the CREATE TABLE QUERY | Return array of query/string.
        $scope.writeQueryCreate = function(){
            var queryResult = new Array();
            for (var i = 0; i < $scope.nTables; i++) {
                queryResult[i] = "CREATE TABLE IF NOT EXISTS des." + $scope.nameDatabase + "_" + $scope.tables[i].name + " ( ";
                for (var j = 0; j < $scope.tables[i].columns; j++) {
                    queryResult[i] += $scope.tables[i].attr[j] + " varchar(255) NOT NULL ";
                    if (j < $scope.tables[i].columns-1)
                        queryResult[i] += ", ";
                }
                queryResult[i] += " ); ";
            }
            return queryResult;
        };

        //Write the INSERT INTO QUERY | Return array of query/string.
        $scope.writeQueryInsert = function(){
            var queryResult = new Array();
            for (var i = 0; i < $scope.nTables; i++) {
                queryResult[i] = "INSERT INTO des." + $scope.nameDatabase + "_" + $scope.tables[i].name + " ( ";
                for (var j = 0; j < $scope.tables[i].columns; j++) {
                    queryResult[i] += $scope.tables[i].attr[j] ;
                    if (j < $scope.tables[i].columns-1)
                        queryResult[i] += ", ";
                }
                queryResult[i] += " ) VALUES ";

                for (var b = 0; b < $scope.tables[i].rows; b++){
                    queryResult[i] += " ( ";
                    for (var a = 0; a < $scope.tables[i].columns; a++) {
                        queryResult[i] += " '" + $scope.tables[i].matrix[b][a] + "' ";
                        if (a < $scope.tables[i].columns-1)
                            queryResult[i] += ", ";
                    }
                    if (b < $scope.tables[i].rows-1)
                        queryResult[i] += " ), ";
                }
                queryResult[i] += " ); ";
            }
            return queryResult;
        };

        //Write the ALTER TABLE QUERY | Return array of query/string.
        $scope.writeQueryFK = function(){
            var queryResult = new Array();
            var counter = 0;
            for (var i=0; i<$scope.nTables; i++) {
                for (var j=0; j<$scope.tables[i].columns; j++){

                    if ($scope.tables[i].fk_attr[j]){
                        queryResult[counter] = "ALTER TABLE des." + $scope.nameDatabase + "_" + $scope.tables[$scope.tables[i].fk_matrix[j][0]].name +
                            " ADD PRIMARY KEY ( " + $scope.tables[$scope.tables[i].fk_matrix[j][0]].attr[$scope.tables[i].fk_matrix[j][1]] + " );";

                        queryResult[counter] += " ALTER TABLE des." + $scope.nameDatabase + "_" + $scope.tables[i].name + 
                            " ADD FOREIGN KEY ( " + $scope.tables[i].attr[j] + " )" +
                            " REFERENCES des." + $scope.nameDatabase + "_" + $scope.tables[$scope.tables[i].fk_matrix[j][0]].name + 
                            "( "+ $scope.tables[$scope.tables[i].fk_matrix[j][0]].attr[$scope.tables[i].fk_matrix[j][1]] +" );";
                        counter++;
                    }
                }
            }
            return queryResult;
        };

        //BuildQuery function call the other function to writeQuery and submit it to API.
        $scope.buildQuery = function(){

            //Declare array.
            var queryCreate = new Array();
            var queryInsert = new Array();
            var queryFK = new Array();

            //Load the array.
            queryCreate = $scope.writeQueryCreate();
            queryFK = $scope.writeQueryFK();
            queryInsert = $scope.writeQueryInsert();

            //Order the array with INSERT QUERY.
            for (var i=0; i<$scope.nTables; i++) {                      
                for (var j=0; j<$scope.tables[i].columns; j++){         
                    if ( $scope.tables[i].fk_attr[j] ){ 
                        if (i < $scope.tables[i].fk_matrix[j][0]){
                            var tmp = queryInsert[i];
                            queryInsert[i] = queryInsert[$scope.tables[i].fk_matrix[j][0]];
                            queryInsert[$scope.tables[i].fk_matrix[j][0]] = tmp;
                        }
                    }
                }
            }

            //Concact all query and pass toLowerCase form.
            var queryToAPI = "";
            for (var i=0; i<$scope.nTables; i++)
                queryToAPI += queryCreate[i].toLowerCase() + " | ";

            for (var i=0; i<queryFK.length; i++)
                queryToAPI += queryFK[i].toLowerCase() + " | ";

            for (var i=0; i<$scope.nTables; i++){
                queryToAPI += queryInsert[i].toLowerCase()
                if (i<$scope.nTables-1)
                    queryToAPI += " | ";
            }

            //Call the API
            $http.get("API/APIadmin.php?query=" + queryToAPI + "&nameDB=" + $scope.nameDatabase)
                .success(function (data, status, header, config) {
                if (data.Success)
                    $scope.addAlert('success', data.Success);
                else
                    $scope.addAlert('danger', data.Error);
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

        /* Modal*/
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

            $uibModalInstance.close("OK");
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
            $uibModalInstance.close("OK");
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

        $http.get("API/APIadmin.php?database")
            .success(function (data, status, header, config) {
            if (data.length > 0) 
                $scope.databases = data;
        })
            .error(function (data, status, header, config) {
            console.log("[ERROR] $http.get request failed!");
        });

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
                $http.get("API/APIadmin.php?type=" + $scope.radio_question + "&text=" + $scope.question + "&new_argument=" + $scope.argument + "&new_solution=" + $scope.solution + "&db=" + $scope.selected_database )
                    .success(function (data, status, header, config) {

                    $scope.checkErrQuestion(data.Error);

                })
                    .error(function (data, status, header, config) {
                    console.log("[ERROR] $http.get request failed!");
                });
            }

            if ($scope.radio_typeArgument == 'ex_argument' && $scope.radio_typeSolution == 'ex_solution') {
                $http.get("API/APIadmin.php?type=" + $scope.radio_question + "&text=" + $scope.question + "&ex_argument=" + $scope.selected_argument + "&ex_solution=" + $scope.selected_solution + "&db=" + $scope.selected_database )
                    .success(function (data, status, header, config) {

                    $scope.checkErrQuestion(data.Error);

                })
                    .error(function (data, status, header, config) {
                    console.log("[ERROR] $http.get request failed!");
                });
            }

            if ($scope.radio_typeArgument == 'ex_argument' && $scope.radio_typeSolution == 'new_solution') {

                $http.get("API/APIadmin.php?type=" + $scope.radio_question + "&text=" + $scope.question + "&ex_argument=" + $scope.selected_argument + "&new_solution=" + $scope.solution + "&db=" + $scope.selected_database )
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
