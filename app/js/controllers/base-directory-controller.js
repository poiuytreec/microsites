
function BaseCollectionCtrl($timeout, $rootScope, $scope, $state, $stateParams, $q, Commons, ApiStub) {
  $scope.offset = $scope.offset || 0;
  $scope.limit = $scope.limit || 50;

  $scope._RESOURCE_NAME = $scope._RESOURCE_NAME || null;

   $scope.getResourceId = $scope.getResourceId || function () {
    return $stateParams[$scope._RESOURCE_NAME + 'Id'];
  };

  $scope._COLLECTION_NAME = $scope._COLLECTION_NAME || null;

  $scope.getTableId = $scope.getTableId || function() {
    return '#datatable_collection';
  };
}
