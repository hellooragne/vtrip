// 
// Here is how to define your module 
// has dependent on mobile-angular-ui
// 


var app = angular.module('MobileAngularUiExamples', [
		'ngRoute',
		'ngAnimate',
		'mobile-angular-ui',

		// touch/drag feature: this is from 'mobile-angular-ui.gestures.js'
		// it is at a very beginning stage, so please be careful if you like to use
		// in production. This is intended to provide a flexible, integrated and and 
		// easy to use alternative to other 3rd party libs like hammer.js, with the
		// final pourpose to integrate gestures into default ui interactions like 
		// opening sidebars, turning switches on/off ..
		'mobile-angular-ui.gestures',

		// If you're migrating from Mobile Angular UI 1.1 and you are using 
		// 'mobile-angular-ui.migrate.js' you have to require it too
		'mobile-angular-ui.migrate',

  		'phonecatServices'
		]);

// 
// You can configure ngRoute as always, but to take advantage of SharedState location
// feature (i.e. close sidebar on backbutton) you should setup 'reloadOnSearch: false' 
// in order to avoid unwanted routing.
// 
app.config(function($routeProvider) {
	$routeProvider.when('/',              {templateUrl: 'home.html', reloadOnSearch: false, controller: "MainController"});
	$routeProvider.when('/gis',           {templateUrl: 'gis.html', reloadOnSearch: false}); 
	$routeProvider.when('/im/:id',        {templateUrl: 'im.html', reloadOnSearch: false, controller: "im"}); 
	$routeProvider.when('/scroll',        {templateUrl: 'scroll.html', reloadOnSearch: false}); 
	$routeProvider.when('/toggle',        {templateUrl: 'toggle.html', reloadOnSearch: false}); 
	$routeProvider.when('/tabs',          {templateUrl: 'tabs.html', reloadOnSearch: false}); 
	$routeProvider.when('/accordion',     {templateUrl: 'accordion.html', reloadOnSearch: false}); 
	$routeProvider.when('/overlay',       {templateUrl: 'overlay.html', reloadOnSearch: false}); 
	$routeProvider.when('/forms',         {templateUrl: 'forms.html', reloadOnSearch: false});
	$routeProvider.when('/dropdown',      {templateUrl: 'dropdown.html', reloadOnSearch: false});
	$routeProvider.when('/drag',          {templateUrl: 'drag.html', reloadOnSearch: false});
	$routeProvider.when('/carousel',      {templateUrl: 'carousel.html', reloadOnSearch: false});
	$routeProvider.when('/toggleLegacy',  {templateUrl: 'toggleLegacy.html', reloadOnSearch: false});
});



//
// `$drag` example: drag to dismiss
//
app.directive('dragToDismiss', function($drag, $parse, $timeout){
	return {
		restrict: 'A',
	compile: function(elem, attrs) {
		var dismissFn = $parse(attrs.dragToDismiss);
		return function(scope, elem, attrs){
			var dismiss = false;

			$drag.bind(elem, {
				constraint: {
					minX: 0, 
				minY: 0, 
				maxY: 0 
				},
				move: function(c) {
					if( c.left >= c.width / 4) {
						dismiss = true;
						elem.addClass('dismiss');
					} else {
						dismiss = false;
						elem.removeClass('dismiss');
					}
				},
				cancel: function(){
					elem.removeClass('dismiss');
				},
				end: function(c, undo, reset) {
					if (dismiss) {
						elem.addClass('dismitted');
						$timeout(function() { 
							scope.$apply(function() {
								dismissFn(scope);  
							});
						}, 400);
					} else {
						reset();
					}
				}
			});
		};
	}
	};
});

