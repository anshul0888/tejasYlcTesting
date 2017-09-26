
var app = angular.module('com.ylc.core');

app.factory('ExperienceListing',['$http','YLC_API',
    function($http,YLC_API){
        var Orders = {
            find : function () {
                var req = {
                    method: 'GET',
                    url: YLC_API + 'experience_listings/'
                };
                return $http(req);
            },
            create : function (data) {
                var req = {
                    method: 'POST',
                    url: YLC_API + 'experience_listings',
                    data: data
                };
                return $http(req);
            },
            update : function (id, data) {
                var req = {
                    method: 'PUT',
                    url: YLC_API + 'experience_listings/' + id,
                    data: data
                };
                return $http(req);
            },
            remove : function (id) {
                return;
            },
            get : function (id) {
                var req = {
                    method: 'GET',
                    url: YLC_API + 'experience_listings/' + id
                };
                return $http(req);
            }
        };
        return Orders;

}]);
