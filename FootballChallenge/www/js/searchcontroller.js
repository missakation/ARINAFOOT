
angular.module('football.controllers')

    .controller('SearchController', function ($scope, SearchStore, ReservationFact, $ionicPopup, $ionicPopover, $timeout, $ionicLoading, pickerView, SMSService) {
        /** picker view stuff **/
        function getDateFromDayName(selectedDay) {
            var selectedDate = new Date();
            if (selectedDay == "Tomorrow") {
                selectedDate.setDate(selectedDate.getDate() + 1);
                return weekday[selectedDate.getDay()] + monthChar[selectedDate.getMonth()] + " " + selectedDate.getDate();
            }
            for (var i = 0; i < 6; i++) {
                if (weekdayFull[selectedDate.getDay()] == selectedDay)
                    return weekday[selectedDate.getDay()] + monthChar[selectedDate.getMonth()] + " " + selectedDate.getDate();
                selectedDate.setDate(selectedDate.getDate() + 1);
            }
        }

        var stadiums = [];
        $scope.allfreestadiums = [];
        $scope.gotlocation = false;
        $scope.search = {
            date: new Date(),
        };

        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        //getting current location
        navigator.geolocation.getCurrentPosition(function (position) {
            //here

            //here
            /*  alert('Latitude: ' + position.coords.latitude + '\n' +
            'Longitude: ' + position.coords.longitude + '\n' +
            'Altitude: ' + position.coords.altitude + '\n' +
            'Accuracy: ' + position.coords.accuracy + '\n' +
            'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '\n' +
            'Heading: ' + position.coords.heading + '\n' +
            'Speed: ' + position.coords.speed + '\n' +
            'Timestamp: ' + position.timestamp + '\n');*/

            $scope.latitude = position.coords.latitude;
            $scope.longitude = position.coords.longitude;

            $scope.gotlocation = true;
        }, function (error) {
            alert("Hello");
            //$scope.checkfree();
        });

        SearchStore.GetMyProfileInfo(function (profile) {

            $scope.myprofile = profile;

            var tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);

            tomorrow.setHours(21);
            tomorrow.setMinutes(0);
            tomorrow.setMilliseconds(0);
            tomorrow.setSeconds(0);



            $scope.search = {
                date: tomorrow,
                text: "Tomorrow, 9:00PM" //- " + ($scope.myprofile.favstadium != null && $scope.myprofile.favstadium != "" ?$scope.myprofile.favstadium:"Near me")
            };
        });

        //toRad function
        if (typeof (Number.prototype.toRad) === "undefined") {
            Number.prototype.toRad = function () {
                return this * Math.PI / 180;
            }
        }

        //get all stadiums
        ReservationFact.GetAllStadiums(function (leagues) {

            $scope.allfreestadiums = leagues;
            if ($scope.gotlocation) {
                /** Converts numeric degrees to radians */

                for (var i = 0; i < leagues.length; i++) {
                    var lat1 = $scope.latitude;
                    var lon1 = $scope.longitude;

                    var lat2 = $scope.allfreestadiums[i].latitude;
                    var lon2 = $scope.allfreestadiums[i].longitude;


                    var R = 6371; // km 
                    //has a problem with the .toRad() method below.
                    var x1 = lat2 - lat1;
                    var dLat = x1.toRad();
                    var x2 = lon2 - lon1;
                    var dLon = x2.toRad();
                    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                        Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);
                    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                    var d = R * c;

                    $scope.allfreestadiums[i].distance = d;
                }
                $scope.allfreestadiums = $scope.allfreestadiums.sort(function (a, b) {
                    return a.distance - b.distance;
                });
            }



            //preparing stadiums list
            stadiums.push("Near me");
            if ($scope.myprofile.favstadium)
                stadiums.push($scope.myprofile.favstadium);
            for (var i = 0; i < leagues.length; i++) {
                //console.log(leagues[i].name);
                if (leagues[i].name != $scope.myprofile.favstadium)
                    stadiums.push(leagues[i].name);
            }


        });
        $ionicLoading.hide();


        $scope.openPickerView = function openPickerView() {

            var picker = pickerView.show({
                titleText: '', // default empty string
                doneButtonText: 'Search', // dafault 'Done'
                cancelButtonText: 'Close', // default 'Cancel'
                items: [{
                    values: dateArrayThingy,
                    defaultIndex: 1
                }, {
                    values: [' 7:00 AM ', ' 7:30 AM ', ' 8:00 AM ', ' 8:30 AM ', ' 9:00 AM ', '9:30 AM ', ' 10:00 AM ', ' 10:30 AM', ' 11:00 AM ', ' 11:30 AM ', ' Noon ', ' 1:00 PM ', ' 1:30 PM ', ' 2:00 PM ', ' 2:30 PM ', ' 3:00 PM ', ' 3:30 PM ', ' 4:00 PM ', ' 4:30 PM ', ' 5:00 PM ', ' 5:30 PM ', ' 6:00 PM ', ' 6:30 PM ', ' 7:00 PM ', ' 7:30 PM ', ' 8:00 PM', ' 8:30 PM ', ' 9:00 PM ', ' 9:30 PM ', ' 10:00 PM ', ' 10:30 PM ', ' 11:00 PM', '11:30 PM ', ' Midnight ',],
                    defaultIndex: 27
                }/*, {
                    values: stadiums,
                    defaultIndex: 0
                }
                */
                ]
            });

            if (picker) {
                picker.then(function pickerViewFinish(output) {
                    if (output) {
                        // output is Array type
                        var correctDate;
                        var selectedDate = output[0];
                        var selectedTime = output[1];
                        if (!Date.parse(selectedDate)) {
                            selectedDate = getDateFromDayName(selectedDate);
                            console.log(selectedDate);
                        }
                        $scope.search.date = new Date(selectedDate + " " + selectedTime + ", " + (new Date()).getFullYear());
                        //$scope.search.players = (output[2].split(" "))[1];
                        console.log($scope.search.date);
                        $scope.search.text = output.join(" - ");
                        $scope.checkfree();
                    }
                });
            }


        };
        /** End picker view stufgf**/
        var freestadiums = [];


        // .fromTemplate() method
        var template = '<ion-popover-view><ion-header-bar> <h1 class="title">My Popover Title</h1> </ion-header-bar> <ion-content> Hello! </ion-content></ion-popover-view>';

        $scope.popover = $ionicPopover.fromTemplate(template, {
            scope: $scope
        });

        // .fromTemplateUrl() method
        $ionicPopover.fromTemplateUrl('templates/player-popover.html', {
            scope: $scope
        }).then(function (popover) {
            $scope.popover = popover;
        });


        $scope.openPopover = function ($event) {
            $scope.popover.show($event);
        };
        $scope.closePopover = function () {
            $scope.popover.hide();
        };
        //Cleanup the popover when we're done with it!
        $scope.$on('$destroy', function () {
            $scope.popover.remove();
        });
        // Execute action on hide popover
        $scope.$on('popover.hidden', function () {
            // Execute action
            //scope.$digest();
            //alert($scope.choice)
        });
        // Execute action on remove popover
        $scope.$on('popover.removed', function () {
            // Execute action
        });

        var user = firebase.auth().currentUser;

        /*   if (user != null) {
               user.providerData.forEach(function (profile) {
   
                   alert("  Provider-specific UID: " + profile.uid);
                   alert("  Name: " + profile.displayName);
                   alert("  Email: " + profile.email);
               });
           }*/

        var filter =
            {
                sortby: "skill",
                skill: "Not Bad",
                distancefrom: 0,
                distanceto: 250000,
            }

        $scope.allfreeplayers = [];

        $scope.checkfree = function (search) {

            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });



            //})
            SearchStore.SearchAvailablePlayers($scope.search, function (leagues) {

                var counter = 0;
                var count = leagues.length;


                $scope.sliderskill = {
                    value: 3,
                    options: {
                        showSelectionBar: true,
                        floor: 0,
                        ceil: 3,
                        showSelectionBar: true,
                        hideLimitLabels: true,
                        stepsArray: ['Newbie', 'Not Bad', 'Solid', 'Pro']

                    }
                };

                if (count > 0) {

                    leagues.forEach(function (element) {

                        firebase.database().ref('/teaminfo/' + element.teamdisplayedkey).on('value', function (snapshot) {
                            if (snapshot.exists()) {

                                element.teambadge = snapshot.child("badge").val();
                                element.teamname = snapshot.child("teamname").val();
                                element.rank = snapshot.child("rank").val();

                                switch (element.rank) {
                                    case 1:
                                        element.rankdescription = element.rank + ' st';
                                        break;
                                    case 2:
                                        element.rankdescription = element.rank + ' nd';
                                        break;
                                    case 3:
                                        element.rankdescription = element.rank + ' rd';
                                        break;

                                    default:
                                        element.rankdescription = element.rank + ' th';
                                        break;
                                }

                            }
                            else {
                                element.members = "";
                                element.rank = "";
                                element.rating = "";
                            }


                        })
                        counter++;
                        if (counter == count) {
                            $scope.allfreeplayers = leagues;
                            console.log($scope.allfreeplayers);
                            $scope.$apply();
                        }

                    }, this);
                }


                $ionicLoading.hide();


            })

        }


        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        //})
        try {
            $timeout(function () {
                $scope.checkfree();
            }, 2000)

        }
        catch (error) {
            alert(error.message);
        }

        $scope.requestnumber = function (player) {


            if (!(player == null || player == undefined || player == []) && !($scope.myprofile == null || $scope.myprofile == undefined || $scope.myprofile == [])) {


                if (!player.status > 0) {

                    var userId = firebase.auth().currentUser.uid;
                    $ionicLoading.show({
                        content: 'Loading',
                        animation: 'fade-in',
                        showBackdrop: true,
                        maxWidth: 200,
                        showDelay: 0
                    });
                    firebase.database().ref('/players/' + userId).once('value').then(function (snapshot) {
                        $ionicLoading.hide();
                        if (!snapshot.val().isMobileVerified) {
                            SMSService.verifyUserMobile($scope, $scope.requestnumber, [player])
                        } else {
                            SearchStore.RequestNumber($scope.myprofile, player).then(function (value) {
                                console.log(4)
                                player.status = 1;
                                player.statusdesc = "Number Requested";
                                player.color = "white";
                                player.backcolor = "#2ab042";
                                $scope.$apply();

                            }, function (error) {
                                alert(error.message);
                            })
                        }
                    });

                }
            }

        }


    })
