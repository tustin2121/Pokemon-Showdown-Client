<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
		<title>TPP League</title>
		<link rel="shortcut icon" href="lotid.png" />
		<link rel="stylesheet" href="style/client.css" />
		<link rel="stylesheet" href="style/sim-types.css" />
		<link rel="stylesheet" href="style/battle.css" />
		<link rel="stylesheet" href="style/utilichart.css" />
		<link rel="stylesheet" href="style/font-awesome.css" />
		<meta id="viewport" name="viewport" content="width=640" />
		<meta name="robots" content="noindex" />
		<meta http-equiv="X-UA-Compatible" content="IE=Edge" />
		<script>
			var Config = {testclient: true};
			(function() {
				if (location.search !== '') {
					var m = /\?~~(([^:\/]*)(:[0-9]*)?)/.exec(location.search);
					if (m) {
						Config.server = {
							id: m[1],
							host: m[2],
							port: (m[3] && parseInt(m[3].substr(1))) || 8000
						};
					} else {
						alert('Unrecognised query string syntax: ' + location.search);
					}
				}
			})();
		</script>
		<!--[if lte IE 8]><script>
			Config.oldie = true;
		</script><![endif]-->
	</head>
	<body>
		<div id="header" class="header">
			<img class="logo" src="tppleague.png" alt="TPP League" width="184" height="40" /><div class="maintabbarbottom"></div>
		</div>
		<div class="ps-room scrollable" id="mainmenu"><div class="mainmenuwrapper">
			<div class="leftmenu">
				<div class="activitymenu">
					<div class="pmbox">
						<?php include 'news-embed.php'; ?>
					</div>
				</div>
				<div class="mainmenu">
					<div id="loading-message" class="mainmessage">Initialising... <noscript>FAILED<br /><br />Pok&eacute;mon Showdown requires JavaScript.</noscript></div>
				</div>
			</div>
			<div class="rightmenu">
			</div>
			<div class="mainmenufooter">
				<small>
					<a href="https://www.reddit.com/r/TPPLeague" target="_blank"><strong>TPPLeague</strong></a><br/>
					<a href="//pokemonshowdown.com/dex/" target="_blank">Pokédex</a> | <a href="https://tppleague.me/replay/" target="_blank">Replays</a> | <small><a href="https://www.reddit.com/r/TPPLeague" target="_blank">Subreddit</a></small>
			</div>
		</div></div>
		<script>
			document.getElementById('loading-message').innerHTML += ' DONE<br />Loading libraries...';
		</script>
		<script src="js/lib/jquery-2.1.4.min.js"></script>
		<script src="js/lib/jquery-cookie.js"></script>
		<script src="js/lib/autoresize.jquery.min.js"></script>
		<script src="js/lib/jquery.json-2.3.min.js"></script>
		<script src="js/webAudioManager.js"></script>
		<script src="audio/bgm-index.js"></script>
		<script>
			soundManager.setup({url: 'swf/'});
		</script>
		<script src="js/lib/html-css-sanitizer-minified.js"></script>
		<script src="js/lib/lodash.core.js"></script>
		<script src="js/lib/backbone.js"></script>
		<script src="js/lib/d3.v3.min.js"></script>

		<script>
			document.getElementById('loading-message').innerHTML += ' DONE<br />Loading data...';
		</script>

		<script src="config/config.js"></script>
		<script src="js/battledata.js"></script>
		<script src="data/pokedex-mini.js"></script>
		<script src="data/typechart.js"></script>
		<script src="js/battle.js"></script>
		<script src="js/lib/sockjs-0.3.4.min.js"></script>
		<script src="js/lib/color-thief.min.js"></script>

		<script>
			document.getElementById('loading-message').innerHTML += ' DONE<br />Loading client...';
		</script>

		<script src="js/client.js"></script>
		<script src="js/client-topbar.js"></script>
		<script src="js/client-mainmenu.js"></script>
		<script src="js/client-teambuilder.js"></script>
		<script src="js/client-adventbuilder.js"></script>
		<script src="js/client-ladder.js"></script>
		<script src="js/client-chat.js"></script>
		<script src="js/client-chat-tournament.js"></script>
		<script src="js/client-battle-tooltips.js"></script>
		<script src="js/client-battle.js"></script>
		<script src="js/client-rooms.js"></script>
		<script src="js/storage.js"></script>
		<script src="data/graphics.js"></script>
		<script src="sprites/bgs/bg-index.js"></script>
		<script src="emotes/emoteregex.js"></script>
		<script src="badges/badge-anim.js"></script>

		<script>
			var app = new App();
		</script>

		<script src="data/pokedex.js"></script>
		<script src="data/moves.js"></script>
		<script src="data/items.js"></script>
		<script src="data/abilities.js"></script>
		<script src="data/statuses.js"></script>
		<script src="data/tpp.js"></script>

		<script src="data/search-index.js"></script>
		<script src="data/teambuilder-tables.js"></script>
		<script src="js/search.js"></script>

		<script src="data/aliases.js" async="async"></script>

	</body>
</html>
