/**
 * Created by TJ on 10/9/15.
 */
(function() {
    angular.module('com.ylc.save-search', [])
        .factory('SaveSearch',[function(){
            var userSearch;

            var SaveSearch = {
                setUserSearch : function (search) {
                        userSearch = search;
                },
                getUserSearch : function () {
                        return userSearch;
                }
            };
            return SaveSearch;

        }]);
})();