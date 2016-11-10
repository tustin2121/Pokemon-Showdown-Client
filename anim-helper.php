<!DOCTYPE html>
<html>
	<head>
		<title></title>
		<meta charset=utf-8>
		<link rel=stylesheet href="/style/replay.css">
		<link rel="stylesheet" href="/style/font-awesome.css?" />
		<link rel="stylesheet" href="/style/battle.css?a6" />
		<link rel="stylesheet" href="/style/replay.css?a6" />
		<style type="text/css">
			.battle-log > div {
				margin: 2px 6px;
			}
			.battle-log h2 { margin: .5em 0; }
			.battle-log h4 {
				margin: 0px 20px;
				border-bottom: 1px solid #AAAAAA;
			}
			.playBtn { 
				float: right;
				margin-right: 8px;
			}
			.customAnim {
				width: 550px;
				float: right;
			}
			.customAnim textarea {
				width: 100%;
				height: 200px;
			}
			.playCustomAnim {
				float: right;
				margin: 18px;
			}
			.premade {
				margin-bottom: 10px !important;
			}
			input[type="number"] { width: 50px; }
			.combineAnims p { font-size: smaller; }
		</style>
	</head>
	<body>
		<div class="wrapper replay-wrapper" style="max-width:1180px;margin:0 auto">
			<div class="battle"></div>
			<div class="battle-log">
				<h2>Animation Controls</h2>
				<div class="aim source">
					<span>Source:</span>
					<label><input type="radio" name="source" value="p1" checked>Myself</input></label>
					<label><input type="radio" name="source" value="p2">Opponent</input></label>
				</div>
				<div class="aim target">
					<span>Target:</span>
					<label><input type="radio" name="target" value="p1">Myself</input></label>
					<label><input type="radio" name="target" value="p2" checked>Opponent</input></label>
				</div>
				<div class="aim options">
					<span>Flags:</span>
					<label><input type="checkbox" name="missed">Miss</input></label>
					<!--<label><input type="checkbox" name="spread">Spread</input></label>-->
				</div>
				<h2>Premade Animations</h2>
				<div class="premade moveAnims">
					<button class="playBtn">Play</button>
					<span>Move Animations:</span>
					<select class="animList"></select>
					<div class="usedIn">Used in:</div>
				</div>
				<div class="premade prepareAnim">
					<button class="playBtn">Play</button>
					<span>Prepare Animations:</span>
					<select class="animList"></select>
				</div>
				<div class="premade statusAnims">
					<button class="playBtn">Play</button>
					<span>Status Animations:</span>
					<select class="animList"></select>
				</div>
				<div class="premade otherAnims">
					<button class="playBtn">Play</button>
					<span>Other Animations:</span>
					<select class="animList"></select>
				</div>
				<h2>Combine Animations</h2>
				<div class="combineAnims">
					<p>
						Type into the text box below a list of animations to play all at once, 
						separated by commas, semicolons, or vertical bars.
						Use the format "animName" or "{move} animName" for move animations, 
						"{prepare} animName" for prepare animations, "{status} animName" for status animations,
						and "{other} animName" for other animations. To change target/source for one animation,
						append a ":ts" to the type, where t = target, and s = source, and position matters.
					</p>
					<p>
						Example: "shadowball, {move:ts}flamethrower, {other:tt}anger, {prepare}ganonssword"
					</p>
					<button class="playBtn">Play</button>
					<input name="combineList" type="text" style="width:86%"></input>
				</div>
				<h2>Battle Effects Preview
					<label style="float:right;"><input type="checkbox" name="showpreview">Show</input></label>
				</h2>
				<div class="preview effect">
					<button class="playBtn">Copy</button>
					<span>Effect:</span>
					<select class="effectList"></select>
				</div>
				<!--<h4>Start</h4>-->
				<div class="preview position">
					<span>Location:</span>
					<label>X: <input type="number" name="posx" value="0"/></label>
					<label>Y: <input type="number" name="posy" value="0"/></label>
					<label>Z: <input type="number" name="posz" value="0"/></label>
					<label><input type="checkbox" name="posrel">Target relative</input></label>
				</div>
				<div class="preview scale">
					<span>Scale:</span>
					<label>X: <input type="number" name="scalex" value="1" min="0" step="0.1"/></label>
					<label>Y: <input type="number" name="scaley" value="1" min="0" step="0.1"/></label>
					<label><input type="checkbox" name="scaleuniform" checked>Uniform</input></label>
				</div>
				<div class="preview opacity">
					<span>Opacity:</span>
					<label><input type="number" name="opacity" value="1" min="0" max="1" step="0.1"/></label>
				</div>
			</div>
			<div class="replay-controls"></div>
			<div class="replay-controls-2"></div>
			<!--<h1 style="font-weight:normal;text-align:center"><strong>Animation Helper</strong></h1>-->
			<div class="customAnim">