//
// Another `$drag` usage example: this is how you could create 
// a touch enabled "deck of cards" carousel. See `carousel.html` for markup.
//
app.directive('carousel', function(){
	return {
		restrict: 'C',
	scope: {},
	controller: function($scope) {
		this.itemCount = 0;
		this.activeItem = null;

		this.addItem = function(){
			var newId = this.itemCount++;
			this.activeItem = this.itemCount == 1 ? newId : this.activeItem;
			return newId;
		};

		this.next = function(){
			this.activeItem = this.activeItem || 0;
			this.activeItem = this.activeItem == this.itemCount - 1 ? 0 : this.activeItem + 1;
		};

		this.prev = function(){
			this.activeItem = this.activeItem || 0;
			this.activeItem = this.activeItem === 0 ? this.itemCount - 1 : this.activeItem - 1;
		};
	}
	};
});

app.directive('carouselItem', function($drag) {
	return {
		restrict: 'C',
	require: '^carousel',
	scope: {},
	transclude: true,
	template: '<div class="item"><div ng-transclude></div></div>',
	link: function(scope, elem, attrs, carousel) {
		scope.carousel = carousel;
		var id = carousel.addItem();

		var zIndex = function(){
			var res = 0;
			if (id == carousel.activeItem){
				res = 2000;
			} else if (carousel.activeItem < id) {
				res = 2000 - (id - carousel.activeItem);
			} else {
				res = 2000 - (carousel.itemCount - 1 - carousel.activeItem + id);
			}
			return res;
		};

		scope.$watch(function(){
			return carousel.activeItem;
		}, function(n, o){
			elem[0].style['z-index']=zIndex();
		});


		$drag.bind(elem, {
			constraint: { minY: 0, maxY: 0 },
			adaptTransform: function(t, dx, dy, x, y, x0, y0) {
				var maxAngle = 15;
				var velocity = 0.02;
				var r = t.getRotation();
				var newRot = r + Math.round(dx * velocity);
				newRot = Math.min(newRot, maxAngle);
				newRot = Math.max(newRot, -maxAngle);
				t.rotate(-r);
				t.rotate(newRot);
			},
			move: function(c){
				if(c.left >= c.width / 4 || c.left <= -(c.width / 4)) {
					elem.addClass('dismiss');  
				} else {
					elem.removeClass('dismiss');  
				}          
			},
			cancel: function(){
				elem.removeClass('dismiss');
			},
			end: function(c, undo, reset) {
				elem.removeClass('dismiss');
				if(c.left >= c.width / 4) {
					scope.$apply(function() {
						carousel.next();
					});
				} else if (c.left <= -(c.width / 4)) {
					scope.$apply(function() {
						carousel.next();
					});
				}
				reset();
			}
		});
	}
	};
});


