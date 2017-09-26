
var app = angular.module('com.ylc.dashboard');

app.factory('OrdersService',['$http','YLC_API',
    function($http,YLC_API){
        var Orders = {
            find : function () {
                var req = {
                    method: 'GET',
                    url: YLC_API + 'bookings/'
                };
                return $http(req);
            },
            create : function (data) {
                var req = {
                    method: 'POST',
                    url: YLC_API + 'bookings',
                    data: data
                };
                return $http(req);
            },
            update : function (id, data) {
                var req = {
                    method: 'PUT',
                    url: YLC_API + 'bookings/' + id,
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
                    url: YLC_API + 'bookings/' + id
                };
                return $http(req);
            }
        };
        return Orders;

}]);
