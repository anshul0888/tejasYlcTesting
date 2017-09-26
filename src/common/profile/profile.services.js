/**
 * Created by TJ on 8/27/15.
 */

(function() {
    angular.module('com.ylc.profile', [])
        .factory('Profile',function($firebaseArray,$firebaseObject,UsersRef,PhotosRef,CitiesRef,VideosRef,CityLocationAddQueueRef,StateLocationAddQueueRef,
                                    CountryLocationAddQueueRef,LocationRemoveQueueRef,StateLocationRemoveQueueRef,CountryLocationRemoveQueueRef,
                                    InterestsRef,AdvisesRef,LanguagesRef,EmailSignupWelcomeLocalQueueRef,CoreService,gettextCatalog,InformYLCQueueRef,
                                    LocationAddQueueRef,CityLocationAddQueueRef,StateLocationAddQueueRef,PhotosLocRef,
                                    CountryLocationAddQueueRef,LocationsRef,InformTJQueueRef,TestimonialsRef,RatingsRef,OrdersRef){
            //var users = $firebaseArray(UsersRef);
            var Profile = {
                getProfile : function(uid){
                    return $firebaseObject(UsersRef.child(uid));
                },
                //getDisplayName : function(uid){
                //    return users.$getRecord(uid).firstName;
                //},
                //all : users,
                noobNoMore : function(uid){
                    $firebaseObject(UsersRef.child(uid).child('noob')).$save().then(function(data){
                        data.set(false);
                    })
                },
                localIsANoob : function (uid) {
                    return $firebaseObject(UsersRef.child(uid).child('noob'));
                },
                isALocal : function (uid) {
                    return $firebaseObject(UsersRef.child(uid).child('isALocal'));
                },
                putUserAsALocal : function (uid) {
                    return $firebaseObject(UsersRef.child(uid).child('isALocal'));
                },
                islocalWelcomeEmailSent : function (uid) {
                    return UsersRef.child(uid).child('localWelcomeEmailSent');
                },
                localWelcomeEmailSent : function (uid) {
                    $firebaseObject(UsersRef.child(uid).child('localWelcomeEmailSent')).$save().then(function (ref) {
                        ref.set(true);
                    })
                },
                addCoverPhotoToProfile : function(uid,photoMeta){
                    return $firebaseArray(PhotosRef).$add(photoMeta).then(function(ref){
                        $firebaseObject(UsersRef.child(uid).child("coverPhotos").child(ref.key())).$save().then(function(dataRef){
                            dataRef.set(true);
                        })
                    });
                },
                isLocalReady : function (uid) {
                    return $firebaseObject(UsersRef.child(uid).child('localIsReady'));
                },
                addVideoToProfile : function (uid, videoMeta) {
                    return $firebaseArray(UsersRef.child(uid).child("videos")).$add(videoMeta);
                },
                getVideos : function(uid){
                    if (uid) {
                        return $firebaseArray(UsersRef.child(uid).child("videos"));
                    }
                    else {
                        return null;
                    }
                },
                getTestimonialCount : function (uid) {
                    return $firebaseArray(UsersRef.child(uid).child('testimonials'));
                },
                addLocationPhoto : function (data) {
                    return $firebaseArray(PhotosLocRef.child('tasks')).$add(data);
                },
                getTestimonials : function(uid){
                    if (uid) {
                        var refTestimonials = new Firebase.util.NormalizedCollection(
                            [UsersRef.child(uid).child('testimonials'),"userTestimonials"],
                            [TestimonialsRef,"testimonials"]
                        ).select(
                            "testimonials.testimonialValue",
                            "testimonials.testimonialDateTime",
                            "testimonials.testimonialBy",
                            "testimonials.orderId"
                        ).ref();

                        return $firebaseArray(refTestimonials);
                    }
                    else {
                        return null;
                    }
                },
                getOldTestimonials : function (uid) {
                    if(uid){
                        return $firebaseArray(UsersRef.child(uid).child('oldWebsiteTestimonials'));
                    }
                },
                getRatingCount : function (uid) {
                    return $firebaseArray(UsersRef.child(uid).child('ratings'));
                },
                getRatings : function(uid){
                    if (uid) {
                        var refRatings = new Firebase.util.NormalizedCollection(
                            [UsersRef.child(uid).child('ratings'),"userRatings"],
                            [RatingsRef,"ratings"]
                        ).select(
                            "ratings.ratingValue",
                            "ratings.ratingDateTime",
                            "ratings.ratingBy",
                            "ratings.orderId"
                        ).ref();

                        return $firebaseArray(refRatings);
                    }
                    else {
                        return null;
                    }
                },
                removeAdviseFromProfile : function (id, uid) {
                    return $firebaseObject(UsersRef.child(uid).child('advises').child(id)).$remove();
                },
                removeLanguageFromProfile : function (id, uid) {
                    return $firebaseObject(UsersRef.child(uid).child('languages').child(id)).$remove();
                },
                removeInterestFromProfile : function (id, uid) {
                    return $firebaseObject(UsersRef.child(uid).child('interests').child(id)).$remove();
                },

                getCoverPhotos : function(uid){
                    if (uid) {
                        var refPhotos = new Firebase.util.NormalizedCollection(
                            [UsersRef.child(uid).child('coverPhotos'),"userPhotos"],
                            [PhotosRef,"photos"]
                        ).select(
                            "photos.url"
                        ).ref();

                        return $firebaseArray(refPhotos);
                    }
                    else {
                        return null;
                    }
                },
                migrateExistingUserEmails : function () {
                    return UsersRef;
                },
                deleteCoverPhoto : function (photId, uid) {
                    //TODO Handle Error Case
                    $firebaseObject(UsersRef.child(uid).child('coverPhotos').child(photId)).$remove().then(function (ref) {
                        $firebaseObject(PhotosRef.child(photId)).$remove().then(function (ref) {
                            CoreService.toastSuccess(gettextCatalog.getString('Image Deleted!'),gettextCatalog.getString('Image deleted successfully!'));
                        })
                    })
                },
                deleteProfilePhoto : function (photId, uid) {
                    //TODO Handle Error Case
                    $firebaseObject(UsersRef.child(uid).child('profilePhotos').child(photId)).$remove().then(function (ref) {
                        $firebaseObject(PhotosRef.child(photId)).$remove().then(function (ref) {
                            CoreService.toastSuccess(gettextCatalog.getString('Image Deleted!'),gettextCatalog.getString('Image deleted successfully!'));
                        })
                    })
                },
                setMainProfilePicture : function (photId,photoURL, uid) {
                    //TODO Handle Error Case, MOVE THE IMAGE TOP OF THE LIST
                    $firebaseObject(UsersRef.child(uid).child('profilePicture')).$save().then(function (ref) {
                        ref.set(photoURL, function (error) {
                            if(error){

                            } else {
                                CoreService.toastSuccess(gettextCatalog.getString('Image Set!'),gettextCatalog.getString('Image Set successfully!'));
                            }
                        })
                    })
                },
                deleteVideo : function (videoId, uid) {
                    //TODO Handle Error Case
                    $firebaseObject(UsersRef.child(uid).child('videos').child(videoId)).$remove().then(function (ref) {
                        CoreService.toastSuccess(gettextCatalog.getString('Video Deleted!'),gettextCatalog.getString('Video deleted successfully!'));
                    });
                },
                getProfilePhotos : function(uid){
                    if(uid){
                        var refProfilePhotos = new Firebase.util.NormalizedCollection(
                            [UsersRef.child(uid).child('profilePhotos'),"profilePhotos"],
                            [PhotosRef,"photos"]
                        ).select(
                            "photos.url"
                        ).ref();

                        return $firebaseArray(refProfilePhotos);
                    }
                },
                addProfilePhotoToProfile : function(uid,photoMeta){
                    return $firebaseArray(PhotosRef).$add(photoMeta).then(function(ref){
                        $firebaseObject(UsersRef.child(uid).child("profilePhotos").child(ref.key())).$save().then(function(dataRef){
                            dataRef.set(true);
                        })
                    });
                },
                getLocalCities : function(uid){
                    if(uid){
                        var refLocalCities = new Firebase.util.NormalizedCollection(
                            [UsersRef.child(uid).child('cities'),"localCities"],
                            [CitiesRef,"cities"]
                        ).select(
                            {"key":"cities.$value","alias":"details"},
                            "localCities.livedHereFor",
                            "localCities.relationshipToCity"
                        ).ref();

                        return $firebaseArray(refLocalCities);
                    }
                },
                localCities : function (uid) {
                    return UsersRef.child(uid).child('cities');
                },
                getLocalLocations : function(uid){
                    if(uid){
                        var refLocalCities = new Firebase.util.NormalizedCollection(
                            [UsersRef.child(uid).child('locations'),"localLocations"],
                            [LocationsRef,"locations"]
                        ).select(
                            {"key":"locations.$value","alias":"details"},
                            "localLocations.livedHereFor",
                            "localLocations.relationshipToCity"
                        ).ref();

                        return $firebaseArray(refLocalCities);
                    }
                },
                localLocations : function (uid) {
                    return UsersRef.child(uid).child('locations');
                },
                updateLocalCity : function (previousCityId,newCityId,uid,newCity) {
                    if(uid && previousCityId && newCityId){
                        $firebaseObject(CitiesRef.child(newCityId)).$save().then(function (dataRef) {
                            dataRef.set(newCity);
                        });

                        $firebaseObject(UsersRef.child(uid).child('cities').child(previousCity.$id)).$save().then(function(ref){
                            ref.set(true);
                        })
                    }
                },

                updateLocalCityRelationship: function (cityId,uid,relationship) {
                    if(uid && relationship && cityId){
                       return $firebaseObject(UsersRef.child(uid).child('locations').child(cityId).child('relationshipToCity'));
                    }
                },

                updateLocalCityYears: function (cityId,uid,years) {
                    if(uid && years && cityId){
                        return $firebaseObject(UsersRef.child(uid).child('locations').child(cityId).child('livedHereFor'));
                    }
                },

                removeExistingUserCity : function (data) {
                    if(data){
                        return $firebaseArray(LocationRemoveQueueRef.child('tasks')).$add(data);
                    }
                },
                removeExistingUserLocation : function (data) {
                    if(data){
                        return $firebaseArray(LocationRemoveQueueRef.child('tasks')).$add(data);
                    }
                },
                removeExistingUserState : function (data) {
                    if(data){
                        return $firebaseArray(StateLocationRemoveQueueRef.child('tasks')).$add(data);
                    }
                },
                removeExistingUserCountry : function (data) {
                    if(data){
                        return $firebaseArray(CountryLocationRemoveQueueRef.child('tasks')).$add(data);
                    }
                },
                saveCity : function(data){
                    return $firebaseArray(CityLocationAddQueueRef.child('tasks')).$add(data);
                },
                saveLocation : function (data) {
                    return $firebaseArray(LocationAddQueueRef.child('tasks')).$add(data);
                },
                saveState : function(data){
                    return $firebaseArray(StateLocationAddQueueRef.child('tasks')).$add(data);
                },
                saveCountry : function(data){
                    return $firebaseArray(CountryLocationAddQueueRef.child('tasks')).$add(data);
                },
                addInterests : function (interest) {
                    $firebaseArray(InterestsRef).$add({name : interest});
                },
                addAdvises : function (advise) {
                    $firebaseArray(AdvisesRef).$add({type : advise});
                },
                addLanguages : function (language) {
                    $firebaseArray(LanguagesRef).$add(language);
                },
                getInterests : function () {
                    return $firebaseArray(InterestsRef.orderByChild('name'));
                },
                getAdvises : function () {
                    return $firebaseArray(AdvisesRef.orderByChild('type'));
                },
                setPayPal : function (profile,uid) {
                    $firebaseObject(UsersRef.child(uid).child('payPal')).$save().then(function (ref) {
                        ref.set(profile);
                    })
                },
                setUserEmailVerified : function (uid) {
                    $firebaseObject(UsersRef.child(uid).child('emailVerified')).$save().then(function (ref) {
                        ref.set(true);
                    });
                    $firebaseObject(UsersRef.child(uid).child('verificationStatus')).$save().then(function (ref) {
                        ref.set(true);
                    });
                    $firebaseObject(UsersRef.child(uid).child('userVerified').child('emailVerified')).$save().then(function (ref) {
                        ref.set(true)
                    });
                    $firebaseObject(UsersRef.child(uid).child('userVerified').child('emailVerifiedDate')).$save().then(function (ref) {
                        ref.set(Firebase.ServerValue.TIMESTAMP);
                    });
                },
                isUserVerified : function (uid) {
                    return $firebaseObject(UsersRef.child(uid).child('emailVerified'));
                },
                getLanguages : function () {
                    return $firebaseArray(LanguagesRef.orderByChild('name'));
                },
                addLanguageToProfile : function(language,uid){
                    $firebaseObject(UsersRef.child(uid).child('languages').child(language.$id)).$save().then(function (data) {
                        data.set(true);
                    });
                },
                getUserLanguages : function (uid) {
                    if(uid){
                        var refUserLanguages = new Firebase.util.NormalizedCollection(
                            [UsersRef.child(uid).child('languages'),"localLanguages"],
                            [LanguagesRef,"languages"]
                        ).select(
                            "languages.name"
                        ).ref();

                        return $firebaseArray(refUserLanguages);
                    }
                },
                addInterestToProfile : function(interest,uid){
                    $firebaseObject(UsersRef.child(uid).child('interests').child(interest.$id)).$save().then(function (data) {
                        data.set(true);
                    });
                },
                getUserInterests : function (uid) {
                    if(uid){
                        var refUserInterests = new Firebase.util.NormalizedCollection(
                            [UsersRef.child(uid).child('interests'),"userInterests"],
                            [InterestsRef,"interests"]
                        ).select(
                            "interests.name"
                        ).ref();

                        return $firebaseArray(refUserInterests);
                    }
                },
                addAdviseToProfile : function(advise,uid){
                    $firebaseObject(UsersRef.child(uid).child('advises').child(advise.$id)).$save().then(function (data) {
                        data.set(true);
                    });
                },
                getUserAdvises : function (uid) {
                    if(uid){
                        var refUserAdvises = new Firebase.util.NormalizedCollection(
                            [UsersRef.child(uid).child('advises'),"userAdvises"],
                            [AdvisesRef,"advises"]
                        ).select(
                            "advises.type"
                        ).ref();

                        return $firebaseArray(refUserAdvises);
                    }
                },
                getUserCities : function (uid) {
                    if(uid){
                        var refUserCities = new Firebase.util.NormalizedCollection(
                            [UsersRef.child(uid).child('cities'),"userCities"],
                            [CitiesRef,"cities"]
                        ).select(
                            "cities.formatted_address",
                            "userCities.livedHereFor",
                            "userCities.relationshipToCity"
                        ).ref();

                        return $firebaseArray(refUserCities);
                    }
                },
                getUserLocations : function (uid) {
                    if(uid){
                        var refUserCities = new Firebase.util.NormalizedCollection(
                            [UsersRef.child(uid).child('locations'),"userLocations"],
                            [LocationsRef,"locations"]
                        ).select(
                            "locations.formatted_address",
                            "locations.address_components",
                            "locations.types",
                            "userLocations.livedHereFor",
                            "userLocations.relationshipToCity"
                        ).ref();

                        return $firebaseArray(refUserCities);
                    }
                },
                addLocalsBusyDate : function (uid,date) {
                    $firebaseObject(UsersRef.child(uid).child('localBusy').child(date)).$save().then(function (snap) {
                        snap.set(true);
                    });
                },

                localsBusyDates : function (uid) {
                    return UsersRef.child(uid).child('localBusy');
                },

                getLocalsSelectedDates : function (uid) {
                    return $firebaseArray(UsersRef.child(uid).child('localBusy'));
                },

                getUserLocationsForSearch : function (uid) {
                    if(uid){

                        //UsersRef.child(uid).child('locations').once('value',function(snap){
                        //    var locations = [];
                        //    var location = {};
                        //    snap.forEach(function (childSnap) {
                        //        LocationsRef.child(childSnap.key()).once('value', function (locSnapshot) {
                        //
                        //        })
                        //    })
                        //});
                        var refUserCities = new Firebase.util.NormalizedCollection(
                            [UsersRef.child(uid).child('locations'),"userLocations"],
                            [LocationsRef,"locations"]
                        ).select(
                            "locations.address_components",
                            "locations.types"
                        ).ref();

                        return $firebaseArray(refUserCities);
                    }
                },

                getCity : function (index,uid) {
                    if(uid && index){
                        return $firebaseObject(UsersRef.child(uid).child('cities').child(index))
                    }
                },
                getLocation : function (index,uid) {
                    if(uid && index){
                        return $firebaseObject(UsersRef.child(uid).child('locations').child(index))
                    }
                },
                userCityState : function (uid,cityId) {
                    return UsersRef.child(uid).child('cities').child(cityId).child('state');
                },
                userCityCountry : function (uid,cityId) {
                    return UsersRef.child(uid).child('cities').child(cityId).child('country');
                },
                userLocationState : function (uid,cityId) {
                    return UsersRef.child(uid).child('locations').child(cityId).child('state');
                },
                userLocationCountry : function (uid,cityId) {
                    return UsersRef.child(uid).child('locations').child(cityId).child('country');
                },
                welcomeLocalEmail : function (data) {
                    return $firebaseArray(EmailSignupWelcomeLocalQueueRef.child('tasks')).$add(data);
                },
                informYLC : function (data) {
                    return $firebaseArray(InformYLCQueueRef.child('tasks')).$add(data);
                },
                informTJ : function (data) {
                    return $firebaseArray(InformTJQueueRef.child('tasks')).$add(data);
                },
                //yoyo : function (data) {
                //    UsersRef.once('value', function (snapshot) {
                //        snapshot.forEach(function (childSnapshot) {
                //            if(childSnapshot.val().cities !== undefined && childSnapshot.val().cities !== null){
                //                //console.log(childSnapshot.ref().child('locations'));
                //                //childSnapshot.ref().child('locations').set(childSnapshot.val().cities);
                //                childSnapshot.ref().child('locations').once('value', function (childchildSnapshot) {
                //                    childchildSnapshot.forEach(function (eachCity) {
                //                        eachCity.ref().child('locationType').set('locality');
                //                    })
                //                })
                //            }
                //        })
                //    })
                //}
                //,
                //yoyo : function (data) {
                //    CitiesRef.once('value', function (snapshot) {
                //        //LocationsRef.child(snapshot.key()).set(snapshot.val());
                //        snapshot.forEach(function (childSnap) {
                //            LocationsRef.child(childSnap.key()).setWithPriority(childSnap.val(),1);
                //        })
                //    })
                //}
                //,yoyo : function (locationId) {
                //    return LocationsRef.child(locationId);
                //},
                //yoyo1 : function (data) {
                //    return UsersRef;
                //}
                //,
                locationAnalytics : function () {
                    return LocationsRef;
                }
                ,
                getUsers : function () {
                    return UsersRef;
                },
                getOrder : function (orderId) {
                    return $firebaseObject(OrdersRef.child(orderId));
                }
            };
            return Profile;
        });
})();