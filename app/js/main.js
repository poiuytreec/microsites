/***
 Agave ToGo Microsite Main Script
 ***/
var AgaveToGo = angular.module("AgaveToGo", [
    'AgavePlatformScienceAPILib',
    'angular-cache',
    'angularMoment',
    'angularUtils.directives.dirPagination',
    'jsonFormatter',
    'ngCookies',
    'ngSanitize',
    'ngStorage',
    'ngAnimate',
    'oauth',
    'ngMd5',
    'oc.lazyLoad',
    'ui.bootstrap',
    'ui.router',
    'ui.select',
    'CommonsService',
    'MessageService',
    'ActionsService',
    'RolesService',
    'TagsService',
    'PermissionsService',
    'pascalprecht.translate',
    'schemaForm',
    'schemaFormWizard',
    'timer',
    'toastr',
    'ngPasswordStrength'
]).service('NotificationsService',['$rootScope', '$localStorage', 'MetaController', 'toastr', function($rootScope, $localStorage, MetaController, toastr){
    if (typeof $localStorage.tenant !== 'undefined' && typeof $localStorage.activeProfile !== 'undefined' && $localStorage.activeProfile) {
        this.client = new Fpp.Client('https://48e3f6fe.fanoutcdn.com/fpp');
        this.channel = this.client.Channel($localStorage.tenant.code + '/' + $localStorage.activeProfile.username);
        this.channel.on('data', function (data) {
            var message = {};
            if (data.event === 'FORCED_EVENT'){
                toastData = 'FORCED_ EVENT - ' + data.source;
            } else {
                if ('app' in data.message){
                    toastData = 'APP - ' + data.event;
                    toastr.info(toastData);
                } else if ('file' in data.message){
                    toastData = 'FILE - ' + data.event;
                } else if ('job' in data.message) {
                    toastData = 'JOB - ' + data.event;
                } else if ('system' in data.message){
                    toastData = 'SYSTEM - ' + data.event;
                } else {
                    toastData = data.event;
                }
            }

            toastr.info(toastData);
        });
    } else {
        App.alert(
            {
                type: 'danger',
                message: 'Error: Invalid Credentials'
            }
        );
    }

}]);


/**********************************************************************/
/**********************************************************************/
/***                                                                ***/
/***            Agave ToGo Microsite global settings                ***/
/***                                                                ***/
/**********************************************************************/
/**********************************************************************/
AgaveToGo.factory('settings', ['$rootScope', function($rootScope) {
    // supported languages
    var settings = {
        storageSystemId: 'data.agaveapi.co',
        appId: 'fork-1.0',
        //appId: 'cloud-runner-0.1.0',
        // appId: 'wc-osg-1.0.0',
        tenantId: 'agave.prod',
        oauth: {
            clients: OAuthClients,
            scope: 'PRODUCTION'
        },
        tenants: {},
        layout: {
            pageSidebarClosed: false, // sidebar menu state
            pageContentWhite: true, // set page content layout
            pageBodySolid: false, // solid body color state
            pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
        },
        assetsPath: '../assets',
        globalPath: '../assets/global',
        layoutPath: '../assets/layouts/compute',
    };

    $rootScope.settings = settings;

    return settings;
}]);

/***************************************************
 * Agave ToGo Microsite - AngularJS App Main Script
 *
 * Don't edit unless you know what you're doing
 ***************************************************/

/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
AgaveToGo.config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        debug: true,
        modules: [
            {
                name: "ui.codemirror",
                files: [
                    "../bower_components/codemirror/lib/codemirror.css",
                    "../bower_components/codemirror/theme/neo.css",
                    "../bower_components/codemirror/lib/codemirror.js",
                    "../bower_components/angular-ui-codemirror/ui-codemirror.min.js"
                ]
            }]
    });
}]);

AgaveToGo.config(function(toastrConfig) {
    angular.extend(toastrConfig, {
        allowHtml: false,
        autoDismiss: true,
        closeButton: true,
        maxOpened: 0,
        newestOnTop: true,
        positionClass: 'toast-top-right',
        preventDuplicates: false,
        preventOpenDuplicates: false,
        templates: {
            toast: 'directives/toast/toast.html',
            progressbar: 'directives/progressbar/progressbar.html'
        },
        timeOut: 5000
    });
});

