
angular.module('football.controllers')



    .controller('LeaderboardController', function ($scope, $timeout, LeaderBoardStore, $state, $ionicPopup, $ionicLoading, $ionicPopover) {

        $scope.notloaded = true;
        $scope.limit = 10;
        $scope.limitfinished = true;
        $scope.rankedteams = [];

        $scope.goteamprofile = function (id) {
            if (id !== null || id == '' || id === undefined) {
                $state.go("app.teamview",
                    {
                        teamid: id
                    })
            }

        }

        $scope.refreshpage = function (limit) {

            LeaderBoardStore.GetLeaderboard(limit, function (leagues) {


                $scope.notloaded = false;
                $scope.rankedteams = leagues.reverse();

                
               /* LeaderBoardStore.UpdateRatings($scope.rankedteams).then(function(result)
                {

                },function(error)
                {
                    alert(error.message);
                })*/
                

                $scope.$broadcast('scroll.infiniteScrollComplete');

                if ($scope.rankedteams.length < limit) {
                    $scope.limitfinished = false;
                }
                else
                {
                    $scope.limitfinished = true;
                }

            })
        }

        $scope.loadMore = function () {

            if (!$scope.limitfinished) {
                $scope.limit += 10;
                $scope.refreshpage($scope.limit);
            }

        }

        $scope.refreshpage($scope.limit);

    })

