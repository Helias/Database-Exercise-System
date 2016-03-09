(function () {
'   use strict';

    var app = angular.module('exerciseSystem', ['ui.router', 'ui.bootstrap', 'chieffancypants.loadingBar']);

    app.controller("ExerciseController", function ($rootScope) {
        
    });
	
	app.controller('algCrtl', function($scope) {
		$scope.queryAlg = ""; 
		$scope.addOpAlg = function(op) {
        	$scope.queryAlg = $scope.queryAlg+op;
    	}
	});

}());
