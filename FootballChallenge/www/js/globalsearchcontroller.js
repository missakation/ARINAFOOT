
angular.module('football.controllers')

    .controller('GlobalSearchController', function ($scope, SearchStore, ReservationFact, $ionicPopup, $ionicLoading, $stateParams, $timeout) {


        $scope.query = $stateParams.searchCriteria.toString();
        /*$scope.teams = [];
        $scope.players = [];
        $scope.stadiums = [];*/

        //global search function
        $scope.searchAll = function (crit) {
            delete $scope.teams;
            delete $scope.players;
            delete $scope.stadiums;

            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });

            //})
            if (crit === null || crit == '' || crit === undefined) {
                crit = $stateParams.searchCriteria;
            }

            if (SearchStore.SearchAllByField("players", "displayname", crit, function (allPlayers) {
                //$ionicLoading.hide();
                if (allPlayers.length > 0) {
                    $scope.players = allPlayers;
                    console.log(allPlayers);
                    //alert("Players: " + $scope.players.length);
                }
                //alert("hellO");
                //$scope.$apply();
            })) {
                // callback();
            };
            /*if(SearchStore.SearchAllByField("stadiums", "name", crit, function (allStadiums) {
                if (allStadiums.length > 0)
                {
                    $scope.stadiums = allStadiums;
                    //alert("Stadiums: " + $scope.stadiums.length);
                }
                //alert("hellO");
                //$scope.$apply();
            })){
                //callback();
            };*/

            ReservationFact.GetAllMiniStadiumsByStadName(crit, function (allStadiums) {
                if (allStadiums.length > 0) {
                    $scope.stadiums = allStadiums;
                    //alert("Stadiums: " + $scope.stadiums.length);
                }
                //alert("hellO");
                //$scope.$apply();
            });

            if (SearchStore.SearchAllByField("teams", "teamname", crit, function (allTeams) {
                if (allTeams.length > 0) {
                    $scope.teams = allTeams;
                    //alert("Teams: " +$scope.teams.length);
                }

                $ionicLoading.hide();
            })) {
                //callback();
            };


        };

        $timeout(function () { $scope.searchAll($scope.searchCrit) });


        $scope.gotoprofile = function (x, key) {
            switch (x) {
                case 1:
                    break;
                case 2:
                    break;
                case 3:
                    break;

                default:
                    break;
            }
        }
    });