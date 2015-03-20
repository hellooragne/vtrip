angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, s_im) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);
	s_im.init();
	s_im.open({username : $scope.loginData.username, password : $scope.loginData.password});
    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {

})

.controller('special_list', 
  function($rootScope, $scope, $http, $sce, SpecialListService) {

	$scope.special_offer_list = [];
	$scope.special_hotel_list = [];
	$scope.special_eat_list = [];
	$scope.special_guide_list = [];
	$scope.special_group_list = [];
	$scope.skip = 0;
	$scope.end = false;
	$scope.scroll_show = false;
	$scope.button_name = 'ShowMore';

	SpecialListService.httpget($http, $scope.end, $scope.special_offer_list, function() {

	});

	$scope.showmore = function() {
		console.log('show more button');
		if ($scope.end == false) {
			SpecialListService.httpget($http, $scope.end, $scope.special_offer_list, function() {

			});
		} else {

		}
	};


	var search = function(type, callback) {

		json = {"type":type, "limit":20,"skip":0};

	
		var rest = encodeURI("/special_offer/search?json=" + JSON.stringify(json));
		$scope.a = 1;

		$http.get(rest).success(function(data) {
			callback(data);
		});
	}

	search('hotel', function(data) {
		console.log(data);
		$scope.special_hotel_list = data;
	});

	search('eat', function(data) {

		$scope.special_eat_list = data;
	});

	search('guide', function(data) {

		$scope.special_guide_list = data;
	});



	search('group', function(data) {
		$scope.special_group_list = data;
	});
})


.controller('control_myitem', function($rootScope, $scope, $stateParams, $http, $sce, SpecialListService, s_im, s_item) {
	$scope.data = {};
	$scope.data.name = 'myitem';

	s_item.get(function(data) {
		$scope.data.my_item = data;
		$scope.data.totle_price = 0;
      	for (i in data) {
			$scope.data.totle_price += parseInt(data[i].price);
			console.log(data[i].price);
		}

		$scope.publish = function() {
			if ($scope.data.my_item.length > 0) {

				json = {
					"name":$scope.data.name,
					"type":'group',
					"time":new Date(),
					"price":$scope.data.totle_price,
					"items":$scope.data.my_item
				};

				console.log(json);
				var rest = "/special_offer/add?json=" + encodeURIComponent(angular.toJson(json));

				$http.get(rest).success(function(data) {
					window.location.href = "#/app/playlists";
				});
			}
			
		};
	});

	$scope.data.mytime = new Date();
})



.controller('control_im', function($rootScope, $scope, $stateParams, $http, $sce, SpecialListService, s_im) {



	$scope.$on('myEvent', function(e, value) {
	     console.log('This is the angular event ', e);
	    console.log('This is the value ', value)
	});	 
})

.controller('control_chat', function($rootScope, $scope, $stateParams, $http, $sce, SpecialListService, s_im) {
	
	s_im.SendText('test2', "hello hotel", "chat");
	
})

.controller('special_detail', function($rootScope, $scope, $stateParams, $http, $sce, SpecialListService, s_item) {

	$rootScope.root_button_show = 'true';
	

	$scope.$on('$destroy', function iVeBeenDismissed() {
		console.log("goodbye im ");
		$rootScope.root_button_show = 'false';
		$rootScope.root_click = null;
	});
	
	/*special list */
	/*
	json['_id'] = $stateParams.id; 
	
	json = {"limit":20,"skip":0};

	var rest = encodeURI("/special_offer/search?json=" + JSON.stringify(json));
	$scope.a = 1;

	$http.get(rest).
		success(function(data) {
			$scope.special_offer_detail = data[0];
			$scope.special_offer_detail['showurl'] = $sce.trustAsResourceUrl($scope.special_offer_detail['showurl']);
			$scope.special_offer_detail['jumpurl'] = $sce.trustAsResourceUrl($scope.special_offer_detail['jumpurl']);
				

			console.log(data[0]);
		});
	*/

	SpecialListService.GetOne($http, $stateParams.id, function(x) {
		$scope.special_offer_detail = x;
		$scope.special_offer_detail['showurl'] = $sce.trustAsResourceUrl($scope.special_offer_detail['showurl']);
		$scope.special_offer_detail['jumpurl'] = $sce.trustAsResourceUrl($scope.special_offer_detail['jumpurl']);

		$rootScope.root_click = function() {
			s_item.add(x);
		};
	});

})

.controller('special_add', 
  function($rootScope, $scope, $http, $sce) {
	$scope.detail = {};
	$scope.submit = function() {
	
		var words = $scope.detail.data.split('\t')		
		var id = words[3].split('/')
		var f_id = id[id.length - 1].split('.')

		json = {
			"name":words[1],
			"id":f_id[0],
			"type":"hotel",
			"time":new Date(),
			"price":words[6],
			"start_time":words[4],
			"start_city":words[2],
			"end_city":words[0],
			"jumpurl":words[3],
			"url":words[3],
			"content":words[8],
			"offsale":words[5],
			"quota":words[7],
		};


		var rest = "/special_offer/add?json=" + encodeURIComponent(JSON.stringify(json));

		console.log(rest);
		$http.get(rest).
			success(function(data) {
				$scope.detail.data = '';
		});		
	};
});
