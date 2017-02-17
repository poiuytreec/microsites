/* Setup general page controller */
angular.module('AgaveToGo').controller('GeneralPageController', ['$rootScope', '$scope', 'settings', 'ChangelogParser', function($rootScope, $scope, settings, ChangelogParser) {

    $scope.changelog = {};

    ChangelogParser.latest().then(function(data) {
        if (data) {

            for(var version in data) break;
            $scope.changelog = data[version];
            $scope.changelog.version = version;

        }
    });

    $scope.$on('$viewContentLoaded', function() {   
    	// initialize core components
    	App.initAjax();

    	// set default layout mode
    	$rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;


    });
    
    
}]);
