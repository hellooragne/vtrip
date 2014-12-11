(function () {

	'use strict';

	/* Services */

	var im = function() {
		this.data  = '123456';
		this.conn  = new Easemob.im.Connection();
	};

	im.prototype.open = function() {
		this.conn.open({
			user : 'test',
			pwd :   '123456',
			//连接时提供appkey
			appKey : 'helloorange#vtrip'
		});
	};

	im.prototype.handleOpen = function(conn) {
		var _this = this;
		console.log('handle open');

		//获取当前登录人的联系人列表
		conn.getRoster({
			success : function(roster) {
				// 页面处理
				var curroster;
				for ( var i in roster) {
					var ros = roster[i];
					//both为双方互为好友，要显示的联系人,from我是对方的单向好友
					if (ros.subscription == 'both'
						|| ros.subscription == 'from') {

							console.log(roster[i].name);
						} else if (ros.subscription == 'to') {
							//to表明了联系人是我的单向好友
							console.log(roster[i].name);
						}
				}

				conn.setPresence();
				//获取当前登录人的群组列表
				conn.listRooms({
					success : function(rooms) {
						if (rooms) {
							var listRoom = rooms;
							for (var i in rooms) {
								console.log("rooms is " + rooms[i].name + "   " + rooms[i].roomId);
							}
						}
					},
					error : function(e) {

					}
				});
			}
		});
	};

	im.prototype.init = function() {
		var _this = this;
		this.conn.init({
			//当连接成功时的回调方法
			onOpened : function() {
				_this.handleOpen(_this.conn);
			}
		});
	};

	var phonecatServices = angular.module('phonecatServices', []);

	phonecatServices.factory('Phone', function() {
		var im_new = new im();
		im_new.init();
		im_new.open();
		var data = {
			user:im_new.data
		};
		return data;  
	});

}());
