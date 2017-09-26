/**
 * Created by TJ on 10/9/15.
 */
(function() {
    angular.module('com.ylc.user-data', [])
        .factory('UserData',[function(){
                var userData;

                var UserData = {
                    //TODO WHAT IF I WANNA PASS NULL ? REMEMEBER CLEAR SEARCH RESULTS SO THAT USER DOESNT GOTO COMING SOON BY THEMSELVES THINK ??

                    setUserData : function (data) {
                        userData = data;
                    },
                    getUserData : function () {
                        if(userData){
                            return userData;
                        }
                    }
                };
                return UserData;

        }]);
})();