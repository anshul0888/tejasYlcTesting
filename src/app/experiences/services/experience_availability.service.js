
var app = angular.module('com.ylc.experiences');

app.factory('ExperienceAvailability',['$http','YLC_API',
    function($http,YLC_API){
        var Orders = {
            find : function () {
                var req = {
                    method: 'GET',
                    url: YLC_API + 'experience_bookings/'
                };
                return $http(req);
            },
            create : function (data) {
                var req = {
                    method: 'POST',
                    url: YLC_API + 'experience_bookings',
                    data: data
                };
                return $http(req);
            },
            update : function (id, data) {
                var req = {
                    method: 'PUT',
                    url: YLC_API + 'experience_bookings/' + id,
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
                    url: YLC_API + 'experience_bookings/' + id
                };
                return $http(req);
            }
        };
        return Orders;

}]);
