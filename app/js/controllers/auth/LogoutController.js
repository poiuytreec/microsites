angular.module('AgaveToGo').controller('LogoutController', function ($injector, $timeout, $rootScope, $scope, $state, moment, $location, settings, $localStorage, TenantsController) {

    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageBodySolid = true;
        $rootScope.settings.layout.pageSidebarClosed = true;
    });
    $scope.requesting = true;
    $scope.profile = $localStorage.activeProfile;
    $scope.tenant = $localStorage.tenant;

    delete $localStorage.activeProfile;
    delete $localStorage.token;


    $scope.requesting = false;

    $location.path("/login");
    $location.replace();
});
