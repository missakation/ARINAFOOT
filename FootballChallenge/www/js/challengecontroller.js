
angular.module('football.controllers')



    .controller('ChallengeController', function ($scope, TeamStores, ChallengeStore, $state, $ionicPopup, $ionicLoading, $ionicPopover, pickerView, $ionicFilterBar) {


        var numofplayersArr = [];
        //alert(JSON.stringify($state.params.myteam));
        $scope.myteam = $state.params.myteam;
        //alert("Key:" +$scope.myteam.key);
        //alert($scope.myteam);
        TeamStores.GetTeamInfoByKey($scope.myteam.key, function (teaminfo) {
            //alert(JSON.stringify(teaminfo));
            if (teaminfo.teamoffive)
                numofplayersArr.push(" 5 Vs 5");
            if (teaminfo.teamofsix)
                numofplayersArr.push(" 6 Vs 6");
            if (teaminfo.teamofseven)
                numofplayersArr.push(" 7 Vs 7");
            if (teaminfo.teamofeight)
                numofplayersArr.push(" 8 Vs 8");
            if (teaminfo.teamofnine)
                numofplayersArr.push(" 9 Vs 9");
            if (teaminfo.teamoften)
                numofplayersArr.push(" 10 Vs 10");
            if (teaminfo.teamofeleven)
                numofplayersArr.push(" 11 Vs 11");
            //alert(JSON.stringify(numofplayersArr));
        });


        /** picker view stuff **/
        function getDateFromDayName(selectedDay) {
            var selectedDate = new Date();
            if (selectedDay == "Tomorrow") {
                selectedDate.setDate(selectedDate.getDate() + 1);
                return weekday[selectedDate.getDay()] + monthChar[selectedDate.getMonth()] + " " + selectedDate.getDate();
            }
            if (selectedDay == "Today") {
                selectedDate.setDate(selectedDate.getDate());
                return weekday[selectedDate.getDay()] + monthChar[selectedDate.getMonth()] + " " + selectedDate.getDate();
            }
            for (var i = 0; i < 6; i++) {
                if (weekdayFull[selectedDate.getDay()] == selectedDay)
                    return weekday[selectedDate.getDay()] + monthChar[selectedDate.getMonth()] + " " + selectedDate.getDate();
                selectedDate.setDate(selectedDate.getDate() + 1);
            }
        }

        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        //tomorrow.date.setDate($scope.search.date.getDate() + 1);
        tomorrow.setHours(21);
        tomorrow.setMinutes(0);
        tomorrow.setMilliseconds(0);
        tomorrow.setSeconds(0);


        $scope.search = {
            date: tomorrow,
            text: "Tomorrow, 9:00PM - 5 Vs 5"
        };

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
                }, {
                    //values: [" 5 Vs 5", " 6 Vs 6", " 7 Vs 7", " 8 Vs 8", " 9 Vs 9", " 10 Vs 10", " 11 Vs 11"],
                    values: numofplayersArr,
                    defaultIndex: 0
                }]
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
                        $scope.search.players = (output[2].split(" "))[1];
                        console.log($scope.search.date);
                        $scope.search.text = output.join(" - ");
                        console.log($scope.search.players);
                        $scope.checkfree();
                    }
                });
            }


        };
        /** End picker view stufgf**/


        $scope.selectedteams = [];

        var template = '<ion-popover-view><ion-header-bar> <h1 class="title">My Popover Title</h1> </ion-header-bar> <ion-content> Hello! </ion-content></ion-popover-view>';

        $scope.popover = $ionicPopover.fromTemplate(template, {
            scope: $scope
        });

        // .fromTemplateUrl() method
        $ionicPopover.fromTemplateUrl('templates/my-popover.html', {
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


        $scope.checkfree = function () {
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });

            try {
                //works

                var date = new Date();
                ChallengeStore.GetAllTeamsNotMe($scope.myteam, $scope.search, function (leagues) {
                    $ionicLoading.hide();
                    $scope.allteamsnotme = leagues;



                    if (leagues.length == 0) {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Error',
                            template: 'No Team Found'
                        });
                    }
                    else {
                        $scope.allteamsnotme.forEach(function (element) {

                            firebase.database().ref('/teaminfo/' + element.key).once('value').then(function (snapshot) {
                                if (snapshot.exists()) {
                                    element.members = snapshot.child("players").numChildren() - 1;
                                    element.rank = snapshot.child("rank").val();
                                    element.rating = snapshot.child("rating").val()
                                }
                                else {
                                    element.members = "Not Found";
                                    element.rank = "Not Found";
                                    element.rating = "Not Found";
                                }

                            })

                        })

                    }
                    $scope.filteredTeams = $scope.allteamsnotme;

                })

                $scope.$apply();
            }
            catch (error) {
                alert(error.message);
            }
        }

        try {
            //works

            var date = new Date();
            $scope.checkfree();
        }
        catch (error) {
            alert(error.message);
        }

        $scope.updateselectedteams = function (team) {


            try {


                if (team.selected == "unselect") {
                    $scope.selectedteams = $scope.selectedteams.filter(function (el) {
                        return el.key !== team.key;
                    });
                    team.selected = "select";
                    team.color = "#28b041";
                    team.backcolor = "white";

                }
                else {
                    if ($scope.selectedteams.length == 3) {
                        $ionicPopup.alert({
                            title: 'Forbidden',
                            template: 'You cannot select more than 3 teams'
                        });
                    }
                    else {

                        $scope.selectedteams.push(angular.copy(team));
                        team.selected = "unselect";
                        team.color = "white";
                        team.backcolor = "#28b041";

                    }
                }
            }
            catch (error) {
                alert(error.message);
            }

        }

        $scope.choosestadium = function () {
            try {


                if ($scope.selectedteams.length == 0) {
                    $ionicPopup.alert({
                        title: 'Select a Team',
                        template: 'You have to select at least one team'
                    });
                }
                else {
                    
                    $state.go('app.challengeteamstadium',

                        {
                            date: $scope.search.date,
                            visualText: $scope.search.text,
                            teams: $scope.selectedteams,
                            myteam: $scope.myteam
                        });
                }
            }
            catch (error) {
                alert(error.message);
            }
        }


        //Filter bar stuff
        var filterBarInstance;

        //function getItems () {
        //    var items = [];
        //    for (var x = 1; x < 2000; x++) {
        //        items.push({text: 'This is item number ' + x + ' which is an ' + (x % 2 === 0 ? 'EVEN' : 'ODD') + ' number.'});
        //    }
        //    $scope.items = items;
        //}

        //getItems();


        $scope.filteredTeams = $scope.allteamsnotme;
        //$scope.$digest();
        $scope.showFilterBar = function () {
            filterBarInstance = $ionicFilterBar.show({
                items: $scope.allteamsnotme,
                update: function (filteredItems, filterText) {
                    if (filterText != "" && filterText != null) {
                        console.log("filterText is: " + filterText)
                        $scope.filteredTeams = filteredItems;
                    }
                    else {
                        console.log("filterText non empty is: " + filterText)
                        $scope.filteredTeams = $scope.allteamsnotme;
                    }
                },
                filterProperties: "teamname"
            });
        };




        $scope.refreshItems = function () {
            if (filterBarInstance) {
                filterBarInstance();
                filterBarInstance = null;
            }

            $timeout(function () {
                getItems();
                $scope.$broadcast('scroll.refreshComplete');
            }, 1000);
        };

        //------------filter bar stuff ----/



    })

    .controller('challengestadiumcontroller', function ($http, $scope, $ionicHistory, LoginStore, ChallengeStore, HomeStore, ReservationFact, $state, $stateParams, $ionicPopup, $ionicLoading, $ionicPopover, $ionicFilterBar) {
        
        $scope.selectedstadiums = [];
        $scope.challengestatus = false;
        $scope.selecteddate =
            {
                date: $state.params.date,
                text: $state.params.visualText
            };

        $scope.myteam = $state.params.myteam;

        ReservationFact.FindFreeStadiums($state.params, function (leagues) {


            $scope.allfreestadiums = leagues;

            if (leagues.length == 0) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Error',
                    template: 'No Available Stadiums'
                });
            }


            // Simple GET request example:
            $http({
                method: 'GET',
                url: 'https://us-central1-project-6346119287623064588.cloudfunctions.net/date'
            }).then(function successCallback(response) {

                $scope.currentdate = new Date(response.data);
                HomeStore.GetProfileInfo($scope.currentdate, function (myprofile) {

                    $scope.profile = myprofile;

                })

            }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });


            $scope.filteredStadiums = $scope.allfreestadiums;
        })
        $scope.updateselectedteams = function (stadiums) {

            try {

                if (stadiums.selected == "unselect") {
                    $scope.selectedstadiums = $scope.selectedstadiums.filter(function (el) {
                        return ((el.stadiumkey !== stadiums.stadiumkey) || (el.stadiumkey == stadiums.stadiumkey && el.ministadiumkey !== stadiums.ministadiumkey));
                    });
                    stadiums.selected = "select";
                    stadiums.color = "#28b041";
                    stadiums.backcolor = "white";

                }
                else {
                    if ($scope.selectedstadiums.length == 3) {
                        $ionicPopup.alert({
                            title: 'Forbidden',
                            template: 'You cannot select more than 3 teams'
                        });
                    }
                    else {
                        $scope.selectedstadiums.push(angular.copy(stadiums));
                        stadiums.selected = "unselect";
                        stadiums.color = "white";
                        stadiums.backcolor = "#28b041";
                    }
                }
            }
            catch (error) {
                alert(error.message);
            }


        }
        $scope.sendchallenge = function () {

            try {

                $scope.challengestatus = true;
                if ($scope.selectedstadiums == 0) {
                    $ionicPopup.alert({
                        title: 'Select a Stadium',
                        template: 'You have to select at least one stadium'
                    });
                }
                else {

                    var confirmPopup = $ionicPopup.confirm({
                        title: 'Confirm',
                        template: 'Are you sure you want to send the challenges?'
                    });

                    confirmPopup.then(function (res) {
                        if (res) {

                            ChallengeStore.GetNumChallengeByDate($state.params.date, $scope.myteam, function (result) {
                                if (result + $state.params.teams.length < 4) {
                                    ChallengeStore.ChallengeTeams($state.params.date, $state.params.teams, $scope.selectedstadiums, $scope.myteam, $scope.profile)
                                        .then(function (value) {
                                            $state.params.teams.forEach(function (element) {
                                                console.log("here");
                                                console.log(element);
                                                firebase.database().ref('/players/' + element.teamadmin).once('value').then(function (snapshot) {
                                                    console.log("AAAAAAAAAA");
                                                    $ionicLoading.hide();
                                                    console.log(snapshot.val());
                                                    if (snapshot.val().devicetoken) {
                                                        console.log(snapshot.val().devicetoken);
                                                        alert("sending notification");
                                                        LoginStore.SendNotification($scope.myteam.teamname + ' challenges you to play a game at ' + $state.params.date + ' vs your team ' + element.teamname, snapshot.val().devicetoken);
                                                    } else {
                                                    }
                                                })

                                                var alertPopup = $ionicPopup.alert({
                                                    title: 'Success',
                                                    template: 'Successfully Challenged'
                                                }).then(function () {
                                                    $ionicHistory.nextViewOptions({
                                                        disableBack: true
                                                    });
                                                    $state.go("app.homepage");
                                                });

                                            })
                                        }, function (error) {
                                            alert(error.message);
                                        })
                                }
                                else {
                                    var alertPopup = $ionicPopup.alert({
                                        title: 'Error',
                                        template: 'You have ' + (3 - result) + ' challenges left for the selected date'
                                    }).then(function () {

                                    });
                                }



                            }, function (error) {
                                alert(error.message);
                            })



                        }


                    })


                }
                $scope.challengestatus = false;
            }
            catch (error) {
                alert(error.message);
            }

        }
        //Filter bar stuff
        var filterBarInstance;

        //function getItems () {
        //    var items = [];
        //    for (var x = 1; x < 2000; x++) {
        //        items.push({text: 'This is item number ' + x + ' which is an ' + (x % 2 === 0 ? 'EVEN' : 'ODD') + ' number.'});
        //    }
        //    $scope.items = items;
        //}

        //getItems();


        $scope.filteredStadiums = $scope.allfreestadiums;
        //$scope.$digest();
        $scope.showFilterBar = function () {
            filterBarInstance = $ionicFilterBar.show({
                items: $scope.allfreestadiums,
                update: function (filteredItems, filterText) {
                    if (filterText != "" && filterText != null) {
                        console.log("filterText is: " + filterText)
                        $scope.filteredStadiums = filteredItems;
                    }
                    else {
                        console.log("filterText non empty is: " + filterText)
                        $scope.filteredStadiums = $scope.allfreestadiums;
                    }
                },
                filterProperties: "stadiumname"
            });
        };




        $scope.refreshItems = function () {
            if (filterBarInstance) {
                filterBarInstance();
                filterBarInstance = null;
            }

            $timeout(function () {
                getItems();
                $scope.$broadcast('scroll.refreshComplete');
            }, 1000);
        };

        //------------filter bar stuff ----/

    })

    .controller('ChooseYourTeamController', function ($scope, $ionicPopup, $ionicLoading, $state, $stateParams, ChallengeStore, $timeout) {



        $scope.$on("$ionicView.beforeEnter", function (event, data) {
            // handle event
            //works
            try {

                ChallengeStore.GetMyAdminTeams(function (myteams) {

                    $ionicLoading.hide();
                    $scope.allmyteams = myteams;

                    $scope.allmyteams.forEach(function (element) {

                        firebase.database().ref('/teaminfo/' + element.key).once('value').then(function (snapshot) {
                            if (snapshot.exists()) {
                                element.members = snapshot.child("players").numChildren() - 1;
                                element.rank = snapshot.child("rank").val();
                                element.rating = snapshot.child("rating").val()
                            }
                            else {
                                element.members = "Not Found";
                                element.rank = "Not Found";
                                element.rating = "Not Found";
                            }

                        })

                    })

                    if (myteams.length == 0) {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Empty',
                            template: 'You do not belong to any team right now'
                        });
                    }

                    if (myteams.length == 4) {
                        $scope.gochallengeteams($scope.test[0]);
                    }

                })

            }
            catch (error) {
                alert(error.message);
            }
        });


        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });



        $scope.gochallengeteams = function (team) {


            try {
                console.log($state.params.otherteam);
                if ($state.params.otherteam || $state.params.otherteam != null) {
                    $state.go('app.challengeteamstadium',

                        {
                            date: new Date(),
                            teams: $state.params.otherteam,
                            myteam: team
                        });
                }
                else {
                    $state.go('app.challengeteam',

                        {
                            myteam: team
                        });
                }


            }


            catch (error) {
                alert(error.message);
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