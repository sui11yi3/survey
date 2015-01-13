'use strict';

var app = angular.module('app', ['ngRoute', 'appControllers', 'appServices', 'appDirectives', 
    'angularCharts', 'tableSort', 'ngSanitize','ngCsv', 'ui.bootstrap']);

var appServices = angular.module('appServices', []);
var appControllers = angular.module('appControllers', []);
var appDirectives = angular.module('appDirectives', []);

var options = {};
options.api = {};
options.api.base_url = "http://127.0.0.1";


app.config([ '$locationProvider', '$routeProvider', 
  function($location, $routeProvider) {
    $routeProvider.
        when('/', {
            templateUrl: 'partials/login.html',
            controller: 'UserCtrl'
        }).
        when('/admin/users', {
            templateUrl: 'partials/admin.users.html',
            controller: 'UserListCtrl',
            access: { requiredAuthentication: true }
        }).
        when('/admin/register', {
            templateUrl: 'partials/admin.register.html',
            controller: 'UserCtrl',
            access: { requiredAuthentication: true }
        }).
        when('/logout', {
            templateUrl: 'partials/logout.html',
            controller: 'UserCtrl',
            access: { requiredAuthentication: true }
        }).
        when('/survey/list', {
            templateUrl: 'partials/survey.list.html',
            controller: 'SurveyListCtrl',
            access: { requiredAuthentication: true }
        }).
        when('/survey/create', {
            templateUrl: 'partials/survey.create.html',
            controller: 'SurveyCreateCtrl',
            access: { requiredAuthentication: true }
        }). 
        when('/survey/edit/:id', {
            templateUrl: 'partials/survey.create.html',
            controller: 'SurveyEditCtrl',
            access: { requiredAuthentication: true }
        }).  
         when('/survey/chart', {
            templateUrl: 'partials/survey.chart.html',
            controller: 'ChartCtrl',
            access: { requiredAuthentication: true }
        }).                       
        otherwise({
            redirectTo: '/'
        });
}]);


app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('TokenInterceptor');
});

app.run([ '$rootScope', '$location', '$window', 'AuthenticationService',
    function($rootScope, $location, $window, AuthenticationService) {

        $rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {
            $rootScope.role = $window.sessionStorage.role || '';
            if(!AuthenticationService.role) {
                AuthenticationService.role = $window.sessionStorage.role || '';
            }
            $rootScope.username = $window.sessionStorage.username || '';
            //redirect only if both isAuthenticated is false and no token is set
            if (nextRoute != null && nextRoute.access != null && nextRoute.access.requiredAuthentication 
                && !AuthenticationService.isAuthenticated && !$window.sessionStorage.token) {

                $location.path("/");
            }
    });
} ]);

