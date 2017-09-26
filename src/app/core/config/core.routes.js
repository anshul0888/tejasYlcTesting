angular.module('com.ylc.core')
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state(
        'home',
            {
                url: '/?utm_source&utm_campaign&utm_medium',
                views : {
                    main : {
                        templateUrl: 'core/views/home.tpl.html',
                        controller: 'HomeCtrl'
                    }
                },
                resolve: {
                    userData: ['User','Auth',function(User, Auth){
                        return Auth.$requireAuth().then(function(auth){
                            return User(auth.uid).$loaded();
                        }).catch(function () {
                            return null;
                        });
                    }],
                    hotelDetails : function($stateParams,HomeService) {
                        return HomeService.getHomeDataArray();
                    }
                },
                data:{ pageTitle: 'Home'},
                // meta: {
                //     'title' : 'Your Local Cousin – Travel like a Local',
                //     'description': 'Skip the tourist traps & get customized itineraries & maps made by 1000+ local experts in 110+ countries. Inexpensively plan your next travel, vacation or holiday.',
                //     'url' : 'https://www.yourlocalcousin.com/',
                //     'type' : 'website'
                // }
                meta: {
                    'title' : 'Custom tours, activities and itineraries',
                    'description': 'Small size and custom tours and activities, tailor-made itineraries and 1-on-1 conversations with locals in 110+ countries.',
                    'url' : 'https://www.yourlocalcousin.com/',
                    'type' : 'website'
                }
            }
        )
        .state(
            'user',
            {
                url: '/user/verify/:token',
                views : {
                    main : {
                        templateUrl: 'core/views/verify.tpl.html',
                        controller: 'VerifyCtrl'
                    }
                },
                resolve: {

                },
                data:{ pageTitle: 'Home' }
            }
        )
        .state(
            'password-reset',
            {
                url: '/user/reset/password',
                views : {
                    main : {
                        templateUrl: 'core/views/reset.password.tpl.html',
                        controller: 'ResetPasswordCtrl'
                    }
                },
                resolve: {

                },
                data:{ pageTitle: 'Home' }
            }
        )
        .state(
        'forbidden',
            {
                url: '/forbidden',
                views : {
                    main : {
                        templateUrl: 'core/views/forbidden.tpl.html'
                    }
                },
                data:{ pageTitle: 'Forbidden' },
                resolve: {
                    "currentAuth": ["Auth", function(Auth) {
                        return Auth.$requireAuth();
                    }]
                }
            }
        ).state('about', {
            url: '/about',
            views : {
                main : {
                    templateUrl: 'core/views/about.tpl.html'
                }
            },
            data:{ pageTitle: 'About' },
            meta: {
                'title': 'About Us | Your Local Cousin',
                'description': 'Your Local Cousin helps you travel smarter by connecting you with vetted local experts. Skip the tourist traps and explore the hidden gems they have discovered over the years.',
                'url' : 'https://www.yourlocalcousin.com/about',
                'image' : 'https://www.filepicker.io/api/file/Fx3hhUjsThyC8TYKyJoW',
                'type' : 'website'
            }
        })
        .state('pricing', {
            url: '/pricing',
            views : {
                main : {
                    templateUrl: 'core/views/pricing.tpl.html'
                }
            },
            data:{ pageTitle: 'Pricing' },
            meta: {
                'title': 'Pricing and Plans | Your Local Cousin',
                'description': 'Find plans and corresponding pricing ranging from texting a local, asking three questions to a local, speaking with a Local to customized itineraries and maps.',
                'url' : 'https://www.yourlocalcousin.com/pricing',
                'image' : 'https://www.filepicker.io/api/file/fnxSLcETzWzDXHBxfoYQ',
                'type' : 'website'
            }
        })
        .state('faq', {
            url: '/faq',
            views : {
                main : {
                    templateUrl: 'core/views/faq.tpl.html'
                }
            },
            data:{ pageTitle: 'FAQ' },
            meta: {
                'title': 'FAQ | Your Local Cousin',
                'description': 'All queries answered ranging from how to become a local cousin, how to connect with a local cousin to how to plan your emergency trips.',
                'url' : 'https://www.yourlocalcousin.com/faq',
                'image' : 'https://www.filepicker.io/api/file/ecAgTQKyQnSuVHs8Si5g',
                'type' : 'website'
            }
        })
        .state('press', {
            url: '/press',
            views : {
                main : {
                    templateUrl: 'core/views/press.tpl.html'
                }
            },
            data:{ pageTitle: 'Press' },
            meta: {
                'title': 'Press | Your Local Cousin',
                'description': 'Your Local Cousin aims to pair travel-enthusiasts with locals who have similar interests, to give an insider\'s take while sticking to a budget.',
                'url' : 'https://www.yourlocalcousin.com/press',
                'image' : 'https://www.filepicker.io/api/file/F2WLn8ttQTKByBADyPcv',
                'type' : 'website'
            }
        })
        .state('contest', {
            url: '/contest',
            views : {
                main : {
                    templateUrl: 'core/views/contest.tpl.html'
                }
            },
            data : {
                pageTitle: 'Contest',
                linkRelImg : 'https://www.filepicker.io/api/file/EN66xrYySgO63XqK7KV5'
            }
        })
        .state('termsofuse', {
            url: '/termsofuse',
            views : {
                main : {
                    templateUrl: 'core/views/termsofuse.tpl.html'
                }
            },
            data:{ pageTitle: 'Terms of Use' }
        })
        .state('trustsafety', {
            url: '/trustsafety',
            views : {
                main : {
                    templateUrl: 'core/views/trustsafety.tpl.html'
                }
            },
            data:{ pageTitle: 'Trust Safety' }
        })
        .state('contact', {
            url: '/contact',
            views : {
                main : {
                    templateUrl: 'core/views/contact.tpl.html',
                    controller : 'ContactUsCtrl'
                }
            },
            data:{ pageTitle: 'Contact' },
            meta: {
                'title': 'Contact Us | Your Local Cousin',
                'description': 'You can send us a message, mail us at info@yourlocalcousin.com or phone us at +1-631-245-4748 and we\'ll get back to you.',
                'url' : 'https://www.yourlocalcousin.com/contact',
                'type' : 'website'
            }
        }).state('steps', {
            url: '/steps',
            views : {
                main : {
                    templateUrl: 'core/views/steps.tpl.html',
                    controller: 'CreateStepsCtrl'
                }
            },
            data:{ pageTitle: 'Steps to become a Local Cousin' }
        }).state('giftcard', {
            url: '/giftcard',
            views : {
                main : {
                    templateUrl: 'core/views/giftcard.tpl.html',
                    controller: 'GiftCardCtrl'
                }
            },
            data:{ pageTitle: 'The Best Gift – The Gift of Travel!' },
            meta: {
                'title': 'The Best Gift – The Gift of Travel!',
                'description': 'Send gift cards to your friends and family who love to travel and want unique experiences from knowledgable locals',
                'url' : 'https://www.yourlocalcousin.com/giftcard',
                'image' : 'https://www.filepicker.io/api/file/51NSWcOSguOsnhSo7fev',
                'type' : 'website'
            }
        }).state('affiliate', {
            url: '/affiliate',
            views : {
                main : {
                    templateUrl: 'core/views/affiliate/affiliate.tpl.html',
                    controller: 'AffilateCtrl'
                }
            },
            data:{ pageTitle: 'Join our Affiliate Program' },
            meta: {
                'title': 'Affiliate Program | Your Local Cousin',
                'description': 'Become an affiliate and make commission for referring our service. Becoming an affiliate with YLC is free, simple and making some extra money doesn\'t get easier than this!',
                'url' : 'https://www.yourlocalcousin.com/affiliate',
                'image' : 'https://www.filepicker.io/api/file/e0rTEq37Rva8TI8eB3Qg',
                'type' : 'website'
            }
        }).state('affiliate_apply', {
            url: '/affiliate/apply',
            views : {
                main : {
                    templateUrl: 'core/views/affiliate/apply_affiliate.tpl.html',
                    controller: 'AffilateCtrl'
                }
            },
            data:{ pageTitle: 'Join our Affiliate Program | Apply' },
            meta: {
                'title': 'Affiliate Program | Your Local Cousin',
                'description': 'Become an affiliate and make commission for referring our service. Becoming an affiliate with YLC is free, simple and making some extra money doesn\'t get easier than this!',
                'url' : 'https://www.yourlocalcousin.com/affiliate',
                'image' : 'https://www.filepicker.io/api/file/e0rTEq37Rva8TI8eB3Qg',
                'type' : 'website'
            }
        });
        $urlRouterProvider.otherwise('/');
  }).factory('HomeService', function ($http) {
    return {
        getHomeData: function () {
            return $http.get('https://ylc-api.herokuapp.com/hotels/the_bernic_hotel_nyc/')
        },
        getHomeDataArray: function () {
            return $http.get('https://ylc-api.herokuapp.com/hotels/the_bernic_hotel_nyc/hotel_experiences/')
        }
    }
})
