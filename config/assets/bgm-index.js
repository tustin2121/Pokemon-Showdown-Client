(function(musicMeta){
	const bgmPath = "audio/bgm/";
	
	const randomBattleMusic = [];
	const randomVictoryMusic = [];
	const categories = {
		trainer: [],
		gym: [],
		e4: [],
		champ: [],
	};
	
	// Parse data and set it up for use
	for (var key in musicMeta) {
		var value = musicMeta[key];
		value.url = value.url || bgmPath+key+".mp3";
		if (value.tags.hidden) continue;
		if (value.tags.random) {
			if (value.tags.victory) randomVictoryMusic.push(key);
			else randomBattleMusic.push(key);
		}
		for (var cat in categories) {
			if (value.tags[cat]) categories[cat].push(key);
		}
	}
	
	const exp = {
		meta: musicMeta,
		cats: categories,
		
		availableBattleMusic : function() {
			return Object.keys(musicMeta).filter(_filter).sort(_sort);
			
			function _sort(a, b) {
				var ax = a.slice(a.indexOf('/'));
				var bx = b.slice(b.indexOf('/'));
				if (ax < bx) return -1;
				if (ax > bx) return 1;
				if (a < b) return -1;
				if (a > b) return 1;
				return 0;
			}
			function _filter(a) {
				if (!a || !musicMeta[a]) return false;
				if (musicMeta[a].tags.hidden) return false;
				if (musicMeta[a].tags.victory) return false;
				if (musicMeta[a].tags.defeat) return false;
				return true;
			}
		},
		randBattle : function() { 
			return randomBattleMusic[Math.floor(Math.random() * randomBattleMusic.length)];
		},
		randVictory : function() {
			return randomVictoryMusic[Math.floor(Math.random() * randomVictoryMusic.length)];
		},
		randInCategory : function(cat) {
			var c = categories[cat];
			if (!c) c = randomBattleMusic;
			return c[Math.floor(Math.random() * c.length)];
		},
		getVictoryMusicFor : function(id) {
			if (!id || !musicMeta[id]) return this.randVictory();
			return _try(musicMeta[id].victoryMusic)
				|| _try(id+"-win")
				|| _try( id.slice(0, id.lastIndexOf('/'))+"/win" )
				|| this.randVictory();
			
			function _try(v) {
				if (!musicMeta[v]) return false;
				if (!musicMeta[v].tags.victory) return false;
				return v;
			}
		},
		isCategory : function(cat) {
			return (cat && categories[cat]);
		},
		isValid : function(id) {
			return (id && musicMeta[id]);
		},
		isValidBattle : function(id) {
			if (!id || !musicMeta[id]) return false;
			if (musicMeta[id].tags.victory) return false;
			if (musicMeta[id].tags.defeat) return false;
			return true;
		},
		isValidVictory : function(id) {
			if (!id || !musicMeta[id]) return false;
			if (musicMeta[id].tags.victory) return true;
			return false;
		},
		isValidDefeat : function(id) {
			if (!id || !musicMeta[id]) return false;
			if (musicMeta[id].tags.defeat) return true;
			return false;
		},
	};
	
	if (typeof module !== "undefined" && module.exports) {
		module.exports = exp;
	} else {
		this.musicTable = exp;
	}
})({
// This is the full list of song ids available for use.
"hgss/johto-trainer":		{ loop:[23.731,125.086], tags:{ random:1, trainer:1, }, 	info:"Pokémon HeartGold/SoulSilver - Battle! Johto Trainer" },
"hgss/kanto-trainer":		{ loop:[13.003, 94.656], tags:{ random:1, trainer:1, }, 	info:"Pokémon HeartGold/SoulSilver - Battle! Kanto Trainer" },
"hgss/rival":				{ loop:[12.842, 68.560], tags:{ random:1, trainer:1, }, 	info:"Pokémon HeartGold/SoulSilver - Battle! Rival" },
"hgss/trainer-win":			{ loop:[ 2.483, 14.488], tags:{ random:1, victory:1, }, 	info:"Pokémon HeartGold/SoulSilver - Victory! Trainer" },
"hgss/johto-gym":			{ loop:[14.248, 73.925], tags:{ random:1, gym:1, }, 		info:"Pokémon HeartGold/SoulSilver - Battle! Gym Leader" },
"hgss/johto-gym-win":		{ loop:[ 3.486, 38.413], tags:{ random:1, victory:1, }, 	info:"Pokémon HeartGold/SoulSilver - Victory! Gym Leader" },
"hgss/kanto-gym":			{ loop:[12.407, 75.026], tags:{ random:1, gym:1, }, 		info:"Pokémon HeartGold/SoulSilver - Battle! Kanto Gym Leader" },
"hgss/champion":			{ loop:[23.719, 68.085], tags:{ random:1, champ:1, }, 		info:"Pokémon HeartGold/SoulSilver - Battle! Champion" },
"hgss/rocket":				{ loop:[20.173, 70.969], tags:{ random:1, }, 				info:"Pokémon HeartGold/SoulSilver - Battle! Rocket" },
"hgss/ho-oh":				{ loop:[32.587,100.125], tags:{  }, 						info:"Pokémon HeartGold/SoulSilver - Battle! Ho-Oh" },
"hgss/entei":				{ loop:[ 4.019, 85.385], tags:{  }, 						info:"Pokémon HeartGold/SoulSilver - Battle! Entei" },
"hgss/beasts":				{ loop:[13.590,105.819], tags:{  },							info:"Pokémon HeartGold/SoulSilver - Beasts" },

"dpp/trainer":				{ loop:[13.440, 96.959], tags:{ random:1, trainer:1, }, 	info:"Pokémon Diamond, Pearl, & Platinum - Battle! Trainer" },
"dpp/trainer-win":			{ loop:[ 1.642, 14.315], tags:{ random:1, victory:1, }, 	info:"Pokémon Diamond, Pearl, & Platinum - Victory! Trainer" },
"dpp/rival":				{ loop:[13.888, 66.352], tags:{ random:1, trainer:1, }, 	info:"Pokémon Diamond, Pearl, & Platinum - Battle! Rival" },
"dpp/gym":					{ loop:[13.799, 92.453], tags:{ random:1, gym:1, }, 		info:"Pokémon Diamond, Pearl, & Platinum - Battle! Gym Leader" },
"dpp/gym-win":				{ loop:[ 6.834, 44.342], tags:{ random:1, victory:1, }, 	info:"Pokémon Diamond, Pearl, & Platinum - Victory! Gym Leader" },
"dpp/e4":					{ loop:[14.249, 92.932], tags:{ random:1, e4:1, }, 			info:"Pokémon Diamond, Pearl, & Platinum - Battle! Elite Four" },
"dpp/e4-win":				{ loop:[ 6.242, 13.630], tags:{ random:1, victory:1, }, 	info:"Pokémon Diamond, Pearl, & Platinum - Victory! Elite Four" },
"dpp/champ":				{ loop:[ 8.477, 85.499], tags:{ random:1, champ:1, }, 		info:"Pokémon Diamond, Pearl, & Platinum - Battle! Champion" },
"dpp/champ-win":			{ loop:[ 8.477, 85.499], tags:{ random:1, victory:1, }, 	info:"Pokémon Diamond, Pearl, & Platinum - Victory! Champion" },
"dpp/fontier":				{ loop:[ 2.870, 91.983], tags:{ random:1, }, 				info:"Pokémon Diamond, Pearl, & Platinum - Battle! Frontier Brain" },
"dpp/fontier-win":			{ loop:[10.248, 15.891], tags:{ random:1, victory:1, }, 	info:"Pokémon Diamond, Pearl, & Platinum - Victory! Frontier Brain" },
"dpp/galactic":				{ loop:[30.674, 93.256], tags:{ random:1, }, 				info:"Pokémon Diamond, Pearl, & Platinum - Battle! Team Galactic" },
"dpp/galactic-win":			{ loop:[ 6.271, 13.658], tags:{ random:1, victory:1, }, 	info:"Pokémon Diamond, Pearl, & Platinum - Victory! Team Galactic" },
"dpp/galactic-commander":	{ loop:[12.426, 70.043], tags:{ random:1, }, 				info:"Pokémon Diamond, Pearl, & Platinum - Battle! Team Galactic Commander" },
"dpp/cyrus":				{ loop:[15.289,130.511], tags:{ random:1, }, 				info:"Pokémon Diamond, Pearl, & Platinum - Battle! Cyrus" },
"dpp/cynthia-piano":		{ loop:[ 4.886, 40.554], tags:{  }, 						info:"Pokémon Diamond, Pearl, & Platinum - Cynthia's Piano " },
"dpp/giratina":				{ loop:[12.767,117.271], tags:{  }, 						info:"Pokémon Diamond, Pearl, & Platinum - Battle! Giratina" },

"bw/subway-trainer":		{ loop:[15.503,110.984], tags:{ random:1, trainer:1, }, 	info:"Pokémon Black/White - Battle! Subway Trainer" },
"bw/trainer":				{ loop:[14.629,110.109], tags:{ random:1, trainer:1, }, 	info:"Pokémon Black/White - Battle! Trainer" },
"bw/trainer-win":			{ loop:[ 3.188, 15.191], tags:{ random:1, victory:1, }, 	info:"Pokémon Black/White - Victory! Trainer" },
"bw/rival": 				{ loop:[19.180, 57.373], tags:{ random:1, trainer:1, }, 	info:"Pokémon Black/White - Battle! Rival" },
"bw/gym":					{ loop:[36.846,110.508], tags:{ random:1, gym:1, }, 		info:"Pokémon Black/White - Battle! Gym Leader" },
"bw/gym-win":				{ loop:[ 9.088, 44.008], tags:{ random:1, victory:1, }, 	info:"Pokémon Black/White - Victory! Gym Leader" },
"bw/e4":					{ loop:[17.797, 91.054], tags:{ random:1, e4:1, },			info:"Pokémon Black/White - Battle! Elite Four" },
"bw/champion":				{ loop:[33.672, 83.340], tags:{ random:1, champ:1, }, 		info:"Pokémon Black/White - Battle! Champion" },
"bw/champion-win":			{ loop:[14.281, 30.285], tags:{ random:1, victory:1, }, 	info:"Pokémon Black/White - Victory! Champion" },
"bw/plasma":				{ loop:[47.469,130.514], tags:{ random:1, }, 				info:"Pokémon Black/White - Battle! Team Plasma" },
"bw/plasma-win":			{ loop:[ 7.351, 32.950], tags:{ random:1, victory:1, }, 	info:"Pokémon Black/White - Victory! Team Plasma" },
"bw/n":						{ loop:[47.216,101.895], tags:{ random:1, }, 				info:"Pokémon Black/White - Battle! N" },
"bw/n-final":				{ loop:[42.400,129.584], tags:{ random:1, }, 				info:"Pokémon Black/White - Battle! N" },
"bw/ghetsis":				{ loop:[92.777,216.592], tags:{ random:1, }, 				info:"Pokémon Black/White - Battle! Ghetsis" },
"bw/cynthia":				{ loop:[22.340, 97.357], tags:{ random:1, champ:1, }, 		info:"Pokémon Black/White - Battle! Cynthia" },
"bw/pkmn-league":			{ loop:[ 1.556, 37.567], tags:{  }, 						info:"Pokémon Black/White - Pokemon League" },

"bw2/kanto-gym":			{ loop:[14.626, 58.986], tags:{ random:1, }, 				info:"Pokémon Black2/White2 - Battle! Kanto Gym Leader", victoryMusic:'hgss-johto-gym-win' },
"bw2/rival":				{ loop:[ 7.152, 68.708], tags:{ random:1, }, 				info:"Pokémon Black2/White2 - Battle! Rival" },
"bw2/gym":					{ loop:[36.846,110.508], tags:{ random:1, gym:1, }, 		info:"Pokémon Black2/White2 - Battle! Gym Leader", victoryMusic:'bw-gym-win' },
"bw2/champion":				{ loop:[11.235,103.757], tags:{ random:1, champ:1, }, 		info:"Pokémon Black2/White2 - Battle! Champion", victoryMusic:'bw-champion-win' },
"bw2/plasma":				{ loop:[18.273,105.565], tags:{ random:1, }, 				info:"Pokémon Black2/White2 - Battle! Team Plasma", victoryMusic:'bw-plasma-win' },
"bw2/n":					{ loop:[23.779, 78.459], tags:{ random:1, }, 				info:"Pokémon Black2/White2 - Battle! N" },
"bw2/colress":				{ loop:[12.869,116.843], tags:{ random:1, }, 				info:"Pokémon Black2/White2 - Battle! Colress" },
"bw2/ghetsis":				{ loop:[29.441, 89.455], tags:{ random:1, }, 				info:"Pokémon Black2/White2 - Battle! Ghetsis" },
"bw2/sinnoh-champion":		{ loop:[22.340, 97.357], tags:{ random:1, champ:1, }, 		info:"Pokémon Black2/White2 - Battle! Sinnoh Champion" },
"bw2/hoenn-gym":			{ loop:[13.594, 77.933], tags:{ random:1, gym:1, },			info:"Pokémon Black2/White2 - Battle! Gym Leader (Hoenn)" },
"bw2/johto-gym":			{ loop:[15.095, 75.732], tags:{ random:1, gym:1, },			info:"Pokémon Black2/White2 - Battle! Gym Leader (Johto)" },
"bw2/homika-dogars":		{ loop:[ 1.661, 68.131], tags:{  }, 						info:"Pokémon Black2/White2 - Homika Dogars" },

"bw2mashup/cynthia":		{ loop:[12.340, 87.357], tags:{ random:1, champ: 1},		info:"Pokémon Black/White/2 Mashup - Battle! Cynthia" },
"bw2mashup/gym":			{ loop:[18.323, 91.980], tags:{ random:1, gym:1, },			info:"Pokémon Black/White/2 Mashup - Battle! Gym" },

"xy/trainer":				{ loop:[11.064, 85.731], tags:{ random:1, trainer:1, }, 	info:"Pokémon X/Y - Battle! Trainer" },
"xy/rival": 				{ loop:[ 7.802, 58.634], tags:{ random:1, trainer:1, }, 	info:"Pokémon X/Y - Battle! Rival" },

"oras/trainer": 			{ loop:[13.579, 91.548], tags:{ random:1, }, 				info:"Pokémon OmegaRuby/AlphaSapphire - Battle! Trainer" },
"oras/trainer-win":			{ loop:[ 2.955, 17.284], tags:{ random:1, victory:1, }, 	info:"Pokémon OmegaRuby/AlphaSapphire - Victory! Trainer" },
"oras/rival":				{ loop:[14.303, 69.149], tags:{ random:1, }, 				info:"Pokémon OmegaRuby/AlphaSapphire - Battle! Rival" },
"oras/remix-rival":			{ loop:[14.370, 71.705], tags:{ random:1, }, 				info:"Pokémon OmegaRuby/AlphaSapphire - Battle! Rival (Remix)" },
"oras/zinnia":				{ loop:[15.438, 95.889], tags:{ random:1, }, 				info:"Pokémon OmegaRuby/AlphaSapphire - Battle! Zinnia" },
"oras/wally":				{ loop:[ 6.057, 42.735], tags:{ random:1, }, 				info:"Pokémon OmegaRuby/AlphaSapphire - Battle! Wally" },
"oras/maxie-archie":		{ loop:[40.006,100.654], tags:{ random:1, }, 				info:"Pokémon OmegaRuby/AlphaSapphire - Battle! Maxie/Archie" },
"oras/gym":					{ loop:[22.660, 86.638], tags:{ random:1, gym:1, }, 		info:"Pokémon OmegaRuby/AlphaSapphire - Battle! Gym Leader" },
"oras/e4":					{ loop:[24.259, 74.849], tags:{ random:1, e4:1, }, 			info:"Pokémon OmegaRuby/AlphaSapphire - Battle! Elite Four" },
"oras/champion":			{ loop:[18.116, 74.197], tags:{ random:1, champ:1, }, 		info:"Pokémon OmegaRuby/AlphaSapphire - Battle! Champion" },
"oras/champion-win":		{ loop:[17.635, 45.199], tags:{ random:1, victory:1, }, 	info:"Pokémon OmegaRuby/AlphaSapphire - Victory! Champion" },
"oras/frontier":			{ loop:[37.780,127.942], tags:{ random:1, }, 				info:"Pokémon OmegaRuby/AlphaSapphire - Battle! Frontier Brain" },
"oras/gym-building":		{ loop:[ 1.248, 35.825], tags:{  }, 						info:"Pokémon OmegaRuby/AlphaSapphire - Gym Theme" },

"sm/gladion":				{ loop:[14.341, 86.008], tags:{ random:1, }, 				info:"Pokémon Sun/Moon - Battle! Gladion" },
"sm/kahuna":				{ loop:[10.638, 55.647], tags:{  }, 						info:"Pokémon Sun/Moon - Battle! Kahuna" },
"sm/captains-trial":		{ loop:[ 9.631, 95.116], tags:{  }, 						info:"Pokémon Sun/Moon - A Captain's Trial has Begun!" },
"sm/totem":					{ loop:[15.861, 89.532], tags:{ random:1, },				info:"Pokémon Sun/Moon - Battle! Totem Pokémon" },
"sm/totem-win":				{ loop:[ 8.885, 21.647], tags:{ random:1, victory:1, },		info:"Pokémon Sun/Moon - Victory! Totem Pokémon" },
"sm/skull-win":				{ loop:[11.802, 24.577], tags:{ random:1, victory:1, },		info:"Pokémon Sun/Moon - Victory! Team Skull" },
"sm/skull":					{ loop:[28.479, 99.736], tags:{ random:1, },				info:"Pokémon Sun/Moon - Battle! Team Skull" },
"sm/skull-admin":			{ loop:[18.173, 86.270], tags:{ random:1, },				info:"Pokémon Sun/Moon - Battle! Team Skull Admin" },

"prism/johto-trainer":		{ loop:[57.900,151.170], tags:{ random:1, trainer:1, }, 	info:"Pokémon Prism - Battle! Johto Trainer" },
"prism/naljo-gym":			{ loop:[45.241,100.526], tags:{ random:1, gym:1, }, 		info:"Pokémon Prism - Battle! Naljo Gym Leader" },
"prism/palette":			{ loop:[21.209, 64.203], tags:{ random:1, }, 				info:"Pokémon Prism - Battle! Palette Patrol" },
"prism/kanto-legend":		{ loop:[60,818,129.390], tags:{  }, 						info:"Pokémon Prism - Battle! Kanto Legend" },

"colo/normal":				{ loop:[ 6.560, 55.844], tags:{ random:1, trainer:1, }, 	info:"Pokémon Colosseum - Normal Battle" },
"colo/tutorial":			{ loop:[10.401, 57.691], tags:{ random:1, }, 				info:"Pokémon Colosseum - First Battle" },
"colo/semifinals":			{ loop:[20.313, 98.946], tags:{ random:1, }, 				info:"Pokémon Colosseum - Semifinals" },
// "colo/cipher-admin":		{ loop:[52.483, 88.720], tags:{ random:1, }, 				info:"Pokémon Colosseum - Cipher Admin Battle" },
"colo/mirorb":				{ loop:[ 4.261, 50.800], tags:{ random:1, }, 				info:"Pokémon Colosseum - Miror B" },

"xd/normal":				{ loop:[ 1.600, 34.361], tags:{ random:1, trainer:1, }, 	info:"Pokémon XD - Normal Battle" },
"xd/cipher-peon":			{ loop:[ 2.751, 42.223], tags:{ random:1, }, 				info:"Pokémon XD - Cipher Peon" },

"reorch/kanto-trainer":		{ loop:[40.562,133.518], tags:{ random:1, trainer:1, }, 	info:"Pokémon Reorchestrated: Kanto Symphony - Battle! VS Trainer" },
"reorch/kanto-trainer-win":	{ loop:[     0,      0], tags:{ random:1, victory:1, }, 	info:"Pokémon Reorchestrated: Kanto Symphony - Battle! VS Trainer" },
"reorch/kanto-gym":			{ loop:[57.229,116.772], tags:{ random:1, gym:1, }, 		info:"Pokémon Reorchestrated: Kanto Symphony - Battle! VS Gym Leader (& Elite Four)" },
"reorch/kanto-gym-win":		{ loop:[     0,      0], tags:{ random:1,victory:1, }, 		info:"Pokémon Reorchestrated: Kanto Symphony - Battle! VS Gym Leader (& Elite Four)" },
"reorch/hoenn-gym":			{ loop:[14.200, 73.597], tags:{ random:1, gym:1, }, 		info:"Pokémon Reorchestrated: Hoenn Summer - Battle! Gym Leader" },
"reorch/hoenn-e4":			{ loop:[13.709, 67.717], tags:{ random:1, e4:1, }, 			info:"Pokémon Reorchestrated: Hoenn Summer - Battle! Elite Four" },
"reorch/hoenn-team":		{ loop:[ 8.332,114.774], tags:{ random:1, }, 				info:"Pokémon Reorchestrated: Double Team! - Aqua and Magma" },

"mmbn/1/boss":				{ loop:[ 9.099, 47.472], tags:{ random:1, },				info:"Mega Man Battle Network - Boss" },
"mmbn/1/finalboss":			{ loop:[ 4.315, 47.960], tags:{ random:1, },				info:"Mega Man Battle Network - Final Boss" },
"hidden/rickroll":			{ loop:[36.305,154.569], tags:{ hidden:1, },				info:"Rick Astley - Never Gonna Give You Up" },

"rs/attack-ii":				{ loop:[55.706,142.093], tags:{ random:1, }, 				info:"RuneScape 3 - Attack II" },

"pokken/haunted-house":		{ loop:[33.604,118.398], tags:{  }, 						info:"Pokken Tournament - Haunted House" },
"pokken/diggersby-land":	{ loop:[ 6.800,125.954], tags:{  },							info:"Pokkén Tournament - Diggersby Land" },
"pokken/main-theme":		{ loop:[14.632,108.630], tags:{  },							info:"Pokkén Tournament - Main Theme" },
"pokken/old-ferrum-town":	{ loop:[ 9.891,123.898], tags:{  },							info:"Pokkén Tournament - Old Ferrum Town" },

"ff/7/chocobo":				{ loop:[10.436,116.462], tags:{ random:1, },				info:"Final Fantasy 7 - Electric de Chocobo" },
"ff/7/win":					{ loop:[ 5.169, 23.559], tags:{ victory:1, },				info:"Final Fantasy 7 - Victory Fanfare" },

"persona/5/desert-river":	{ loop:[59.548,310.613], tags:{ random:1, },				info:"Persona 5 - Rivers in the Desert" },
"persona/5/desert-river-i":	{ loop:[16.290,149.197], tags:{ random:1, },				info:"Persona 5 - Rivers in the Desert (Instrumental)" },
"persona/5/last-surprise":	{ loop:[17.827,222.655], tags:{ random:1, },				info:"Persona 5 - Last Surprise" },
"persona/5/win":			{ loop:[34.714, 51.720], tags:{ random:1, victory:1, },		info:"Persona 5 - Victory" },

});