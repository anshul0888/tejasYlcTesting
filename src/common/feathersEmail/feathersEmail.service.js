/**
 * Created by TJ on 8/27/15.
 */

(function() {
    angular.module('com.ylc.feathersEmail', [])
        .factory('FeathersEmail', ['$http', 'YLC_API',
            function($http, YLC_API) {
                var Emails = {
                    find: function() {
                        var req = {
                            method: 'GET',
                            url: YLC_API + 'emails/'
                        };
                        return $http(req);
                    },
                    create: function(data) {
                        var req = {
                            method: 'POST',
                            url: YLC_API + 'emails',
                            data: data
                        };
                        return $http(req);
                    },
                    update: function(id, data) {
                        var req = {
                            method: 'PUT',
                            url: YLC_API + 'emails/' + id,
                            data: data
                        };
                        return $http(req);
                    },
                    remove: function(id) {
                        return;
                    },
                    get: function(id) {
                        var req = {
                            method: 'GET',
                            url: YLC_API + 'emails/' + id
                        };
                        return $http(req);
                    }
                };
                return Emails;

            }
        ]);
})();
