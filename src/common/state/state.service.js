/**
 * Created by TJ on 10/9/15.
 */
(function() {
    angular.module('com.ylc.state', [])
        .factory('State',[function(){
                var userNextState;
                var userNextStateParams;
                var userCurrentState;
                var userCurrentStateParams;
                var userPreviousState;
                var userPreviousStateParams;

                var State = {
                    // Next State and Params

                    //TODO WHAT IF I WANNA PASS NULL ? REMEMEBER CLEAR SEARCH RESULTS SO THAT USER DOESNT GOTO COMING SOON BY THEMSELVES THINK ??
                    setUserNextState : function (nextState) {
                            userNextState = nextState;
                    },
                    getUserNextState : function () {
                        if(userNextState){
                            return userNextState;
                        }
                    },
                    setUserNextStateParams : function (nextStateParams) {
                            userNextStateParams = nextStateParams;
                    },
                    getUserNextStateParams : function () {
                        if(userNextStateParams){
                            return userNextStateParams;
                        }
                    },

                    // Current State and Params
                    setUserCurrentState : function (currentState) {
                            userCurrentState = currentState;
                    },
                    getUserCurrentState : function () {
                        if(userCurrentState){
                            return userCurrentState;
                        }
                    },
                    setUserCurrentStateParams : function (currentStateParams) {
                            userCurrentStateParams = currentStateParams;
                    },
                    getUserCurrentStateParams : function () {
                        if(userCurrentStateParams){
                            return userCurrentStateParams;
                        }
                    },

                    // Previous State and Params
                    setUserPreviousState : function (previousState) {

                            userPreviousState = previousState;

                    },
                    getUserPreviousState : function () {
                        if(userPreviousState){
                            return userPreviousState;
                        }
                    },
                    setUserPreviousStateParams : function (previousStateParams) {
                            userPreviousStateParams = previousStateParams;
                    },
                    getUserPreviousStateParams : function () {
                        if(userPreviousStateParams){
                            return userPreviousStateParams;
                        }
                    }
                };
                return State;
        }]);
})();