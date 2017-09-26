
angular.module('com.ylc.search')
  .config(function($stateProvider) {
    $stateProvider
        .state('search', {
            url: '/search',
            abstract : true,
            views : {
                main : {
                    templateUrl: 'search/views/main.tpl.html'
                }
          },
          data:{ pageTitle: 'Search' }
        })
        .state('search.results', {
            url: '',
            views : {
                search : {
                    templateUrl: 'search/views/results.tpl.html',
                    controller : 'SearchResultsCtrl'
                }
            },
            data:{ pageTitle: 'Search Results' }
        })
        .state('search.coming-soon', {
            url: '/coming-soon',
            views : {
                search : {
                    templateUrl: 'search/views/coming-soon.tpl.html',
                    controller : 'SearchComingSoonCtrl'
                }
            },
            data:{ pageTitle: 'Coming Soon' }
        })
        .state('search.details', {
            url: '/:id',
            resolve: {
                profile: ['Profile','$stateParams',function(Profile,$stateParams){
                    return Profile.getProfile($stateParams.id).$loaded();
                }],
                videos : ['Profile','$stateParams',function(Profile,$stateParams){
                        return Profile.getVideos($stateParams.id).$loaded();
                }],
                selectedDates : function ($stateParams,Profile) {
                    return Profile.getLocalsSelectedDates($stateParams.id).$loaded(function (data) {
                        var selectedDates = [];
                        angular.forEach(data, function (val, key) {
                            selectedDates.push(parseInt(val.$id));
                        });
                        return selectedDates;
                    })
                }
                ,
                testimonialsCount : ['Profile','$stateParams',function(Profile,$stateParams){
                    return Profile.getTestimonialCount($stateParams.id).$loaded();
                }],
                ratingsCount : ['Profile','$stateParams',function(Profile,$stateParams){
                    return Profile.getRatingCount($stateParams.id).$loaded();
                }],
                oldTestimonials : ['Profile','$stateParams',function(Profile,$stateParams){
                    return Profile.getOldTestimonials($stateParams.id).$loaded();
                }]
            },
            views : {
                search : {
                    templateUrl: 'profile/view/views/view.tpl.html',
                    controller: 'SearchViewCtrl'
                }
            },
            data:{ pageTitle: 'View' }
        })
    });

