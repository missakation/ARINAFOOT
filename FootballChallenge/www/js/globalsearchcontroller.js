
angular.module('football.controllers')

    .controller('GlobalSearchController', function ($scope, SearchStore, ReservationFact, $ionicPopup, $ionicLoading, $stateParams, $timeout, $ionicSlideBoxDelegate) {


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

            if (SearchStore.SearchElastic("player", crit, function (allPlayers) {
                //$ionicLoading.hide();
                if (allPlayers.length > 0) {
                    $scope.players = allPlayers;
                    console.log(allPlayers);
                $ionicSlideBoxDelegate.update();
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

            SearchStore.SearchElastic("stadium", crit, function(allStadiums) {
                if (allStadiums.length > 0) {
                    $scope.stadiums = allStadiums;
                    //console.log(allStadiums[0]);
                    //alert("Stadiums: " + $scope.stadiums.length);
                }
                //alert("hellO");
                //$scope.$apply();
            });

            if (SearchStore.SearchElastic("team", crit, function (allTeams) {
                if (allTeams.length > 0) {
                    $scope.teams = allTeams;
                    //alert("Teams: " +$scope.teams.length);
                }

                $ionicLoading.hide();
            })) {
                //callback();
                $ionicSlideBoxDelegate.update();
            };


        };

        $timeout(function () { $scope.searchAll($scope.searchCrit); $ionicSlideBoxDelegate.update();});
        //$timeout(function () { doSearch(buildQueryBody(crit, false)); });

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

        $ionicSlideBoxDelegate.update();

        //we can avoid using this i think
        function buildQuery(term,type) {
            // this just gets data out of the form
            var index = "firebase";
            var type = "firebase";
            var term = $form.find('[name="term"]').val();
            var matchWholePhrase = $form.find('[name="exact"]').is(':checked');
            var size = parseInt($form.find('[name="size"]').val());
            var from = parseInt($form.find('[name="from"]').val());

            // skeleton of the JSON object we will write to DB
            var query = {
                index: index,
                type: type
            };

            // size and from are used for pagination
            if (!isNaN(size)) { query.size = size; }
            if (!isNaN(from)) { query.from = from; }

            buildQueryBody(query, term, matchWholePhrase);

            return query;
        }

        function buildQueryBody(category, crit, matchWholePhrase) {
            // skeleton of the JSON object we will write to DB
            var query = {
                index : "firebase",
                type: type
                };
            if (matchWholePhrase) {
                var body = query.body = {};
                body.query = {
                    // match_phrase matches the phrase exactly instead of breaking it
                    // into individual words
                    "match_phrase": {
                        // this is the field name, _all is a meta indicating any field
                        "_all": term
                    }
                    /**
                     * Match breaks up individual words and matches any
                     * This is the equivalent of the `q` string below
                    "match": {
                      "_all": term
                    }
                    */
                }
            }
            else {
                query.q = term;
            }
            return query;
        }

        // conduct a search by writing it to the search/request path
        function doSearch(query) {
            var ref = database.ref().child(PATH);
            var key = ref.child('request').push(query).key;

            console.log('search', key, query);
            $('#query').text(JSON.stringify(query, null, 2));
            ref.child('response/' + key).on('value', showResults);
        }

        // when results are written to the database, read them and display
        function showResults(snap) {
        if( !snap.exists() ) { return; } // wait until we get data
        var dat = snap.val().hits;

        // when a value arrives from the database, stop listening
        // and remove the temporary data from the database
        snap.ref.off('value', showResults);
        snap.ref.remove();

        // the rest of this just displays data in our demo and probably
        // isn't very interesting
        var totalText = dat.total;
        if( dat.hits && dat.hits.length !== dat.total ) {
          totalText = dat.hits.length + ' of ' + dat.total;
        }
        $('#total').text('(' + totalText + ')');

        var $pair = $('#results')
          .text(JSON.stringify(dat, null, 2))
          .removeClass('error zero');
        if( dat.error ) {
          $pair.addClass('error');
        }
        else if( dat.total < 1 ) {
          $pair.addClass('zero');
        }
      }
    });