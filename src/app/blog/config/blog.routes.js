
angular.module('com.ylc.blog')
  .config(function($stateProvider) {
    $stateProvider
        .state('blog', {
            url: '/blog',
            abstract : true,
            views : {
                main : {
                    templateUrl: 'blog/views/main.tpl.html'
                }
          },
          data:{ pageTitle: 'Blog' }
        })
        .state('blog.view', {
            url: '',
            views : {
                view : {
                    templateUrl: 'blog/views/view.tpl.html'
                }
            },
            data:{ pageTitle: 'Blog' },
            meta: {
                'title': 'Blog | Your Local Cousin',
                'description': 'Our blog brings to you awesome travel stories, lists of best go-to places in your favorite destinations and coverage of outstanding travel spots.',
                'url' : 'https://www.yourlocalcousin.com/blog',
                'image' : 'https://www.filepicker.io/api/file/GJMmsw5TBKC9ieezkn1Q',
                'type' : 'website'
            }
        })
        .state('blog.barcelona', {
            url: '/beyond-barcelona-offbeat-travel-destinations',
            views : {
                view : {
                    templateUrl: 'blog/views/barcelona.tpl.html'
                }
            },
            data:{ pageTitle: 'Barcelona', linkRelImg: 'https://www.filepicker.io/api/file/DsGcL5gWR7uGjwJiIwcr' },
            meta: {
                'title': 'Beyond Barcelona : Offbeat travel destinations',
                'description': 'From ancient yet colorful city of Girona to village of Castellfollit de la Roca atop a basalt cliff, theres so much you can explore on your next trip to Barcelona.',
                'image' : 'https://www.filepicker.io/api/file/DsGcL5gWR7uGjwJiIwcr',
                'url' : 'https://www.yourlocalcousin.com/blog/beyond-barcelona-offbeat-travel-destinations',
                'type' : 'article'
            }
        })
        .state('blog.brooklynbridge', {
            url: '/beyond-times-square-and-the-brooklyn-bridge',
            views : {
                view : {
                    templateUrl: 'blog/views/brooklynbridge.tpl.html'
                }
            },
            data:{ pageTitle: 'Brooklyn bridge', linkRelImg: 'https://www.filepicker.io/api/file/gkXCeLiZTMmn7JMi2EmO' },
            meta: {
                'title': 'Beyond Times Square & The Brooklyn Bridge',
                'description': 'Anyone headed to New York is bombarded with information about what to do, when to do it, where to do it and why.  Read how to have a more authentic NYC experience.',
                'image' : 'https://www.filepicker.io/api/file/gkXCeLiZTMmn7JMi2EmO',
                'url' : 'https://www.yourlocalcousin.com/blog/beyond-times-square-and-the-brooklyn-bridge',
                'type' : 'article'
            }
        })
        .state('blog.charleston', {
            url: '/the-charleston-south-carolina-bucket-list',
            views : {
                view : {
                    templateUrl: 'blog/views/charleston.tpl.html'
                }
            },
            data:{ pageTitle: 'Charleston', linkRelImg: 'https://www.filepicker.io/api/file/SqfcVUevSrS9hnonudfB' },
            meta: {
                'title': 'The Charleston - South Carolina Bucket List',
                'description': 'From playing the Ocean Course at Kiawah Island to exploring rare beers at Charleston Beer Exchange, our best local in Charleston - Morgan - has covered them all.',
                'image' : 'https://www.filepicker.io/api/file/SqfcVUevSrS9hnonudfB',
                'url' : 'https://www.yourlocalcousin.com/blog/the-charleston-south-carolina-bucket-list',
                'type' : 'article'
            }
        })
        .state('blog.dellybelly', {
            url: '/indian-street-food-that-wont-give-you-a-delhi-belly',
            views : {
                view : {
                    templateUrl: 'blog/views/dellybelly.tpl.html'
                }
            },
            data:{ pageTitle: 'Dellybelly', linkRelImg: 'https://www.filepicker.io/api/file/etkcb5eUTJG0Ch9zAxzz' },
            meta: {
                'title': 'Indian Street Food That wont give you a Delhi-Belly',
                'description': 'Let’s face it, the best food in India is made on the streets and we bring to you options which safe for the traveler with a sensitive stomach.',
                'image' : 'https://www.filepicker.io/api/file/etkcb5eUTJG0Ch9zAxzz',
                'url' : 'https://www.yourlocalcousin.com/blog/indian-street-food-that-wont-give-you-a-delhi-belly',
                'type' : 'article'
            }
        })
        .state('blog.foodporn', {
            url: '/seven-foodporn-worthy-eats-in-boston',
            views : {
                view : {
                    templateUrl: 'blog/views/foodporn.tpl.html'
                }
            },
            data:{ pageTitle: 'Foodporn', linkRelImg: 'https://www.filepicker.io/api/file/QDsBaD8sSqyorJEj1nsD' },
            meta: {
                'title': 'SEVEN #foodporn worthy eats in boston',
                'description': 'Boston is home to an extremely diverse culinary scene that will leave you craving dishes – even on the ride back home.',
                'image' : 'https://www.filepicker.io/api/file/QDsBaD8sSqyorJEj1nsD',
                'url' : 'https://www.yourlocalcousin.com/blog/seven-foodporn-worthy-eats-in-boston',
                'type' : 'article'
            }
        })
        .state('blog.george', {
            url: '/three-hours-in-georgetown-dc-like-a-local-and-then-some',
            views : {
                view : {
                    templateUrl: 'blog/views/george.tpl.html'
                }
            },
            data:{ pageTitle: 'George', linkRelImg: 'https://www.filepicker.io/api/file/mfkeZGwlTrqAtMo7Tr1R' },
            meta: {
                'title': 'Three hours in Georgetown, D.C. like a local . . .  and then Some',
                'description': "All the hidden gems in brooklyn have been covered in the article including UrbanGlass studio and Audrey's Concerto.",
                'image' : 'https://www.filepicker.io/api/file/mfkeZGwlTrqAtMo7Tr1R',
                'url' : 'https://www.yourlocalcousin.com/blog/three-hours-in-georgetown-dc-like-a-local-and-then-some',
                'type' : 'article'
            }
        })
        .state('blog.grant', {
            url: '/the-incredible-rachel-grant',
            views : {
                view : {
                    templateUrl: 'blog/views/grant.tpl.html'
                }
            },
            data:{ pageTitle: 'Grant', linkRelImg: 'https://www.filepicker.io/api/file/rssiaIcUQGacFJRmQ5Z1' },
            meta: {
                'title': 'The Incredible Rachel Grant!',
                'description': "Our interview with Rachel Grant - former Miss Hawaiian Tropic and Angelina Jolie's stunt double in Tomb Raider - about travel, her sense for adventure and what inspires her journey.",
                'image' : 'https://www.filepicker.io/api/file/rssiaIcUQGacFJRmQ5Z1',
                'url' : 'https://www.yourlocalcousin.com/blog/the-incredible-rachel-grant',
                'type' : 'article'
            }
        })
        .state('blog.kolkata', {
            url: '/local-insights-on-why-kolkata-is-indias-most-charming-city',
            views : {
                view : {
                    templateUrl: 'blog/views/kolkata.tpl.html'
                }
            },
            data:{ pageTitle: 'Kolkata', linkRelImg: 'https://www.filepicker.io/api/file/HhwOH3EdQre7INVBn08S' },
            meta: {
                'title': ' Local insights on why Kolkata is indias most charming city',
                'description': 'Is it because of Central Avenue and North Kolkata for its tremendous architecture or Kolkatas world famous biryani or St Paul’s cathedral on the last Sunday before Christmas?',
                'image' : 'https://www.filepicker.io/api/file/HhwOH3EdQre7INVBn08S',
                'url' : 'https://www.yourlocalcousin.com/blog/local-insights-on-why-kolkata-is-indias-most-charming-city',
                'type' : 'article'
            }
        })
        .state('blog.madrid', {
            url: '/my-top-eight-bars-in-madrid',
            views : {
                view : {
                    templateUrl: 'blog/views/madrid.tpl.html'
                }
            },
            data:{ pageTitle: 'Madrid', linkRelImg: 'https://www.filepicker.io/api/file/kJsmypizSk6pJktY64it' },
            meta: {
                'title': 'My Top Eight Bars in Madrid',
                'description': 'An expert in nightlife, Tessy speaks about what makes these eight bars the best ones in Madrid. The list includes Tartan Roof and El Imperfecto.',
                'image' : 'https://www.filepicker.io/api/file/kJsmypizSk6pJktY64it',
                'url' : 'https://www.yourlocalcousin.com/blog/my-top-eight-bars-in-madrid',
                'type' : 'article'
            }
        })
        .state('blog.panama', {
            url: '/bocas-del-toro-ecotourism-and-adventure-in-panama',
            views : {
                view : {
                    templateUrl: 'blog/views/panama.tpl.html'
                }
            },
            data:{ pageTitle: 'Panama', linkRelImg: 'https://www.filepicker.io/api/file/7YdNSr83TNN6Z12JV2sQ' },
            meta: {
                'title': 'Bocas Del Toro - ecotourism & adventure in Panama',
                'description': 'If you are an avid birder, you will find your nirvana in Bocas del Toro’s jungles and coasts. Bocas del Toro is also known as the Galapagos of the Carribean.',
                'image' : 'https://www.filepicker.io/api/file/7YdNSr83TNN6Z12JV2sQ',
                'url' : 'https://www.yourlocalcousin.com/blog/bocas-del-toro-ecotourism-and-adventure-in-panama',
                'type' : 'article'
            }
        })
        .state('blog.phnom', {
            url: '/phnom-penh-the-pearl-of-asia',
            views : {
                view : {
                    templateUrl: 'blog/views/phnom.tpl.html'
                }
            },
            data:{ pageTitle: 'Phnom', linkRelImg: 'https://www.filepicker.io/api/file/wH1XkphEQG2PGOdI63mh' },
            meta: {
                'title': 'Phnom Penh The Pearl Of Asia',
                'description': 'Phnom Penh is one of Easts most tempting treasure and  lot of the Khmer culture revolves around food.',
                'image' : 'https://www.filepicker.io/api/file/wH1XkphEQG2PGOdI63mh',
                'url' : 'https://www.yourlocalcousin.com/blog/phnom-penh-the-pearl-of-asia',
                'type' : 'article'
            }
        })
        .state('blog.top10thing', {
            url: '/top-ten-things-to-do-in-brooklyn-only-locals-know-about',
            views : {
                view : {
                    templateUrl: 'blog/views/top10thing.tpl.html'
                }
            },
            data:{ pageTitle: 'Top10thing', linkRelImg: 'https://www.filepicker.io/api/file/OcyAXIrSSTmgUF1WUADj' },
            meta: {
                'title': ' Top ten things to do in brooklyn only locals know about',
                'description': "All the hidden gems in brooklyn have been covered in the article including UrbanGlass studio and Audrey's Concerto.",
                'image' : 'https://www.filepicker.io/api/file/OcyAXIrSSTmgUF1WUADj',
                'url' : 'https://www.yourlocalcousin.com/blog/top-ten-things-to-do-in-brooklyn-only-locals-know-about',
                'type' : 'article'
            }
        })
        .state('blog.triund', {
            url: '/the-most-beautiful-trek-in-india-triund-himachal-pradesh',
            views : {
                view : {
                    templateUrl: 'blog/views/triund.tpl.html'
                }
            },
            data:{ pageTitle: 'Triund', linkRelImg: 'https://www.filepicker.io/api/file/EL2LskWCQVZ1OzfD2hDf' },
            meta: {
                'title': 'The most beautiful trek in india - Triund, himachal pradesh',
                'description': 'Practically everybody who visits or stays in Dharamsala, especially McLeod Ganj and Dharamkot, has heard fantastic stories about Triund Trek.',
                'image' : 'https://www.filepicker.io/api/file/EL2LskWCQVZ1OzfD2hDf',
                'url' : 'https://www.yourlocalcousin.com/blog/the-most-beautiful-trek-in-india-triund-himachal-pradesh',
                'type' : 'article'
            }
        })
        .state('blog.vicki', {
            url: '/an-amazing-morning-in-brooklyn-with-the-fabulous-vicki-winters',
            views : {
                view : {
                    templateUrl: 'blog/views/vicki.tpl.html'
                }
            },
            data:{ pageTitle: 'Vicki', linkRelImg: 'https://www.filepicker.io/api/file/c4Cp9OSR1iIOt0e8TO1t' },
            meta: {
                'title': 'An Amazing Morning in Brooklyn with the Fabulous Vicki Winters',
                'description': 'Vicki is a professional blogger with a fresh perspective on world travel and knows all the hidden gems in NYC.',
                'image' : 'https://www.filepicker.io/api/file/c4Cp9OSR1iIOt0e8TO1t',
                'url' : 'https://www.yourlocalcousin.com/blog/an-amazing-morning-in-brooklyn-with-the-fabulous-vicki-winters',
                'type' : 'article'
            }
        })
        .state('blog.ylc', {
            url: '/your-local-cousin-insider-tips-for-travelers',
            views : {
                view : {
                    templateUrl: 'blog/views/ylc.tpl.html'
                }
            },
            data:{ pageTitle: 'Ylc', linkRelImg: 'https://www.filepicker.io/api/file/7z4N5bnQSbOGaWwHntsi' },
            meta: {
                'title': 'Your Local Cousin: INSIDER TIPS FOR TRAVELERS',
                'description': 'Your Local Cousin is a platform devoted to connecting travelers with locals for insider tips about their destinations to make inexpensive customized travel planning possible.',
                'image' : 'https://www.filepicker.io/api/file/7z4N5bnQSbOGaWwHntsi',
                'url' : 'https://www.yourlocalcousin.com/blog/your-local-cousin-insider-tips-for-travelers',
                'type' : 'article'
            }
        })
        .state('blog.contact', {
            url: '/contact',
            views : {
                view : {
                    templateUrl: 'blog/views/contact.tpl.html',
                    controller : 'BlogCtrl'
                }
            },
            data:{ pageTitle: 'Contact'}

        })
        .state('blog.requirements', {
            url: '/requirements',
            views : {
                view : {
                    templateUrl: 'blog/views/requirements.tpl.html'
                }
            },
            data:{ pageTitle: 'Requirements', linkRelImg: 'https://www.filepicker.io/api/file/K4VRnzzSzCxuTcTtSxw6' },
            meta: {
                'title': 'Article Submission Guidelines',
                'description': 'Your Local Cousin’s blog is a collection of carefully curated articles written by travel enthusiasts around the globe. We seek to publish articles filled with unique information about a location, with a personalized approach.',
                'image' : 'https://www.filepicker.io/api/file/K4VRnzzSzCxuTcTtSxw6',
                'url' : 'https://www.yourlocalcousin.com/blog/requirements',
                'type' : 'article'
            }
        })
        .state('blog.swede', {
            url: '/we-tested-swedens-new-travel-initiative-call-a-random-swede',
            views : {
                view : {
                    templateUrl: 'blog/views/swede.tpl.html'
                }
            },
            data:{ pageTitle: 'Swede', linkRelImg: 'https://www.filepicker.io/api/file/qjKFM6icTW21hnQTksan' },
            meta: {
                'title': 'We Tested Sweden’s new travel initiative - Call a Random Swede',
                'description': 'Sweden now has its own phone number and a Swedish tourism campaign is inviting people to call a random Swede. Sweden should definitely be next on your vacation list!',
                'image' : 'https://www.filepicker.io/api/file/qjKFM6icTW21hnQTksan',
                'url' : 'https://www.yourlocalcousin.com/blog/we-tested-swedens-new-travel-initiative-call-a-random-swede',
                'type' : 'article'
            }
        })
        .state('blog.mike', {
            url: '/mike-and-regina-making-a-living-traveling-the-world',
            views : {
                view : {
                    templateUrl: 'blog/views/mike.tpl.html'
                }
            },
            data:{ pageTitle: 'Mike', linkRelImg: 'https://www.filepicker.io/api/file/ScUNfhC3QyiwLLAZuMLw' },
            meta: {
                'title': 'Mike and Regina making a living traveling the world',
                'description': 'Mike and Regina van de Velden quit their jobs in New Zealand and started their "Walk the Earth" journey in January 2014. Learn about their amazing journey so far.',
                'image' : 'https://www.filepicker.io/api/file/ScUNfhC3QyiwLLAZuMLw',
                'url' : 'https://www.yourlocalcousin.com/blog/mike-and-regina-making-a-living-traveling-the-world',
                'type' : 'article'
            }
        })
        .state('blog.starbucks', {
            url: '/beyond-starbucks-discovering-the-magnificent-mile-as-a-college-student',
            views : {
                view : {
                    templateUrl: 'blog/views/starbucks.tpl.html'
                }
            },
            data:{ pageTitle: 'Starbucks' , linkRelImg: 'https://www.filepicker.io/api/file/5x6IXJ3PRoGnnGvAo0s7' },
            meta: {
                'title': 'Beyond Starbucks: discovering dhe Magnificent Mile as a college student',
                'description': 'Downtown Chicago offers hidden gems with excellent food and atmosphere, right off the Magnificent Mile and Loop. From belgian bread, gelato, focaccia, multicolored cake balls to Firecakes, this area has a lot to offer.',
                'image' : 'https://www.filepicker.io/api/file/5x6IXJ3PRoGnnGvAo0s7',
                'url' : 'https://www.yourlocalcousin.com/blog/beyond-starbucks-discovering-the-magnificent-mile-as-a-college-student',
                'type' : 'article'
            }
        })
        .state('blog.eatthisnow', {
            url: '/eat-this-now',
            views : {
                view : {
                    templateUrl: 'blog/views/eatthisnow.tpl.html'
                }
            },
            data:{ pageTitle: 'Eat', linkRelImg: 'https://www.filepicker.io/api/file/sXwicEXJSRm2tS8Iuy8w' },
            meta: {
                'title': 'Eat This Now',
                'description': 'Diverse food trending across the globe are covered - Japanese Water Cake, Cricket Bar, Paintable Pasta, Keyboard Waffle and many more.',
                'image' : 'https://www.filepicker.io/api/file/sXwicEXJSRm2tS8Iuy8w',
                'url' : 'https://www.yourlocalcousin.com/blog/eat-this-now',
                'type' : 'article'
            }
        })

        .state('blog.corsica', {
            url: '/the-beauty-of-corsica',
            views : {
                view : {
                    templateUrl: 'blog/views/corsica.tpl.html'
                }
            },
            data:{ pageTitle: 'Corsica', linkRelImg: 'https://www.filepicker.io/api/file/XdX9WS6IQj2CKvqIKjDK' },
            meta: {
                'title': 'The Beauty of Corsica',
                'description': 'Famous for being the birthplace of Napoleon, the Corsica island is also known for its gorgeous beach as well as mountain spots, wines and strong cultural identity.',
                'image' : 'https://www.filepicker.io/api/file/XdX9WS6IQj2CKvqIKjDK',
                'url' : 'https://www.yourlocalcousin.com/blog/the-beauty-of-corsica',
                'type' : 'article'
            }
        })

        .state('blog.heyley', {
            url: '/lecturer-phd-cabin-crew-blogger-and-a-traveler',
            views : {
                view : {
                    templateUrl: 'blog/views/heyley.tpl.html'
                }
            },
            data:{ pageTitle: 'Heyley', linkRelImg: 'https://www.filepicker.io/api/file/8oP2W5qiQvSeYXhs7kvZ' },
            meta: {
                'title': 'Lecturer, PhD, Cabin Crew, Blogger and a Traveler – Meet Hayley',
                'description': 'Hayley Stainton is a Senior Lecturer in Tourism and Aviation and travel blogger. She has traveled to 197 cities and 41 countries, including Israel during the war and Egypt during the revolution.',
                'image' : 'https://www.filepicker.io/api/file/8oP2W5qiQvSeYXhs7kvZ',
                'url' : 'https://www.yourlocalcousin.com/blog/lecturer-phd-cabin-crew-blogger-and-a-traveler',
                'type' : 'article'
            }
        })
        .state('blog.turkish', {
            url: '/turkish-delight-turkish-tea-turkish-kebap-and-turkish-coup-detat-for-dessert',
            views : {
                view : {
                    templateUrl: 'blog/views/turkish.tpl.html'
                }
            },
            data:{ pageTitle: 'Turkish Delight', linkRelImg: 'https://www.filepicker.io/api/file/lvLrOadVSqiKQ5qFetgV' },
            meta: {
                'title': 'Turkish delight, Turkish tea, Turkish kebap and Turkish Coup detat for dessert',
                'description': '“Closed!” the waiter said. “What is closed?” I asked. He shrugged and repeated “Closed!” My blank expression made him add “Bridge. Everything. Closed! Army now. Erdogan gone!” ',
                'image' : 'https://www.filepicker.io/api/file/lvLrOadVSqiKQ5qFetgV',
                'url' : 'turkish-delight-turkish-tea-turkish-kebap-and-turkish-coup-detat-for-dessert',
                'type' : 'article'
            }
        })
          .state('blog.rachelgrant', {
              url: '/suitcase-challenge-i-tried-packing-130-items-into-a-carry-on-suitcase-like-rachel-grant',
              views : {
                  view : {
                      templateUrl: 'blog/views/rachelgrant.tpl.html'
                  }
              },
              data:{ pageTitle: 'Suitcase challenge: I Tried Packing 130 Items Into a Carry On Suitcase Just Like Rachel Grant...', linkRelImg: 'https://cdn.filepicker.io/api/file/i2bIHr7pShaTYFgTkvbS' },
              meta: {
                  'title': 'Suitcase challenge: I Tried Packing 130 Items Into a Carry On Suitcase Just Like Rachel Grant...',
                  'description': 'When Rachel Grant (Bond Girl and Angelina Jolie’s stunt double!) told me that she is making a video where she packs 130 items into a small carry on bag I thought she was nuts!',
                  'image' : 'https://cdn.filepicker.io/api/file/i2bIHr7pShaTYFgTkvbS',
                  'url' : 'suitcase-challenge-i-tried-packing-130-items-into-a-carry-on-suitcase-like-rachel-grant',
                  'type' : 'article'
              }
          })
          .state('blog.oakland', {
              url: '/traveling-to-the-bay-area-oakland-is-the-cool-kid-everyone-wants-to-eat-with',
              views : {
                  view : {
                      templateUrl: 'blog/views/oakland.tpl.html'
                  }
              },
              data:{ pageTitle: 'Traveling to the Bay Area? Oakland is the “Cool Kid” Everyone Wants to Eat With', linkRelImg: 'https://cdn.filepicker.io/api/file/zQebFNjTRr6QAgVDzQ4x' },
              meta: {
                  'title': 'Traveling to the Bay Area? Oakland is the “Cool Kid” Everyone Wants to Eat With',
                  'description': 'I have visited San Francisco dozens of times over the past decade and fell in love with the city. But I found myself in the same routine over the over again – walking down Lombard Street.',
                  'image' : 'https://cdn.filepicker.io/api/file/zQebFNjTRr6QAgVDzQ4x',
                  'url' : 'traveling-to-the-bay-area-oakland-is-the-cool-kid-everyone-wants-to-eat-with',
                  'type' : 'article'
              }
          })
          .state('blog.emilyblog', {
              url: '/my-experience-using-your-local-cousin-while-traveling-to-edinburgh-scotland',
              views : {
                  view : {
                      templateUrl: 'blog/views/emilyblog.tpl.html'
                  }
              },
              data:{ pageTitle: '', linkRelImg: 'https://cdn.filepicker.io/api/file/1tM9MWr2QEesvJxNdN10' },
              meta: {
                  'title': 'My Experience using Your Local Cousin while traveling to Edinburgh, Scotland',
                  'description': 'When I’m traveling, the last thing I want to be doing is sitting in my hotel room furiously Googling the best attractions and lunch spots. Sometimes I don’t have time to do thorough preparation before embarking on a great adventure.',
                  'image' : 'https://cdn.filepicker.io/api/file/1tM9MWr2QEesvJxNdN10',
                  'url' : 'my-experience-using-your-local-cousin-while-traveling-to-edinburgh-scotland',
                  'type' : 'article'
              }
          })
          .state('blog.tragichistories', {
              url: '/the-tragic-histories-of-nice',
              views : {
                  view : {
                      templateUrl: 'blog/views/tragichistories.tpl.html'
                  }
              },
              data:{ pageTitle: '', linkRelImg: 'https://cdn.filepicker.io/api/file/qGOrjjwBTniOgUoEnTAr' },
              meta: {
                  'title': 'The Tragic Histories of Nice',
                  'description': 'With a name like “Nice” and its 300 days of sunshine, it’s hard to imagine that this tranquil city carries some dark, tragic historical baggage that are not known to most travellers/visitors or even locals. ',
                  'image' : 'https://cdn.filepicker.io/api/file/qGOrjjwBTniOgUoEnTAr',
                  'url' : 'the-tragic-histories-of-nice',
                  'type' : 'article'
              }
          })
          .state('blog.mexicostequila', {
              url: '/mexicos-tequila-trail-the-best-way-to-see-tequila-country',
              views : {
                  view : {
                      templateUrl: 'blog/views/mexicostequila.tpl.html'
                  }
              },
              data:{ pageTitle: '', linkRelImg: 'https://www.filepicker.io/api/file/1T18XNH1QmKHoCx5KUKJ' },
              meta: {
                  'title': 'Mexico’s Tequila Trail - The Best Way To See Tequila Country',
                  'description': 'For all you tequila fanatics, you finally have the chance to not only visit the origin of this golden drink, but to also sample some of the finest tequila the region has to offer',
                  'image' : 'https://www.filepicker.io/api/file/1T18XNH1QmKHoCx5KUKJ',
                  'url' : 'mexicos-tequila-trail-the-best-way-to-see-tequila-country',
                  'type' : 'article'
              }
          })
          .state('blog.pokemon', {
              url: '/pokemon-go-guide-delhi',
              views : {
                  view : {
                      templateUrl: 'blog/views/pokemon.tpl.html'
                  }
              },
              data:{ pageTitle: 'Pokemon Go Guide – The Best Places to catch Pokemon in Delhi', linkRelImg: 'https://cdn.filepicker.io/api/file/sGnZyN1mSCqbYZdw0UCd' },
              meta: {
                  'title': 'Pokemon Go Guide – The Best Places to catch Pokemon in Delhi',
                  'description': 'Just downloaded version 0.35.0? Sweet!!! If you don’t know what I’m talking about, well you’re Slow-bro. Might just get another update, by the time you’re done reading this!',
                  'image' : 'https://cdn.filepicker.io/api/file/sGnZyN1mSCqbYZdw0UCd',
                  'url' : 'pokemon-go-guide-delhi',
                  'type' : 'article'
              }
          })
          .state('blog.scottishhighlands', {
              url: '/inside-the-scottish-highland-games-a-wonderful-highland-gathering-tradition',
              views : {
                  view : {
                      templateUrl: 'blog/views/scottishhighlands.tpl.html'
                  }
              },
              data:{ pageTitle: 'Inside the Scottish Highland Games – A wonderful Highland Gathering Tradition', linkRelImg: 'https://cdn.filepicker.io/api/file/5LUQaF1fRxqsIKxPYgV6' },
              meta: {
                  'title': 'Inside the Scottish Highland Games – A wonderful Highland Gathering Tradition',
                  'description': 'The Highland Gathering of Clans in Scotland is a serious event and the call to attend is never to be ignored.',
                  'image' : 'https://cdn.filepicker.io/api/file/5LUQaF1fRxqsIKxPYgV6',
                  'url' : 'inside-the-scottish-highland-games-a-wonderful-highland-gathering-tradition',
                  'type' : 'article'
              }
          })
          .state('blog.offbeatcentral', {
              url: '/ten-off-beat-places-to-visit-in-central-america',
              views : {
                  view : {
                      templateUrl: 'blog/views/offbeatcentral.tpl.html'
                  }
              },
              data:{ pageTitle: '10 Off Beat Places to Visit in Central America', linkRelImg: 'https://cdn.filepicker.io/api/file/ExMEYVLSQKto6xQv1dgg' },
              meta: {
                  'title': '10 Off Beat Places to Visit in Central America',
                  'description': 'Just as it happens in every other region of the world, there are destinations that tend to call a traveler’s attention more than others. They usually receive a lot of visitors and seem, as though everyone you know has already been there or wants to go.',
                  'image' : 'https://cdn.filepicker.io/api/file/ExMEYVLSQKto6xQv1dgg',
                  'url' : 'ten-off-beat-places-to-visit-in-central-america',
                  'type' : 'article'
              }
          })
          .state('blog.trekhimalaya', {
              url: '/why-your-next-trek-should-be-leh',
              views : {
                  view : {
                      templateUrl: 'blog/views/trekhimalaya.tpl.html'
                  }
              },
              data:{ pageTitle: 'Why your next trek should be Leh, Ladakh - India', linkRelImg: 'https://cdn.filepicker.io/api/file/FbZaKnVSoKquSRcN7ulC' },
              meta: {
                  'title': 'Why your next trek should be Leh, Ladakh - India',
                  'description': 'For those interested in trekking, there are a number of good and challenging treks out there from the Markha Valley trek or the even more challenging Zanskar trek.',
                  'image' : 'https://cdn.filepicker.io/api/file/FbZaKnVSoKquSRcN7ulC',
                  'url' : 'why-your-next-trek-should-be-leh',
                  'type' : 'article'
              }
          })
          .state('blog.travellingcuba', {
              url: '/travelling-to-cuba-from-us',
              views : {
                  view : {
                      templateUrl: 'blog/views/travellingcuba.tpl.html'
                  }
              },
              data:{ pageTitle: 'Traveling to Cuba from the United States? This is how you do it.', linkRelImg: 'https://cdn.filepicker.io/api/file/dbxX0HuARIS7oLjutMUa' },
              meta: {
                  'title': 'Traveling to Cuba from the United States? This is how you do it.',
                  'description': "How to travel to Cuba if you're an American citizen or live in the United States and do not want to go in an organized tour. Your guide to a hassle free entry in to the country and our top tips before you go to Cuba.",
                  'image' : 'https://cdn.filepicker.io/api/file/dbxX0HuARIS7oLjutMUa',
                  'url' : 'travelling-to-cuba-from-us',
                  'type' : 'article'
              }
          })
          .state('blog.fourdaysincuba', {
              url: '/four-days-in-cuba',
              views : {
                  view : {
                      templateUrl: 'blog/views/fourdaysincuba.tpl.html'
                  }
              },
              data:{ pageTitle: 'Four days in Cuba', linkRelImg: 'https://cdn.filepicker.io/api/file/UoM9UptMRuKH8jxEn7Kz' },
              meta: {
                  'title': 'Four days in Cuba',
                  'description': "Planning a trip to Cuba for less than a week? Here is what a Havana local recommends you should eat, see and shop! Insider tips and a detailed four day itinerary for Havana and Vinales Valley.",
                  'image' : 'https://cdn.filepicker.io/api/file/UoM9UptMRuKH8jxEn7Kz',
                  'url' : 'four-days-in-cuba',
                  'type' : 'article'
              }
          })
          .state('blog.chambalriversafari', {
              url: '/chambal-river-safari',
              views : {
                  view : {
                      templateUrl: 'blog/views/chambal.tpl.html'
                  }
              },
              data:{ pageTitle: 'River safari in croc-infested waters!', linkRelImg: 'https://cdn.filepicker.io/api/file/hJCQAZFTDycOOqkF5IPw' },
              meta: {
                  'title': 'River safari in croc-infested waters!',
                  'description': "We got your attention, didn’t we? You can now do a river safari on the once notorious Chambal River.",
                  'image' : 'https://cdn.filepicker.io/api/file/hJCQAZFTDycOOqkF5IPw',
                  'url' : 'chambal-river-safari',
                  'type' : 'article'
              }
          })
          .state('blog.bluecliffmonastery', {
              url: '/blue-cliff-monastery',
              views : {
                  view : {
                      templateUrl: 'blog/views/bluecliffmonastery.tpl.html'
                  }
              },
              data:{ pageTitle: 'Peace & Mediation – a short drive from New York City!', linkRelImg: 'https://cdn.filepicker.io/api/file/KEt9VXIbTpm3iSG5FqfW' },
              meta: {
                  'title': 'Peace & Mediation – a short drive from New York City!',
                  'description': "Looking for peace and meditation? Check out the Blue Cliff Monastery in Upstate New York.",
                  'image' : 'https://cdn.filepicker.io/api/file/KEt9VXIbTpm3iSG5FqfW',
                  'url' : 'blue-cliff-monastery',
                  'type' : 'article'
              }
          });
    });
