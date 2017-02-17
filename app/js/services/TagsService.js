angular.module('TagsService',[]).service('TagsService', ['$rootScope', '$window', '$localStorage', '$q', 'Commons', function ($rootScope, $window, $localStorage, $q, Commons) {

    /**
     * Get a list of available tags.
     * @param {int|null} limit    Optional parameter: The maximum number of results returned from this query
     * @param {int|null} offset    Optional parameter: The number of results skipped in the result set returned from this query
     * @param {Dictionary} queryParameters    Optional parameter: Additional optional query parameters are supported by this endpoint
     *
     * @return {promise<array>}
     */
    this.listTags = function (limit, offset, queryParameters) {
        //Assign default values
        limit = limit || 100;
        offset = offset || 0;
        queryParameters = queryParameters || null;

        return $q(function(resolve, reject) {
            setTimeout(function() {
                var tags = $localStorage.tags;
                var matches = [];

                if (tags) {
                    if (queryParameters) {
                        $(tags).filter(function (tag) {
                            if (queryParameters.name) {
                                if (Commons.contains(tag, queryParameters.name)) {
                                    matches.push(tag);
                                }
                            } else if (queryParameters.id) {
                                if (queryParameters.ids.indexOf(tag.id) > -1) {
                                    matches.push(tag);
                                }
                            } else if (queryParameters.associatedUuid) {
                                if (tag.associatedUuids.indexOf(queryParameters.associatedUuid) > -1) {
                                    matches.push(tag);
                                }
                            }
                        })
                        resolve(matches.slice(offset, limit));
                    } else {
                        resolve(tags.slice(offset, limit));
                    }
                } else {
                    resolve([]);
                }
            }, 50);
        });
    };

    /**
     * Register new tags.
     * @param {Tag|null} body    Optional parameter: The description of the tag to add or update.
     *
     * @return {promise<Tag>}
     */
    this.addTag = function (tag) {

        return $q(function(resolve, reject) {
            setTimeout(function() {
                if (tag && tag.name) {
                    if ($localStorage.tags) {
                        //tag.id = Math.floor(Date.now()) + '-' + Math.floor(Math.random() * 1000000) + '-0001-061';
                        tag.owner = "dooley";
                        tag.created = Math.floor(Date.now()/1000);
                        tag.lastModified = tag.created;
                        tag.tenant = "iplantc.org";
                        $localStorage.tags.push(tag);
                        resolve(tag);
                    } else {
                        $localStorage.tags = [tag];
                        resolve(tag);
                    }
                } else {
                    reject("Please supply a valid tag name.");
                }
            }, 50);
        });
    };

    /**
     * Update tag.
     * @param {Tag|null} body    The description of the tag to add or update.
     *
     * @return {promise<Tag>}
     */
    this.updateTag = function (tag) {
        if (tag && !tag.associatedUuids) {
            return this.removeTag(tag.id);
        }
        return $q(function(resolve, reject) {
            setTimeout(function() {
                if (tag && tag.id) {
                    var found = false;
                    if ($localStorage.tags) {
                        for (var i = 0; i < $localStorage.tags.length; i++) {
                            if ($localStorage.tags[i].id == tag.id) {
                                tag.lastModified = Math.floor(Date.now()/1000);
                                $localStorage.tags[i] = tag;
                                found = true;
                                resolve(tag);
                                break;
                            }
                        }

                    }
                    if (!found) {
                        reject("No tag found with the given id");
                    }
                } else {
                    reject("No tag found with the given id");
                }
            }, 50);
        });
    };

    /**
     * Get details of an tag by it's unique id.
     * @param {string} appId    Required parameter: The id of the tag.
     *
     * @return {promise<Tag>}
     */
    this.getTagDetails = function (tagId) {

        return $q(function(resolve, reject) {
            setTimeout(function() {
                if (tagId) {
                    var tags = $localStorage.tags;
                    var tag;
                    if (tags) {
                        for (var i = 0; i < tags.length; i++) {
                            if (tags[i].id == tagId) {
                                tag = tags[i];
                                break;
                            }
                        }
                    }
                }

                if (tag) {
                    resolve(tag);
                } else {
                    reject("No tag found with the given id");
                }
            }, 50);
        });
    };

    /**
     * Delete a tag
     * @param {string} appId    Required parameter: The id of the tag.
     *
     * @return {promise<Tag>}
     */
    this.removeTag = function (tagId) {

        return $q(function(resolve, reject) {
            setTimeout(function() {
                if (tagId) {
                    var tags = $localStorage.tags;
                    var tag;
                    var found = false;
                    if (tags) {
                        for (var i = 0; i < tags.length; i++) {
                            if (tags[i].id == tagId) {
                                tags.splice(i, 1);
                                $localStorage.tags = tags;
                                found = true;
                                break;
                            }
                        }
                    }
                }

                if (found) {
                    resolve();
                } else {
                    reject("No tag found with the given id");
                }
            }, 50);
        });
    };
}]);