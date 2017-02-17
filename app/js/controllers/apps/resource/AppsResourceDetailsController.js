angular.module('AgaveToGo').controller('AppsResourceDetailsController', function($scope, $rootScope, $stateParams, $translate, AppsController, ActionsService, MessageService, PermissionsService) {

  $scope.app = null;

  $scope.getApp = function(){
    if ($rootScope.settings.appId !== ''){
      AppsController.getAppDetails($rootScope.settings.appId)
        .then(
          function(response){
            $scope.app = response.result;
          },
          function(response){
            MessageService.handle(response, $translate.instant('error_apps_details'));
          }
        );
    } else {
      MessageService.handle(response, $translate.instant('error_apps_details'));
    }
  };

  $scope.confirmAction = function(resourceType, resource, resourceAction, resourceIndex){
    ActionsService.confirmAction(resourceType, resource, resourceAction, resourceIndex);
  };

  $scope.editPermissions = function(resource) {
    PermissionsService.editPermissions(resource);
  }

  $scope.getApp();

});
