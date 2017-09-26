'use strict';
angular.module('com.ylc.locations')
  .controller('LocationsCtrl', function($scope, CoreService,Search,$stateParams,$state,
                                        SearchLocationRef,SaveSearch,gettextCatalog,User,usSpinnerService,
                                        LocationPhotosRef,blockUI,Profile,Auth,ngMeta,algolia) {



      // For Stopping auto-play of videos in angular-bg-video plugin
      $scope.videoBgCallback = function (player) {
          $scope.pausePlayback = function () {
              player.pauseVideo();
          };
          $scope.playPlayback = function () {
              $('.yt-play-button').addClass('hide');
              player.playVideo();
          };
          // Pause video on start
          $scope.pausePlayback();
      };


    var searchPresent = false;



    searchPresent  = SaveSearch.getUserSearch() ? true : $stateParams.location ? false : $state.go('home');

    if(!searchPresent){
      var location = $stateParams.location;
        if(location){
            var locationArray = location.split('-');
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({'address' : locationArray.join(',') }, function (locationResults, status) {
                if(status == google.maps.GeocoderStatus.OK){
                    var savedSearch = locationResults;
                    //var savedSearch = SaveSearch.getUserSearch();
                    $scope.searchDetails = function(localId){
                        // Saving filter object states on a global object
                        console.log('I was still called');
                        setFilterData(savedSearch);
                        // Saving users search on a global object
                        SaveSearch.setUserSearch(savedSearch);
                        $state.go('search.details',{id : localId});
                    };
                    // For setting meta tags through ngMeta
                    setMetaTags(savedSearch);
                    // For setting the cover video or cover image
                    setCoverVideo(savedSearch[0].place_id);
                    // id : 'oM2j_rxZNl8'
                    setSearchQueryFunctions(savedSearch);
                }
            });
        }
    } else {
        var savedSearch = SaveSearch.getUserSearch();
        $scope.searchDetails = function(localId){
            // Saving filter object states on a global object
            setFilterData(savedSearch);
            // Saving users search on a global object
            SaveSearch.setUserSearch(savedSearch);
            $state.go('search.details',{id : localId});
        };
        // For setting meta tags through ngMeta
        setMetaTags(savedSearch);
        // For setting the cover video or cover image
        setCoverVideo(savedSearch[0].place_id);
        // id : 'oM2j_rxZNl8'
        setSearchQueryFunctions(savedSearch);
    }


      /**
       * Function to get locals based on savedSearch Object
       * @params: savedSearch, an object returned by Google Geocoder API
       */
      function setSearchQueryFunctions (savedSearch) {
          if(savedSearch){

              $scope.extendedSearch = true;

              $scope.exactMatch = null;
              $scope.searchResultsExactMatch = [];
              $scope.searchedLocation = {};

              $scope.localsFoundExactMatch = 0;
              $scope.$watch('searchResultsExactMatch', function(newVal) {
                  $scope.localsFoundExactMatch = newVal.length;
              });

                angular.forEach(savedSearch[0].address_components, function (val, key) {
                    if(val.types[0] === savedSearch[0].types[0] && val.types[0] !== null && val.types[0] !== undefined){
                        $scope.formattedAddress = val.long_name;
                    }
                    if (val.types[0] === 'locality') {
                        $scope.searchedLocation.cityName = val.long_name;
                    } else if (val.types[0] === 'administrative_level_1') {
                        $scope.searchedLocation.stateName = val.long_name;
                    } else if (val.types[0] === 'country') {
                        $scope.searchedLocation.countryName = val.long_name;
                    }
                });

              function addLocalsToList (locals) {
                  $scope.searchResultsExactMatch = [];
                  for (var i = 0; i < locals.length; ++i) {
                      var local = locals[i];

                      /* Logic for advises tags for every local */
                      local.userAdvisesRandom = [];
                      if ($scope.filterObject['advisesArray'] === undefined) {
                          var userAdvisesArray = Array.prototype.concat(local.advisesArray);
                          local.userAdvisesRandom = userAdvisesArray.splice(0, 3);
                      } else {
                          var j = 0;
                          for (j = 0; j < $scope.filterObject['advisesArray'].length && j < 3; ++j) {
                              local.userAdvisesRandom.push($scope.filterObject['advisesArray'][j]);
                          }
                          if (j < 3) {
                              for (var k = 0; k < local.advisesArray.length; ++k) {
                                  var notInArray = true;
                                  for (var l = 0; l < local.userAdvisesRandom.length; ++l) {
                                      if (local.advisesArray[k] === local.userAdvisesRandom[l]) {
                                          notInArray = false;
                                          break;
                                      }
                                  }
                                  if (notInArray) {
                                      local.userAdvisesRandom.push(local.advisesArray[k]);
                                      j++;
                                      if (j >= 3) {
                                          break;
                                      }
                                  }
                              }
                          }
                      }
                      $scope.searchResultsExactMatch.push(local);
                  }

                  // Only runs on first search
                  if ($scope.exactMatch === null) {
                      $scope.exactMatch = $scope.searchResultsExactMatch.length === 0;
                  }
              } // addLocalsToList ends

              if (savedSearch.filters === undefined) {
                  $scope.filters = {
                      occupations: {},
                      triptypes: {},
                      interests: {},
                      languages: {},
                      cities: {},

                      occupationsPrevObject: null
                  };
              } else {
                  $scope.filters = savedSearch.filters;
              }

              //11b8c8bf186dd99b315b855af7198b1a
              // algolia = algolia.Client('PJND61LW6F', '11b8c8bf186dd99b315b855af7198b1a');
              algolia = algolia.Client('PJND61LW6F', 'c0e2c0520f6601cf60729b9ba6ecd864');
              $scope.helper = algoliasearchHelper(algolia, 'Locals', {
                  hitsPerPage: 1000,
                  facets: [
                      'profession',
                      'interestsArray',
                      'advisesArray',
                      'languagesArray',
                      'localIsReady',
                      'cityLocations.city',
                      'cityLocations.country',
                      'cityLocations.state'
                  ],
                  filters: 'localIsReady:true'
              });
              $scope.helper.on('result', function(data) {

                  console.log(data);
                  var locals = data.hits;
                  var facets = data.facets;
                  addLocalsToList(locals);


                  // console.log(facets);
                  for (var f = 0; f < facets.length; ++f) {
                      var facet = facets[f];
                      switch (facet.name) {
                        case 'profession':
                          $scope.filters.occupationsArray = facet.data;
                          break;
                        case 'interestsArray':
                          $scope.filters.interestsArray = facet.data;
                          break;
                        case 'languagesArray':
                          $scope.filters.languagesArray = facet.data;
                          break;
                        case 'advisesArray':
                          $scope.filters.triptypesArray = facet.data;
                          break;

                        case 'cityLocations.city':
                          if ($scope.citiesPresent) {
                              // If it is a state then sort by second last element else sort by 1 (country)
                              var sortElementOffset = savedSearch[0].types[0] === 'administrative_area_level_1' ? 2 : 1;
                              var allCities = Object.keys(facet.data);
                              var countriesCount = {};
                              allCities.forEach(function (element) {
                                  var splitElement = element.split(',');
                                  var country = splitElement[splitElement.length - sortElementOffset];
                                  countriesCount[country] = countriesCount[country] === undefined ? 0 : countriesCount[country] + 1;
                              });
                              // console.log(countriesCount);
                              var allCountries = Object.keys(countriesCount);
                              var maxCountry = allCountries[0];
                              for (var m = 0; m < allCountries.length; ++m) {
                                  if (countriesCount[allCountries[m]] > maxCountry) {
                                      maxCountry = allCountries[m];
                                  }
                              }
                              $scope.filters.cityLocationsCity = {};
                              allCities.forEach(function (element) {
                                  var splitElement = element.split(',');
                                  var country = splitElement[splitElement.length - sortElementOffset];
                                  if (country === maxCountry) {
                                      $scope.filters.cityLocationsCity[element] = facet.data[element];
                                  }
                              });
                              // console.log(facet.data);
                              // console.log($scope.filters.cityLocationsCity);
                          } else {
                              $scope.filters.cityLocationsCity = {};
                          }
                          break;
                      }
                  }
                  // console.log($scope.filters);
                  blockUI.stop();
              });


              // console.log(savedSearch);

              // Setting parameters for first search when user comes to the search page
              $scope.citiesPresent = false;
              if (savedSearch[0].types[0] === 'country') {
                  $scope.helper.addFacetRefinement('cityLocations.country', savedSearch[0].place_id);
                  $scope.citiesPresent = true;
              } else if (savedSearch[0].types[0] === 'administrative_area_level_1') {
                  $scope.helper.addFacetRefinement('cityLocations.state', savedSearch[0].place_id);
                  $scope.citiesPresent = true;
              } else {
                  $scope.helper.setQueryParameter('aroundLatLng', savedSearch[0].geometry.location.lat() + ', ' + savedSearch[0].geometry.location.lng());
                  $scope.helper.setQueryParameter('aroundRadius', 5000); // 5 Km Radius
              }
              $scope.helper.search();


              // Create a new filterObject if no global state exist
              if (savedSearch.filterObject === undefined) {
                  $scope.filterObject = {};
              } else {
                  $scope.filterObject = savedSearch.filterObject;
                  // console.log($scope.filterObject);
                  var groups = Object.keys($scope.filterObject);
                  for (var i = 0; i < groups.length; ++i) {
                      var groupString = groups[i];
                      for (var j = 0; j < $scope.filterObject[groups[i]].length; ++j) {
                          var facetString = groupString === 'cityLocationsCity' ? 'cityLocations.city' : groupString;
                          $scope.helper.addFacetRefinement(facetString, $scope.filterObject[groupString][j]);
                      }
                  }
                  $scope.helper.search();
              }

              // Common function which is called for every item clicked on every filter
              $scope.selectFilter = function (element, filterGroup, groupString) {
                  // Starting the spinner/loader
                  blockUI.start('Searching...');
                  // Flip the boolean for all filters alike
                  filterGroup[element] = !filterGroup[element];

                  // Different facetString for cityLocationsCity only, for others, groupString is the facetString
                  var facetString = groupString === 'cityLocationsCity' ? 'cityLocations.city' : groupString;

                  // For profession/occupation, single-selection, no multiple selection like other filters
                  if (groupString === 'profession') {
                      if ($scope.filters.occupationsPrevObject !== null && element !== $scope.filters.occupationsPrevObject) {
                          filterGroup[$scope.filters.occupationsPrevObject] = false;
                          $scope.helper.removeFacetRefinement('profession', $scope.filters.occupationsPrevObject);
                      }
                      $scope.filters.occupationsPrevObject = element;
                  }

                  // Common for all filters
                  if (filterGroup[element]) {
                      // Change state of filterObject
                        if ($scope.filterObject[groupString] !== undefined) {
                            $scope.filterObject[groupString].push(element);
                        } else {
                            $scope.filterObject[groupString] = [ element ];
                        }

                      // console.log($scope.filterObject);
                      // Add Facet to Algolia
                      $scope.helper.addFacetRefinement(facetString, element).search();
                  } else {

                      // Change state of filterObject
                        if ($scope.filterObject[groupString].length > 1) {
                            var elementIndex = $scope.filterObject[groupString].indexOf(element);
                            if (elementIndex > -1) {
                                $scope.filterObject[groupString].splice(elementIndex, 1);
                            }
                        } else {
                            delete $scope.filterObject[groupString];
                        }

                      // console.log($scope.filterObject);
                      // Remove Facet from Algolia
                      $scope.helper.removeFacetRefinement(facetString, element).search();
                  }
              };

              $scope.clearFilters = function () {
                  blockUI.start('Clearing filters...');
                  // Resetting all filter states
                  $scope.filterObject = {};
                  $scope.filters = {
                      occupations: {},
                      triptypes: {},
                      interests: {},
                      languages: {},
                      cities: {},

                      occupationsPrevObject: null
                  };

                   // Clearing facets from Algolia
                  $scope.helper.clearRefinements('profession');
                  $scope.helper.clearRefinements('interestsArray');
                  $scope.helper.clearRefinements('advisesArray');
                  $scope.helper.clearRefinements('languagesArray');
                  $scope.helper.clearRefinements('cityLocations.city');
                  $scope.helper.search();
              };


              // Setting click events for all filter items
              $('div.dropdown.custom-dropdown button.dropdown-toggle').on('click', function (event) {
                  var hasOpenClass = $(this).parent().hasClass('open');
                  $('div.dropdown.custom-dropdown').removeClass('open');
                  if (!hasOpenClass) {
                      $(this).parent().addClass('open');
                  }
              });

              // When user clicks on the body to close any filter's box
              $('body').on('click', function (e) {
                  if (!$('div.dropdown.custom-dropdown').is(e.target) 
                      && $('div.dropdown.custom-dropdown').has(e.target).length === 0 
                      && $('.open').has(e.target).length === 0
                     ) {
                         $('div.dropdown.custom-dropdown').removeClass('open');
                     }
              });

              $('.close-dropdown').on('click', function (e) {
                  $('div.dropdown.custom-dropdown').removeClass('open');
              });



              // The code below is used to set the banner for the search page based on the searched location
              var geoFirePhotos = new GeoFire(LocationPhotosRef);
              var geoQueryPhotos = geoFirePhotos.query({
                  center: [savedSearch[0].geometry.location.lat(), savedSearch[0].geometry.location.lng()],
                  radius: 500000
              });
              var photoDistance = [];
              var onKeyEntered = geoQueryPhotos.on("key_entered", function(key, location, distance) {
                  photoDistance.push({dist : distance, photoKey : key});
              });
              var onReady = geoQueryPhotos.on("ready", function() {
                  photoDistance.sort(function (val1, val2) {
                      return val1.dist - val2.dist
                  });

                  if(photoDistance.length > 0){
                      var keySotred = photoDistance[0].photoKey;
                      var keyStored = keySotred.substring(0,keySotred.indexOf("_oO_DUDEDUDE_Oo_"));
                      var url = atob(keyStored);
                      $scope.photoURL = url;
                  } else {
                      $scope.photoURL = 'https://www.filepicker.io/api/file/DGouJ1aQTamSGERVVNhQ';
                  }
              });

          } else {

              // Handling empty searches
              blockUI.stop();
              CoreService.toastError(gettextCatalog.getString('Place needed!'), gettextCatalog.getString('Pick a place and search, if the problem still persist contact us at info@yourlocalcousin.com'));
              $state.go('home');
          }
      }

      /**
       * Function to save the state for filters
       * @params: savedSearch
       */
      function setFilterData (savedSearch) {
          savedSearch.filterObject = $scope.filterObject;
          savedSearch.filters = $scope.filters;
      }
      /**
       * Function to set the Cover Video
       * @params: place_id
       */
      function setCoverVideo (place_id) {
          var coverVideos = {
              'ChIJA-2qKIt9hYARZ5N1NdUVtHE' : { id : 'oM2j_rxZNl8'},
              'ChIJQ4Ld14-UC0cRb1jb03UcZvg' : { id : '3N16mMRxMaw'},
              'ChIJi3lwCZyTC0cRkEAWZg-vAAQ' : { id : '3N16mMRxMaw'}
          };

          $scope.videoFound = null;

          if(place_id === 'ChIJA-2qKIt9hYARZ5N1NdUVtHE' || place_id === 'ChIJQ4Ld14-UC0cRb1jb03UcZvg' || place_id ===  'ChIJi3lwCZyTC0cRkEAWZg-vAAQ'){
              $scope.videoFound = true;
              $scope.video = coverVideos[place_id];
          } else {
              $scope.videoFound= false;
          }
      }

      /**
       * Function to set ngMeta Descriptions specific locations
       * @params: savedSearch, Object which stores information on current location
       */
      function setMetaTags (savedSearch) {
          var savedCity = null;
          var savedCountry = null;
          angular.forEach(savedSearch[0].address_components, function (val, key) {
              if(val.types[0] !== null && val.types[0] !== undefined){
                  if (val.types[0] === 'locality') {
                      savedCity = val.long_name.toLowerCase();
                  } else if (val.types[0] === 'country') {
                      savedCountry = val.long_name.toLowerCase();
                  }
              }
          });
          var initialName = savedSearch[0].address_components[0].long_name;
          var metaTitle = 'Your Local Cousin | ' + savedCity + ' ' + savedCountry;
          var metaDescription = '';
          switch (savedCity + '-' + savedCountry) {
          case 'paris-france':
              metaDescription = 'Live like a local in Paris.  We have over 20 locals who have you covered whether you are into budget travel or long-term travel or business travel.  Find the best pastries, bars and restaurants with our insider tips.';
              break;
          case 'spain-barcelona':
              metaDescription = 'Find the hidden gems in Barcelona and get travel advice from over 20 locals. Take an adventurous and life changing trip customized by your expert local cousin.';
              break;
          case 'oakland-united states':
              metaDescription = 'Have a unique Oakland travel experience and get personalized advice from our Oakland locals.  They can tell you where to eat, what to see and what to do around Oakland. Getting to Oakland from San Francisco is easy by ferry or BART. ';
              break;
          case 'new york-united states':
              metaDescription = 'Make the most out of your trip to New York City and get personalized travel tips from our expert locals. Get unique travel insights and experience the hidden gems.  Local cousins create itineraries for the best NYC vacations.';
              break;
          case 'null-japan':
              metaDescription = 'Our Tokyo locals will help you find unique places around Tokyo. Have an authentic customized travel experience and get around Tokyo easily with our locals.';
              break;
          case 'oslo-norway':
              metaDescription = 'Experience Oslo like a local and get authentic travel trips from our Oslo locals.  In the summer have a unique trip around Oslo using insider tips from actual locals.';
              break;
          case 'null-hongkong':
              metaDescription = 'Speak with our Hong Kong locals and create your travel plans.  You can quickly plan your trip with our help and get your own custom maps and itineraries. Have an unforgettable experience.';
              break;
          case 'null-norway':
              metaDescription = 'Experience Norway cities like a local and skip the tourist traps. Get customized travel planning that is quick and cheap.';
              break;
          case 'rome-italy':
              metaDescription = 'Get in touch with one of our Rome locals who know about the hidden treasures in Rome you should definitely visit. Travel like a local.';
              break;
          case 'bangkok-thailand':
              metaDescription = 'We have many knowledgable locals in Bangkok. Get customized travel tips from our local experts and explore all the hidden gems quick and cheap.';
              break;
          case '-indonesia':
              metaDescription = 'We have many locals in Bali who will ensure that you have a unique travel experience. Explore Bali beyond the top spots and find the hidden gems. Avoid the tourist traps.';
              break;
          case 'phuket-thailand':
              metaDescription = 'Whether you are a solo traveler to Phuket seeking budget travel or on a long tour to Phuket, our locals can help you make the most out of your trip. Call, text and skype our amazing locals.';
              break;
          case '-taiwan':
              metaDescription = 'Make the most out of your trip to Taiwan and get personalized travel tips from our locals. Our locals offer unique travel experiences and customized itineraries for your Taiwan vacation.';
              break;
          case 'beijing-china':
              metaDescription = 'Our Beijing locals will share with you unique places to go in and around Beijing. Have an authentic customized travel experience with locals.';
              break;
          case '-myanmar (burma)':
              metaDescription = 'Have a unique Myanmar travel experience by getting personalized advice from our Myanmar locals. We have got you covered whether you are on a business or adventure trip. Eat great food and visit the best bars.';
              break;
          case '-singapore':
              metaDescription = 'Find the hidden gems in Singapore with our amazing locals and take travel advice from these trip experts. Have an adventurous trip customized for you by our locals.';
              break;
          case '-cambodia':
              metaDescription = 'Get in touch with one of our Cambodia locals to learn about the hidden treasures in Cambodia. Travel like a local and plan your trip fast and cheap.';
              break;
          case '-malaysia':
              metaDescription = 'Find the hidden gems in Penang with the help of our locals. Have an adventurous and life changing trip customized for you by our locals.';
              break;
          case 'yangon-myanmar (burma)':
              metaDescription = 'Talk to our Yangon locals and create your travel plans inexpensively and get your own custom maps and itineraries. Have an unforgettable Myanmar trip experience.';
              break;
          case 'tbilisi-georgia':
              metaDescription = 'Discover Tbilisi and Georgia like a local with insider tips from our expert locals. Call, text and email all your travel questions and get fast answers.';
              break;
          case 'mexico city-mexico':
              metaDescription = 'Find the hidden gems in Mexico City with 7+ locals and take travel advice from these experts. Have an adventurous trip customized for you by our locals.';
              break;
          case 'san diego-united states':
              metaDescription = 'If you are visiting San Diego soon then live like a local and skip the tourist traps. Our expert insiders tell you how over text, phone, e-mail and skype.';
              break;
          case 'jaipur-india':
              metaDescription = 'Find the hidden gems in Barcelona and get travel advice from over 11 locals. Take an adventurous and life changing trip customized by your expert local cousin.';
              break;
          case 'colombo-sri lanka':
              metaDescription = 'Have a unique Colombo travel experience and get personalized advice from our Colombo locals. We’ve got you covered whether you are on a business or an adventure trip.';
              break;
          case 'dubai-united arab emirates':
              metaDescription = 'Make the most out of your trip to Dubai and get personalized travel tips from our expert locals. Get unique travel insights and experience something unique.  Local cousins create itineraries for the best Dubai vacations.';
              break;
          case 'krong siem reap-cambodia':
              metaDescription = 'Our Seam Reap locals will help you in finding unique places to go in and around Seam Reap. Have an authentic customized Cambodian travel experience.';
              break;
          case 'udaipur-india':
              metaDescription = 'Experience Udaipur like a local and use authentic travel trips from our Udaipur locals.  Have a unique travel trip to Udaipur in Rajasthan.';
              break;
          case 'delhi-india':
              metaDescription = 'Experience Delhi like a local and get rid of travel guides. Get customized travel planning at an inexpensive rate.';
              break;
          case 'kuala lumpur-malaysia':
              metaDescription = 'Get in touch with one of our 8+ Kuala Lumpur locals to know about the hidden treasures in Kuala Lumpur you should definitely visit. Travel like a local in Malaysia.';
              break;
          case 'null-india':
              metaDescription = 'We have 5+ locals in Goa. Get customized travel tips from our local experts and explore all the hidden gems in Goa.';
              break;
          case 'hanoi-vietnam':
              metaDescription = 'We have over 15 locals in Hanoi who will ensure that you have a unique travel experience. Explore Hanoi in Vietnam beyond the top spots.';
              break;
          case 'ho chi minh city-vietnam':
              metaDescription = 'Whether you are a solo traveler to Ho Chi Minh City in Vietnam seeking budget travel or on a long tour to Ho Chi Minh City, our 10+ locals can help you make the most out of your trip.';
              break;
          case 'agra-india':
              metaDescription = 'Make the most out of your trips to Agra and get personalized travel tips from our locals. Let us ensure unique travel experience and customized itineraries for your Agra vacation.';
              break;
          case 'null-thailand':
              if (initialName === 'Chiang Mai') {
                  metaDescription = 'Our Chiang Mai locals will share with you unique places to go in and around Chiang Mai. Have an authentic customized Thailand travel experience.';
              } else if (initialName === 'Krabi') {
                  metaDescription = 'Have a unique Krabi travel experience by getting personalized advice from our Krabi locals. We’ve got you covered whether you are on a business or adventure trip to Thailand.';
              }
              break;
          case 'null-indonesia':
              metaDescription = 'Get in touch with one of our 6+ Jakarta locals to know about the hidden treasures in Jakarta and definitely visit these. Travel like a local in Indonesia.';
              break;
          case 'yogyakarta-indonesia':
              metaDescription = 'Find the hidden gems in Yogyakarta in Indonesia with the help of our 5+ locals. Have an adventurous and life changing trip which is customized for you by our locals.';
              break;
          case 'nadiad-india':
              metaDescription = 'Experience Nadi in Fiji like a local and get rid of travel guides. Get customized travel planning at inexpensive rates.';
              break;
          }
          ngMeta.setTitle(metaTitle);
          ngMeta.setTag('description', metaDescription);
      }
  })
    .filter('shuffle', function() {
        return function(ary) {

        }
    })

    .filter('capitalize', function() {
        return function(input) {
            return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
        }
    });
