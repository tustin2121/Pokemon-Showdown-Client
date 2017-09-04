// Twitch Emote regexes

var processEmoteRegExp = function(str) {
	// Robot emotes
	str = str.replace(/&lt;3\b/g, 
		'<img src="/emotes/-robot/heart.png" alt="&lt;3" title="&lt;3" class="emote">');
	// -global emotes
	str = str.replace(/\b(4Head|AMPTropPunch|ANELE|ArgieB8|ArigatoNas|ArsonNoSexy|AsianGlow|BabyRage|BatChest|BCWarrior|BegWan|BibleThump|BigBrother|BigPhish|BJBlazkowicz|BlargNaut|bleedPurple|BlessRNG|BloodTrail|BrainSlug|BrokeBack|BuddhaBar|BudStar|CarlSmile|ChefFrank|cmonBruh|CoolCat|CoolStoryBob|copyThis|CorgiDerp|CrreamAwk|CurseLit|DAESuppy|DansGame|DatSheffy|DBstyle|DendiFace|DogFace|DoritosChip|duDudu|DxCat|EagleEye|EleGiggle|FailFish|FrankerZ|FreakinStinkin|FUNgineer|FunRun|FutureMan|GingerPower|GivePLZ|GOWSkull|GrammarKing|HassaanChop|HassanChop|HeyGuys|HotPokket|HumbleLife|imGlitch|InuyoFace|ItsBoshyTime|Jebaited|JKanStyle|JonCarnage|KAPOW|Kappa|KappaClaus|KappaPride|KappaRoss|KappaWealth|Kappu|Keepo|KevinTurtle|Kippa|KonCha|Kreygasm|Mau5|mcaT|MikeHogu|MingLee|MorphinTime|MrDestructoid|MVGame|NinjaGrumpy|NomNom|NotATK|NotLikeThis|OhMyDog|OneHand|OpieOP|OptimizePrime|OSblob|OSfrog|OSkomodo|OSsloth|panicBasket|PanicVis|PartyTime|pastaThat|PeoplesChamp|PermaSmug|PicoMause|PipeHype|PJSalt|PJSugar|PMSTwin|PogChamp|Poooound|PraiseIt|PRChase|PrimeMe|PunchTrees|PunOko|QuadDamage|RaccAttack|RalpherZ|RedCoat|ResidentSleeper|riPepperonis|RitzMitz|RlyTho|RuleFive|SabaPing|SeemsGood|ShadyLulu|ShazBotstix|SmoocherZ|SMOrc|SoBayed|SoonerLater|Squid1|Squid2|Squid3|Squid4|SSSsss|StinkyCheese|StoneLightning|StrawBeary|SuperVinlin|SwiftRage|TakeNRG|TBAngel|TBCrunchy|TBTacoBag|TBTacoProps|TearGlove|TehePelo|TF2John|ThankEgg|TheIlluminati|TheRinger|TheTarFu|TheThing|ThunBeast|TinyFace|TooSpicy|TriHard|TTours|TwitchLit|twitchRaid|TwitchRPG|TwitchUnity|UncleNox|UnSane|UWot|VaultBoy|VoHiYo|VoteNay|VoteYea|WholeWheat|WTRuck|WutFace|YouDontSay|YouWHY)\b/g,
		'<img src="/emotes/-global/$&.png" alt="$&" title="$&" class="emote"/>');
	// -twitch-curse-integration emotes
	str = str.replace(/\b(TwitchLit)\b/g,
		'<img src="/emotes/-twitch-curse-integration/$&.png" alt="$&" title="$&" class="emote"/>');
	// -twitch-turbo emotes
	str = str.replace(/\b(KappaHD|MiniK|ScaredyCat|TableHere|FlipThis)\b/g,
		'<img src="/emotes/-twitch-turbo/$&.png" alt="$&" title="$&" class="emote"/>');
	// puncayshun emotes
	str = str.replace(/\b(punThump|punWaifu|punPeach|punLewd|punDokuro|punCirno|punGasm|punW|punEhhUrr|punWhomp|punWW|punOK|punTHICC|punGayshun|punThrow)\b/g,
		'<img src="/emotes/puncayshun/$&.png" alt="$&" title="$&" class="emote"/>');
	// lffn emotes
	str = str.replace(/\b(lffnMarth|lffnZip|lffnFox|lffnEvil|lffnEgo|lffnMyB|lffnSheik|lffnPop|lffnTSM|lffnPaint|lffnPaintGold|lffnFalco|lffnLEFF|lffnNotch|lffnWeeb|lffnMewtwo|lffnW)\b/g,
		'<img src="/emotes/lffn/$&.png" alt="$&" title="$&" class="emote"/>');
	// twitchplayspokemon emotes
	str = str.replace(/\b(tppPokeball|tppHelix|tppRng|tppPokeyen|tppCrit|tppHax|tppMiss|tppPc|tppRiot|tppDome|tppCursor|tppTrumpet|tppSlowpoke|tppHappy|tppBait|tppS)\b/g,
		'<img src="/emotes/twitchplayspokemon/$&.png" alt="$&" title="$&" class="emote"/>');
	// FrankerFaceZ emotes
	str = str.replace(/\b(tbSriracha|tbSpicy|tbQuesarito|tbBaconBiscuit|tbSausageBiscuit|tbChickenBiscuit)\b/g,
		'<img src="/emotes/-ffz/$&.png" alt="$&" title="$&" class="emote"/>');
	// Extra emotes
	str = str.replace(/\b(AMPEnergy|AMPEnergyCherry|Ackbar|AtGL|AtIvy|AtWW|AthenaPMS|BCouch|BORT|BQRT|BionicBunion|BudBlast|CougarHunt|DOOMGuy|DatHass|Demon|DxAbomb|EvilFetus|Evo2013|FPSMarksman|FeelsBadMan|FeelsGoodMan|FiteFiteFite|Fraud|FuzzyOtterOO|GasJoker|GoCanada|GoChina|GoEU|GoFrance|GoJapan|GoKorea|GoMexico|GoTaiwan|GoUK|GoUSA|ItsATrap|KAPOldW|KZskull|MechaSupes|NerfBlueBlaster|NerfRedBlaster|NervousMonkey|NightBat|NinjaTroll|NoNoSpot|OMGScoots|OSbeaver|OSbury|OSdeo|OSrob|PJHarley|PackItUp|PazPazowitz|PeteZaroll|PeteZarollTie|PuppeyFace|SGlemon|SGmouth|SGrasp|SMSkull|SPKFace|SPKWave|Shazam|ShibeZ|Soulfist|SriHead|Stormtrooper|Sullustan|TBCheesePull|TBTacoLeft|TBTacoRight|TheKing|TriZard|TwitchRPGCoin|UleetBackup|Volcania|WAHAHA|WinWaker|deExcite|deIlluminati|evo2015|evoKapow|evoKappaOno|evoMcRib|kappaRyu|kappaSagat|mm2Nice|mm2NotNice|punRNG|shazamicon|tgaTrophy|tppFogChamp|tppLUL|tppRobored)\b/g,
		'<img src="/emotes/-x/$&.png" alt="$&" title="$&" class="emote"/>');
	return str;
};
