appServices.factory('AuthenticationService', function() {
    var auth = {
        isAuthenticated: false,
        role: ''
    }

    return auth;
});

appServices.factory('TokenInterceptor', function ($q, $window, $location, AuthenticationService) {
    return {
        request: function (config) {
            config.headers = config.headers || {};
            if ($window.sessionStorage.token) {
                config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
            }
            return config;
        },

        requestError: function(rejection) {
            return $q.reject(rejection);
        },

        /* Set Authentication.isAuthenticated to true if 200 received */
        response: function (response) {
            if (response != null && response.status == 200 && $window.sessionStorage.token && !AuthenticationService.isAuthenticated) {
                AuthenticationService.isAuthenticated = true;
                AuthenticationService.role = $window.sessionStorage.role;
            }
            return response || $q.when(response);
        },

        /* Revoke client authentication if 401 is received */
        responseError: function(rejection) {
            if (rejection != null && rejection.status === 401 && ($window.sessionStorage.token || AuthenticationService.isAuthenticated)) {
                delete $window.sessionStorage.token;
                AuthenticationService.isAuthenticated = false;
                $location.path("/");
            }

            return $q.reject(rejection);
        }
    };
});

appServices.factory('SurveyService', function($http) {
    return {
        findOne: function(id) {
            return $http.get('/survey/' + id);
        },
        
        findAll: function() {
            return $http.get('/survey/list');
        },

        delete: function(id) {
            return $http.delete('/survey/' + id);
        },

        create: function(survey, creator) {
            return $http.post('/survey', {'survey': survey, 'creator': creator});
        },

        update: function(survey) {
            return $http.put('/survey', {'survey': survey});
        },

        getPie: function() {
            return $http.get('/survey/gender');
        }
    };
});

appServices.factory('UserService', function ($http) {
    return {
        signIn: function(username, password) {
            return $http.post('/user/signin', {username: username, password: password});
        },

        logOut: function() {
            return $http.get('/user/logout');
        },

        register: function(username, password, passwordConfirmation, role) {
            return $http.post('/user/register', {username: username, password: password, passwordConfirmation: passwordConfirmation, role: role });
        },

        list: function() {
            return $http.get('/user/list');
        }
    };
});
