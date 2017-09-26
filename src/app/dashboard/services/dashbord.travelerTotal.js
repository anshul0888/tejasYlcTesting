/**
 * Created by TJ on 10/23/15.
 */

var app = angular.module('com.ylc.dashboard');

app.factory("ArrayWithSum", function($firebaseArray) {
    return $firebaseArray.$extend({
        sum: function() {
            var total = 0;
            angular.forEach(this.$list, function(rec) {
                total += rec.count;
            });
            return total;
        }
    });
});
