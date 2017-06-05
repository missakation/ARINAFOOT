
angular.module('football.controllers')

    .factory('ReservationFact', function ($q) {


        var TempItems = [];
        var Availables = [];
        var StadiumInfo = {};
        var AllStadiums = [];
        return {


            FindFreeStadiums: function (search, callback) {
                //console.log("hasa hos");
                //var q = $q.defer();
                try {

                    //alert(JSON.stringify(search.date));
                    //alert("here");
                    Availables = [];
                    var year = search.date.getFullYear();
                    var month = search.date.getMonth();
                    var day = search.date.getDate();

                    var hour = search.date.getHours();
                    var minute = search.date.getMinutes();

                    //firebase.database().ref('/stadiums/ministadiums').on('value',function (snapshot) {  

                    firebase.database().ref('/stadiums').once('value', function (snapshot) {

                        snapshot.forEach(function (mainstadiumSnapshot) {


                            mainstadiumSnapshot.child("ministadiums").forEach(function (stadiumsnapshot) {

                                var available = true;
                                var starthour = stadiumsnapshot.child("starthour").val();
                                var startminute = stadiumsnapshot.child("startminute").val();

                                var endhour = stadiumsnapshot.child("endhour").val();
                                var endminute = stadiumsnapshot.child("endminute").val();
                                var players = stadiumsnapshot.child("numplayers").val();

                                

                                
                                //console.log(players);
                                //console.log(search.players);
                                if (stadiumsnapshot.child('schedules/' + year + '/' + month + '/' + day).exists()) {
                                    var freetimes = [];

                                    stadiumsnapshot.child('schedules/' + year + '/' + month + '/' + day).forEach(function (minisnapshot) {

                                        if (minisnapshot.child("maindata").val()) {



                                            var temphour = minisnapshot.child("hour").val();
                                            var tempminute = minisnapshot.child("minute").val();

                                          //  if (temphour < starthour || temphour > (endhour - 2) || (Math.abs(temphour - hour) < 1.5)) {

                                            if(stadiumsnapshot.key=="Middle")
                                                alert((Math.abs( (temphour*60+tempminute) - (hour*60+minute))));

                                            if ((Math.abs( (temphour*60+tempminute) - (hour*60+minute) < 90)))
                                             {          
                                                 alert("not available");                                      
                                                available = false;
                                            }

                                        }



                                    });
                                    //alert(search.date);

                                    var startdate = new Date();


                                    startdate.setMinutes(minute);
                                    startdate.setFullYear(year);
                                    startdate.setMonth(month);
                                    startdate.setHours(hour);
                                    startdate.setDate(day);

                                }
                                if (available == true /*&& players == search.players*/) {
                                    var Data = {
                                        "admin": mainstadiumSnapshot.child("admin").val(),
                                        "stadiumkey": mainstadiumSnapshot.key,
                                        "ministadiumkey": stadiumsnapshot.key,
                                        "stadiumname": mainstadiumSnapshot.child("name").val(),
                                        "description": stadiumsnapshot.child("description").val(),
                                        //"datetime": hour + " : " + minute,
                                        "datetime": search.date,
                                        "price": stadiumsnapshot.child("price").val(),
                                        "photo": mainstadiumSnapshot.child("photo").val(),
                                        "type": stadiumsnapshot.child("type").val(),
                                        "typefloor": stadiumsnapshot.child("typefloor").val(),
                                        "distance": "5",
                                        "year": year,
                                        "month": month,
                                        "day": day,
                                        "players": stadiumsnapshot.child("numplayers").val(),
                                        "hour": hour,
                                        "minute": minute,
                                        "selected": "select",
                                        "color": "green",
                                        "backcolor": "white",
                                        "rating": 1,
                                        //"freetimes": freetimes,
                                        "SortPoints": 0,
                                        "latitude": mainstadiumSnapshot.child("cordovalatitude").val(),
                                        "longitude": mainstadiumSnapshot.child("cordovalongitude").val(),
                                        "iscombined": stadiumsnapshot.child("iscombined").val(),
                                        "combined": stadiumsnapshot.child("combined").val(),
                                        //"freedates":
                                        //{
                                        //    date : startdate
                                        //}
                                        //"indoor": indoor,
                                        //"outdoor": outdoor,
                                        //"clay": clay,
                                        //"grass":grass



                                    };

                                    Availables.push(Data);
                                }


                            });

                        });
                        //console.log(Availables);
                        callback(Availables);
                    }, function (error) {
                        alert(error.message);
                    });

                }
                catch (error) {
                    alert(error);
                }


            },
            RegisterFreeStadiums: function (search, user, stadiums) {
                //alert("here");
                var year = search.date.getFullYear();
                var month = search.date.getMonth();
                var day = search.date.getDate();

                var hour = search.date.getHours();
                var minute = search.date.getMinutes();


                //add duration


                var enddate = search.date;
                enddate.setMinutes(enddate.getMinutes() + 90);
                var endyear = search.date.getFullYear();
                var endmonth = search.date.getMonth();
                var endday = search.date.getDate();

                var endhour = search.date.getHours();
                var endminute = search.date.getMinutes();




                var key = stadiums.stadiumkey;
                var subkey = stadiums.ministadiumkey;

                var newkey = subkey + year.toString() + month.toString() + day.toString() + hour.toString() + minute.toString();
                //firebase.database().ref('/stadiums/ministadiums').on('value',function (snapshot) {

                var mainkey = newkey;

                var user = firebase.auth().currentUser;

                var id = user.uid;

                var postData = {
                    uid: id,
                    hour: hour,
                    minute: minute,
                    day: day,
                    discount: "0",
                    month: month,
                    nettotal: "",
                    price: stadiums.price,
                    starthour: "",
                    startmin: "",
                    teamone: "",
                    teamonescore: "",
                    teamtwo: "",
                    teamtwoscore: "",
                    usercode: "",
                    percentage: "",
                    duration: 90,
                    type: "B",
                    year: year,
                    total: stadiums.price,
                    bookedadmin: false,
                    maindata: true,
                    starthour: hour,
                    startminute: minute,
                    endhour: endhour,
                    endminute: endminute,
                    references: ""//the main info of the exact beginning time


                };

                var extraslots = {
                    usercode: id,
                    type: "B",
                    maindata: false
                };
                var updates = {};

                var numslots = 90 / 30;

                var mainkey = newkey;
                var references = [];

                for (i = 1; i < numslots; i++) {
                    search.date.setMinutes(search.date.getMinutes() + 30);

                    newkey = subkey + search.date.getFullYear().toString() + search.date.getMonth().toString() + search.date.getDate().toString() + search.date.getHours().toString() + search.date.getMinutes().toString();
                    var refdata = {
                        key: newkey
                    }
                    references.push(refdata);

                    var extrakeys = [];
                    if (stadiums.iscombined) {
                        for (var key in stadiums.combined) {
                            extrakeys.push(key);
                        }
                        console.log(extrakeys);
                        extrakeys.forEach(function (element) {
                            updates['/stadiums/' + stadiums.stadiumkey + '/ministadiums/' + element + '/schedules/' + year + '/' + month + '/' + day + '/' + newkey] = extraslots;
                            updates['/stadiumshistory/' + stadiums.stadiumkey + '/ministadiums/' + element + '/schedules/' + year + '/' + month + '/' + day + '/' + newkey] = extraslots;
                        }, this);
                    }

                    updates['/stadiums/' + stadiums.stadiumkey + '/ministadiums/' + subkey + '/schedules/' + year + '/' + month + '/' + day + '/' + newkey] = extraslots;
                    updates['/stadiumshistory/' + stadiums.stadiumkey + '/ministadiums/' + subkey + '/schedules/' + year + '/' + month + '/' + day + '/' + newkey] = extraslots;


                }
                postData.references = references;

                var accountinfo = {
                    usercode: id,
                    hour: hour,
                    minute: minute,
                    day: day,
                    discount: "0",
                    month: month,
                    nettotal: "",
                    //  price: details.price,
                    starthour: "",
                    startmin: "",
                    year: year,
                    percentage: "0",
                    type: "B",
                    total: 0,
                    bookedadmin: true,
                    fullstartdate: search.date,
                };

                var postDataPlayer = {
                    stadiumkey: stadiums.stadiumkey,
                    ministadiumkey: stadiums.ministadiumkey,
                    photo: stadiums.photo,
                    price: stadiums.price,
                    stadiumdescription: stadiums.stadiumname,
                    hour: hour,
                    minute: minute,
                    day: day,
                    discount: "0",
                    month: month,
                    nettotal: "",
                    teamone: "",
                    teamonescore: 0,
                    teamtwo: "",
                    teamtwoscore: 0,
                    year: year,
                    bookedadmin: false

                };

                var keys = [];
                if (stadiums.iscombined) {
                    for (var itemkey in stadiums.combined) {
                        keys.push(itemkey);
                    }

                    keys.forEach(function (element) {
                        updates['/stadiums/' + stadiums.stadiumkey + '/ministadiums/' + element + '/schedules/' + year + '/' + month + '/' + day + '/' + mainkey] = postData;
                        updates['/stadiumshistory/' + stadiums.stadiumkey + '/ministadiums/' + element + '/schedules/' + year + '/' + month + '/' + day + '/' + mainkey] = postData;
                    }, this);
                }

                updates['/stadiums/' + stadiums.stadiumkey + '/ministadiums/' + subkey + '/schedules/' + year + '/' + month + '/' + day + '/' + mainkey] = postData;
                updates['/stadiumshistory/' + stadiums.stadiumkey + '/ministadiums/' + subkey + '/schedules/' + year + '/' + month + '/' + day + '/' + mainkey] = postData;


                updates['/players/' + id + '/upcomingmatches/' + mainkey] = postDataPlayer;

                updates['/accounting/' + id + '/' + mainkey] = accountinfo;

                console.log(updates);

                return firebase.database().ref().update(updates);

            },
            GetStadiumsByID: function (id, callback) {
                //var q = $q.defer();
                try {
                    //firebase.database().ref('/stadiums/ministadiums').on('value',function (snapshot) {  

                    firebase.database().ref('/stadiumsinfo/' + id).once('value', function (snapshot) {
                        StadiumInfo = {};

                        var Data = {
                            "stadiumkey": snapshot.key,
                            "stadiumname": snapshot.child("name").val(),
                            "distance": "5",
                            "cancelationpolicy": snapshot.child("cancelationpolicy").val(),
                            "cordovaaccuracy": snapshot.child("cordovaaccuracy").val(),
                            "cordovaaltitude": snapshot.child("cordovaaltitude").val(),
                            "cordovaaltitudeAccuracy": snapshot.child("cordovaaltitudeAccuracy").val(),
                            "cordovaheading": snapshot.child("cordovaheading").val(),
                            "cordovalatitude": snapshot.child("cordovalatitude").val(),
                            "cordovalongitude": snapshot.child("cordovalongitude").val(),
                            "description": snapshot.child("description").val(),
                            "email": snapshot.child("email").val(),
                            "indoor": snapshot.child("indoor").val(),
                            "locationarea": snapshot.child("locationarea").val(),
                            "locationcity": snapshot.child("locationcity").val(),
                            "locationtelephone": snapshot.child("locationtelephone").val(),
                            "name": snapshot.child("name").val(),
                            "numberofstadium": snapshot.child("numberofstadium").val(),
                            "outdoor": snapshot.child("outdoor").val(),
                            "rating": snapshot.child("rating").val(),
                            "telephone": snapshot.child("telephone").val(),
                            "water": snapshot.child("water").val(),
                            "photo": snapshot.child("photo").val()

                        };
                        StadiumInfo = Data;

                        console.log(StadiumInfo);
                        callback(StadiumInfo);

                    });



                }
                catch (error) {
                    alert(error);
                }
            },
            GetMiniStadiumsByID: function (id, callback) {
                //var q = $q.defer();
                try {
                    //firebase.database().ref('/stadiums/ministadiums').on('value',function (snapshot) {  

                    firebase.database().ref('/stadiumsinfo/' + id).once('value', function (snapshot) {
                        StadiumInfo = {};

                        var Data = {
                            "stadiumkey": snapshot.key,
                            "stadiumname": snapshot.child("name").val(),
                            "distance": "5",
                            "cancelationpolicy": snapshot.child("cancelationpolicy").val(),
                            "cordovaaccuracy": snapshot.child("cordovaaccuracy").val(),
                            "cordovaaltitude": snapshot.child("cordovaaltitude").val(),
                            "cordovaaltitudeAccuracy": snapshot.child("cordovaaltitudeAccuracy").val(),
                            "cordovaheading": snapshot.child("cordovaheading").val(),
                            "cordovalatitude": snapshot.child("cordovalatitude").val(),
                            "cordovalongitude": snapshot.child("cordovalongitude").val(),
                            "description": snapshot.child("description").val(),
                            "email": snapshot.child("email").val(),
                            "indoor": snapshot.child("indoor").val(),
                            "locationarea": snapshot.child("locationarea").val(),
                            "locationcity": snapshot.child("locationcity").val(),
                            "locationtelephone": snapshot.child("locationtelephone").val(),
                            "name": snapshot.child("name").val(),
                            "numberofstadium": snapshot.child("numberofstadium").val(),
                            "outdoor": snapshot.child("outdoor").val(),
                            "rating": snapshot.child("rating").val(),
                            "telephone": snapshot.child("telephone").val(),
                            "water": snapshot.child("water").val()

                        };
                        StadiumInfo = Data;
                        callback(StadiumInfo);

                    });



                }
                catch (error) {
                    alert(error);
                }
            },
            GetAllStadiums: function (callback) {
                //var q = $q.defer();
                try {
                    //firebase.database().ref('/stadiums/ministadiums').on('value',function (snapshot) {  

                    firebase.database().ref('/stadiumsinfo').once('value', function (snapshot) {
                        AllStadiums = [];
                        snapshot.forEach(function (minisnapshot) {

                            var Data = {
                                "key": minisnapshot.key,
                                "name": minisnapshot.child("name").val(),
                                "photo": minisnapshot.child("photo").val(),
                                "area": minisnapshot.child("locationarea").val(),
                                "latitude": minisnapshot.child("cordovalatitude").val(),
                                "longitude": minisnapshot.child("cordovalongitude").val()


                            };
                            AllStadiums.push(Data);
                        })
                        callback(AllStadiums);

                    });



                }
                catch (error) {
                    alert(error);
                }
            },
            GetAllMiniStadiums: function (callback) {
                //var q = $q.defer();
                try {
                    //firebase.database().ref('/stadiums/ministadiums').on('value',function (snapshot) {  

                    firebase.database().ref('/stadiumsinfo').once('value', function (snapshot) {
                        AllStadiums = [];
                        snapshot.forEach(function (stadiumSnapshot) {
                            ministadiums = stadiumSnapshot.child("ministadiums");

                            ministadiums.forEach(function (minisnapshot) {
                                AllStadiums.push(minisnapshot.val());
                            })
                        })
                        callback(AllStadiums);

                    });
                }
                catch (error) {
                    alert(error);
                }
            },
            GetAllMiniStadiumsByStadName: function (stdName, callback) {
                //var q = $q.defer();
                try {
                    //firebase.database().ref('/stadiums/ministadiums').on('value',function (snapshot) {  

                    firebase.database().ref('/stadiumsinfo').orderByChild("name").startAt(stdName).endAt(stdName).once('value', function (snapshot) {
                        AllStadiums = [];
                        snapshot.forEach(function (stadiumSnapshot) {
                            if (stadiumSnapshot != null && stadiumSnapshot.child("name").val() == stdName) {
                                ministadiums = stadiumSnapshot.child("ministadiums");

                                ministadiums.forEach(function (minisnapshot) {
                                    minStd = minisnapshot.val();
                                    minStd.name = stadiumSnapshot.child("name").val();
                                    AllStadiums.push(minStd);
                                })

                                callback(AllStadiums);
                            }
                        })
                    });
                }
                catch (error) {
                    alert(error);
                }
            },
            CheckIfFree: function (stadiums, date, callback) {
                try {
                    var year = date.getFullYear();
                    var month = date.getMonth();
                    var day = date.getDate();

                    var hour = date.getHours();
                    var minute = date.getMinutes();

                    var key = stadiums.stadiumkey;
                    var subkey = stadiums.ministadiumkey;

                    var newkey = subkey + year.toString() + month.toString() + day.toString() + hour.toString() + minute.toString();

                    var exists = false;

                    firebase.database().ref('/stadiums/' + key + '/ministadiums/' + subkey + '/schedules/' + year + '/' + month + '/' + day + '/' + newkey)
                        .once('value', function (snapshot) {
                            if (snapshot.exists()) {
                                exists = true;
                            }
                            callback(exists);
                        })
                }
                catch (error) {
                    alert(error.message);
                }

            }
        }
    })