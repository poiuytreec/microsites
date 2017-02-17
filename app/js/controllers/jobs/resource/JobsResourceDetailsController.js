angular.module('AgaveToGo').controller('JobsResourceDetailsController', function ($scope, $stateParams, $state, $translate, $uibModal, JobsController, ActionsService, MessageService, NotificationsController) {

    $scope.job = null;

    $scope.getJob = function () {
        $scope.requesting = true;
        if ($stateParams.id !== '') {
            JobsController.getJobDetails($stateParams.id)
                .then(
                    function (response) {
                        $scope.job = response.result;
                        $scope.requesting = false;
                    },
                    function (response) {
                        MessageService.handle(response, $translate.instant('error_jobs_details'));
                        $scope.requesting = false;
                    }
                );
        } else {
            MessageService.handle(response, $translate.instant('error_jobs_details'));
            $scope.requesting = false;
        }
    };

    $scope.browse = function (id) {
        JobsController.getJobDetails(id)
            .then(
                function (data) {
                    $state.go('data-explorer', {'systemId': data.archiveSystem, path: data.archivePath});
                },
                function (data) {
                    MessageService.handle(response, $translate.instant('error_jobs_details'));
                    $scope.requesting = false;
                }
            );
    };

    $scope.resubmit = function(jobId) {
        JobsController.createResubmitJob(jobId)
            .then(
                function(response) {
                    // hard-wired for now
                    var websocketNotification = {
                        associatedUuid: response.result.id,
                        event: '*',
                        persistent: true,
                        url: 'https://9d1e23fc.fanoutcdn.com/fpp'};

                    var offlineNotification = {
                        associatedUuid: response.result.id,
                        event: '*',
                        persistent: true,
                        url: 'http://httpbin.org/status/418',
                        policy: {
                            retryStrategy: 'NONE',
                            saveOnFailure: true
                        }};

                    NotificationsController.addNotification(websocketNotification)
                        .then(
                            function(response){
                            },
                            function(response){
                                MessageService.handle(response, $translate.instant('error_notifications_add'));
                            }
                        );

                    NotificationsController.addNotification(offlineNotification)
                        .then(
                            function(response){
                            },
                            function(response){
                                MessageService.handle(response, $translate.instant('error_notifications_add'));
                            }
                        );

                    $scope.job = response.result;

                    $uibModal.open({
                        templateUrl: "views/apps/resource/job-resubmission-success.html",
                        scope: $scope,
                        size: 'lg',
                        controller: ['$scope', '$uibModalInstance', function($scope, $uibModalInstance ) {
                            $scope.cancel = function()
                            {
                                $uibModalInstance.dismiss('cancel');
                            };

                            $scope.close = function(){
                                $uibModalInstance.close();
                            }
                        }]
                    });
                    $scope.resetForm();
                    $scope.requesting = false;
                },
                function(response) {
                    MessageService.handle(response, $translate.instant('error_jobs_create'));
                });
    };

    $scope.getJob();

});