<button class="playCustomAnim">Play animation</button>
<h2>Custom Animation</h2>
<pre>
anim: function (battle, args) {
	var attacker = args[0];
	var defender = args[1];
</pre>
<textarea name="customAnimBody"></textarea>
<pre>}</pre>
			</div>
			<div class="extra"></div>
		</div>
		
		<script src="/js/lib/jquery-1.11.0.min.js"></script>
		<script src="/js/lib/lodash.compat.js"></script>
		<script src="/js/lib/html-sanitizer-minified.js"></script>
		<script src="/js/config.js?a6"></script>
		<script src="/js/battledata.js?a6"></script>
		<script src="/data/pokedex-mini.js?a6"></script>
		<script src="/data/pokedex-mini-bw.js?a6"></script>
		<script src="/data/graphics.js?a6"></script>
		<script src="/sprites/bgs/bg-index.js"></script>
		<script src="/js/battle.js?a6"></script>
		
<script>
/* global $, Battle, BattleMoveAnims, BattleStatusAnims, BattleOtherAnims, BattleEffects */
var musicTable = {
	randBattle: ()=> null,
	randVictory: ()=> null,
};
var soundManager = {
	createSound: ()=> null,
};
var AnimHelper = {
	init: function () {
		this.$el = $('.wrapper');

		var self = this;
		this.$el.on('click', '.chooser button', function (e) {
			self.clickChangeSetting(e);
		});
		this.$el.on('click', 'button', function (e) {
			var action = $(e.currentTarget).data('action');
			if (action) self[action]();
		});

		this.battle = new Battle(this.$('.battle'), $(".extra"));// this.$('.battle-log'));
		// this.battle.errorCallback = this.errorCallback.bind(this);
		// this.battle.resumeButton = this.resume.bind(this);
		// this.battle.setQueue(log.split('\n'));
		this.battle.setQueue([
			// '|player|p1|tustin2122|1',
			// '|player|p2|tustin2121|tustin2121.png',
			'|gametype|single',
			// '|gametype|double',
			'|gen|6',
			'|tier|Animation Helper',
			'|seed|',
			'|clearpoke',
			'|choice||',
			'|',
			'|start',
			'|switch|p1a: Source|Nidorino, M|100/100',
			'|switch|p2a: Target|Gengar, M|100/100',
			// '|switch|p1b: Ally|Charmander, M|100/100',
			// '|switch|p2b: Other Foe|Pikachu, M|100/100',
			'|turn|1',
			'|choice||',
			'|',
		]);
		this.battle.p1.name = "I";
		this.battle.p2.name = "The opponent";
		this.battle.reset();
		this.battle.fastForwardTo(1);
		// this.$('.battle').append('<div class="playbutton"><button data-action="start"><i class="fa fa-play"></i> Play</button><br /><br /><button data-action="startMuted" class="startsoundchooser" style="font-size:10pt">Play (music off)</button></div>');
		// this.$('.replay-controls-2').html('<div class="chooser leftchooser speedchooser"> <em>Speed:</em> <div><button class="sel" value="fast">Fast</button><button value="normal">Normal</button><button value="slow">Slow</button><button value="reallyslow">Really Slow</button></div> </div> <div class="chooser colorchooser"> <em>Color&nbsp;scheme:</em> <div><button class="sel" value="light">Light</button><button value="dark">Dark</button></div> </div> <div class="chooser soundchooser" style="display:none"> <em>Music:</em> <div><button class="sel" value="on">On</button><button value="off">Off</button></div> </div>');
		
		//////////////////////////////////////////////////////////////////////////
		// Premade Animations
		
		let anims = {};
		let prepAnims = [];
		moveAnimsLoop:
		for(let id in BattleMoveAnims) {
			if (BattleMoveAnims[id].prepareAnim) prepAnims.push(id);
			for (let name in anims) {
				if (BattleMoveAnims[name].anim === BattleMoveAnims[id].anim) {
					anims[name].moves.push(id);
					continue moveAnimsLoop;
				}
			}
			anims[id] = { moves:[id] };
		}
		Object.keys(anims).forEach((id)=>{
			$(".moveAnims .animList").append(`<option value="${id}">${id}</option>`);
		});
		prepAnims.forEach((id)=>{
			$(".prepareAnim .animList").append(`<option value="${id}">${id}</option>`);
		});
		Object.keys(BattleStatusAnims).forEach((id)=>{
			$(".statusAnims .animList").append(`<option value="${id}">${id}</option>`);
		});
		Object.keys(BattleOtherAnims).forEach((id)=>{
			$(".otherAnims .animList").append(`<option value="${id}">${id}</option>`);
		});
		
		$(".moveAnims .animList").on('change', (e)=>{
			$(".moveAnims .usedIn").html("Used in: "+anims[e.target.value].moves.join(", "));
		}).change();
		
		
		$(".moveAnims .playBtn").on("click", (e)=>{
			let source = this.battle[$("input[name=source]:checked").val()].active[0];
			let target = this.battle[$("input[name=target]:checked").val()].active[0];
			let extras = "";
			if ($("input[name=missed]").prop("checked")) extras += "|[miss]";
			// if ($("input[name=spread]").prop("checked")) extras += "|[spread] "+target.side.active[1].ident;
			
			this.battle.add(`|-anim|${source.ident}|${$(".moveAnims .animList").val()}|${target.ident}${extras}`);
			this.battle.play();
		});
		$(".prepareAnim .playBtn").on("click", (e)=>{
			let source = this.battle[$("input[name=source]:checked").val()].active[0];
			let target = this.battle[$("input[name=target]:checked").val()].active[0];
			let extras = "";
			// if ($("input[name=missed]").prop("checked")) extras += "|[miss]";
			// if ($("input[name=spread]").prop("checked")) extras += "|[spread] "+target.side.active[1].ident;
			
			this.battle.add(`|-prepare|${source.ident}|${$(".prepareAnim .animList").val()}|${target.ident}${extras}`);
			this.battle.play();
			setTimeout(()=>{
				this.battle.add("|");
				source.sprite.animReset();
				target.sprite.animReset();
				this.battle.play();
			}, 2000);
		});
		$(".statusAnims .playBtn").on("click", (e)=>{
			let source = this.battle[$("input[name=source]:checked").val()].active[0];
			let target = this.battle[$("input[name=target]:checked").val()].active[0];
			if ($("input[name=missed]").prop("checked")) {
				target = target.side.missedPokemon;
			}
			
			let id = $(".statusAnims .animList").val();
			source.sprite.beforeMove();
			target.sprite.beforeMove();
			BattleStatusAnims[id].anim(this.battle, [source.sprite, target.sprite]);
			source.sprite.afterMove();
			target.sprite.afterMove();
			this.battle.activityAnimations.promise().done(()=>this.battle.fxElem.empty());
		});
		$(".otherAnims .playBtn").on("click", (e)=>{
			let source = this.battle[$("input[name=source]:checked").val()].active[0];
			let target = this.battle[$("input[name=target]:checked").val()].active[0];
			if ($("input[name=missed]").prop("checked")) {
				target = target.side.missedPokemon;
			}
			
			let id = $(".otherAnims .animList").val();
			source.sprite.beforeMove();
			target.sprite.beforeMove();
			BattleOtherAnims[id].anim(this.battle, [source.sprite, target.sprite]);
			source.sprite.afterMove();
			target.sprite.afterMove();
			this.battle.activityAnimations.promise().done(()=>this.battle.fxElem.empty());
		});
		$(".combineAnims .playBtn").on("click", (e)=>{
			let source = this.battle[$("input[name=source]:checked").val()].active[0];
			let target = this.battle[$("input[name=target]:checked").val()].active[0];
			if ($("input[name=missed]").prop("checked")) {
				target = target.side.missedPokemon;
			}
			let extras = "";
			
			let list = $("input[name=combineList]").val().split(/[,;|]/).join("|");
			this.battle.add(`|-animcustom|${source.ident}|${target.ident}|${list}${extras}`);
			this.battle.play();
		});
		
		//////////////////////////////////////////////////////////////////////////
		// Preview Area
		
		let previewElem = $("<div>").addClass("previewAnimElement").hide();
		let previewEffect = $("<img style='position:absolute;' />");
		this.battle.fxElem.after(previewElem);
		previewElem.append(previewEffect);
		
		let updateEffect = ()=>{
			let defender = this.battle[$("input[name=target]:checked").val()].active[0].sprite;
			
			let eff = BattleEffects[$(".preview.effect .effectList").val()];
			let pos;
			if ($("input[name=posrel]").prop("checked")) {
				pos = {
					x: defender.leftof($("input[name=posx]").val()),
					y: defender.y + $("input[name=posy]").val(),
					z: defender.behind($("input[name=posz]").val()),
				};
			} else {
				pos = {
					x: $("input[name=posx]").val(),
					y: $("input[name=posy]").val(),
					z: $("input[name=posz]").val(),
				};
			}
			pos.opacity = $("input[name=opacity]").val();
			if ($("input[name=scaleuniform]").prop("checked")) {
				pos.scale = $("input[name=scalex]").val();
			} else {
				pos.yscale = $("input[name=scalex]").val();
				pos.xscale = $("input[name=scaley]").val();
			}
			previewEffect.css(this.battle.pos(pos, eff));
		};
		
		Object.keys(BattleEffects).forEach((id)=>{
			$(".preview.effect .effectList").append(`<option value="${id}">${id}</option>`);
		});
		$(".preview.effect .effectList").on('change', (e)=>{
			let eff = BattleEffects[e.target.value];
			previewEffect.attr("src", eff.url);
			updateEffect();
		}).change();
		$(".preview.effect .playBtn").on('click', (e)=>{
			
		});
		
		$("input[name=showpreview]").on("change", (e)=>{
			previewElem.toggle(!!e.target.checked);
		});
		$("input[name=scaleuniform]").on("change", (e)=>{
			$("input[name=scaley]").prop("disabled", e.target.checked);
		}).change();
		$(".preview input[type=number],input[name=posrel]").on("change", (e)=>{
			updateEffect();
		});
		
		//////////////////////////////////////////////////////////////////////////
		// Custom Animation
		
		$(".playCustomAnim").on("click", (e)=>{
			let source = this.battle[$("input[name=source]:checked").val()].active[0];
			let target = this.battle[$("input[name=target]:checked").val()].active[0];
			if ($("input[name=missed]").prop("checked")) {
				target = target.side.missedPokemon;
			}
			try {
				let fn = $(".customAnim textarea").val();
				if (window.sessionStorage) {
					sessionStorage.setItem("animHelper-custom", fn);
				}
				fn = new Function("battle", "args", 
`var attacker = args[0];
var defender = args[1];

${fn}`);
				source.sprite.beforeMove();
				target.sprite.beforeMove();
				fn(this.battle, [source.sprite, target.sprite]);
				source.sprite.afterMove();
				target.sprite.afterMove();
				this.battle.activityAnimations.promise().done(()=>{
					this.battle.fxElem.empty()
				});
			} catch (e) {
				this.battle.log('<div class="chat message-error">' + e.message + '</div>');
			}
		});
		
		if (window.sessionStorage) {
			var fn = sessionStorage.getItem('animHelper-custom');
			$(".customAnim textarea").val(fn);
		}
		
		// this works around a WebKit/Blink bug relating to float layout
		// var rc2 = this.$('.replay-controls-2')[0];
		// if (rc2) rc2.innerHTML = rc2.innerHTML;
		// this.reset();
		this.battle.play();
	},
	"$": function (sel) {
		return this.$el.find(sel);
	},
};

window.onload = function () {
	AnimHelper.init();
};
</script>
	</body>
</html>