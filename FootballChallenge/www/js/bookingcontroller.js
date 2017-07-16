
angular.module('football.controllers')

    .controller('BookingController', function ($scope, $http, $timeout, BookingStore, $ionicPopup, $ionicLoading) {

        $scope.tabs =
            {
                Current: false,
                Previous: false
            }

        $scope.status =
            {
                Current: "solid",
                Previous: "none"
            }

        $scope.currentbookings = [];
        $scope.previousbookings = [];
        $scope.selectedbookings = [];

        $scope.notloaded = true;

        BookingStore.GetMyUpcomingBookings(function (leagues) {

            // Simple GET request example:
            $http({
                method: 'GET',
                url: 'https://us-central1-project-6346119287623064588.cloudfunctions.net/date'
            }).then(function successCallback(response) {

                console.log(response);

                $scope.bookings = leagues;
                $scope.tabs.Current = true;
                $scope.notloaded = false;


                $scope.currentdate = new Date(response.data);

                for (var i = 0; i < $scope.bookings.length; i++) {

                    if ($scope.bookings[i].date >= $scope.currentdate) {
                        $scope.currentbookings.push($scope.bookings[i]);
                    }
                    else {
                        $scope.previousbookings.push($scope.bookings[i]);
                    }

                }

                $scope.selectedbookings = $scope.currentbookings;
                console.log($scope.previousbookings);
            }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                alert(JSON.stringify(response));
            });


        });

        $scope.deletebooking = function () {

        }

        $scope.CancelBooking = function (item) {

            var difference = (item.date - $scope.currentdate ) / 1000 / 60  / 60;

            firebase.database().ref('/stadiumsinfo/' + item.stadiumkey + '/ministadiums/' + item.ministadiumkey + '/cancellation').on('value', function (snapshot) {

                if (difference < snapshot.val()) {
                    var confirmPopup = $ionicPopup.alert({

                        template: 'You cannot cancel this reservation due to stadiums cancellation policy. Please call the stadium'
                    });

                }
                else {
                    
                    

                }


            })
        }

        $scope.switchscreens = function (x) {
            switch (x) {
                case 1:
                    $scope.tabs.Current = true;
                    $scope.tabs.Previous = false;

                    $scope.status.Current = "none";
                    $scope.status.Previous = "none";

                    $scope.status.Current = "solid";

                    $scope.selectedbookings = $scope.currentbookings;
                    $scope.$apply();
                    break;

                case 2:
                    $scope.tabs.Previous = true;
                    $scope.tabs.Current = false;

                    $scope.status.Current = "none";
                    $scope.status.Previous = "none";

                    $scope.status.Previous = "solid";
                    $scope.selectedbookings = $scope.previousbookings;
                    $scope.$apply();
                    $scope.$digest();

                    break;
            }
        }


    })
