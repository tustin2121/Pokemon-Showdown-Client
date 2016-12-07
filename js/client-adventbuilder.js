(function (exports, $) {
	var CURR_GEN = 7;
	
	var ConfirmPopup = this.ConfirmPopup = Popup.extend({
		initialize: function (data) {
			if (!data || !data.message || typeof data.callback !== "function") return;
			this.callback = data.callback;

			var buf = '<form>';
			buf += '<p style="white-space:pre-wrap;word-wrap:break-word">' + data.message;
			buf += '<input type="hidden" name="data" value="' + Tools.escapeHTML(data.value || '') + '" /></p>';
			buf += '<p class="buttonbar"><button type="submit"><strong>' + data.button + '</strong></button> <button name="close">Cancel</button></p>';
			buf += '</form>';

			this.$el.html(buf);
		},
		submit: function (data) {
			this.close();
			this.callback(data.data);
		}
	});
	
	/* global app, BattleBackdrops, musicTable */
	var AdventbuilderRoom = exports.AdventbuilderRoom = exports.Room.extend({
		type: 'adventbuilder',
		title: 'TPPLeague',
		initialize: function () {
			this.$el.addClass('ps-room-light scrollable tpp');
			
			app.on('response:adventbuilder', this.update, this);
			app.send('/adventbuilder request options');
			this.update();
		},
		events: {
			// Note: Button events already covered by dispatchClickButton, as long as the button is given a 'name' sttribute
		},
		update: function(data) {
			this.undelegateEvents();
			if (!data) {
				if (app.isDisconnected){
					this.$el.html("<div class='pad'><p>You are offline.</p></div>");
				} else {
					this.$el.html("<div class='pad'><p>Loading...</p></div>");
				}
				return;
			}
			if (data.err) {
				switch (data.err) {
					case 'unregistered':
						this.$el.html("<div class='pad'><p>Please register or log-in before continuing.</p></div>");
						return;
					case 'unauthed':
						this.$el.html("<div class='pad'><p>You are unauthorized to view this panel.</p></div>");
						return;
					case 'lockdown':
						app.addPopup(Popup, {
							type: 'semimodal',
							message: "Cannot perform this action: The server is in lockdown.",
						});
						return;
					default:
						app.addPopup(Popup, {
							type: 'semimodal',
							message: data.err.replace(/\|\|/g, '\n')
						});
						return;
				}
			}
			if (data.confirm) {
				var btn = "Yes";
				var action = "perform this action";
				var cmd = data.cmd.split(" ");
				switch (cmd[1]) {
					case "commit":
						switch (cmd[2]) {
							case "rmgym":
								btn = "Delete";
								action = "delete this gym";
								break;
							case "rmelite":
								btn = "Remove";
								action = "remove this elite member";
								break;
							case "rmchal":
								btn = "Kick";
								action = "delete this challenger's profile (they will still be able to start again from scratch if they wish)";
								break;
						} break;
					case "del":
						switch(cmd[2]) {
							case "league-challenge":
								btn = "Forfeit";
								action = "forfeit your league challenge";
								break;
						} break;
				}
				app.addPopup(ConfirmPopup, {
					message: "Are you sure you wish to "+action+"? (This action is irriversable.)",
					button: btn,
					value: data.cmd+" "+data.confirm,
					callback: function(cmd){
						app.send(cmd);
					},
				});
			}
			if (data.success) {
				app.addPopup(Popup, {
					type: 'semimodal',
					message: data.success.replace(/\|\|/g, '\n')
				});
			}
			
			if (data.screen) {
				this.layout(data);
			}
			this.delegateEvents();
		},
		layout: function(data) {
			var scrn = $("<div class='pad'>").attr('screen', data.screen);
			if (data.screen !== 'opts') {
				$("<button class='button'>")
					.html('<i class="fa fa-chevron-left"></i> Back')
					.on('click', function(){ app.send('/adventbuilder request options'); })
					.appendTo(scrn);
			}
			switch (data.screen) {
			case 'opts':
				var list = $("<ul>").css({'list-style':'none', margin:'0', padding:'0'});
				for (var i = 0; i < data.info.length; i++) {
					var b = $('<button class="button">');
					b.css({ height:40, width:320, 'font-size':'18px' });
					// b.prop('to', data.info[i]);
					b.attr({'name':'openView', 'value': data.info[i]});
					switch (data.info[i]) {
						case 'league-admin': b.html("<i class='fa fa-cogs'></i> Administer TPPLeague"); break;
						case 'league-champ': b.html("<i class='fa fa-star'></i> Edit Champion Setup"); break;
						case 'league-elite': b.html("<i class='fa fa-star-o'></i> Edit Elite Four Setup"); break;
						case 'league-gym': b.html("<i class='fa fa-shield'></i> Edit Gym Setup"); break;
						case 'league-challenge': b.html("<i class='fa fa-id-card-o'></i> View League Challenge"); break;
						case 'league-challenge:new': b.html("<i class='fa fa-plus'></i> Create League Challenge"); break;
					}
					// if (data.info[i].endsWith(":new")) {
					// 	b.on('click', function(){ app.send('/adventbuilder new '+$(this).prop('to').slice(0, -4)); });
					// } else {
					// 	b.on('click', function(){ app.send('/adventbuilder request '+$(this).prop('to')); });
					// }
					list.append(b);
					b.wrap("<li>");
				}
				scrn.append(list);
				break;
			
			case 'league-admin':
				scrn.append("<h1>TPPLeague Administration Console</h1>");
				scrn.append("<h3>Elite Members:</h3>");
				var elitelist = $("<ul>").appendTo(scrn);
				scrn.append("<h3>Regional Gyms:</h3>");
				var gymlist = $("<ul>").appendTo(scrn);
				scrn.append("<h3>Current Challengers:</h3>");
				var challist = $("<ul>").appendTo(scrn);
				
				Object.keys(data.info.elites).forEach(function(nick){
					var settings = data.info.elites[nick];
					var li = $("<li>").attr("value", nick).addClass("inabox").appendTo(elitelist);
					
					var btnpane = $("<div>").css({float:"right", "text-align":"right"}).appendTo(li);
					if (settings.isChamp) {
						$("<h4>Champion </h4>").append(
							$("<button>").addClass("button").html("Demote to E4")
							.on("click", function(){
								app.send('/adventbuilder commit demotechamp '+$(this).parents("li").first().attr("value"));
							})
						).appendTo(btnpane);
					} else {
						$("<h4>Elite Four </h4>").append(
							$("<button>").addClass("button").html("Promote to Champ")
							.on("click", function(){
								app.send('/adventbuilder commit promotechamp '+$(this).parents("li").first().attr("value"));
							})
						).appendTo(btnpane);
					}
					$("<button>").addClass("button").html("Remove Member")
					.on("click", function(){
						app.send('/adventbuilder commit rmelite '+$(this).parents("li").first().attr("value"));
					}).appendTo(btnpane);
					
					li.append("<h4>"+(settings.name||(settings.isChamp?"Champion":"Elite Four"))+"</h4><h3>"+nick+"</h3>");
					var types = $("<div>").appendTo(li).append("<span class='battletype'>"+settings.battletype+"</span>");
					if (!settings.types || !settings.types.length) {
						$("<img>").attr("src", "/sprites/types/%3F%3F%3F.png").appendTo(types);
					} else {
						for (var i = 0; i < settings.types; i++) {
							$("<img>").attr("src", "/sprites/types/"+settings.types+".png").appendTo(types);
						}
					}
				});
				{
					$("<li>").addClass("inabox").css({"text-align":"center"}).appendTo(elitelist)
					.append(
						$("<input type='text'>").addClass("textbox").attr("name", "addelite")
					)
					.append(
						$("<button>").addClass("button").html("Add new Elite Member")
						.on("click", function(){
							app.send('/adventbuilder commit addelite '+ $(this).parent().find("input[name=addelite]").val())
						})
					);
				}
				
				Object.keys(data.info.gyms).forEach(function(nick){
					var settings = data.info.gyms[nick];
					var li = $("<li>").attr("value", nick).addClass("inabox").appendTo(gymlist);
					
					var btnpane = $("<div>").css({float:"right", "text-align":"right"}).appendTo(li);
					$("<button>").addClass("button").html("Remove Leader")
					.on("click", function(){
						app.send('/adventbuilder commit rmgym '+$(this).parents("li").first().attr("value"));
					}).appendTo(btnpane);
					$("<h4>").html((settings.badge||"???")+" Badge").appendTo(btnpane);
					
					$("<img>").attr("src", "/badges/"+(settings.badge||"_Error_")+".png").addClass("badge").appendTo(li);
					
					li.append("<h4>The "+settings.name+" "+(settings.battletype==='trial'?"Trial":"Gym")+"</h4><h3>"+nick+"</h3>");
					var types = $("<div>").appendTo(li).append("<span class='battletype'>"+settings.battletype+"</span>");
					if (!settings.types || !settings.types.length) {
						$("<img>").attr("src", "/sprites/types/%3F%3F%3F.png").appendTo(types);
					} else {
						for (var i = 0; i < settings.types; i++) {
							$("<img>").attr("src", "/sprites/types/"+settings.types+".png").appendTo(types);
						}
					}
				});
				{
					$("<li>").addClass("inabox").css({"text-align":"center"}).appendTo(gymlist)
					.append(
						$("<input type='text'>").addClass("textbox").attr("name", "addgym")
					)
					.append(
						$("<button>").addClass("button").html("Add new Gym")
						.on("click", function(){
							app.send('/adventbuilder commit addgym '+ $(this).parent().find("input[name=addgym]").val())
						})
					);
				}
				
				Object.keys(data.info.challengers).forEach(function(nick){
					var settings = data.info.challengers[nick];
					var li = $("<li>").attr("value", nick).addClass("inabox").appendTo(challist);
					
					var btnpane = $("<div>").css({float:"right", "text-align":"right"}).appendTo(li);
					$("<button>").addClass("button").html("Kick Challenger")
					.on("click", function(){
						app.send('/adventbuilder commit rmchal '+$(this).parents("li").first().attr("value"));
					}).appendTo(btnpane);
					
					li.append("<h3>"+nick+"</h3>");
					var badges = $("<div>").appendTo(li);
					Object.keys(settings.badges).forEach(function(b){
						$("<img>").attr("src", "/badges/"+b+".png").attr('title', b).css({width:32, height:32, 'margin-left':4}).appendTo(badges);
					});
					if (badges.find("img").length == 0) {
						badges.append("No badges yet.");
					}
				});
				if (challist.find("li").length == 0) {
					challist.append("<li><center>No challengers at this time.</center></li>");
				}
				break;
				
			case 'league-elite':
				// Elite four settings
				scrn.append(`<h1>${(data.info.isChamp?'Champion':'Elite Four')} Settings</h1>`);
				var bgsettings = $("<div>").css({ 'max-width': 640, }).appendTo(scrn);
				$("<div>").appendTo(bgsettings)
					.addClass("inabox")
					.css({ float: 'right', width: 180, })
					.append("<label>Battle Field:</label>")
					.append(function(){
						var sel = $("<select name='battlefield'>");
						var bgs = BattleBackdrops.getSelectionList(CURR_GEN);
						for (var i = 0; i < bgs.length; i++) {
							sel.append('<option value="'+bgs[i]+'" '+(data.info.bgimg==bgs[i]? "selected":'')+'>'+bgs[i]+'</option>');
						}
						return sel;
					})
					.append("<label>Battle Field:</label>")
					.append(function(){
						var sel = $("<select name='battlemusic'>");
						var music = Object.keys(musicTable.meta);
						for (var i = 0; i < music.length; i++) {
							sel.append('<option value="'+music[i]+'" '+(data.info.bgmusic==music[i]? "selected":'')+'>'+music[i]+'</option>');
						}
						return sel;
					});
				$('<img>').appendTo(bgsettings)
					.attr("src", data.info.bgimg || BattleBackdrops.convertToPath(CURR_GEN, "bg-champion"))
					.css({ width: "440px", border: '4px inset #AAAAAA' })
					.addClass('bgpreview');
				break;
				
			case 'league-gym':
				// Gym settings
				break;
			
			case 'league-challenge':
				// League challenge settings
				break;
			
			case 'tppla1':
				// 
				break;
			}
			this.$el.empty().append(scrn);
		},
		
		openView: function(id, element) {
			if (id.endsWith(":new")) {
				app.send('/adventbuilder new '+id.slice(0, -4));
			} else {
				app.send('/adventbuilder request '+id);
			}
		},
	});
	
})(window, jQuery);
