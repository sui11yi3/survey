appControllers.controller('NavCtrl', [ '$scope', '$location',
    function($scope, $location) {
      $scope.isActive = function(route) {
        $scope.path = $location.path();
        return $location.path() === route;
      };
    }
]);

appControllers.controller("ExpandCtrl", [ '$scope',
    function($scope) {
        $scope.toggleDetail = function(id) {
            if ($scope.activeId == id)
                $scope.activeId = -1;
            else
                $scope.activeId = id;
        };
    }
]);

appControllers.controller('SurveyListCtrl', ['$scope', '$interval', '$window', '$location', 'SurveyService', 'AuthenticationService',
    function SurveyListCtrl($scope, $interval, $window, $location, SurveyService, AuthenticationService) {
        if (AuthenticationService.isAuthenticated) {
            $scope.surveys = [];
            $scope.exportData = [];
            $scope.currentUser = $window.sessionStorage._id;

            SurveyService.findAll().success(function(data) {
                $scope.surveys = data;
                for(var i = 0; i < data.length; i++) {
                    var createDate = new Date(data[i].created);
                    $scope.exportData.push({
                        name: data[i].name,
                        gender: data[i].gender,
                        city: data[i].city,
                        kids: data[i].kids.toString(),
                        creator: data[i].creator.username,
                        created: createDate
                    });
                }
            }).error(function(data, status) {
                console.log(status);
                console.log(data);
            });

            var timerSurveyList = $interval(function () {
                $scope.exportData = [];
                SurveyService.findAll().success(function(data) {
                    $scope.surveys = data;
                    for(var i = 0; i < data.length; i++) {
                        var createDate = new Date(data[i].created);
                        $scope.exportData.push({
                            name: data[i].name,
                            gender: data[i].gender,
                            city: data[i].city,
                            kids: data[i].kids.toString(),
                            creator: data[i].creator.username,
                            created: createDate
                        });
                    }          
                }).error(function(data, status) {
                    console.log(status);
                    console.log(data);
                });
            }, 60000);
            $scope.$on('$destroy', function() {
                $interval.cancel(timerSurveyList);
            });
        }
        else {
            $location.path("/");
        }
    }
]);

appControllers.controller('SurveyCreateCtrl', ['$scope', '$location', '$window', 'SurveyService', 'AuthenticationService',
    function SurveyCreateCtrl($scope, $location, $window, SurveyService, AuthenticationService) {
        if (AuthenticationService.isAuthenticated) {
            $scope.save = function save(survey) {
                 if (survey.name != undefined && survey.city != undefined && survey.gender != undefined && survey.kids != undefined) {
                    SurveyService.create(survey, $window.sessionStorage.username).success(function(data) {
                        $location.path("/survey/list");
                    }).error(function(data, status) {
                        console.log(status);
                        console.log(data);
                    });
                }
            }
        }
    }
]);

appControllers.controller('SurveyEditCtrl', ['$scope', '$routeParams', '$location', 'SurveyService', 'AuthenticationService',
    function SurveyEditCtrl($scope, $routeParams, $location, SurveyService, AuthenticationService) {
        if (AuthenticationService.isAuthenticated) {
            $scope.survey = {};
            var id = $routeParams.id;

            SurveyService.findOne(id).success(function(data) {
                $scope.survey = data;
            }).error(function(data, status) {
                $location.path("/survey/list");
            });

            $scope.save = function save(survey) {
                 if (survey.name != undefined && survey.city != undefined && survey.gender != undefined && survey.kids != undefined) {
                    SurveyService.update(survey).success(function(data) {
                        $location.path("/survey/list");
                    }).error(function(data, status) {
                        console.log(status);
                        console.log(data);
                    });
                }
            }
        }
    }
]);

appControllers.controller('ModalCtrl', ['$scope', '$location', '$route', 'SurveyService',
    function ModalCtrl($scope, $location, $route, SurveyService) {
            $scope.modalShown = false;
            $scope.surveyToDeleteId = '';

            $scope.openModal = function(id) {
                $scope.modalShown = !$scope.modalShown;
                $scope.surveyToDeleteId = id;
            }

            $scope.closeModal = function() {
                $scope.modalShown = !$scope.modalShown;
                $scope.surveyToDeleteId = '';  
            }

            $scope.deleteSurvey = function deleteSurvey() {
                if ($scope.surveyToDeleteId != '') {
                    var id = $scope.surveyToDeleteId;
                    $scope.surveyToDeleteId= '';

                    SurveyService.delete(id).success(function(data) {
                        if($location.path() != "/survey/list") {
                            $location.path("/survey/list");
                        }
                        else {
                            $route.reload();
                        }
                    }).error(function(data, status) {
                        console.log(status);
                        console.log(data);
                    });
                }
            }        
    }
]);



