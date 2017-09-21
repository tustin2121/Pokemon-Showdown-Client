(function(){
	const bgsPath = "sprites/bgs/";
	const exp = {
		1: [ 'bg-gen1.png' ],
		2: [ 'bg-gen2.png' ],
		3: [
			'bg-gen3.png',
			'bg-gen3-cave.png',
			'bg-gen3-ocean.png',
			'bg-gen3-sand.png',
			'bg-gen3-forest.png',
			'bg-gen3-arena.png'
		],
		4: [
			'bg-gen4.png',
			'bg-gen4-cave.png',
			'bg-gen4-snow.png',
			'bg-gen4-indoors.png',
			'bg-gen4-water.png'
		],
		5: [
			'bg-beach.png',
			'bg-beachshore.png',
			'bg-desert.png',
			'bg-meadow.png',
			'bg-thunderplains.png',
			'bg-city.png',
			'bg-earthycave.png',
			'bg-mountain.png',
			'bg-volcanocave.png',
			'bg-dampcave.png',
			'bg-forest.png',
			'bg-river.png',
			'bg-deepsea.png',
			'bg-icecave.png',
			'bg-route.png'
		],
		6: [
			 "bg-beach.jpg",
			 "bg-beach2-night.jpg",
			 "bg-beach2.jpg",
			 "bg-bridge.png",
			 "bg-cave.png",
			 "bg-cave3.png",
			"~bg-ceremony.png",
			"~bg-champion.png",
			"~bg-championxy.png",
			 "bg-city-night.png",
			 "bg-city.jpg",
			 "bg-city2-night.jpg",
			 "bg-city3.png",
			 "bg-cycling.png",
			 "bg-dampcave.jpg",
			 "bg-darkmeadow.jpg",
			"~bg-deepsea.jpg",
			 "bg-desert.jpg",
			"~bg-e4-drake.jpg",
			"~bg-e4-drasna.png",
			"~bg-e4-glacia.png",
			"~bg-e4-malva.png",
			"~bg-e4-phoebe.png",
			"~bg-e4-siebold.png",
			"~bg-e4-sydney.png",
			 "bg-earthycave.jpg",
			"~bg-fairymist.png",
			"~bg-flowerfield.png",
			 "bg-forest.jpg",
			 "bg-grass-autumn.png",
			 "bg-grass-evening.png",
			 "bg-grass-night.png",
			 "bg-grass.png",
			"~bg-grassyterrain.png",
			 "bg-gravetower.png",
			 "bg-icecave.jpg",
			 "bg-indoors.png",
			 "bg-indoors2.png",
			"~bg-leader-brawly.png",
			"~bg-leader-flannery.png",
			"~bg-leader-grant.png",
			"~bg-leader-korrina.png",
			"~bg-leader-norman.png",
			"~bg-leader-olympia.png",
			"~bg-leader-viola.png",
			"~bg-leader-wallace.jpg",
			"~bg-leader-wattson.png",
			"~bg-leader-winona.png",
			 "bg-library.jpg",
			 "bg-maison.png",
			 "bg-meadow-night.jpg",
			 "bg-meadow.jpg",
			 "bg-rocky-evening.png",
			 "bg-rocky.jpg",
			 "bg-rocky2.png",
			 "bg-sea.jpg",
			 "bg-sea2.png",
			 "bg-skybattle.png",
			"~bg-skypillar.jpg",
			 "bg-snow.jpg",
			 "bg-sooty-evening.png",
			 "bg-sooty.png",
			"~bg-sterile.png",
			"~bg-sun.png",
			 "bg-volcano.png",
			 "bg-wifi.jpg",
			"~bg-xerneasglenn.png",
			"~bg.png",
		],
		
		convertToId : function(path) {
			var s = path.lastIndexOf('/')+1;
			var e = path.lastIndexOf('.');
			if (s === -1) s = 0;
			if (e === -1) e = path.length;
			return path.substr(s, e);
		},
		convertToPath : function(gen, id) {
			if (!gen || !id) return bgsPath + "gen6/bg.png";
			var list = exp[gen];
			for (var i = 0; i < list.length; i++) {
				var idx = list[i].indexOf(id);
				if (idx == 0 || idx == 1) return bgsPath + "gen"+ gen + "/" + list[i].substr(idx);
			}
			return bgsPath + "gen6/bg.png";
		},
		
		getRandomBG : function(gen) {
			if (!gen) return bgsPath + "gen6/bg.png";
			var list = exp[gen];
			while (true) {
				var url = list[Math.floor(Math.random()*list.length)];
				if (url.charAt(0) === '~') continue;
				return bgsPath + "gen"+ gen + "/" + url;
			}
		},
		getSelectionList : function(gen) {
			if (!gen) return [];
			var list = exp[gen].slice();
			for (var i = 0; i < list.length; i++) {
				if (list[i].charAt(0) == '~') list[i] = list[i].substr(1);
				list[i] = exp.convertToId(list[i]);
			}
			return list;
		},
	};
	
	exp["7"] = exp["6"]; //use gen 6 bgs for gen 7 for now
	
	if (typeof module !== "undefined" && module.exports) {
		module.exports = exp;
	} else {
		this.BattleBackdrops = exp;
	}
})();