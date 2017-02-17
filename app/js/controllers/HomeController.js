/* Setup home page controller */
angular.module('AgaveToGo').controller('HomeController', ['$rootScope', '$scope', 'settings', 'moment', '$filter', function($rootScope, $scope, settings, moment, $filter) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        // App.initAjax();


        // set default layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
    });
    $scope.today = new Date();
}]);
