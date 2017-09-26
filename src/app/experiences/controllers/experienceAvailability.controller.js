'use strict';
angular.module('com.ylc.experiences')

.controller('ExperiencesAvailabilityCtrl',

    function (
        $scope,
        CoreService,
        ExperienceAvailability,
        $stateParams,
        $modalInstance,
        experience_data,
        $sce
    ) {
        $scope.book_link = $sce.trustAsResourceUrl(experience_data.book_now_link);
        console.log(experience_data);
        $scope.experience_booking = {
            experience_id: $stateParams.experienceId,
            travellingWith: []
        };

        $scope.addTravellingWith = function (travellingWith) {
            var indexOfTravellingWith = $scope.experience_booking.travellingWith.indexOf(travellingWith);
            if (indexOfTravellingWith == -1) {
                $scope.experience_booking.travellingWith.push(travellingWith);
            } else {
                $scope.experience_booking.travellingWith.splice(indexOfTravellingWith, 1);
            }
        }

        $scope.checkExperienceAvailability = function() {
            if (!$scope.experience_booking.name || $scope.experience_booking.name == '') {
                CoreService.toastError('You cannot submit the form without a name.');
                return;
            }

            if (!$scope.experience_booking.phone || $scope.experience_booking.phone == '') {
                CoreService.toastError('You cannot submit the form without a phone.');
                return;
            }

            if (!$scope.experience_booking.email || $scope.experience_booking.email == '') {
                CoreService.toastError('You cannot submit the form without an email address.');
                return;
            }
            ExperienceAvailability.create($scope.experience_booking).then(function(response) {
                console.log(response);
                $scope.experience_booking = {}
                CoreService.alertSuccess('Your request has been submitted, we\'ll get back to you soon.');
                $modalInstance.close();
            }).catch(function(error) {
                console.log(error);
                CoreService.alertError('Something went wrong, please try again after sometime.');
                $modalInstance.close();
            });
        }

        $(function () {
            $('#datetimepicker1').datepicker({
                format: 'dd/mm/yyyy',
                startDate: new Date()
            });
        })

        $scope.closeModal = function () {
            $modalInstance.close('canceled');
        }
    });
