///**
// * Created by TJ on 11/19/15.
// */
//var app = angular.module('com.ylc.profile.edit');
//
//app.config(function (authProvider) {
//    authProvider.init({
//        domain: 'ylc.auth0.com',
//        clientID: 'diE57fRpjEICrzRqQjzouMXjjDfMBohK'
//    });
//}).run(function(auth) {
//    // This hooks al auth events to check everything as soon as the app starts
//    auth.hookEvents();
//});
//
//
////app.config(function($authProvider) {
////    $authProvider.facebook({
////        clientId: '1628362000774270',
////        name: 'facebook',
////        url: 'http://localhost:63342/YourLocalCousin/build/index.html#/edit/settings',
////        authorizationEndpoint: 'https://www.facebook.com/v2.5/dialog/oauth',
////        redirectUri: 'https://auth.firebase.com/v2/ylc/auth/facebook/callback',
////        requiredUrlParams: ['display', 'scope'],
////        scope: ['email'],
////        scopeDelimiter: ',',
////        display: 'popup',
////        type: '2.0',
////        popupOptions: { width: 580, height: 400 }
////
////    });
////
////    $authProvider.linkedin({
////        clientId: '773ubyh5zhzjka',
////        url: 'http://localhost:3000/auth/linkedin',
////        authorizationEndpoint: 'https://www.linkedin.com/uas/oauth2/authorization',
////        redirectUri: 'http://localhost:3000',
////        requiredUrlParams: ['state'],
////        scope: ['r_emailaddress'],
////        scopeDelimiter: ' ',
////        state: 'STATE',
////        type: '2.0',
////        popupOptions: { width: 527, height: 582 }
////    });
////
////});
