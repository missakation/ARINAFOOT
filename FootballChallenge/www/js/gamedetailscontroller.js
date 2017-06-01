
angular.module('football.controllers')

    .controller('GameDetailsController', function ($scope, HomeStore, $ionicPopup, $ionicLoading, $state, $stateParams, TeamStores, ChallengeStore, $timeout) {

        $scope.loadingphase = false;
        $scope.isadmin = false;
        $scope.first = true;
        $scope.currentteam = "";

        $scope.myplayers = [];

        $scope.gameid = $state.params.gameid;

        //alert($scope.gameid);

        $scope.opponent = "" //for game details title

        $scope.notloaded = true;
        try {
            $scope.profile = {};

            $scope.user = firebase.auth().currentUser;
            $scope.myid = $scope.user.uid;


            ChallengeStore.GetChallengeByKey($scope.myid, $scope.gameid, function (challengedetails) {
                
                if ( challengedetails.hasOwnProperty("key")) {
                    $scope.challenge = challengedetails;

                    //alert(JSON.stringify($scope.challenge)); 

                    if ($scope.challenge.team1adminid === $scope.myid) {
                        $scope.isadmin = true;
                        $scope.first = true;
                        $scope.currentteam = $scope.challenge.team1key;
                        $scope.opponent = $scope.challenge.team2name;
                    }
                    else if ($scope.challenge.team2adminid === $scope.myid) {
                        $scope.isadmin = true;
                        $scope.first = false;
                        $scope.currentteam = $scope.challenge.team2key;
                        $scope.opponent = $scope.challenge.team1name;
                    }
                    else {
                        $scope.isadmin = false;
                    }

                    if ($scope.isadmin) {



                        //get team depending on your admin key
                        TeamStores.GetTeamByKey($scope.currentteam, function (myteam) {

                            $scope.myteam = myteam;
                            console.log(myteam);

                            $scope.myplayers = $scope.myteam.players;

                            if ($scope.isadmin) {

                                if ($scope.first) {
                                    for (var i = 0; i < $scope.myplayers.length; i++) {
                                        for (var j = 0; j < $scope.challenge.team1players.length; j++) {
                                            if ($scope.myplayers[i].key == $scope.challenge.team1players[j].key) {
                                                $scope.myplayers[i].status = $scope.challenge.team1players[j].status;
                                            }
                                            if ($scope.myplayers[i].key == $scope.myid) {
                                                $scope.myplayers[i].status = 5;
                                            }

                                        }

                                    }
                                }
                                else {
                                    for (var i = 0; i < $scope.myplayers.length; i++) {

                                        for (var j = 0; j < $scope.challenge.team2players.length; j++) {

                                            if ($scope.myplayers[i].key == $scope.challenge.team2players[j].key) {
                                                $scope.myplayers[i].status = $scope.challenge.team2players[j].status;
                                            }

                                        }
                                        if ($scope.myplayers[i].key == $scope.myid) {
                                            $scope.myplayers[i].status = 5;
                                        }

                                    }
                                }
                            }

                            $scope.notloaded = false;

                            $scope.$apply();
                            //  alert("test2");
                            console.log($scope.isadmin);
                        })
                    }
                    $scope.notloaded = false;
                    $scope.$apply();

                }
                else {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Team not Found',
                        template: 'Looks like your admin decided to delete this game'
                    }).then(function () {
                        $state.go('app.homepage');
                    })
                }

            })

        } catch (error) {
            alert(error.message);
        }

        $scope.CancelChallenge = function (challenge) {
            try {
                var confirmPopup = $ionicPopup.confirm({
                    title: 'Decline',
                    template: 'Are you sure you want to Cancel the game?'
                });

                confirmPopup.then(function (res) {
                    if (res) {
                        HomeStore.DeleteChallenge(challenge).then(function () {

                            var alertPopup = $ionicPopup.alert({
                                title: 'Success',
                                template: 'Challenge Cancelled'
                            }).then(function () {
                                $state.go('app.homepage');
                            })

                        }, function (error) {
                            alert(error.message);
                        })
                    }

                })

            } catch (error) {
                alert(error.message);
            }
        }

        $scope.InvitePlayer = function (challenge, player) {

            try {

                var fieldname = $scope.first ? "team1players" : "team2players"

                if (player.status == 0) {

                    ChallengeStore.InvitePlayerToGame(challenge, player, fieldname)
                        .then(function () {

                            player.status = 1;
                        }
                        ,
                        function (error) {
                            alert(error.message);
                        })
                }

            } catch (error) {

            }

        }

        $scope.gotoadd = function () {
            $state.go("app.teamadd");
        }



    })


