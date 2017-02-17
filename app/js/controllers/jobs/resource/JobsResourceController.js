angular.module('AgaveToGo').controller("JobsResourceController", function ($scope, $rootScope, $state, $stateParams, $uibModal, MessageService, PermissionsService) {
    // $scope.$on('$viewContentLoaded', function () {
    //     App.initAjax(); // initialize core components
    //
    //     // set sidebar closed and body solid layout mode
    //     $rootScope.settings.layout.pageBodySolid = true;
    //     $rootScope.settings.layout.pageSidebarClosed = true;
    //
    // });


    $scope.jobId = $stateParams.id;

    $scope.go = function (route) {
        $state.go(route);
    };

    $scope.active = function (route) {
        // default to details tab
        if ($state.current.name === "jobs") {
            $state.go("jobs.details")
        }

        return $state.is(route);
    };

    $scope.tabs = [
        {heading: "Details", route: "jobs.details", active: false},
        {heading: "History", route: "jobs.history", active: false},
        // { heading: "Stats", route:"jobs.stats", active:false },
    ];

    $scope.$on("$stateChangeSuccess", function () {
        $scope.tabs.forEach(function (tab) {
            tab.active = $scope.active(tab.route);
        });
    });

    $scope.resubmit = function (jobId) {
        JobsController.resubmit(new JobResubmitAction(), jobId)
            .then(
                function (response) {
                    // hard-wired for now
                    var websocketNotification = {
                        associatedUuid: response.result.id,
                        event: '*',
                        persistent: true,
                        url: 'https://9d1e23fc.fanoutcdn.com/fpp'
                    };

                    var offlineNotification = {
                        associatedUuid: response.result.id,
                        event: '*',
                        persistent: true,
                        url: 'http://httpbin.org/status/418',
                        policy: {
                            retryStrategy: NONE,
                            saveOnFailure: true
                        }
                    };

                    NotificationsController.addNotification(websocketNotification)
                        .then(
                            function (response) {
                            },
                            function (response) {
                                MessageService.handle(response, $translate.instant('error_notifications_add'));
                            }
                        );

                    NotificationsController.addNotification(offlineNotification)
                        .then(
                            function (response) {
                            },
                            function (response) {
                                MessageService.handle(response, $translate.instant('error_notifications_add'));
                            }
                        );

                    $scope.job = response.result;

                    $uibModal.open({
                        templateUrl: "views/apps/resource/job-success.html",
                        scope: $scope,
                        size: 'lg',
                        controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                            $scope.cancel = function () {
                                $modalInstance.dismiss('cancel');
                            };

                            $scope.close = function () {
                                $modalInstance.close();
                            }
                        }]
                    });
                    $scope.resetForm();
                    $scope.requesting = false;
                },
                function (response) {
                    MessageService.handle(response, $translate.instant('error_jobs_create'));
                });
    };
});
