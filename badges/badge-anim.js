// badge-anim.js

function showBadgeAnim(badgeName) {
	var md = 450; //music delay
	
	var overlay = $("<div>").addClass("ps-overlay").css({ overflow: "hidden" });
	var bg = $("<div>").css({
		position: "absolute",
	    top: 0, left: 0, right: 0, bottom: 0,
	    background: "linear-gradient(-7deg, rgba(0,51,255,0) 0%,rgba(0,51,255,0.94) 47%,rgba(255,255,48,1) 50%,rgba(0,51,255,0.94) 53%,rgba(0,51,255,0) 100%)",
	    "background-size": "300%",
	    "background-position": "50%",
	    opacity: 0,
	}).appendTo(overlay);
	var center = $("<div>").css({
		position: "absolute",
		top: "50%", left: "50%",
	}).appendTo(overlay);
	
	var badge = $("<img src='/badges/"+badgeName+".png'>").css({
		position: "absolute",
		top: -80 * 3, left: -80 * 3,
		width: 160 * 3, height: 160 * 3,
		"z-index": 10,
		opacity: 0,
	}).appendTo(center).one("error", function(){
		$(this).prop("src", "/badges/_Error_.png");
	});
	var text1 = $("<h1>").css({
		position: "absolute",
		bottom: 64, left: -400,
		width: 800,
		"text-align": "center",
		"font-size": "5.5em",
		"text-shadow": "3px 3px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000, 0px 0px 20px rgba(0,51,255,1)",
		"z-index": 10,
		"white-space": "nowrap",
		opacity: 0,
	}).html("Got the").appendTo(center);
	var text2 = $("<h1>").css({
		position: "absolute",
		top: 64, left: -400,
		width: 800,
		"text-align": "center",
		"font-size": "5.5em",
		"text-shadow": "3px 3px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000, 0px 0px 20px rgba(0,51,255,1)",
		"z-index": 10,
		"white-space": "nowrap",
		opacity: 0,
	}).html(badgeName+" Badge!").appendTo(center);
	
	if ($("body").innerWidth() < 600) {
		text2.html(badgeName+"<br/>Badge!");
	}
	
	var clickclose = $("<p>").html("Click anywhere to close.").css({
		position: "fixed",
		bottom: 10, left: 10,
		display: "none",
		color: "black",
		"text-shadow": "0 0 6px #fff, 0 0 6px #fff, 0 0 6px #fff",
		"font-weight": "bold",
		"z-index": 20,
	}).appendTo(overlay);
	
	var music = soundManager.createSound({
		id: "badge-get",
		url: Tools.resourcePrefix + "badges/badge-get.mp3",
		volume: BattleSound.bgmVolume,
	});
	
	$(".badgeget:last").hide()
	
	var done = false;
	overlay.appendTo("body");
	overlay.animate({ opacity: 1 }, 400);
	
	if (music.id) { //Check if supported
		music.load().then(_beginAnim);
	} else {
		_beginAnim();
	}
	return;
	
	function _beginAnim() {
		$(".badgeget:last").hide()
		music.play(md*0.001);
		bg.animate({ opacity: 1, "background-size": "100%"}, 400);
		badge.delay(md+200-400).animate({
			opacity: 1,
			top: -80, left: -80,
			width: 160, height: 160,
		}, 400);
		text1.delay(md+1500-300).animate({
			opacity: 1,
			"font-size": "3.5em",
		}, 300);
		text2.delay(md+1880-300).animate({
			opacity: 1,
			"font-size": "3.5em",
		}, 300);
		
		var fx = [
			"/fx/electroball.png",
			"/fx/mistball.png",
			"/fx/iceball.png",
		];
		for (var i = 0; i < 20; i++) {
			makeSparkle(fx[i%fx.length], i)
		}
		
		clickclose.delay(4500).fadeIn(600, function(){
			overlay.on("click", closeOverlay);
		});
	}
	
	function makeSparkle(src, i) {
		var sparkle = $("<img src='"+src+"'>").css({
			position: "absolute",
			width: 20, height: 20,
			top: -10, left: -10,
			opacity: 0,
		}).appendTo(center);
		sparkle.delay(md+3250+(i*100)).queue(function(){ doSparkle($(this)); });
	}
	
	function doSparkle(sparkle) {
		if (!done) {
			var r = Math.random() * 2 * Math.PI;
			var x = Math.sin(r);
			var y = Math.cos(r);
			sparkle
				.animate({ 
					opacity: 1,
					top: -10, left: -10,
					width: 20, height: 20,
				}, 1)
				.animate({
					top: -10 - (x * 300),
					left: -10 - (y * 300),
					width: 60, height: 60,
					opacity: 0,
				}, 1000)
				.queue(function(){ doSparkle($(this)); });
		}
		sparkle.dequeue();
	}
	
	function closeOverlay() {
		done = true;
		$(".badgeget").slideDown(1000);
		overlay.fadeOut(1000, function(){
			overlay.remove();
		});
	}
}