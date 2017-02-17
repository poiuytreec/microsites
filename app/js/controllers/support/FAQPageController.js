/* Setup general page controller */
angular.module('AgaveToGo').controller('FAQPageController', ['$rootScope', '$scope', 'settings', function($rootScope, $scope, settings) {
    $scope.$on('$viewContentLoaded', function() {   
    	// initialize core components
    	App.initAjax();

    	// set default layout mode
    	$rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
    });

    /** @type {boolean} */
    $scope.oneAtATime = true;
    /** @type {Array} */
    $scope.groups = [
        {
            title: "Dynamic Group Header - 1",
            content: "Dynamic Group Body - 1"
        },
        {
            title: "Dynamic Group Header - 2",
            content: "Dynamic Group Body - 2"
        }];
    /** @type {Array} */
    $scope.items = ["Item 1", "Item 2", "Item 3"];
    /**
     * @return {undefined}
     */
    $scope.addItem = function()
    {
        var vvar = $scope.items.length + 1;
        $scope.items.push("Item " + vvar);
    };
    $scope.status = {
        isCustomHeaderOpen: false,
        isFirstOpen: true,
        isFirstDisabled: false
    };
}]);