AgaveToGo.config(function($locationProvider) {
    $locationProvider.html5Mode({
        enabled: false,
        //hashPrefix: '!',
        required: false
    });
});

AgaveToGo.config(function($translateProvider) {
    $translateProvider.translations('en', {
        error_apps_add: 'Error: Could not submit app',
        error_apps_details: 'Error: Could not retrieve app',
        error_apps_edit: 'Error: Could not edit app',
        error_apps_edit_permission: 'Error: User does not have permission to edit app',
        error_apps_files_select: 'Could not find a default system to browse files. Please specify a default system',
        error_apps_form: 'Error: Invalid form. Please check all fields',
        error_apps_permissions: 'Error: Could not retreive app permissions',
        error_apps_permissions_update: 'Error: Could not update app permissions',
        error_apps_search: 'Error: Could not retrieve apps',
        error_apps_template: 'Error: Could not retrieve app template',

        error_files_list: 'Error: Could not list files for the given system and path',

        error_jobs_create: 'Error: Could not submit job',
        error_jobs_details: 'Error: Could not retrieve job',
        error_jobs_list: 'Error: Could not retrieve jobs',

        error_monitors_add: 'Error: Could not add monitor',
        error_monitors_list: 'Error: Could not retrieve monitor',
        error_monitors_search: 'Error: Could not retrieve monitors',
        error_monitors_test: 'Error: Could not test monitor',
        error_monitors_update: 'Error: Could not update monitor',

        error_monitors_checks_id: 'Error: Please provide a monitor id',
        error_monitors_checks_search: 'Error: could not retrieve monitor checks',

        error_notifications_add: 'Error: Could not add notification',
        error_notifications_alerts: 'Error: Could not retrieve notification alerts',
        error_notifications_list: 'Error: Could not retrieve notification',
        error_notifications_search: 'Error: Could not retrieve notifications',
        error_notifications_test: 'Error: Could not test notification',
        error_notifications_update: 'Error: Could not update notification',

        error_profiles_list: 'Error: Could not retrieve profile',

        error_systems_add: 'Error: Could not create system',
        error_systems_default: 'Error: Could not set default system',
        error_systems_edit: 'Error: Could not edit system',
        error_systems_edit_permission: 'Error: User does not have permission to edit system',
        error_systems_form: 'Error: Invalid form. Please check all fields',
        error_systems_list: 'Error: Could not retrieve system',
        error_systems_roles: 'Error: Could not retrieve roles',
        error_systems_roles_update: 'Error: Could not update roles',
        error_systems_search: 'Error: Could not retrieve systems',
        error_systems_template: 'Error: Could not retrieve system template',

        error_tenant_list: 'Error: Could not retrieve tenant info',
        error_profile_get: 'Failed to fetch user profile',

        success_apps_permissions_update: 'Success: updated permissions for ',

        success_files_permissions_update: 'Success updating file permissions',

        success_monitors_test: 'Success: fired monitor ',
        success_monitors_update: 'Success: updated ',

        success_notifications_add: 'Success: added ',
        success_notifications_test: 'Success: fired notification ',
        success_notifications_update: 'Success: updated ',



        success_systems_roles: 'Success: updated roles for ',
        setDefault: 'set to default',
        unsetDefault: 'unset default'
    });

    $translateProvider.preferredLanguage('en');
});

/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
AgaveToGo.config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        debug: true,
        modules: [
            {
                name: "ui.codemirror",
                files: [
                    "../bower_components/codemirror/lib/codemirror.css",
                    "../bower_components/codemirror/theme/neo.css",
                    "../bower_components/codemirror/lib/codemirror.js",
                    "../bower_components/angular-ui-codemirror/ui-codemirror.min.js"
                ]
            }]
    });
}]);

AgaveToGo.constant('angularMomentConfig', {
    timezone: 'America/Chicago' // optional
});

