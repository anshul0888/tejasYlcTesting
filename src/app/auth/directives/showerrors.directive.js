/**
 * Created by TJ on 9/13/15.
 */
angular.module('com.ylc.auth')
    .directive('showErrors', function (){
        return {
            restrict : 'A',
            link : function(scope,el){
                el.bind('blur',function(){
                    var valid = scope.signupForm.$valid;
                    el.toggleClass('has-error',valid);
                })
            }
        }
    });