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
            templateUrl: 'partials/home.html'
        })
            .state('arguments', {
            url: '/arguments/:arg',
            controller: 'argumentsCrtl',
            templateUrl: 'partials/arguments.html'
        })
            .state('exercise', {
            url: '/exercise/:arg/:id',
            controller: 'ExerciseCtrl',
            templateUrl: 'partials/exercise.html'
        })
            .state('algArguments', {
            url: '/algebra/:id',
            controller: 'algExCtrl',
            templateUrl: 'partials/algEx.html'
        })
            .state('sqlArguments', {
            url: '/sql/:id',
            controller: 'sqlExCtrl',
            templateUrl: 'partials/sqlEx.html'
        })
            .state('admin', {
            url: '/admin',
            controller: 'adminPanel',
            templateUrl: 'partials/admin.html'
        })
            .state('dbManager', {
            url: '/dbManager',
            controller: 'dbManager',
            templateUrl: 'partials/dbManager.html'
        })
            .state('auth', {
            url: '/auth:ref',
            controller: 'auth',
            templateUrl: 'partials/auth.html'
        });

    });

}());
