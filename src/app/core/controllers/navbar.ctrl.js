/**
 * Created by TJ on 9/4/15.
 */

angular.module('com.ylc.core').controller('NavCtrl', ['Auth','$scope','$state','Profile',
    'gettextCatalog','CoreService','SaveSearch','Navigation','User','Idle','State','Cart','UserData','$cookieStore','blockUI'
    ,function (Auth,$scope,$state,Profile,gettextCatalog,CoreService,SaveSearch,Navigation,User,Idle,State,Cart,UserData,$cookieStore,blockUI) {

        $scope.$on('IdleStart', function() {
        });

    $scope.logout = function(){
        Auth.$unauth();
        State.setUserCurrentState(null);
        State.setUserNextState(null);
        State.setUserPreviousState(null);
        State.setUserCurrentStateParams(null);
        State.setUserNextStateParams(null);
        State.setUserPreviousStateParams(null);
        Cart.setUserCart(null);
        $cookieStore.remove('userSearch');
        UserData.setUserData(null);
        Auth.$requireAuth().then(function (auth) {
            $scope.signedIn = true;
            CoreService.toastError(gettextCatalog.getString('Logout failed'),gettextCatalog.getString('Logout failed, Please try again!'));
        }, function (error) {
            $scope.signedIn = false;
            CoreService.toastSuccess(gettextCatalog.getString('Logged out'),gettextCatalog.getString('Logout Successful!'));
        })
    };

    $scope.$on('g-places-autocomplete:select', function (event, param) {
        $scope.place = param;
        $scope.searchLocals();
    });

    $scope.searchLocals = function () {
        blockUI.start('Searching ...');

        if($scope.place === null || $scope.place === undefined || $scope.place === ''){
            CoreService.toastError(gettextCatalog.getString('Enter Correct Place!'), gettextCatalog.getString('Enter a location select from the drop-down and try again'));
            blockUI.stop();
        } else {
            setTimeout(function () {
                if(SaveSearch.getUserSearch()){
                    SaveSearch.setUserSearch(null);
                }
                var geocoder = new google.maps.Geocoder();

                geocoder.geocode( { 'placeId': $scope.place.place_id}, function(results, status) {
                    $cookieStore.put('userSearch',results);
                    SaveSearch.setUserSearch(results);
                    if (status == google.maps.GeocoderStatus.OK) {
                        var location = results[0].formatted_address;
                        var loc = location.replace(/\s/g,'');
                        loc = loc.split(',').join('-');
                        $state.go('locations.results',{location : loc},{reload: true});
                    } else {
                        blockUI.stop();
                        CoreService.toastError(gettextCatalog.getString('Error! Incorrect Search!'), gettextCatalog.getString('Try again after correcting place or contact us on info@yourlocalcousin.com!'));
                    }
                });
            },500);
        }

        //if(SaveSearch.getUserSearch()){
        //    SaveSearch.setUserSearch(null);
        //}
        //var geocoder = new google.maps.Geocoder();
        //
        //geocoder.geocode( { 'placeId': $scope.place.place_id}, function(results, status) {
        //    $cookieStore.put('userSearch',results);
        //    if (status == google.maps.GeocoderStatus.OK) {
        //        SaveSearch.setUserSearch(results);
        //        $scope.place = null;
        //        $state.go('search.results',{},{reload: true});
        //    } else {
        //        CoreService.toastError(gettextCatalog.getString('Error! Incorrect Search!'), gettextCatalog.getString('Try again after correcting place or contact us on info@yourlocalcousin.com!'));
        //    }
        //});
    };

    $scope.autocompleteOptions = {
        types: ['(regions)']
    };

    Auth.$requireAuth().then(function(auth){
        $scope.profile = Profile.getProfile(auth.uid);

        $scope.userIsALocal = Navigation.isUserLocal(auth.uid);

        $scope.usersData = User(auth.uid);

        Navigation.getUserConversations(auth.uid).on('value', function (userConvoRef) {
            var unreadMessageCount = 0;
            angular.forEach(userConvoRef.val(), function (value, key) {
                if(value.messages){
                    angular.forEach(value.messages, function (valueMessages, keyMessages) {
                        if(valueMessages.sentTo === auth.uid && valueMessages.seen === false){
                            unreadMessageCount++;
                        }
                    })
                }
            });
            $scope.userUnreadMessages = unreadMessageCount;
        });




        $scope.signedIn = true;
    });
}]).config(function(IdleProvider, KeepaliveProvider) {
    IdleProvider.idle(2); // in seconds
    IdleProvider.timeout(false);
    KeepaliveProvider.interval(2); // in seconds
})
    .run(function(Idle){
        Idle.watch();
    });
