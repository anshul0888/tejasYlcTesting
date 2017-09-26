
angular.module('com.ylc.local-stories')
  .config(function($stateProvider) {
    $stateProvider
        .state('local-stories', {
            url: '/travel-content-collaboration',
            abstract : true,
            views : {
                main : {
                    templateUrl: 'local-stories/views/main.tpl.html'
                }
          },
          data:{ pageTitle: 'Local stories' }
        })
        .state('local-stories.view', {
            url: '',
            views : {
                view : {
                    templateUrl: 'local-stories/views/view.tpl.html'
                }
            },
            data:{ pageTitle: 'Travel content collaboration' },
            meta: {
                'title': 'Travel Content Collaboration | Your Local Cousin',
                'description': 'Get our best locals to write original, real-time and un-biased travel content for your organization\'s blog.',
                'url' : 'https://www.yourlocalcousin.com/travel-content-collaboration',
                'image' : 'https://www.filepicker.io/api/file/xMEplL43QKeyEVXincja',
                'type' : 'website'
            }
        }).state('local-stories.contact', {
        url: '/contact',
        views : {
            view : {
                templateUrl: 'local-stories/views/contact.tpl.html',
                controller : 'LocalStoriesCtrl'
            }
        },
        data:{ pageTitle: 'Contact'}

    })
    });
