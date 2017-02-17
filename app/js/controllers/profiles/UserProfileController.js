angular.module('AgaveToGo').controller('UserProfileController', function($rootScope, $scope, $stateParams, $state, $http, $filter, $timeout, $localStorage, $translate, $q, Commons, ProfilesController, JobsController, AppsController, SystemsController, MessageService) {
    $scope.jobCount = '-';
    $scope.systemCount = '-';
    $scope.appCount = '-';
    $scope.directorySearchTerm = '';
    $scope.passStrength = 80;
    $scope.users = [];

    if ($state.current.name === "profile"){
        $state.go("profile.account");
    };

    if ($stateParams.username) {
        $scope.username = $stateParams.username;
    } else {
        $scope.username = 'me';
    }

    $scope.setUserProfile = function(profile) {
        $timeout(function() {
            profile.password = '';
            profile.oldPassword = '';
            profile.passwordConfirmation = '';
            
            $scope.profile = profile;
        }, 100);
    }
    $scope.setJobCount = function(jobCount) {
        $timeout(function() {
            $scope.jobCount = jobCount;
        }, 100);
    };

    $scope.setAppCount = function(appCount) {
        $timeout(function() {
            $scope.appCount = appCount;
        }, 100);
    };

    $scope.setSystemCount = function(systemCount) {
        $timeout(function() {
            $scope.systemCount = systemCount;
        }, 100);
    };

    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
        // Layout.setSidebarMenuActiveLink('set', $('#sidebar_menu_link_profile')); // set profile link active in sidebar menu

        ProfilesController.getProfile($scope.username).then(
            function(data) {
                $scope.setUserProfile(data);
            },
            function(response) {
                MessageService.handle(response, $translate.instant('error_profiles_list'));
                $scope.requesting = false;
            });

        JobsController.searchJobs("appId.eq=" + $rootScope.settings.appId + "&filter=id").then(function(data) {
            var jobCount = data.result.length;
            $scope.jobCount = jobCount;

            $scope.setJobCount(jobCount);
        });

        SystemsController.searchSystems("filter=id").then(function(response) {
            var systemCount = response.result.length;
            $scope.setSystemCount(response.result.length);
        });

        AppsController.searchApps("filter=id").then(function(data) {
            var appCount = data.result.length;
            $scope.appCount = appCount;
            $scope.setAppCount(appCount);
        });
    });
    
    $scope.updateProfile = function() {
        ProfilesController.updateProfile($scope.profile).then(function(response) {
            $rootScope.$broadcast('oauth:profile', response.result);
        },
        function(response) {
            MessageService.handle(response, $translate.instant('error_profiles_update'));
        });

    };

    $scope.updateProfile = function() {
        ProfilesController.updateProfile($scope.profile).then(function(response) {
                $rootScope.$broadcast('oauth:profile', response.result);
            },
            function(response) {
                MessageService.handle(response, $translate.instant('error_profiles_update'));
            });
    };

    $scope.searchProfiles = function() {
        
        $scope.users = [];

        var isSuccess = true;
        var that = this;
        var searchTerm = $('#directory-search-input').val();
        var promises = [];
        var totalResults = 0;
        var users = [];
        if (searchTerm.indexOf(' ') < 0) {
            promises.push(ProfilesController.listProfiles(null, null, searchTerm, null, null).then(
                function (response) {
                    angular.forEach(response, function (user) {
                        users[user.username] = user;
                    });
                },
                function (response) {
                    MessageService.handle(response, $translate.instant('error_profiles_search'));
                }));

            promises.push(ProfilesController.listProfiles(null, null, null, searchTerm, null).then(
                function (response) {
                    angular.forEach(response, function (user) {
                        users[user.username] = user;
                    });
                },
                function (response) {
                    MessageService.handle(response, $translate.instant('error_profiles_search'));
                }));
        }
        else {
            promises.push(ProfilesController.listProfiles(null, searchTerm, null, null, null).then(
                function (response) {
                    angular.forEach(response, function (user) {
                        users[user.username] = user;
                    });
                },
                function (response) {
                    MessageService.handle(response, $translate.instant('error_profiles_search'));
                }));
        }

        promises.push(ProfilesController.listProfiles(searchTerm, null, null, null, null).then(
            function (response) {
                angular.forEach(response, function (user) {
                    users[user.username] = user;
                });
            },
            function (response) {
                MessageService.handle(response, $translate.instant('error_profiles_search'));
            }));

        promises.push(ProfilesController.listProfiles(null, null, null, null, searchTerm).then(
            function (response) {
                angular.forEach(response, function (user) {
                    users[user.username] = user;
                });
            },
            function (response) {
                MessageService.handle(response, $translate.instant('error_profiles_search'));
            }));

        var deferred = $q.all(promises).then(
            function(result) {
                $timeout(function() {
                    var arr = [];
                    for (var m in users) {
                        if (users.hasOwnProperty(m)) {
                            $scope.users.push(users[m]);
                        }
                    }
                }, 10);
            },
            function(message, result) {
                MessageService.handle(response, $translate.instant('error_profiles_search'));
            });
    };



    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
        Layout.setAngularJsMainMenuActiveLink('set', $('#sidebar_menu_link_profile'), $state); // set profile link active in sidebar menu
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageBodySolid = true;
    $rootScope.settings.layout.pageSidebarClosed = true;
});
