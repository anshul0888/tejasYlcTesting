
angular.module('com.ylc.experiences')
  .config(function($stateProvider) {
    $stateProvider
        .state('experiences', {
            url: '/experiences',
            abstract : true,
            views : {
                main : {
                    templateUrl: 'experiences/views/main.tpl.html'
                }
          },
          data:{ pageTitle: 'Experiences' }
        })
        .state('experiences.detail', {
            url: '/:experienceId',
            views : {
                experience : {
                    templateUrl: 'experiences/views/experience.details.tpl.html',
                    controller : 'ExperiencesCtrl'
                }
            },
            resolve : {
                experienceDetails : function($stateParams,Experiences) {
                    return Experiences.getExperienceData($stateParams.experienceId).$loaded();
                }
            },
            data:{
                pageTitle: 'Yogyakarta temples and traditions',
                linkRelImg: 'https://www.filepicker.io/api/file/DsGcL5gWR7uGjwJiIwcr'
            }
        })
    });
