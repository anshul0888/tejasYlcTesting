/**
 * Created by TJ on 7/8/15.
 */

var app = angular.module('com.ylc.payments');

app.factory('Bookings',['$http','YLC_API',
    function($http,YLC_API){
        var Bookings = {
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
        return Bookings;

}]);
