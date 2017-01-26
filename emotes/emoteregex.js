// Twitch Emote regexes

var processEmoteRegExp = function(str) {
	// Robot emotes
	str = str.replace(/&lt;3\b/g, 
		'<img src="/emotes/-robot/heart.png" alt="&lt;3" title="&lt;3" class="emote">');
	// -global emotes
	str = str.replace(/\b(4Head|AMPEnergy|AMPEnergyCherry|AMPTropPunch|ANELE|ArgieB8|ArsonNoSexy|AsianGlow|BabyRage|BatChest|BCouch|BCWarrior|BibleThump|BigBrother|BlargNaut|bleedPurple|BloodTrail|BrainSlug|BrokeBack|BudBlast|BuddhaBar|BudStar|ChefFrank|cmonBruh|CoolCat|CoolStoryBob|copyThis|CorgiDerp|CurseLit|DAESuppy|DansGame|DatSheffy|DBstyle|deIlluminati|DendiFace|DogFace|DoritosChip|duDudu|DxAbomb|DxCat|EagleEye|EleGiggle|FailFish|FrankerZ|FreakinStinkin|FUNgineer|FunRun|FutureMan|GingerPower|GivePLZ|GOWSkull|GrammarKing|HassaanChop|HassanChop|HeyGuys|HotPokket|HumbleLife|imGlitch|ItsBoshyTime|Jebaited|JKanStyle|JonCarnage|KAPOW|Kappa|KappaClaus|KappaPride|KappaRoss|KappaWealth|Keepo|KevinTurtle|Kippa|Kreygasm|Mau5|mcaT|MikeHogu|MingLee|MrDestructoid|MVGame|NerfBlueBlaster|NerfRedBlaster|NinjaGrumpy|NomNom|NotATK|NotLikeThis|OhMyDog|OMGScoots|OneHand|OpieOP|OptimizePrime|OSfrog|OSkomodo|OSsloth|panicBasket|PanicVis|PartyTime|pastaThat|PeoplesChamp|PermaSmug|PeteZaroll|PeteZarollTie|PicoMause|PipeHype|PJSalt|PJSugar|PMSTwin|PogChamp|Poooound|PraiseIt|PRChase|PrimeMe|PunchTrees|RaccAttack|RalpherZ|RedCoat|ResidentSleeper|riPepperonis|RitzMitz|RlyTho|RuleFive|SeemsGood|ShadyLulu|ShazBotstix|SmoocherZ|SMOrc|SoBayed|SoonerLater|SSSsss|StinkyCheese|StoneLightning|StrawBeary|SuperVinlin|SwiftRage|TakeNRG|TBCheesePull|TBTacoLeft|TBTacoRight|TF2John|TheRinger|TheTarFu|TheThing|ThunBeast|TinyFace|TooSpicy|TriHard|TTours|twitchRaid|TwitchRPG|UncleNox|UnSane|UWot|VoHiYo|VoteNay|VoteYea|WholeWheat|WTRuck|WutFace|YouDontSay|YouWHY)\b/g,
		'<img src="/emotes/-global/$&.png" alt="$&" title="$&" class="emote"/>');
	// -twitch-curse-integration emotes
	str = str.replace(/\b(TwitchLit)\b/g,
		'<img src="/emotes/-twitch-curse-integration/$&.png" alt="$&" title="$&" class="emote"/>');
	// -twitch-turbo emotes
	str = str.replace(/\b(KappaHD|MiniK|ScaredyCat|TableHere|FlipThis)\b/g,
		'<img src="/emotes/-twitch-turbo/$&.png" alt="$&" title="$&" class="emote"/>');
	// srkevo4 emotes
	str = str.replace(/\b(evo2016|evoCanada|evoChile|evoChina|evoFrance|evoJapan|evoKorea|evoMexico|evoTilt|evoMindBlown|evoPR|evoRekt|evoTaiwan|evoUK|evoUSA)\b/g,
		'<img src="/emotes/srkevo4/$&.png" alt="$&" title="$&" class="emote"/>');
	// puncayshun emotes
	str = str.replace(/\b(punThump|punWaifu|punPeach|punLewd|punDokuro|punCirno|punGasm|punW)\b/g,
		'<img src="/emotes/puncayshun/$&.png" alt="$&" title="$&" class="emote"/>');
	// lffn emotes
	str = str.replace(/\b(lffnMarth|lffnZip|lffnFox|lffnFalco|lffnEvil|lffnEgo|lffnMyB|lffnSheik|lffnPop|lffnTSM)\b/g,
		'<img src="/emotes/lffn/$&.png" alt="$&" title="$&" class="emote"/>');
	// twitchplayspokemon emotes
	str = str.replace(/\b(tppPokeball|tppHelix|tppRng|tppPokeyen|tppCrit|tppHax|tppMiss|tppPc|tppRobored|tppRiot|tppDome|tppCursor|tppTrumpet|tppFogChamp|tppSlowpoke)\b/g,
		'<img src="/emotes/twitchplayspokemon/$&.png" alt="$&" title="$&" class="emote"/>');
	// FrankerFaceZ emotes
	str = str.replace(/\b(tbSriracha|tbSpicy|tbQuesarito|tbBaconBiscuit|tbSausageBiscuit|tbChickenBiscuit)\b/g,
		'<img src="/emotes/-ffz/$&.png" alt="$&" title="$&" class="emote"/>');
	// Extra emotes
	str = str.replace(/\b(Ackbar|AtGL|AtIvy|AtWW|AthenaPMS|BORT|BQRT|BionicBunion|CougarHunt|DOOMGuy|DatHass|Demon|EvilFetus|Evo2013|FPSMarksman|FeelsBadMan|FeelsGoodMan|Fraud|FuzzyOtterOO|GasJoker|GoCanada|GoChina|GoEU|GoFrance|GoJapan|GoKorea|GoMexico|GoTaiwan|GoUK|GoUSA|ItsATrap|KAPOldW|KZskull|MechaSupes|NervousMonkey|NightBat|NinjaTroll|NoNoSpot|OSbeaver|OSbury|OSdeo|OSrob|PJHarley|PackItUp|PazPazowitz|PuppeyFace|SGlemon|SGmouth|SGrasp|SMSkull|Shazam|ShibeZ|Soulfist|SriHead|Stormtrooper|Sullustan|TheKing|TriZard|UleetBackup|VaultBoy|Volcania|WAHAHA|WinWaker|deExcite|evo2015|evoKapow|evoKappaOno|evoMcRib|kappaRyu|kappaSagat|mm2Nice|mm2NotNice|punRNG|punThrow|shazamicon|tgaTrophy)\b/g,
		'<img src="/emotes/-x/$&.png" alt="$&" title="$&" class="emote"/>');
	return str;
};