//
// For this trivial demo we have just a unique MainController 
// for everything
//
app.controller('MainController', function($rootScope, $scope, $routeParams, $http, Phone){

	$rootScope.test = 'test1234'

	// User agent displayed in home page
	$scope.userAgent = navigator.userAgent;

	// Needed for the loading screen
	$rootScope.$on('$routeChangeStart', function(){
		$rootScope.loading = true;
	});

	$rootScope.$on('$routeChangeSuccess', function(){
		$rootScope.loading = false;
	});

	// Fake text i used here and there.
	$scope.lorem = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vel explicabo, aliquid eaque soluta nihil eligendi adipisci error, illum corrupti nam fuga omnis quod quaerat mollitia expedita impedit dolores ipsam. Obcaecati.';

	// 
	// 'Scroll' screen
	// 
	var scrollItems = [];

	for (var i=1; i<=100; i++) {
		scrollItems.push('Item ' + i);
	}

	$scope.scrollItems = scrollItems;

	$scope.bottomReached = function() {
		alert('Congrats you scrolled to the end of the list!');
	}

	// 
	// Right Sidebar
	// 
	$scope.chatUsers = [
	{ name: 'Carlos  Flowers', online: true },
	{ name: 'Byron Taylor', online: true },
	{ name: 'Jana  Terry', online: true },
	{ name: 'Darryl  Stone', online: true },
	{ name: 'Fannie  Carlson', online: true },
	{ name: 'Holly Nguyen', online: true },
	{ name: 'Bill  Chavez', online: true },
	{ name: 'Veronica  Maxwell', online: true },
	{ name: 'Jessica Webster', online: true },
	{ name: 'Ebony Rice', online: false }
	];

	//
	// 'Forms' screen
	//  
	$scope.rememberMe = true;
	$scope.email = 'me@example.com';

	$scope.login = function() {
		alert('You submitted the login form');
	};


	var d = new Date();

	$scope.GisValue = 123456;


	var httpGet = function(position) {
		$scope.position = "Latitude: " + position.coords.latitude +
			  "Longitude: " + position.coords.longitude;
		console.log("Latitude: " + position.coords.latitude +
			  "Longitude: " + position.coords.longitude);

		var rest = "/gis/subway?location=" 
			+ position.coords.latitude
			+ ","
			+ position.coords.longitude 
			+ "&radius=8000";
		$http.get(rest).
			success(function(data) {
				$scope.greeting = data;
			});
	};

	$scope.GetGis = function($a) {
		//$scope.GisValue = $scope.GisValue + 1;
		console.log("GetGis");

		navigator.geolocation.getCurrentPosition(httpGet);
		
	};

	// 
	// 'Drag' screen
	// 
	$scope.notices = [];

	for (var j = 0; j < $scope.chatUsers.length; j++) {
		var user = $scope.chatUsers[j];
		$scope.notices.push({icon: 'envelope', message: 'Notice ' + j });
	}

	$scope.deleteNotice = function(notice) {
		var index = $scope.notices.indexOf(notice);
		if (index > -1) {
			$scope.notices.splice(index, 1);
		}
	};

	$scope.username = '';
	$scope.password = '';
	$rootScope.rooms = [

	];

	$scope.onOpen = function(r) {
		console.log("onOpen");
		//$scope.rooms = r.rooms;
		window.location.href = "#/gis/";
		for (var i in r.rooms) {
			console.log("rooms is " + r.rooms[i].name + "   " + r.rooms[i].roomId);
			$rootScope.rooms.push(r.rooms[i]);
		}
		Phone.groupsend({to:'141810209314877', msg:'12222222'});
	};

	$scope.handleTextMessage = function(message) {
		var from = message.from;//消息的发送者
		var mestype = message.type;//消息发送的类型是群组消息还是个人消息
		var messageContent = message.data;//文本消息体
		//TODO  根据消息体的to值去定位那个群组的聊天记录
		var room = message.to;
		console.log(mestype + "  " + messageContent);

		if (mestype == 'groupchat') {
			console.log(messageContent);
		} else {

		}
	};

	$scope.Login = function() {
		console.log($scope.username);
		console.log($scope.password);
		Phone.init({onOpen: $scope.onOpen, handleTextMessage: $scope.handleTextMessage});
		Phone.open({username:$scope.username, password:$scope.password});
	};

	

});

app.controller('im', ['$rootScope', '$scope', '$routeParams', 'Phone',
  function($rootScope, $scope, $routeParams, Phone) {

	  /*im */

	$scope.message = '';

	$scope.chats = ['111111111', '2222222'];

    $scope.id = $routeParams.id; 

    $scope.setImage = function(imageUrl) {
      $scope.phone = imageUrl;
    };

	$scope.Send = function() {
		console.log($scope.message);
		$scope.chats.push($scope.message);
		Phone.groupsend({to:$routeParams.id, msg:$scope.message});
		$scope.message = '';
		/*
		var index = $scope.chats.indexOf("hello");
		if (index > -1) {
			$scope.chats.splice(index, 1);
		}
		*/
	    //var	html = '<div class="section section-break"> <i class="fa fa-{{notice.icon}}"></i>' + $scope.message + '</div>';
		//angular.element('#helloim').append(html);
	};

	$scope.$on('$destroy', function iVeBeenDismissed() {
		// say goodbye to your controller here
		console.log("goodbye im ");
	});
	
	
  }]);