var weekday = new Array(7);
weekday[0] = "Su,";
weekday[1] = "Mo,";
weekday[2] = "Tu,";
weekday[3] = "We,";
weekday[4] = "Th,";
weekday[5] = "Fr,";
weekday[6] = "Sa,";

var weekdayFull = new Array(7);
weekdayFull[0] = "Sunday";
weekdayFull[1] = "Monday";
weekdayFull[2] = "Tuesday";
weekdayFull[3] = "Wednesday";
weekdayFull[4] = "Thursday";
weekdayFull[5] = "Friday";
weekdayFull[6] = "Saturday";


monthChar = new Array(12);
monthChar[0] = "Jan";
monthChar[1] = "Feb";
monthChar[2] = "Mar";
monthChar[3] = "Apr";
monthChar[4] = "May";
monthChar[5] = "Jun";
monthChar[6] = "Jul";
monthChar[7] = "Aug";
monthChar[8] = "Sep";
monthChar[9] = "Oct";
monthChar[10] = "Nov";
monthChar[11] = "Dec";


var nesheDate = new Date();
var dateArrayThingy = new Array();
dateArrayThingy.push("Today");
dateArrayThingy.push("Tomorrow");
//alert(nesheDate.getDay());
nesheDate.setDate(nesheDate.getDate() + 1);
for (i = 0; i < 7; i++) {
    nesheDate.setDate(nesheDate.getDate() + 1);
    dateArrayThingy.push(weekdayFull[nesheDate.getDay()]);
}
for (i = 0; i < 100; i++) {
    nesheDate.setDate(nesheDate.getDate() + 1);
    //alert(weekday[nesheDate.getDay()]);
    var day = weekday[nesheDate.getDay()];
    var month = monthChar[nesheDate.getMonth()];
    var dayInMonth = nesheDate.getDate();
    dateArrayThingy.push(day + " " + month + " " + dayInMonth);
}
