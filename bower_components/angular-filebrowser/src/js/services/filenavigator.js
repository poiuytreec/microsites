(function(angular) {
    "use strict";
    angular.module('FileManagerApp').service('fileNavigator', [
        '$http', '$q', '$rootScope', 'fileManagerConfig', 'FilesController', 'fileItem', '$localStorage', function ($http, $q, $rootScope, fileManagerConfig, FilesController, fileItem, $localStorage) {

        var FileNavigator = function(system, path) {
            this.requesting = false;
            this.fileList = [];
            this.fileListSelected = [];
            this.system = system;
            this.crumbsPath = '';
            // if the system is present, we set the current path or default to the system.storage.homeDir as
            // an absolute (virtual) path.
            if (system) {
                if (path) {
                    if (path[0] === '/') {
                        this.currentPath = path.split('/').splice(1);
                    } else {
                        this.currentPath = path.split('/');
                    }
                } else {
                    if (system.storage.homeDir[0] === '/') {
                        this.currentPath = system.storage.homeDir.split('/')[1];
                    } else {
                        this.currentPath = system.storage.homeDir.split('/')
                    }
                }
            } else if (path) {
                if (path[0] === '/') {
                    this.currentPath = path.split('/').splice(1);
                } else {
                    this.currentPath = path.split('/');
                }
            } else {
                this.currentPath = [];
            }

            this.history = [];
            this.error = '';

        };

        FileNavigator.prototype.deferredHandler = function(data, deferred, defaultMsg) {
            if (!data || typeof data !== 'object') {
                this.error = data;
            }
            //if (!this.error && data && data.error) {
            //    this.error = data.result.error;
            //}
            //if (!this.error && data.error) {
            //    this.error = data.error.message;
            //}
            //if (!this.error && defaultMsg) {
            //    this.error = defaultMsg;
            //}
            if (this.error) {
                return deferred.reject(data);
            }
            return deferred.resolve(data);
        };

        FileNavigator.prototype.list = function() {
            var self = this;
            var deferred = $q.defer();
            var path = '';
            self.requesting = true;
            self.fileList = [];
            self.error = '';

            if (!self.system) {
                return $q(function(resolve, reject) {
                    setTimeout(function() {
                        reject("No system selected. Please select a valid system to browse.");
                    }, 50);
                });
            } else {
                if (self.currentPath.length) {
                    path = self.currentPath.join('/');
                }  else {
                    path = "";
                }

                FilesController.listFileItems(self.system.id, path, 999999, 0)
                    .then(function (data) {
                        self.deferredHandler(data, deferred);
                    }, function (data) {
                        // need to modify angularjs-sdk to return proper messages here
                        self.error = 'Could not list files for this path';
                        self.deferredHandler(data, deferred, 'Unknown error listing, check the response');
                    })['finally'](function (data) {
                    self.requesting = false;
                });

                return deferred.promise;
            }
        };

        FileNavigator.prototype.refresh = function() {
            var self = this;
            var path = self.currentPath.join('/');

            return self.list().then(function(data) {
                $rootScope.$broadcast('af:directory-change', self.system.id, decodeURIComponent(path));
                angular.forEach((data || []), function (file, key) {
                    if (file.name !== '.' && file.name !== '..' ) {
                        self.fileList.push(new fileItem(file, self.currentPath, self.system));
                    }
                });
                if (!self.crumbsPath){
                  if(self.fileList.length > 0){
                      self.crumbsPath = self.fileList[0].model.crumbsPath().slice(0, -1).splice(1);
                  } else {
                      self.crumbsPath = self.currentPath;
                  }
                }

                 // prepend root folder to fileList
                var rootItem = new fileItem();
                if (typeof self.fileList[0] !== 'undefined'){
                  angular.copy(self.fileList[0], rootItem);
                } else {
                  rootItem.model.path = self.currentPath;
                }
                rootItem.model.name = self.currentPath.length === 0 ? '' : self.currentPath[self.currentPath.length-1];
                rootItem.model.fileType = 'folder';
                rootItem.model.type = 'dir';
                rootItem.model.root = true;
                rootItem.tempModel = rootItem.model;
                self.fileList.unshift(rootItem);

                self.buildTree(path);
            });
        };

        FileNavigator.prototype.buildTree = function(path) {
            var self = this;
            function recursive(parent, item, path) {
                var absName = path ? (path + '/' + item.model.name) : item.model.name;
                if (parent.name.trim() && path.trim().indexOf(parent.name) !== 0) {
                    parent.nodes = [];
                }
                if (parent.name !== path) {
                    for (var i in parent.nodes) {
                        recursive(parent.nodes[i], item, path);
                    }
                } else {
                    for (var e in parent.nodes) {
                        if (parent.nodes[e].name === absName) {
                            return;
                        }
                    }
                    parent.nodes.push({item: item, name: absName, nodes: []});
                }
                parent.nodes = parent.nodes.sort(function(a, b) {
                    return a.name < b.name ? -1 : a.name === b.name ? 0 : 1;
                });
            };

            if (self.history.length){
              if (self.history[0].name !== "") {
              self.history = [];
                self.history.push({name: path, nodes: []})
              }
            } else {
              self.history.push({name: path, nodes: []});
            }

            for (var o in self.fileList) {
                var item = self.fileList[o];
                item.isFolder() && recursive(self.history[0], item, path);
            }
        };

        FileNavigator.prototype.folderClick = function(item) {
            var self = this;
            if (item && item.isFolder()) {
             // update if not root dir
             if (typeof item.model.root === 'undefined'){
                 self.currentPath = [];
                 self.currentPath = item.model.fullPath().split('/').splice(1);
                 self.crumbsPath = item.model.crumbsPath().splice(1);
              }
            }

            self.refresh();
        };

        FileNavigator.prototype.upDir = function() {
            var self = this;
            if (self.currentPath[0]) {
                self.currentPath = self.currentPath.slice(0, -1);
                self.crumbsPath = self.crumbsPath.slice(0, -1);
                self.refresh();
            }
        };

        FileNavigator.prototype.goHome = function() {
            var self = this;
            if (self.system.storage.homeDir[0] === '/') {
                self.currentPath = self.system.storage.homeDir.split('/')[1];
            } else {
                self.currentPath = self.system.storage.homeDir.split('/')
            }

            if (self.system.public) {
                if (self.currentPath.length) {
                    self.currentPath.push($localStorage.activeProfile.username);
                } else {
                    self.currentPath = [$localStorage.activeProfile.username];
                }
            }

            self.refresh();
        };

        FileNavigator.prototype.goTo = function(index) {
            var self = this;
            self.currentPath = self.currentPath.slice(0, index + 1);
            self.crumbsPath = self.crumbsPath.slice(0, index + 1);
            self.refresh();
        };

        FileNavigator.prototype.fileNameExists = function(fileName) {
            var self = this;
            for (var item in self.fileList) {
                item = self.fileList[item];
                if (fileName.trim && item.model.name.trim() === fileName.trim()) {
                    return true;
                }
            }
        };

        FileNavigator.prototype.listHasFolders = function() {
            var self = this;
            for (var item in self.fileList) {
                if (self.fileList[item].model.type === 'dir') {
                    return true;
                }
            }
        };

        return FileNavigator;
    }]);
})(angular);
