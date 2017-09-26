/**
 * Created by TJ on 10/9/15.
 */
(function() {
    angular.module('com.ylc.twilio', [])
        .factory('TwilioService',[ '$http', '$q','Yumigo_API', function($http, $q,Yumigo_API){
            // var server = 'http://yourlocalcousin.herokuapp.com/ipmessagings/';
            // var server = 'http://localhost:3030/ipmessagings/';
            var server = Yumigo_API + 'ipmessagings/';
            var accessToken = {
                getAccessToken : function(uid) {

                    var deferred = $q.defer();
                    $http.get(server + uid + '/?_=' + Date.now()).success(function(data) {
                        deferred.resolve(data);
                    });

                    return deferred.promise;
                }
            }

            return accessToken;
            
        }]);
})();