AgaveToGo.config(function($locationProvider) {
    $locationProvider.html5Mode({
        enabled: false,
        //hashPrefix: '!',
        required: false
    });
});

//AngularJS v1.3.x workaround for old style controller declarition in HTML
AgaveToGo.config(['$controllerProvider', function($controllerProvider) {
    // this option might be handy for migrating old apps, but please don't use it
    // in new ones!
    $controllerProvider.allowGlobals();
}]);

/********************************************
 END: BREAKING CHANGE in AngularJS v1.3.x:
 *********************************************/

/* Setup App Main Controller */
AgaveToGo.controller('AppController', ['$scope', '$rootScope', function($scope, $rootScope) {
    $scope.$on('$viewContentLoaded', function() {
        App.initComponents(); // init core components
        //Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive
    });

    $scope.$on('oauth:login', function(event, token) {
        console.log('AppController: Authorized third party app with token', token.access_token);
    });

    $scope.$on('oauth:logout', function(event) {
        console.log('AppController: The user has signed out');
    });

    $scope.$on('oauth:loggedOut', function(event) {
        console.log('AppController: The user is not signed in');
    });

    $scope.$on('oauth:denied', function(event) {
        console.log('AppController: The user did not authorize the third party app');
    });

    $scope.$on('oauth:expired', function(event) {
        console.log('AppController: The access token is expired. Please refresh.');
    });

    $scope.$on('oauth:profile', function(profile) {
        console.log('AppController: User profile data retrieved: ', profile);
    });
}]);

/***
 Layout Partials.
 By default the partials are loaded through AngularJS ng-include directive. In case they loaded in server side(e.g: PHP include function) then below partial
 initialization can be disabled and Layout.init() should be called on page load complete as explained above.
 ***/

/* Setup Layout Part - Header */
AgaveToGo.controller('HeaderController', ['$scope', '$localStorage', '$timeout', '$filter', 'settings', 'StatusIoController', 'JobsController', 'moment', 'amMoment', 'Commons', 'ProfilesController', function($scope, $localStorage, $timeout, $filter, settings, StatusIoController, JobsController, moment, amMoment, Commons, ProfilesController) {

    $scope.authenticatedUser = $localStorage.activeProfile;
    $scope.tenant = settings.tenants[0];

    $scope.tokenCountdown = 0;
    // update current countdown time until token expires
    if (typeof $localStorage.token !== 'undefined'){
        var currentDate = new Date();
        var expirationDate = Date.parse($localStorage.token.expires_at) || currentDate;
        var diff = Math.abs((expirationDate - currentDate) / 60000);
        $scope.tokenCountdown = diff * 60;
    }

    // default and refresh incoming messages
    $scope.minbox = {
        count: 0,
        last_updated: new Date(),
        items: []
    };

    $scope.activeTasks = [];

    $scope.authToken = $localStorage.token;
    $scope.loggedIn = (!!$scope.authToken) && (moment($scope.authToken.expires_at).diff(moment()) > 0);

    if ($scope.loggedIn) {
        JobsController.searchJobs('status.in=CLEANING_UP,ARCHIVING,RUNNING,PAUSED,QUEUED,PENDING,STAGING_INPUTS,STAGING_JOB,SUBMITTING,PROCESSING_INPUTS,STAGED&filter=id,name,startTime,endTime,created,submitTime,status,owner&appId.eq=' + settings.appId).then(
            function (jobs) {
                var tasks = [];
                angular.forEach(jobs, function (job, index) {
                    return 25;

                    $timeout(function () {
                        // if (stagingStartTime) {
                        //     job.progress = (stagingStartTime - createTime) / totalTime;
                        // }
                        //
                        // if (stagingEndTime) {
                        //     job.progress = (stagingEndTime - stagingStartTime) / totalTime;
                        // }
                        //
                        // if (runStartTime) {
                        //     job.progress = (runStartTime - stagingEndTime) / totalTime;
                        // }
                        //
                        // if (runEndTime) {
                        //     job.progress = (runEndTime - runStartTime) / totalTime;
                        // }
                        //
                        // if (archiveEndTime) {
                        //     job.progress = (archiveEndTime - archiveStartTime) / totalTime;
                        // }
                        job.progress = 25;
                        $scope.activeTasks.push(job);
                    }, 50);
                });
            });
    }

    $scope.$watch(function () { return $localStorage.activeProfile; },function(newProfile,oldProfile){
        $timeout(function() {
            if (newProfile !== $scope.activeProfile) {
                $scope.activeProfile = newProfile;
            }
        }, 50);
    });

    // default and refresh the platform status feed
    $scope.platformStatus = { status:'Up', statusCode: 100, incidents: [], issues:[]};

    StatusIoController.listStatuses().then(

        function(data) {
            var issues = [];
            for (var i=0; i<data.result.status.length; i++) {
                if (data.result.status[i].status_code !== 100) {
                    issues.push({
                        "component": data.result.status[i].name,
                        "container": data.result.status[i].containers[0].name,
                        "status": data.result.status[i].status,
                        "statusCode" : data.result.status[i].status_code,
                        "updated": data.result.status[i].updated
                    });
                }
            }
            setTimeout(function() {
                $scope.platformStatus.incidents = data.result.incidents;
                $scope.platformStatus.status = data.result.status_overall.status;
                $scope.platformStatus.statusCode = data.result.status_overall.status_code;
                $scope.platformStatus.issues = issues;

            }, 0);

        },
        function(data) {

        }
    );

    $scope.$on('$includeContentLoaded', function() {
        Layout.initHeader(); // init header

        $timeout(function() {
            $scope.tenant = settings.tenants[0];
        }, 500);
    });
}]);