appControllers.controller('ChartCtrl', [ '$scope', '$location', '$interval', 'SurveyService', 'AuthenticationService',
    function ChartCtrl($scope, $location, $interval, SurveyService, AuthenticationService) {
            if (AuthenticationService.isAuthenticated) {
                $scope.pieConfig = {
                tooltips: true,
                labels: false,
                colors: ['red', 'blue'],
                legend: {
                    display: true,
                    position: 'right'
                    }
                };
                SurveyService.getPie().success(function(data) {
                    $scope.pieData = {
                        data: [{
                            x: "Male",
                            y: [data.male],
                        }, {
                            x: "Female",
                            y: [data.female]
                        }]
                      };
                })
                .error(function(data, status) {
                    console.log(status);
                    console.log(data);
                });
                var timerSurveyChart = $interval(function () {
                    SurveyService.getPie().success(function(data) {
                        $scope.pieData = {
                            data: [{
                                x: "Male",
                                y: [data.male],
                            }, {
                                x: "Female",
                                y: [data.female]
                            }]
                          };
                    })
                    .error(function(data, status) {
                        console.log(status);
                        console.log(data);
                    });
                }, 60000);
                $scope.$on('$destroy', function() {
                    $interval.cancel(timerSurveyChart);
                });
            }
            else {
                $location.path("/");
            }
        }
]);


appControllers.controller('UserCtrl', ['$scope', '$location', '$window', '$interval', 'UserService', 'AuthenticationService', 
    function UserCtrl($scope, $location, $window, $interval, UserService, AuthenticationService) {

        if (AuthenticationService.isAuthenticated && $location.path() == '/') {
            $location.path('/survey/list'); 
        }

        if (AuthenticationService.role != 'admin' && $location.path() == '/admin/register') {
            $location.path('/survey/list');
        }

        //Admin User Controller (signIn, logOut, register)
        $scope.signIn = function signIn(username, password) {
            if (username != null && password != null) {
                UserService.signIn(username, password).success(function(data) {
                    AuthenticationService.isAuthenticated = true;
                    $window.sessionStorage._id = data._id;
                    $window.sessionStorage.username = data.username;
                    $window.sessionStorage.role = data.role;
                    $window.sessionStorage.token = data.token;
                    $location.path("/survey/list");
                    
                }).error(function(data, status) {
                    $scope.error = data.error;
                    console.log(status);
                    console.log(data);
                });
            }

        }

        $scope.logOut = function logOut() {
            if (AuthenticationService.isAuthenticated) {
                
                UserService.logOut().success(function(data) {
                    AuthenticationService.isAuthenticated = false;
                    AuthenticationService.role = '';
                    delete $window.sessionStorage._id;
                    delete $window.sessionStorage.username;
                    delete $window.sessionStorage.role;
                    delete $window.sessionStorage.token;

                    //$interval.cancel(timerSurveyList);
                    //$interval.cancel(timerSurveyChart);

                    $location.path("/");
                }).error(function(data, status) {
                    console.log(status);
                    console.log(data);
                });
            }
            else {
                $location.path("/");
            }
        }

        $scope.register = function register(username, password, passwordConfirm, role) {
            if (AuthenticationService.isAuthenticated) {
                UserService.register(username, password, passwordConfirm, role).success(function(data) {
                    $location.path("/admin/users");
                }).error(function(data, status) {
                    $scope.error = data.error;
                    console.log(status);
                    console.log(data);
                });
            }
            else {
                $location.path("/");
            }
        }
    }
]);


appControllers.controller('UserListCtrl', [ '$scope', '$location', 'UserService', 'AuthenticationService',
    function UserListCtrl($scope, $location, UserService, AuthenticationService) {
        if (AuthenticationService.role != 'admin' && $location.path() == '/admin/users') {
            $location.path('/survey/list');
        }
        else if (AuthenticationService.isAuthenticated) {
            $scope.users = [];

            UserService.list().success(function(data) {
                $scope.users = data;            
            }).error(function(data, status) {
                console.log(status);
                console.log(data);
            });
        }
        else {
            $location.path("/");
        }

    }
]);
