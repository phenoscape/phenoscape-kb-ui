'use strict';


// Declare app level module which depends on filters, and services
angular.module('pkb', [
'ngRoute',
'cgBusy',
'ngScientificNotation',
'pkb.filters',
'pkb.services',
'pkb.directives',
'pkb.controllers'
]).
config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/home', {templateUrl: 'partials/home.html', controller: 'HomeController'});
	$routeProvider.otherwise({redirectTo: '/home'});
}]);
