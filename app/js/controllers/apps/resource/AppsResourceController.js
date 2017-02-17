angular.module('AgaveToGo').controller("AppsResourceController", function($scope, $rootScope, $state, $stateParams) {

		$scope.appId = $rootScope.settings.appId;

		$scope.go = function(route){
			$state.go(route);
		};

		$scope.active = function(route){
			// default to details tab
			if ($state.current.name === "apps"){
				$state.go("apps.run")
			}

			return $state.is(route);
		};

		$scope.tabs = [
			{ heading: "Run", route:"apps.run", active:false },
			{ heading: "Details", route:"apps.details", active:false },
			// { heading: "Stats", route:"apps.stats", active:false },
		];

		$scope.$on("$stateChangeSuccess", function() {
			$scope.tabs.forEach(function(tab) {
				tab.active = $scope.active(tab.route);
			});
		});


	});
