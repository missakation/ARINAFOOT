
angular.module('football.controllers')

  .controller('SettingsController', function ($scope,SMSService, $state, $timeout, BookingStore, $ionicPopup, $ionicLoading) {
    ;
    $scope.filter = {};
    var notificationRef = firebase.database().ref('/playersinfo/' + firebase.auth().currentUser.uid + '/settings');
    notificationRef.on('value', function (snapshot) {
      var data = snapshot.val();
      console.log('snapshot.val() : ' + angular.toJson(data, ' '));
      $scope.filter.notification = data.notification;
      $scope.filter.reminder_3hours = data.reminder_3hours;
      $scope.filter.emailVerified = firebase.auth().currentUser.emailVerified;
    });


    $scope.saveNotificationData = function (value) {
      var userId = firebase.auth().currentUser.uid;
      firebase.database().ref('players/' + userId + '/settings').update({
        notification: value,
        reminder_3hours: value
      });
      firebase.database().ref('playersinfo/' + userId + '/settings').update({
        notification: value,
        reminder_3hours: value
      });
    }

    $scope.saveReminderData = function (value) {
      if (!$scope.filter.notification) {
        $scope.filter.reminder_3hours = false;
        return;
      } else {
        var userId = firebase.auth().currentUser.uid;
        firebase.database().ref('players/' + userId + '/settings').update({
          reminder_3hours: value
        });
        firebase.database().ref('playersinfo/' + userId + '/settings').update({
          reminder_3hours: value
        });
      }

    }

    $scope.gosmsverifypage = function () {
    }


  })

  .controller('SettingsSmsController', function ($scope, $state, $timeout, BookingStore, $ionicPopup, $ionicLoading) {





  })