/* Setup Layout Part - Sidebar */
AgaveToGo.controller('SidebarController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initSidebar($state); // init sidebar
    });
}]);

/* Setup Layout Part - Sidebar */
AgaveToGo.controller('PageHeadController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Demo.init(); // init theme panel
    });
}]);

/* Setup Layout Part - Theme Panel */
AgaveToGo.controller('ThemePanelController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Demo.init(); // init theme panel
    });
}]);

/* Setup Layout Part - Footer */
AgaveToGo.controller('FooterController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initFooter(); // init footer
    });
}]);

/* Setup Rounting For All Pages */
AgaveToGo.config(['$stateProvider', '$urlRouterProvider', '$urlMatcherFactoryProvider', function($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {

    function valToString(val) { return val != null ? val.toString() : val; }
    function valFromString(val) { return val != null ? val.toString() : val; }
    function regexpMatches(val) { /*jshint validthis:true */ return this.pattern.test(val); }

    // Redirect any unmatched url
    $urlRouterProvider.otherwise("/404");

    $urlRouterProvider.rule(function ($injector, $location) {
        var path = $location.path().replace(/\/\/+/g, '/');
        $location.replace().path(path);
    });

    // Make trailing slashed options
    $urlMatcherFactoryProvider.strictMode(false);

    $stateProvider


        /**********************************************************************/
        /**********************************************************************/
        /***                                                                ***/
        /***                   Static Page Routes                           ***/
        /***                                                                ***/
        /**********************************************************************/
        /**********************************************************************/
        // Landing page
        .state('home', {
            url: "/",
            templateUrl: "views/home.html",
            data: {pageTitle: 'Welcome', pageSubTitle: 'Agave ToGo Microsite - Compute Edition'},
            controller: "HomeController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'AgaveToGo',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'js/controllers/HomeController.js',
                        ]
                    });
                }]
            }
        })

        .state('welcome', {
            url: "/home",
            templateUrl: "views/home.html",
            data: {pageTitle: 'Welcome', pageSubTitle: 'Agave ToGo Microsite - Compute Edition'},
            controller: "HomeController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'AgaveToGo',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'js/controllers/HomeController.js',
                        ]
                    });
                }]
            }
        })

        // 404 Page
        .state('fourofour', {
            url: "/404",
            templateUrl: "views/404.html",
            data: {pageTitle: 'Page Not Found'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'AgaveToGo',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/pages/css/error.min.css',
                            'js/controllers/GeneralPageController.js',
                        ]
                    });
                }]
            }
        })

        // 500 Page
        .state('fivehundred', {
            url: "/500",
            templateUrl: "views/500.html",
            data: {pageTitle: 'Server Error'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'AgaveToGo',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/pages/css/error.min.css',
                            'js/controllers/GeneralPageController.js'
                        ]
                    });
                }]
            }
        })

        // faq Page
        .state('faq', {
            url: "/faq",
            templateUrl: "views/support/faq.html",
            data: {pageTitle: 'FAQ'},
            controller: "FAQPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'AgaveToGo',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/pages/css/faq.min.css',
                            'js/controllers/support/FAQPageController.js'
                        ]
                    });
                }]
            }
        })

        /**********************************************************************/
        /**********************************************************************/
        /***                                                                ***/
        /***                       About Page Routes                        ***/
        /***                                                                ***/
        /**********************************************************************/
        /**********************************************************************/

        // About Page
        .state('about', {
            url: "/about",
            templateUrl: "views/about/main.html",
            data: {pageTitle: 'About', pageSubTitle: 'Agave ToGo Microsites'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'AgaveToGo',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/pages/css/about.css',
                            'js/controllers/GeneralPageController.js'
                        ]
                    });
                }]
            }
        })

        // About Page
        .state('about.platform', {
            url: "/platform",
            templateUrl: "views/about/platform.html",
            data: {pageTitle: 'The Agave Platform'}
        })

        // About Page
        .state('about.togo', {
            url: "/togo",
            templateUrl: "views/about/togo.html",
            data: {pageTitle: 'Agave ToGo'}
        })

        /**********************************************************************/
        /**********************************************************************/
        /***                                                                ***/
        /***                          Auth Routes                           ***/
        /***                                                                ***/
        /**********************************************************************/
        /**********************************************************************/

        // Auth redirect
        .state('access_token', {
            url: "/access_token=:accessToken",
            templateUrl: "",
            data: {pageTitle: 'OAuth Redirect'},
            controller: function ($location, $rootScope, $scope, AccessToken, Storage, ProfilesController, $localStorage, Configuration, Storage) {
                $scope.refreshing = true;
                var hash = $location.path().substr(1);
                Storage.use('localStorage');
                AccessToken.setTokenFromString(hash);

                $rootScope.$broadcast('oauth:login', AccessToken.get());

                // Configuration.oAuthAccessToken = $localStorage.token ? $localStorage.token.access_token : '';
                // Configuration.BASEURI = $localStorage.tenant ? $localStorage.tenant.baseUrl : '';

                $location.path("/home");
                $location.replace();
                $scope.refreshing = false;
            }
        })

        // Login
        .state('login', {
            url: "/login",
            templateUrl: "views/auth/login.html",
            data: {pageTitle: 'Login'},
            controller: "LoginController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'AgaveAuth',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'js/controllers/auth/LoginController.js',
                        ]
                    });
                }]
            }
        })

        // Logout
        .state('logout', {
            url: "/logout",
            templateUrl: "views/auth/logout.html",
            data: {pageTitle: 'Logout'},
            controller: "LogoutController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'AgaveAuth',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'js/controllers/auth/LogoutController.js',
                        ]
                    });
                }]
            }
            // controller: function ($location, $localStorage, Configuration) {
            //     delete $localStorage.activeProfile;
            //     delete $localStorage.token;
            //
            //     // window.location.href = "#/login";
            //     $location.path("/login");
            //     $location.replace();
            // }
        })

        /**********************************************************************/
        /**********************************************************************/
        /***                                                                ***/
        /***                       Apps Routes                              ***/
        /***                                                                ***/
        /**********************************************************************/
        /**********************************************************************/

        .state("apps", {
            abtract: true,
            url:"/apps",
            templateUrl:"views/apps/resource/resource.html",
            controller: "AppsResourceController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            name: 'AgaveToGo',
                            files: [
                                'js/controllers/apps/resource/AppsResourceController.js'
                            ]
                        }
                    ]);
                }]
            }
        })

        .state("apps-slash", {
            abtract: true,
            url:"/apps/",
            templateUrl:"views/apps/resource/resource.html",
            controller: "AppsResourceController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            name: 'AgaveToGo',
                            files: [
                                'js/controllers/apps/resource/AppsResourceController.js'
                            ]
                        }
                    ]);
                }]
            }
        })

        .state("apps.details", {
            url: "/details",
            templateUrl: "views/apps/resource/details.html",
            controller: "AppsResourceDetailsController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            serie: true,
                            name: 'AgaveToGo',
                            files: [
                                'js/services/ActionsService.js',
                                'js/services/MessageService.js',
                                'js/services/PermissionsService.js',
                                'js/controllers/apps/resource/AppsResourceDetailsController.js'
                            ]
                        }
                    ]);
                }]
            }
        })

        .state("apps.stats", {
            url: "/stats",
            controller: "AppsResourceStatsController",
            templateUrl: "views/apps/resource/stats.html",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            name: 'AgaveToGo',
                            files: [
                                'js/controllers/apps/resource/AppsResourceStatsController.js'
                            ]
                        }
                    ]);
                }]
            }
        })

        .state("apps.run", {
            url: "/run",
            controller: "AppsResourceRunController",
            templateUrl: "views/apps/resource/job-form.html",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            serie: true,
                            name: 'AgaveToGo',
                            files: [
                                '../bower_components/underscore/underscore-min.js',
                                'js/services/MessageService.js',
                                'js/controllers/apps/resource/AppsResourceRunController.js',
                                "js/controllers/data/FileExplorerController.js"
                            ]
                        }
                    ]);
                }]
            }
        })

        /**********************************************************************/
        /**********************************************************************/
        /***                                                                ***/
        /***                       Jobs Routes                              ***/
        /***                                                                ***/
        /**********************************************************************/
        /**********************************************************************/

        .state('jobs-manage', {
            url: "/jobs",
            templateUrl: "views/jobs/manager.html",
            data: {pageTitle: 'Jobs Management', pageSubTitle: 'Manage your private collection of jobs'},
            controller: "JobsDirectoryController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        serie: true,
                        name: 'AgaveToGo',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            //'../bower_components/datatables/media/css/dataTables.bootstrap.min.css',
                            //'../bower_components/datatables/media/css/jquery.dataTables.min.css',
                            //
                            //'../bower_components/datatables/media/js/dataTables.bootstrap.js',
                            //'../bower_components/datatables/media/js/jquery.dataTables.js',
                            '../assets/global/scripts/datatable.js',
                            '../bower_components/holderjs/holder.js',
                            'js/services/ActionsService.js',
                            'js/services/MessageService.js',
                            'js/services/PermissionsService.js',
                            'js/services/RolesService.js',
                            'js/controllers/QueryBuilderController.js',
                            'js/controllers/jobs/JobsDirectoryController.js'
                        ]
                    });
                }]
            }
        })

        .state("jobs", {
            abtract: true,
            url:"/jobs/:id",
            templateUrl:"views/jobs/resource/resource.html",
            controller: "JobsResourceController",
            data: {pageTitle: 'Job Details', pageSubTitle: 'View details access data for a single job'},
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            name: 'AgaveToGo',
                            files: [
                                'js/controllers/jobs/resource/JobsResourceController.js'
                            ]
                        }
                    ]);
                }]
            }
        })

        .state("jobs.details", {
            url: "",
            templateUrl: "views/jobs/resource/details.html",
            controller: "JobsResourceDetailsController",
            data: {pageTitle: 'Job Details', pageSubTitle: 'View details access data for a single job'},
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            name: 'AgaveToGo',
                            files: [
                                'js/services/ActionsService.js',
                                'js/services/MessageService.js',
                                'js/services/PermissionsService.js',
                                'js/controllers/jobs/resource/JobsResourceDetailsController.js'
                            ]
                        }
                    ]);
                }]
            }
        })

        .state("jobs.history", {
            url: "/history",
            controller: "JobsResourceHistoryController",
            templateUrl: "views/jobs/resource/history.html",
            data: {pageTitle: 'Job History', pageSubTitle: 'View the event history of a single job'},
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            name: 'AgaveToGo',
                            files: [
                                'js/services/ActionsService.js',
                                'js/controllers/jobs/resource/JobsResourceHistoryController.js'
                            ]
                        }
                    ]);
                }]
            }
        })

        // .state("jobs.stats", {
        //     url: "/jobs",
        //     controller: "JobsResourceStatsController",
        //     templateUrl: "views/jobs/resource/stats.html",
        //     data: {pageTitle: 'Job Stats'},
        //     resolve: {
        //         deps: ['$ocLazyLoad', function($ocLazyLoad) {
        //             return $ocLazyLoad.load([
        //                 {
        //                     name: 'AgaveToGo',
        //                     files: [
        //                         'js/controllers/jobs/resource/JobsResourceStatsController.js'
        //                     ]
        //                 }
        //             ]);
        //         }]
        //     }
        // })

        /**********************************************************************/
        /**********************************************************************/
        /***                                                                ***/
        /***                      Files Routes                              ***/
        /***                                                                ***/
        /**********************************************************************/
        /**********************************************************************/

        // TO-DO: need to improve this with redirect
        .state('data-explorer-noslash', {
            url: "/data/explorer/:systemId",
            templateUrl: "views/data/explorer.html",
            data: { pageTitle: 'File Explorer' },
            controller: "FileExplorerController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            serie: true,
                            name: 'AgaveToGo',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                "js/services/MessageService.js",
                                "js/controllers/data/FileExplorerController.js"
                            ]
                        }
                    ]);
                }]
            }
        })

        // AngularJS plugins
        .state('data-explorer', {
            url: "/data/explorer/:systemId/{path:any}",
            templateUrl: "views/data/explorer.html",
            data: { pageTitle: 'File Explorer' },
            controller: "FileExplorerController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            serie: true,
                            name: 'AgaveToGo',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                /********* File Manager ******/
                                "js/services/MessageService.js",
                                "js/controllers/data/FileExplorerController.js"
                            ]
                        }
                    ]);
                }]
            }
        })

        /**********************************************************************/
        /**********************************************************************/
        /***                                                                ***/
        /***                    Profiles Routes                             ***/
        /***                                                                ***/
        /**********************************************************************/
        /**********************************************************************/

        // User Profile
        .state("profile", {
            url: "/profile",
            templateUrl: "views/profiles/main.html",
            data: {pageTitle: 'User Profile'},
            controller: "UserProfileController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'AgaveToGo',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/pages/css/profile.css',
                            '../assets/pages/css/search.css',
                            'js/controllers/profiles/UserProfileController.js'
                        ]
                    });
                }]
            }
        })


        // User Profile Account
        .state("profile.account", {
            url: "/account",
            templateUrl: "views/profiles/account.html",
            data: {pageTitle: 'User Account'}
        })

        // User Profile Search
        .state("profile.search", {
            url: "/search",
            templateUrl: "views/profiles/search.html",
            data: {pageTitle: 'Directory Search'}
        })



}]);

