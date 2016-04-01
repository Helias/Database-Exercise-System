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
            .state('algebra', {
            url: '/algebra',
            controller: 'argumentsCrtl',
            templateUrl: 'partials/algebra.html'
        })
            .state('algArguments', {
            url: '/algebra/:id',
            controller: 'algExCtrl',
            templateUrl: 'partials/algEx.html'
        })
            .state('sql', {
            url: '/sql',
            controller: 'argumentsCrtl',
            templateUrl: 'partials/sql.html'
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
