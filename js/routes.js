/*jslint browser: true, white: true, plusplus: true*/
/*global angular, console, alert*/

(function () {
    'use strict';

    var app = angular.module('exerciseSystem');

    app.config(function ($stateProvider, $urlRouterProvider) {

        /* routing */

        // default route
        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state('home', {
            url: '/',
            controller: 'ExerciseController',
            templateUrl: 'partials/home.html'
        })
            .state('algebra', {
            url: '/algebra',
            templateUrl: 'partials/algebra.html'
        })
            .state('sql', {
            url: '/sql',
            templateUrl: 'partials/sql.html'
        });

    });

}());