/* Init global settings and run the app */
AgaveToGo.run(['$rootScope', 'settings', '$state', '$http', '$templateCache', '$localStorage', '$window', '$location', '$timeout', 'CacheFactory', 'NotificationsService', 'ProfilesController', 'TenantsController', 'MessageService', '$translate', 'Configuration', 'Storage', function($rootScope, settings, $state, $http, $templateCache, $localStorage, $window, $location, $timeout, CacheFactory, NotificationsService, ProfilesController, TenantsController, MessageService, $translate, Configuration, Storage) {
    $rootScope.$state = $state; // state to be accessed from view
    $rootScope.$settings = settings; // state to be accessed from view

    Storage.use('localStorage');

    // Init the SDK token and base url based on previous auth info stored in $localStorage.
    // If this isn't set, the user will get redirected to the login page and this will be
    // set again with valid info on the redirect back from the oauth server.
    // Configuration.oAuthAccessToken = $localStorage.token ? $localStorage.token.access_token : '';
    // Configuration.BASEURI = $localStorage.tenant ? $localStorage.tenant.baseUrl : '';

    // ProfilesController.getProfile('me').then(
    //     function(profile) {
    //         console.log('success getting profile');
    //         $localStorage.activeProfile = profile;
    //         // $rootScope.$broadcast('oauth:profile', profile);
    //         // $location.path("/home");
    //         // $location.replace();
    //     },
    //     function(response) {
    //         console.log('could not get profile');
    //         // MessageService.handle(response, $translate.instant('error_profile_get'));
    //         //
    //         // $localStorage.activeProfile = null;
    //         // $location.path("/500");
    //         // $location.replace();
    //     }
    // );

    TenantsController.listTenants().then(
        function (response) {
            var validTenants = [];
            angular.forEach(response, function (tenant, key) {
                if (settings.oauth.clients[tenant.code] &&
                    settings.oauth.clients[tenant.code].clientKey)
                {
                    validTenants[tenant.code] = tenant;
                    Configuration.setBaseUri(tenant.baseUrl);
                    $localStorage.tenant = tenant;
                    return false;
                }
            });

            $timeout(function() {
                settings.tenants = validTenants;
            }, 10);
        }
    );

    $http.defaults.cache = CacheFactory('defaultCache', {
        maxAge: 24 * 60 * 60 * 1000, // Items added to this cache expire after 1 day
        cacheFlushInterval: 30 * 24 * 60 * 60 * 1000, // This cache will clear itself every 30 days
        deleteOnExpire: 'aggressive', // Items will be deleted from this cache when they expire
        storageMode: 'localStorage'
    });

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
        // Temp fix until I find better solution
        // This is to avoid changing url location on filemanager promise returns
        if ((fromState.name === 'data-explorer-noslash' || fromState.name === 'data-explorer') && (toState.name !== 'data-explorer-noslash' || toState.name !== 'data-explorer')){
            $rootScope.locationChange = false;
        } else {
            $rootScope.locationChange = true;
        }

        if (typeof $localStorage.tenant !== 'undefined' && typeof $localStorage.token !== 'undefined'){
            var currentDate = new Date();
            var expirationDate = Date.parse($localStorage.token.expires_at);
            var diff = (expirationDate - currentDate) / 60000;
            if (diff < 0) {
                $location.path("/logout");
                $location.replace();
            }
        } else {
            var authToken = $localStorage.token;
            var loggedin = (authToken && (moment(authToken.expires_at).diff(moment()) <= 0));

            if (typeof loggedin == undefined) {
                $location.path("/logout");
                $location.replace();
            }
        }
    });

    $rootScope.$on('oauth:login', function(event, token) {
        $localStorage.token = token;

        Configuration.setToken($localStorage.token.access_token);


        ProfilesController.getProfile('me').then(
            function(profile) {
                console.log('oauth:login - success getting profile');
                $localStorage.activeProfile = profile;
                // $rootScope.$broadcast('oauth:profile', profile);
                // $location.path("/home");
                // $location.replace();
            },
            function(response) {
                console.log('oauth:login - could not get profile');
                MessageService.handle(response, $translate.instant('error_profile_get'));
                // $location.path("/home");
                // $localStorage.activeProfile = null;
                // $location.path("/500");
                // $location.replace();
            }
        );
    });

    // $rootScope.$on('oauth:logout', function(event) {
    // });
    //
    // $rootScope.$on('oauth:loggedOut', function(event) {
    // });
    //
    // $rootScope.$on('oauth:denied', function(event) {
    //     //$location.href("/login");
    // });
    //
    // $rootScope.$on('oauth:expired', function(event) {
    //     //$location.href("/login");
    // });

    // $rootScope.$on('oauth:profile', function(event, profile) {
    //     $timeout(function() {
    //         $localStorage.activeProfile = profile;
    //     }, 0);
    // });
}]);
