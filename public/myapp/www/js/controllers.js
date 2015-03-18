angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
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

})


.controller('control_im', function($rootScope, $scope, $stateParams, $http, $sce, SpecialListService, s_im) {

	s_im.init();
	s_im.open({username:'test', password:'123456'});
})

.controller('special_detail', function($rootScope, $scope, $stateParams, $http, $sce, SpecialListService) {
	
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
	});


	$scope.$on('$destroy', function iVeBeenDismissed() {
		// say goodbye to your controller here
		console.log("goodbye special list");
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
			"type":'travel',
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
		});		
	};
});
