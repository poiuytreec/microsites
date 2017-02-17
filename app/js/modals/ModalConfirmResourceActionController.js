angular.module('AgaveToGo').controller('ModalConfirmResourceActionController', function ($scope, $modalInstance, AppsController, resource, resourceAction, resourceIndex){

    $scope.resource = resource;

    $scope.resourceAction = resourceAction;

    $scope.resourceIndex = resourceIndex;

    $scope.ok = function()
    {
      switch($scope._RESOURCE_NAME){
        case 'app':
          switch($scope.resourceAction){
            case 'enable':
            case 'disable':
              var body = {'action': $scope.resourceAction};
              AppsController.updateInvokeAppAction(resource.id, body)
                .then(
                  function(response){
                    angular.copy(response, $scope.resource);
                    $scope.$apply();
                  },
                  function(response){
                    App.alert({
                       type: 'danger',
                       message: "Error on " + $scope.resourceAction + " " + $scope.resourceId
                    });
                  });
              break;
            case 'delete':
              AppsController.deleteApp(resource.id)
                .then(
                  function(response){
                    $scope.appsDetailsList.splice($scope.appsDetailsList.indexOf($scope.resourceIndex), 1);
                    $scope.$apply();
                  },
                  function(response){
                    App.alert({
                       type: 'danger',
                       message: "Error on " + resourceAction + " " + resourceId
                    });
                  });
                break;
          }
          break;
      }
      $modalInstance.close($scope.resource.name);
    };

    $scope.cancel = function()
    {
        $modalInstance.dismiss('cancel');
    };
});
