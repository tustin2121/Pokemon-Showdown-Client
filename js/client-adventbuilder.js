(function (exports, $) {
	var UNKNOWN_AVATAR = 167;
	var CURR_GEN = 7;
	var BATTLETYPES = "<select name='battletype'>"
		+"<option value='singles'>Singles</option>"
		+"<option value='doubles'>Doubles</option>"
		+"<option value='triples'>Triples</option>"
	+"</select>";
	
	// Because Mantis uses IE... OpieOP
	if (!Array.prototype.includes) {
		Array.prototype.includes = function(searchElement /*, fromIndex*/) {
			'use strict';
			if (this == null) {
				throw new TypeError('Array.prototype.includes called on null or undefined');
			}
			
			var O = Object(this);
			var len = parseInt(O.length, 10) || 0;
			if (len === 0) return false;
			var n = parseInt(arguments[1], 10) || 0;
			var k;
			if (n >= 0) {
				k = n;
			} else {
				k = len + n;
				if (k < 0) {k = 0;}
			}
			var currentElement;
			while (k < len) {
				currentElement = O[k];
				if (searchElement === currentElement || (searchElement !== searchElement && currentElement !== currentElement)) { // NaN !== NaN
					return true;
				}
				k++;
			}
			return false;
		};
	}
	
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
	
	/* global BattleTypeChart */
	var TypeListPopup = Popup.extend({
		callback: null,
		initialize: function(data){ //pass in an array of already present types
			if (!data) data = {};
			if (!data.types) data.types = {};
			this.callback = data.callback;
			var types = Object.keys(BattleTypeChart);
			if (!types.includes("???")) types.push("???");
			var buf = '<label>Add Type:</label><table><tr>';
			for (var i = 0; i < types.length; i++) {
				if (i % 3 == 0 && i > 0) buf += '</tr><tr>';
				buf += '<td><button class="button '+(data.types[types[i]]?"sel":"")+'" name="addType" value="'+types[i]+'" title="'+types[i]+'"><img src="/sprites/types/'+types[i].replace(/\?/g, '%3f')+'.png" /></button></td>';
			}
			buf += '</tr></table>';
			this.$el.html(buf);
		},
		addType: function(type, btn){
			if (this.callback) {
				$(btn).toggleClass("sel", this.callback(type));
			}
		},
	});
	
	var ExplainationPopup = Popup.extend({
		type: 'semimodal',
		initialize: function (data) {
			var buf = "<h2>Information: "+data.title+"</h2>";
			if (typeof data.info === 'string') {
				buf += "<p>"+data.info+"</p>";
			} else if (Array.isArray(data.info)) {
				buf += "<p>"+data.info.join("</p><p>")+"</p>";
			}
			buf += '<p class="buttonbar"><button name="close" class="autofocus">Close</button></p>';
			this.$el.css('max-width', 760).html(buf);
		},
	});
	
	var TooltopPopup = Popup.extend({
		initialize: function (data) {
			if (typeof data.info === 'string') {
				data.info = data.info.split("\n");
			}
			var buf = "<p>"+data.info.join("</p><p>")+"</p>";
			this.$el.css('max-width', 760).html(buf);
		},
	});
	
	function array2map(arr) {
		arr = (arr && arr.slice()) || [];
		var map = {};
		while(arr.length) { map[arr.pop()] = 1; }
		Object.defineProperty(map, 'length', {
			get: function() {
				var item = 0;
				for (var key in map) {
					if (!!map[key]) item++;
				}
				return item;
			},
		});
		return map;
	}
	function map2array(map) {
		var arr = [];
		for (var key in map) {
			if (map[key]) arr.push(key);
		}
		return arr;
	}
	
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
			'change input[name=title]': 'updateTitle',
			'change input[name=badgename]': 'updateBadge',
			'change select[name=battlefield]': 'updateBattlefield',
			'change select[name=battlemusic]': 'updateBattleMusic',
			'change select[name=battletype]': 'updateBattleType',
			'change input[name=banlist]': 'markDirty',
			'click .badge-case-cover': 'openBadgeCase',
			'click .challBadgeRm': 'adminRemoveBadge',
		},
		
		blur: function() {
			if (this.musicpreview && this.musicpreview.playing) {
				this.musicpreview.stop();
				this.$("button[name=playPauseAudio]")
					.html("<i class='fa fa-music fa-fw'></i> <i class='fa fa-play fa-fw'></i>");
			}
		},
		leave: function() {
			if (this.musicpreview && this.musicpreview.playing) {
				this.musicpreview.stop();
			}
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
						this.$el.html("<div class='pad' style='text-align:center;'><p>Please register or log-in before continuing.</p><button class='button' name='openMainMenu'>Try Again</button></div>");
						this.delegateEvents();
						return;
					case 'unauthed':
						this.$el.html("<div class='pad' style='text-align:center;'><p>You are unauthorized to view this panel.</p><button class='button' name='openMainMenu'>Back to Main Menu</button></div>");
						this.delegateEvents();
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
			if (this.musicpreview && this.musicpreview.playing) {
				this.musicpreview.stop();
			}
			var scrn = $("<div class='pad'>").attr('screen', data.screen).addClass(data.screen);
			if (data.screen !== 'opts') {
				$("<button class='button' name='openMainMenu'>")
					.html('<i class="fa fa-chevron-left"></i> Back')
					.appendTo(scrn);
			}
			switch (data.screen) {
			case 'opts':
				scrn.css('text-align', 'center');
				scrn.append('<h2>Welcome to the TPPLeague!</h2>')
				scrn.append("<p>The following buttons allow you to interact with various settings for the TPPLeague. If you are a gym leader or an Elite Four member, the appropriate buttons to edit your gym's or elite battle settings will be shown here. If you're just looking to be a regular trainer, the option to start a league challenge will be below.</p><p><strong>Note: The nickname you are logged in as now will be the nickname that is completing the gym challenge.</strong> If you fight a leader under any other nickname, they will be unable to give badges to you.</p>");
				var list = $("<ul>");
				for (var i = 0; i < data.info.length; i++) {
					var b = $('<button class="button">');
					b.css({ height:40, width:320, 'font-size':'18px' });
					b.attr({'name':'openView', 'value': data.info[i]});
					switch (data.info[i]) {
						case 'league-admin': b.html("<i class='fa fa-cogs'></i> Administer TPPLeague"); break;
						case 'view-league': b.html("<i class='fa fa-map-o'></i> View TPPLeague"); break;
						case 'league-champ': b.html("<i class='fa fa-star'></i> Edit Champion Setup"); break;
						case 'league-elite': b.html("<i class='fa fa-star-o'></i> Edit Elite Four Setup"); break;
						case 'league-gym': b.html("<i class='fa fa-shield'></i> Edit Gym Setup"); break;
						case 'league-challenge': b.html("<i class='fa fa-id-card-o'></i> View League Challenge"); break;
						case 'league-challenge:new': b.html("<i class='fa fa-plus'></i> Create League Challenge"); break;
					}
					list.append(b);
					b.wrap("<li>");
				}
				scrn.append(list);
				break;
			
			case 'league-admin':
				scrn.append("<h1>TPPLeague Administration Console</h1>");
				scrn.append("<h3>League Options:</h3>");
				var optspane = $("<div>").addClass("inabox").appendTo(scrn);
				scrn.append("<h3>Elite Members:</h3>");
				var elitelist = $("<ul>").appendTo(scrn);
				scrn.append("<h3>Regional Gyms:</h3>");
				var gymlist = $("<ul>").appendTo(scrn);
				scrn.append("<h3>Current Challengers:</h3>");
				var challist = $("<ul>").appendTo(scrn);
				
				{
					optspane.append("<button class='button' name='adminCommitLeagueOptions' style='float:right;'>Commit Options</button>");
					optspane.append("<label><input type='checkbox' name='badgeRename'> Allow Gym Leaders to change their gym badges.</label>");
					optspane.append("<label><input type='checkbox' name='gymRename'> Allow Gym Leaders to change their gym names.</label>");
					optspane.append("<label><input type='checkbox' name='titleRename'> Allow Elite Four members to change their titles.</label>");
					optspane.append("<hr/>");
					optspane.append("<label><input type='checkbox' name='badgeGive'> Forbid Gym Leaders from handing out badges at this time.</label>");
					
					optspane.find("[name=badgeGive]").prop("checked", !data.info.options.badgeGive);
					optspane.find("[name=badgeRename]").prop("checked", data.info.options.badgeRename);
					optspane.find("[name=titleRename]").prop("checked", data.info.options.titleRename);
					optspane.find("[name=gymRename]").prop("checked", data.info.options.gymRename);
				}
				
				Object.keys(data.info.elites).forEach(function(nick){
					var settings = data.info.elites[nick];
					var li = $("<li>").attr("value", nick).addClass("inabox").appendTo(elitelist);
					
					var btnpane = $("<div>").css({float:"right", "text-align":"right"}).appendTo(li);
					if (settings.isChamp) {
						$("<h4>Champion </h4>").append(
							$("<button>").addClass("button").html("Demote to E4")
								.attr({name:'adminDemoteChamp', value: nick})
						).appendTo(btnpane);
					} else {
						$("<h4>Elite Four </h4>").append(
							$("<button>").addClass("button").html("Promote to Champ")
								.attr({name:'adminPromoteChamp', value: nick})
						).appendTo(btnpane);
					}
					$("<button>").addClass("button")
						.html("Remove Member")
						.attr({name:'adminRemoveElite', value: nick})
						.appendTo(btnpane);
					
					$("<img>").attr("src", Tools.resolveAvatar(settings.avatar||UNKNOWN_AVATAR)).addClass("badge").appendTo(li);
					
					li.append("<h4>"+(settings.name||(settings.isChamp?"Champion":"Elite Four"))+"</h4><h3>"+nick+"</h3>");
					var types = $("<div>").appendTo(li).append("<span class='battletype'>"+settings.battletype+"</span>");
					if (!settings.types || !settings.types.length) {
						$("<img>").attr("src", "/sprites/types/%3F%3F%3F.png").appendTo(types);
					} else {
						for (var i = 0; i < settings.types.length; i++) {
							$("<img>").attr("src", "/sprites/types/"+settings.types[i].replace(/\?/g, '%3f')+".png").appendTo(types);
						}
					}
					if (settings.isHidden) {
						li.css({opacity: 0.5});
					}
				});
				{
					$("<li>").addClass("inabox").css({"text-align":"center"}).appendTo(elitelist)
					.append(
						$("<input type='text'>").addClass("textbox").attr("name", "addelite")
					)
					.append(
						$("<button>").addClass("button")
							.html("Add new Elite Member")
							.attr('name', 'adminAddElite')
					);
				}
				
				Object.keys(data.info.gyms).forEach(function(nick){
					var settings = data.info.gyms[nick];
					var li = $("<li>").attr("value", nick).addClass("inabox").appendTo(gymlist);
					
					var btnpane = $("<div>").css({float:"right", "text-align":"right"}).appendTo(li);
					$("<button>").addClass("button")
						.html("Remove Leader")
						.attr({name:'adminRemoveGym', value: nick})
						.appendTo(btnpane);
					$("<h4>").html((settings.badge||"???")+" Badge").appendTo(btnpane);
					
					$("<img>").attr("src", "/badges/"+(settings.badge||"_Error_")+".png").addClass("badge").appendTo(li);
					$("<img>").attr("src", Tools.resolveAvatar(settings.avatar||UNKNOWN_AVATAR)).addClass("badge").appendTo(li);
					
					li.append("<h4>The "+settings.name+" "+(settings.battletype==='trial'?"Trial":"Gym")+"</h4><h3>"+nick+"</h3>");
					var types = $("<div>").appendTo(li).append("<span class='battletype'>"+settings.battletype+"</span>");
					if (!settings.types || !settings.types.length) {
						$("<img>").attr("src", "/sprites/types/%3F%3F%3F.png").appendTo(types);
					} else {
						for (var i = 0; i < settings.types.length; i++) {
							$("<img>").attr("src", "/sprites/types/"+settings.types[i].replace(/\?/g, '%3f')+".png").appendTo(types);
						}
					}
					if (settings.isHidden) {
						li.css({opacity: 0.5});
					}
				});
				{
					$("<li>").addClass("inabox").css({"text-align":"center"}).appendTo(gymlist)
					.append(
						$("<input type='text'>").addClass("textbox").attr("name", "addgym")
					)
					.append(
						$("<button>").addClass("button")
							.html("Add new Gym")
							.attr('name', 'adminAddGym')
					);
				}
				
				Object.keys(data.info.challengers).forEach(function(nick){
					var settings = data.info.challengers[nick];
					var li = $("<li>").attr("value", nick).addClass("inabox").appendTo(challist);
					
					var btnpane = $("<div>").css({float:"right", "text-align":"right"}).appendTo(li);
					$("<button>").addClass("button")
						.html("Kick Challenger")
						.attr({name: 'adminRemoveChallenger', value:nick})
						.appendTo(btnpane);
					
					
					$("<h3>").html(nick).append(function(){
						if (!settings.trainerid) return " <span class='trid'>(No ID)</span>";
						var visid = String(settings.trainerid[0]+settings.trainerid[1]*65536).substr(-6);
						return " <span class='trid'>"+visid+" ["+settings.trainerid.join(',')+"]</span>";
					}).appendTo(li);
					
					var badges = $("<div>").appendTo(li);
					Object.keys(settings.badges).forEach(function(b){
						$("<img>")
							.addClass("challBadgeRm")
							.attr("src", "/badges/"+b+".png")
							.attr('title', b)
							.css({width:32, height:32, 'margin-left':4})
							.appendTo(badges);
					});
					if (badges.find("img").length == 0) {
						badges.append("No badges yet.");
					}
					if (settings.isHidden) {
						li.css({opacity: 0.5});
					}
				});
				if (challist.find("li").length == 0) {
					challist.append("<li><center>No challengers at this time.</center></li>");
				}
				break;
				
			case 'league-elite':
				// Elite four settings
				data.info.bgimg = data.info.bgimg || (data.info.isChamp?'bg-champion':'bg-e4-drake');
				data.info.bgmusic = data.info.bgmusic || (data.info.isChamp?'dpp-champ':'dpp-e4');
				
				scrn.append(' <button class="button commitButton" name="commitElite" disabled>Save Changes</button>')
				scrn.append('<h1>'+(data.info.isChamp?'Champion':'Elite Four')+" Settings <button style='font-size:9pt; vertical-align:top;' class='button' name='openHelpPopup' value='elite'><i class='fa fa-question-circle-o'></i></button></h1>");
				
				$("<div>").addClass("inabox").appendTo(scrn)
					.append("<div style='float:left;'><label>Your Title:</label><input type='text' name='title' placeholder='"+(data.info.isChamp?'Champion':'Elite Four')+"' value='"+data.info.name+"'></div>")
					.append(this.renderTypeSelector(data))
					.append(
						$("<div style='text-align:center'><label>Battle Type:</label></div>").append(BATTLETYPES)
					)
					.append('<div style="clear:both;"></div>');
				
				this.renderPreview(data, "e4").appendTo(scrn);
				
				$("<div>").addClass("inabox").appendTo(scrn)
					.append("<label>Supplemental Ban List: <button class='button' name='openHelpPopup' value='banlist'><i class='fa fa-question-circle-o'></i></button></label>")
					.append("<input style='width:99%' type='text' name='banlist' maxlength='128' value='"+(data.info.banlist||[""]).join(", ")+"' placeholder='Comma separated list of Pokemon, Moves, Abilities, or Items to ban.'/>");
				
				scrn.find("input[name=title]").attr('maxlength', 32);
				scrn.find("select[name=battletype]").val(data.info.battletype);
				if (!data.options.titleRename) {
					scrn.find("input[name=title]")
						.prop('disabled', true)
						.attr('title', "Changing of E4 Titles is not allowed at this time by League Admin mandate.");
				}
				break;
				
			case 'league-gym':
				// Gym settings
				data.info.bgimg = data.info.bgimg || 'bg-leader-norman';
				data.info.bgmusic = data.info.bgmusic || 'oras-gym';
				
				scrn.append(' <button class="button commitButton" name="commitGym" disabled>Save Changes</button>')
				scrn.append("<h1>Gym Settings <button style='font-size:9pt; vertical-align:top;' class='button' name='openHelpPopup' value='gym'><i class='fa fa-question-circle-o'></i></button></h1>");
				
				$("<div>").addClass("inabox").appendTo(scrn)
					.append("<div style='float:left;'><label>Gym Name:</label><input type='text' name='title' placeholder='' value='"+data.info.name+"'></div>")
					.append(this.renderTypeSelector(data))
					.append(
						$("<div style='text-align:center'><label>Battle Type:</label></div>").append(
							$(BATTLETYPES).append('<option value="trial">Trial</option>')
						)
					)
					.append('<div style="clear:both;"></div>');
				
				this.renderPreview(data, "gym").appendTo(scrn);
				
				$("<div>").addClass("inabox").appendTo(scrn)
					.append("<label>Supplemental Ban List: <button class='button' name='openHelpPopup' value='banlist'><i class='fa fa-question-circle-o'></i></button></label>")
					.append("<input style='width:99%' type='text' name='banlist' maxlength='128' value='"+(data.info.banlist||[""]).join(", ")+"' placeholder='Comma separated list of Pokemon, Moves, Abilities, or Items to ban.'/>");
				
				$("<div>").addClass("inabox trialDesc").appendTo(scrn)
					.append("<label>Trial Description: <button class='button' name='openHelpPopup' value='trials'><i class='fa fa-question-circle-o'></i></button></label>")
					.append("<textarea name='trialdesc' style='width:98%' rows='3' maxlength='1000' spellcheck='true' autocapitalize='sentences'>"+(data.info.trialdesc||"")+"</textarea>")
					.toggle(data.info.battletype==='trial');
				
				scrn.find("input[name=title]").attr('maxlength', 16);
				scrn.find("input[name=badgename]").attr({'maxlength': 32, pattern: '[a-zA-Z- ]{0,32}'});
				scrn.find("select[name=battletype]").val(data.info.battletype);
				if (!data.options.gymRename) {
					scrn.find("input[name=title]")
						.prop('disabled', true)
						.attr('title', "Changing of Gym names is not allowed at this time by League Admin mandate.");
				}
				if (!data.options.badgeRename) {
					scrn.find("input[name=badgename]")
						.prop('disabled', true)
						.attr('title', "Changing of Badge names is not allowed at this time by League Admin mandate.");
				}
				break;
			
			case 'view-league':
				scrn.append("<h3>Regional Gyms:</h3>");
				var gymlist = $("<ul>").addClass("gymList").appendTo(scrn);
				
				var self = this;
				Object.keys(data.league.gyms).forEach(function(nick){
					var settings = data.league.gyms[nick];
					gymlist.append(self.renderGymPanel(nick, settings, true, true));
				});
				
				scrn.append("<h3>Elite Members:</h3>");
				var singles = [];
				var doubles = [];
				var elitelist = $("<ul>").addClass("gymList").appendTo(scrn);
				var champPanels = $("<ul>").addClass("gymList").appendTo(scrn);
				Object.keys(data.league.elites).forEach(function(nick){
					var settings = data.league.elites[nick];
					var panel = self.renderElitePanel(nick, settings, false/*TODO track elite four defeats*/, true);
					if (!settings.isChamp) {
						if (settings.battletype === 'singles') {
							singles.push(panel);
						} else if (settings.battletype === 'doubles') {
							doubles.push(panel);
						} else {
							elitelist.append(panel);
						}
					} else {
						if (settings.battletype === 'singles') {
							champPanels.addClass("champ").prepend(panel);
						} else {
							champPanels.addClass("champ").append(panel);
						}
					}
				});
				while (doubles.length || singles.length) {
					if (doubles.length) elitelist.prepend(doubles.pop());
					if (singles.length) elitelist.prepend(singles.pop());
				}
				break;
			
			case 'league-challenge':
				// League challenge settings
				scrn.append("<div style='clear:both;'></div>");
				var sdate = new Date(data.info.startdate);
				var tcard = $("<div>").addClass("trainer-card").appendTo(scrn)
					.append("<img class='pic' src='"+Tools.resolveAvatar(data.user.avatar)+"'>")
					.append("<div class='field name'>"+data.user.name+"</div>")
					.append("<div class='field id'>"+data.info.trainerid+"</div>")
					.append("<div class='field score'>"+(data.info.score||0)+"</div>")
					.append("<div class='field startdate'>"+sdate.toLocaleDateString()+" "+sdate.toLocaleTimeString()+"</div>")
					.css({ float:'left' });
					
				scrn.append("<div class='badge-case-cover'>Badge Case</div>");
				var bcase = $("<div>").addClass("badge-case").appendTo(scrn);
				bcase.append("<button class='button' style='position: absolute; top:0; right:0;' name='closeBadgeCase'><i class='fa fa-close'></i></button>");
				var badges = map2array(data.info.badges);
				for (var i = 0; i < badges.length || i < 8 || i%2 !== 0; i++) {
					if (badges[i]) {
						bcase.append("<div class='badge'><img src='/badges/"+badges[i]+".png'/></div>");
					} else {
						bcase.append("<div class='badge empty'></div>");
					}
				}
				bcase.append("<div style='clear:both;'></div>");
				bcase.find("img").one("error", function(){ $(this).prop("src", "/badges/_Error_.png"); });
				
				scrn.append("<p style='clear:both; margin-top:6px;'>Note: Remember when challenging a gym leader or elite member that <strong><em>you</em> must be the one to issue the challenge</strong>. If the leader issues you the challenge, the battle will error.</p><p>You may issue challenges to leaders even if they are not online; they will be notified of your challenge request when they next come online. You will have to re-issue the challenge to them at that time.</p>");
				
				scrn.append("<h3>Regional Gyms:</h3>");
				var gymlist = $("<ul>").addClass("gymList").appendTo(scrn);
				
				var self = this;
				Object.keys(data.league.gyms).forEach(function(nick){
					var settings = data.league.gyms[nick];
					gymlist.append(self.renderGymPanel(nick, settings, !!data.info.badges[settings.badge]));
				});
				
				if (badges.length > 8) {
					scrn.append("<h3>Elite Members:</h3>");
					var singles = [];
					var doubles = [];
					var elitelist = $("<ul>").addClass("gymList").appendTo(scrn);
					var champPanels = $("<ul>").addClass("gymList").appendTo(scrn);
					Object.keys(data.league.elites).forEach(function(nick){
						var settings = data.league.elites[nick];
						var panel = self.renderElitePanel(nick, settings, false/*TODO track elite four defeats*/);
						if (!settings.isChamp) {
							if (settings.battletype === 'singles') {
								singles.push(panel);
							} else if (settings.battletype === 'doubles') {
								doubles.push(panel);
							} else {
								elitelist.append(panel);
							}
						} else {
							if (settings.battletype === 'singles') {
								champPanels.addClass("champ").prepend(panel);
							} else {
								champPanels.addClass("champ").append(panel);
							}
						}
					});
					while (doubles.length || singles.length) {
						if (doubles.length) elitelist.prepend(doubles.pop());
						if (singles.length) elitelist.prepend(singles.pop());
					}
				}
				
				scrn.find("li[value="+toId(data.user.name)+"] .challengeBtn")
					.prop("disabled", true)
					.attr('title', 'You cannot challenge yourself');
				
				break;
			
			case 'tppla1':
				// 
				break;
			}
			this.$el.empty().append(scrn);
		},
		
		renderGymPanel: function(nick, settings, haveBadge, dontChallenge) {
			if (haveBadge === undefined) haveBadge = true;
			
			var li = $("<li>").attr("value", nick).addClass("inabox gym-entry");
			
			li.append("<h4>The "+settings.name+" "+(settings.battletype==='trial'?"Trial":"Gym")+"</h4>");
			li.append("<h3>Leader: "+nick+"</h3>");
			
			$("<img>").appendTo(li)
				.addClass("badge")
				.attr("src", Tools.resolveAvatar(settings.avatar||UNKNOWN_AVATAR));
			$("<img>").appendTo(li)
				.addClass("badge"+(haveBadge?"":" unobtained"))
				.attr("src", "/badges/"+(settings.badge||"_Error_")+".png")
				.one("error", function(){ $(this).prop("src", "/badges/_Error_.png"); });
			li.append("<h4>"+(settings.badge||"???")+" Badge</h4>");
			
			if (!dontChallenge) {
				$("<button>").addClass("button challengeBtn")
					.html("Challenge")
					.attr({name:'challengeGym', value: nick})
					.appendTo(li);
				li.append("<div style='clear:both;'></div>");
			}
			
			li.append("<span class='battletype' style='float:left;'>"+settings.battletype+"</span>")
			
			var types = $("<div>").appendTo(li).css("float", "right");
			if (!settings.types || !settings.types.length) {
				$("<img>").attr("src", "/sprites/types/%3F%3F%3F.png").appendTo(types);
			} else {
				for (var i = 0; i < settings.types.length; i++) {
					$("<img>").attr("src", "/sprites/types/"+settings.types[i].replace(/\?/g, '%3f')+".png").appendTo(types);
				}
			}
			li.append("<div style='clear:both;'></div>");
			
			if (settings.battletype === "trial") {
				li.find(".battletype").wrapInner(
					$("<a>")
						.attr("title", Tools.escapeHTML(settings.trialdesc))
						.css({cursor:"pointer"})
						.on("click", function(e){
							app.addPopup(TooltopPopup, {
								sourceEl: e.target,
								info: Tools.escapeHTML(settings.trialdesc),
							});
							e.preventDefault();
							e.stopImmediatePropagation();
						})
				);
			}
			if (settings.banlist && settings.banlist.length) {
				li.find(".battletype").append(this.renderBanlist(settings.banlist));
			}
			return li;
		},
		
		renderElitePanel: function(nick, settings, defeated, dontChallenge) {
			var li = $("<li>").attr("value", nick).addClass("inabox gym-entry");
			
			li.append("<h4>"+(settings.name||(settings.isChamp?"Champion":"Elite Four"))+"</h4>");
			li.append("<h3>"+nick+"</h3>");
			
			$("<img>").appendTo(li)
				.addClass("badge"+(defeated?" unobtained":""))
				.attr("src", Tools.resolveAvatar(settings.avatar||UNKNOWN_AVATAR));
			li.append("<h4>"+(settings.isChamp?"Champion":"Elite Four")+"</h4>");
			
			if (!dontChallenge) {
				$("<button>").addClass("button challengeBtn")
					.html("Challenge")
					.attr({name:'challenge'+(settings.isChamp?"Champ":"E4"), value: nick})
					.appendTo(li);
				li.append("<div style='clear:both;'></div>");
			}
			
			li.append("<span class='battletype' style='float:left;'>"+settings.battletype+"</span>")
			
			var types = $("<div>").appendTo(li).css("float", "right");
			if (!settings.types || !settings.types.length) {
				$("<img>").attr("src", "/sprites/types/%3F%3F%3F.png").appendTo(types);
			} else {
				for (var i = 0; i < settings.types.length; i++) {
					$("<img>").attr("src", "/sprites/types/"+settings.types[i].replace(/\?/g, '%3f')+".png").appendTo(types);
				}
			}
			li.append("<div style='clear:both;'></div>");
			
			if (settings.banlist && settings.banlist.length) {
				li.find(".battletype").append(this.renderBanlist(settings.banlist));
			}
			return li;
		},
		
		renderPreview: function(data, type) {
			var bgsettings = $("<div>")
				.css({ 
					'max-width': 640, 
					'min-height': 240,
					border: '1px solid #aaa', 
					padding:'4px', 
					'border-radius':'6px' ,
					position: 'relative',
				});
			var sidebox = $("<div>").appendTo(bgsettings)
				.addClass("inabox")
				.css({ position:'absolute', right: 4, width: 180, })
				.append("<label>Battle Field:</label>")
				.append(function(){
					var sel = $("<select name='battlefield'>");
					var bgs = BattleBackdrops.getSelectionList(CURR_GEN);
					for (var i = 0; i < bgs.length; i++) {
						sel.append('<option value="'+bgs[i]+'" '+(data.info.bgimg==bgs[i]? "selected":'')+'>'+bgs[i]+'</option>');
					}
					return sel;
				})
				.append("<label style='margin-top:6px;'>Battle Music:</label>")
				.append(function(){
					var sel = $("<select name='battlemusic'>");
					var music = Object.keys(musicTable.meta);
					for (var i = 0; i < music.length; i++) {
						if (!musicTable.isValidBattle(music[i])) continue;
						sel.append('<option value="'+music[i]+'" '+(data.info.bgmusic==music[i]? "selected":'')+'>'+music[i]+'</option>');
					}
					return sel;
				});
			$('<img>').appendTo(bgsettings)
				.attr("src", BattleBackdrops.convertToPath(CURR_GEN, data.info.bgimg))
				.css({ width: 420, border: '2px inset #AAAAAA', })
				.addClass('bgpreview');
			var sidebar = $("<div>").addClass("rightbar").appendTo(bgsettings)
				.css({
					top: 6, right: 200,
					bottom: 6, height: 'auto',
				})
				.append(
					$("<div>").addClass("trainer").css({ bottom: 'initial', top: 15})
					.append('<strong name="usertitle"></strong>')
					.append('<strong name="username">'+Tools.escapeHTML(data.user.name)+'</strong>')
					.append('<img class="trainersprite" src="'+Tools.resolveAvatar(data.user.avatar)+'">')
				);
			var gymname = $("<h3>").appendTo(bgsettings)
				.css({ 
					position: 'absolute', 
					top: 6, left: 6, 
					color: 'white',
					'background-color': 'rgba(0, 0, 0, 0.55)',
					padding: '2px 16px 2px 4px',
					'border-radius': '0 0 30px 0',
					margin: 0,
				});
			
			$("<button>").addClass("button").appendTo(bgsettings)
				.html("<i class='fa fa-music fa-fw'></i> <i class='fa fa-spinner fa-pulse fa-fw'></i>")
				.attr('name', 'playPauseAudio')
				.prop('disabled', true)
				.css({ position: 'absolute', bottom: 15, right: 210, });
			this.loadMusicPreview(data.info.bgmusic);
			
			
			if (type === "gym") {
				sidebox
					.append("<label style='margin-top:6px;'>Badge: <button class='button' name='openHelpPopup' value='badges'><i class='fa fa-question-circle-o'></i></button></label>")
					.append("<input type='text' name='badgename' value='"+(data.info.badge||"")+"'/>");
				$('<img>').appendTo(bgsettings)
					.attr("src", "/badges/"+data.info.badge+".png")
					.css({ position: 'absolute', bottom: 4, right: 40, width: 130, height: 130,  })
					.addClass('badgepreview')
					.one("error", function(){ $(this).prop("src", "/badges/_Error_.png"); });
				
				gymname.html("The <span name='myname'>"+data.info.name+"</span> <span name='gymtype'>"+(data.info.battletype=="trial"?"Trial":"Gym")+"</span>");
				sidebar.find("[name=usertitle]").html("<span name='gymleadertype'>"+(data.info.battletype=="trial"?"Captain":"Leader")+"</span>");
			}
			
			if (type === "e4") {
				gymname.html("Elite Four");
				sidebar.find("[name=usertitle]").html("<span name='myname'>"+data.info.name+"</span>");
			}
			
			return bgsettings;
		},
		
		renderBanlist: function(banlist){
			var bl = $("<span class='banlist' title='This gym has banned: "+banlist.join(", ")+".'>Banlist</span>");
			bl.on("click", function(e){
				app.addPopup(TooltopPopup, {
					sourceEl: e.target,
					info: "This gym has banned: "+banlist.join(", ")+".",
				});
				e.preventDefault();
				e.stopImmediatePropagation();
			});
			return [" ", bl];
		},
		
		openMainMenu: function(){
			app.send('/adventbuilder request options');
		},
		openView: function(id, element) {
			if (id.slice(-4) === ":new") {
				app.send('/adventbuilder new '+id.slice(0, -4));
			} else {
				app.send('/adventbuilder request '+id);
			}
		},
		
		markDirty: function() {
			this.$("button.commitButton").prop('disabled', false);
		},
		updateTitle: function() {
			this.markDirty();
			var title = Tools.escapeHTML(this.$("input[name=title]").val()).substr(0, 32);
			if (!title) title = Tools.escapeHTML(this.$("input[name=title]").attr("placeholder"));
			this.$("span[name=myname]").html(title);
		},
		updateBattlefield: function(){
			this.markDirty();
			this.$("img.bgpreview").attr("src", 
				BattleBackdrops.convertToPath(7, this.$("select[name=battlefield]").val()));
		},
		updateBattleMusic: function(){
			this.markDirty();
			this.loadMusicPreview(this.$("select[name=battlemusic]").val());
		},
		updateBadge: function() {
			this.markDirty();
			var name = this.$('input[name=badgename]').val().trim().replace(/[^a-zA-Z- ]/, "").substr(0, 32);
			this.$('input[name=badgename]').val(name);
			this.$(".badgepreview").attr('src', "/badges/"+name+".png")
				.one("error", function(){ $(this).prop("src", "/badges/_Error_.png"); });
		},
		updateBattleType: function(){
			this.markDirty();
			var type = this.$("select[name=battletype]").val();
			if (type === 'trial') {
				this.$("span[name=gymtype]").html("Trial");
				this.$("span[name=gymleadertype]").html("Captain");
				this.$(".trialDesc").slideDown();
			} else {
				this.$("span[name=gymtype]").html("Gym");
				this.$("span[name=gymleadertype]").html("Leader");
				this.$(".trialDesc").slideUp();
			}
		},
		
		renderTypeSelector: function(data) {
			var types = array2map(data.info.types);
			return $("<div style='float:right'><label>Your Type(s): <button class='button' name='openTypeList'><i class='fa fa-plus-square fa-fw'></i></button></label></div>").append(
				$("<div>").css({'width':230,})
					.addClass("typeList").data('types', types)
					.append(this.renderTypeList(types).join(" "))
			);
		},
		renderTypeList: function(types) {
			if (!$.isPlainObject(types) || !types.length) 
				return ["<img src='/sprites/types/%3f%3f%3f.png' title='No types defined'/>"];
			var arr = [];
			for (var type in types) {
				if (!types[type]) continue;
				arr.push("<img src='/sprites/types/"+type.replace(/\?/g, '%3f')+".png' title='"+type+"'>");
			}
			return arr;
		},
		openTypeList: function(){
			app.addPopup(TypeListPopup, {
				types:this.$(".typeList").data('types'), 
				callback: this.addTypeFromPopup.bind(this)
				
			});
		},
		addTypeFromPopup: function(type){
			this.markDirty();
			var list = this.$(".typeList").data('types');
			list[type] = !list[type];
			if (list.length > 6) list[type] = false; // don't allow more than 6 types
			this.$(".typeList").html(this.renderTypeList(list).join(" "));
			return list[type];
		},
		
		commitElite: function() {
			var json = {
				name: Tools.escapeHTML(this.$("input[name=title]").val().trim().substr(0, 32)),
				bgimg: this.$("select[name=battlefield]").val(),
				bgmusic: this.$("select[name=battlemusic]").val(),
				battletype: this.$("select[name=battletype]").val(),
				types: map2array(this.$(".typeList").data('types')),
				banlist: this.$("input[name=banlist]").val().trim().split(/, ?/i),
			};
			app.send('/adventbuilder commit elite '+JSON.stringify(json));
		},
		commitGym: function() {
			var json = {
				name: Tools.escapeHTML(this.$("input[name=title]").val().trim().substr(0, 16)),
				bgimg: this.$("select[name=battlefield]").val(),
				bgmusic: this.$("select[name=battlemusic]").val(),
				battletype: this.$("select[name=battletype]").val(),
				types: map2array(this.$(".typeList").data('types')),
				badge: this.$("input[name=badgename]").val().trim().replace(/[^a-zA-Z- ]/, "").substr(0, 32),
				trialdesc: this.$("textarea[name=trialdesc]").val().trim().substr(0, 1000),
				banlist: this.$("input[name=banlist]").val().trim().split(/, ?/i),
			};
			app.send('/adventbuilder commit gym '+JSON.stringify(json));
		},
		
		openBadgeCase: function(){
			this.$(".badge-case").slideDown(1000);
			this.$(".badge-case-cover").slideUp(1000);
		},
		closeBadgeCase: function(){
			this.$(".badge-case").slideUp(1000);
			this.$(".badge-case-cover").slideDown(1000);
		},
		
		challengeGym: function(nick){
			app.focusRoom('');
			app.rooms[''].challenge(nick, "TPPLeagueGym");
		},
		challengeE4: function(nick){
			app.focusRoom('');
			app.rooms[''].challenge(nick, "TPPLeagueEliteFour");
		},
		challengeChamp: function(nick){
			app.focusRoom('');
			app.rooms[''].challenge(nick, "TPPLeagueChampion");
		},
		
		musicpreview: null,
		playPauseAudio: function() {
			if (!this.musicpreview) return;
			if (this.musicpreview.playing) {
				this.musicpreview.stop();
				this.$("button[name=playPauseAudio]")
					.html("<i class='fa fa-music fa-fw'></i> <i class='fa fa-play fa-fw'></i>");
			} else {
				this.musicpreview.play();
				this.$("button[name=playPauseAudio]")
					.html("<i class='fa fa-music fa-fw'></i> <i class='fa fa-stop fa-fw'></i>");
			}
		},
		loadMusicPreview: function(musicid){
			if (!(window.AudioContext || window.webkitAudioContext)) {
				this.$("button[name=playPauseAudio]")
					.html("<i class='fa fa-music fa-fw'></i> <i class='fa fa-remove fa-fw'></i>")
					.attr('title', 'Your browser does not support audio playback.')
					.prop('disabled', true);
				return;
			}
			
			if (this.musicpreview && this.musicpreview.playing) {
				this.musicpreview.stop();
			}
			
			/* global soundManager, Tools, BattleSound */
			var bgmInfo = musicTable.meta[musicid];
			if (!bgmInfo) {
				this.$("button[name=playPauseAudio]")
					.html("<i class='fa fa-music fa-fw'></i> <i class='fa fa-remove fa-fw'></i>")
					.attr('title', 'The selected music id has no metadata.')
					.prop('disabled', true);
				return;
			}
			this.$("button[name=playPauseAudio]")
					.html("<i class='fa fa-music fa-fw'></i> <i class='fa fa-spinner fa-pulse fa-fw'></i>")
					.attr('title','')
					.prop('disabled', true);
			this.musicpreview = soundManager.createSound({
				id: bgmInfo.url,
				url: Tools.resourcePrefix + bgmInfo.url,
				volume: BattleSound.bgmVolume,
				loopstart: bgmInfo.loop[0],
				loopend: bgmInfo.loop[1],
			});
			
			this.musicpreview.load().then(function(){
				this.$("button[name=playPauseAudio]")
					.html("<i class='fa fa-music fa-fw'></i> <i class='fa fa-play fa-fw'></i>")
					.prop('disabled', false);
			}.bind(this))
			.catch(function(err){
				this.$("button[name=playPauseAudio]")
					.html("<i class='fa fa-music fa-fw'></i> <i class='fa fa-remove fa-fw'></i>")
					.attr('title', 'The selected music id does not exist on the server.')
					.prop('disabled', true);
			}.bind(this));
		},
		
		adminCommitLeagueOptions: function() {
			var opts = {
				badgeGive: !this.$("[name=badgeGive]").is(":checked"),
				badgeRename: this.$("[name=badgeRename]").is(":checked"),
				titleRename: this.$("[name=titleRename]").is(":checked"),
				gymRename: this.$("[name=gymRename]").is(":checked"),
			};
			app.send('/adventbuilder commit leagueopts '+JSON.stringify(opts));
		},
		adminRemoveBadge: function(el) {
			
		},
		adminRemoveChallenger: function(nick){
			app.send('/adventbuilder commit rmchal '+nick);
		},
		adminAddGym: function(){
			app.send('/adventbuilder commit addgym '+ this.$("input[name=addgym]").val())
		},
		adminRemoveGym: function(nick){
			app.send('/adventbuilder commit rmgym '+nick);
		},
		adminAddElite: function() {
			app.send('/adventbuilder commit addelite '+ this.$("input[name=addelite]").val())
		},
		adminRemoveElite: function(nick) {
			app.send('/adventbuilder commit rmelite '+nick);
		},
		adminPromoteChamp: function(nick) {
			app.send('/adventbuilder commit promotechamp '+nick);
		},
		adminDemoteChamp: function(nick) {
			app.send('/adventbuilder commit demotechamp '+nick);
		},
		
		openHelpPopup: function(topic) {
			app.addPopup(ExplainationPopup, {
				sourceEl: null,
				title: topic,
				info: this.helpText[topic],
			});
		},
		
		helpText: {
			"elite": [
				"These are your elite four (or champion) battle settings. Remember to save any changes you make here.",
				"When challengers want to challenge you, <strong>do not send the challenge to them</strong>. They must send the challenge to you (which they can do easily from the View League Challenge screen in the TPPLeague tab once they earn 8 badges). Make sure the format is 'TPPLeague (Elite Four)' (or 'TPPLeague (Champion)' if you are the champion), or your settings here won't be applied to the battle, and the battle may error before you even begin.",
				"If you are offline, challengers can still send you challenges. They will be recorded and reported to you when you next log in to the server. Challengers will stay in this 'pending' list until you battle them (or Tustin2121 manually removes them). You can view your current pending list with the command <code>/pendingchallenges</code>.",
				"The server does not currently track wins and losses for E4/Champion challenges.",
				"When a Champion fight starts, the server will automatically ping the IRC channel and send notifications to everyone on the server currently afk.",
			],
			"gym": [
				"These are your gym settings. Remember to save any changes you make here.",
				"When challengers want to challenge your gym, <strong>do not send the challenge to them</strong>. They must send the challenge to you (which they can do easily from the View League Challenge screen in the TPPLeague tab). Make sure the format is 'TPPLeague (Gym)', or your settings here won't be applied to the battle, and the battle may error before you even begin.",
				"If you are offline, challengers can still send you challenges. They will be recorded and reported to you when you next log in to the server. Challengers will stay in this 'pending' list until you battle them (or Tustin2121 manually removes them). You can view your current pending list with the command <code>/pendingchallenges</code>.",
				"You must give challengers badges yourself, using the command <code>/givebadge [name]</code>. Think of it like handing the challenger your badge, and how Clair was a dick for not giving you a badge after you defeat her."
			],
			"banlist": [
				"If you wish, your gym or elite battle setup may ban (or unban) Moves, Pokemon, Items, or Abilities. The text field takes a comma-separated list of items, where items with a '!' in front of it will unban the item.",
				"For example: \"Earthquake, !Swagger\" will ban the move Earthquake, and unban the move Swagger.",
				"This list will be checked against by the server-side verifier, when the challenger challenges you, before you receive the challenge.",
				"Note: The TPPLeague format already has the following clauses:",
				"Swagger Clause, Mega Rayquaza Clause, Sleep Clause Mod, OHKO Clause, Moody Clause, Evasion Moves Clause, Endless Battle Clause, HP Percentage Mod"
			],
			"badges": [
				'The badge your gym gives out is named here.',
				'This name corresponds to a graphic on the server of the same name. (A badge named "Heat" will correspond to the graphic "Heat.png" at the server.) If you change your badge name, the graphic will change as well. The server has a graphic for every badge in the mainline games, if you wish to use one of those.',
				"Badge graphics are 160x160 pixels square. They should be \"badge-like\" in design (eg, no cut-off edges, no faces of people, most likely a symbol of some kind). You will need to give your badge graphic to Tustin2121, for him to manually put on the server.",
				"When you wish to give a badge to a challenger, use the command <code>/givebadge [username]</code>. The recipient must be logged into the server with their proper name to recieve the badge. They will be shown an animation upon recieving the badge. You cannot give someone a badge more than once.",
				"Badges cannot be handed out when the server is in lockdown. (In fact, this whole TPPLeague tab is unabled to be used when the server is in lockdown.)",
			],
		},
	});
	
})(window, jQuery);
