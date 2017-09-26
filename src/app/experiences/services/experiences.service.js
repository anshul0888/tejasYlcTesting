/**
 * Created by TJ on 7/8/15.
 */

var app = angular.module('com.ylc.dashboard');

app.factory('Experiences',['ExperiencesRef','$firebaseObject',
    function(ExperiencesRef,$firebaseObject){
        var Experiences = {
            getExperienceData : function (experienceId) {
                return $firebaseObject(ExperiencesRef.child(experienceId));
            }
        }
        return Experiences;
    }]);
