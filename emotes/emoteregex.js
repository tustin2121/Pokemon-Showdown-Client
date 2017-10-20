// Twitch Emote regexes

var processEmoteRegExp = function(str) {
	// Robot emotes
	str = str.replace(/&lt;3\b/g, 
		'<img src="/emotes/-robot/heart.png" alt="&lt;3" title="&lt;3" class="emote">');
	// -global emotes
	str = str.replace(/\b(JKanStyle|OptimizePrime|StoneLightning|TheRinger|RedCoat|Kappa|JonCarnage|MrDestructoid|BCWarrior|GingerPower|DansGame|SwiftRage|PJSalt|KevinTurtle|Kreygasm|SSSsss|PunchTrees|FunRun|ArsonNoSexy|SMOrc|FrankerZ|OneHand|HassanChop|BloodTrail|DBstyle|AsianGlow|BibleThump|ShazBotstix|PogChamp|PMSTwin|FUNgineer|ResidentSleeper|4Head|HotPokket|FailFish|DAESuppy|WholeWheat|ThunBeast|TF2John|RalpherZ|Kippa|Keepo|BigBrother|SoBayed|PeoplesChamp|GrammarKing|PanicVis|ANELE|BrokeBack|PipeHype|YouWHY|RitzMitz|EleGiggle|TheThing|HassaanChop|BabyRage|panicBasket|PermaSmug|BuddhaBar|WutFace|PRChase|Mau5|HeyGuys|NotATK|mcaT|TTours|PraiseIt|HumbleLife|CorgiDerp|ArgieB8|ShadyLulu|KappaPride|CoolCat|DendiFace|NotLikeThis|riPepperonis|duDudu|bleedPurple|twitchRaid|SeemsGood|MingLee|KappaRoss|KappaClaus|OhMyDog|OSfrog|OSsloth|OSkomodo|VoHiYo|MikeHogu|KappaWealth|cmonBruh|SmoocherZ|NomNom|StinkyCheese|ChefFrank|BudStar|FutureMan|OpieOP|DoritosChip|PJSugar|VoteYea|VoteNay|RuleFive|DxCat|AMPTropPunch|TinyFace|PicoMause|TheTarFu|DatSheffy|UnSane|copyThis|pastaThat|imGlitch|GivePLZ|TakeNRG|BlargNaut|DogFace|Jebaited|TooSpicy|WTRuck|UncleNox|RaccAttack|StrawBeary|PrimeMe|BrainSlug|BatChest|CurseLit|Poooound|FreakinStinkin|SuperVinlin|TriHard|CoolStoryBob|ItsBoshyTime|KAPOW|YouDontSay|UWot|RlyTho|SoonerLater|PartyTime|NinjaGrumpy|MVGame|TBAngel|TheIlluminati|BlessRNG|MorphinTime|ThankEgg|ArigatoNas|BegWan|BigPhish|InuyoFace|Kappu|KonCha|PunOko|SabaPing|TearGlove|TehePelo|TwitchLit|CarlSmile|CrreamAwk|TwitchRPG|Squid1|Squid2|Squid3|Squid4|TwitchUnity|TBCrunchy|TBTacoBag|TBTacoProps|VaultBoy|QuadDamage|BJBlazkowicz|TPcrunchyroll|EntropyWins|LUL|PowerUpR|PowerUpL|HSLight|HSVoid|HSCheers|HSWP|DarkMode|TwitchVotes)\b/g,
		'<img src="/emotes/-global/$&.png" alt="$&" title="$&" class="emote"/>');
	// puncayshun emotes
	str = str.replace(/\b(punWaifu|punPeach|punThump|punLewd|punDokuro|punCirno|punGasm|punW|punEhhUrr|punWhomp|punOK|punTHICC|punGayshun|punThrow|punRNG|punWW|punWWW)\b/g,
		'<img src="/emotes/puncayshun/$&.png" alt="$&" title="$&" class="emote"/>');
	// lffn emotes
	str = str.replace(/\b(lffnZip|lffnEvil|lffnEgo|lffnFox|lffnMarth|lffnMyB|lffnPop|lffnSheik|lffnTSM|lffnW|lffnPaint|lffnFalco|lffnLEFF|lffnNotch|lffnWeeb|lffnMewtwo|lffnPaintGold)\b/g,
		'<img src="/emotes/lffn/$&.png" alt="$&" title="$&" class="emote"/>');
	// cirno_tv emotes
	str = str.replace(/\b(cirBell|cirFairy|cirPrise|cirShades|cirLewd|cirThree|cirBar|cirRage|cirWink|cirHappy|cirSleep|cirLove|cirSmug|cirGlod|cirHonk|cirNilla|cirMini|cirGasm|cirCola|cirHi|cirLaugh|cirKiss|cirBaka|cirBlech|cirGreed|cirSanta|cirPalm|cirTan|cirBlind|cirREE|cirThink|cirWut|cirPls|cirMiku|cirNo|cirCop|cirComfy|cirGPantsu|cirLPantsu)\b/g,
		'<img src="/emotes/cirno_tv/$&.png" alt="$&" title="$&" class="emote"/>');
	// auslove emotes
	str = str.replace(/\b(ausGoof|ausGrump|ausDJ|ausHype|ausHug|ausGG|ausHax|ausTy|ausTired|ausLol|ausL|ausTroll|ausCute|ausGasm|ausWave|ausCry|ausRekt|ausShiny|ausDono|ausHonk|ausLuck|ausWow|ausCheeky|ausTilt|ausYay|ausHungry|ausEww|ausRage|ausFix|ausLurk|ausPotato|ausPride|ausCheer|ausArt|ausDab|ausHole|ausRich)\b/g,
		'<img src="/emotes/auslove/$&.png" alt="$&" title="$&" class="emote"/>');
	// twitchplayspokemon emotes
	str = str.replace(/\b(tppCrit|tppPokeyen|tppHax|tppMiss|tppRng|tppHelix|tppRiot|tppPc|tppDome|tppSlowpoke|tppTrumpet|tppCursor|tppPokeball|tppHappy|tppBait|tppS|tppLUL)\b/g,
		'<img src="/emotes/twitchplayspokemon/$&.png" alt="$&" title="$&" class="emote"/>');
	// FrankerFaceZ emotes
	str = str.replace(/\b(tbSriracha|tbSpicy|tbQuesarito|tbBaconBiscuit|tbSausageBiscuit|tbChickenBiscuit)\b/g,
		'<img src="/emotes/-ffz/$&.png" alt="$&" title="$&" class="emote"/>');
	// Extra emotes
	str = str.replace(/\b(AMPEnergy|AMPEnergyCherry|Ackbar|AtGL|AtIvy|AtWW|AthenaPMS|BCouch|BORT|BQRT|BionicBunion|BudBlast|CougarHunt|DOOMGuy|DatHass|Demon|DxAbomb|EagleEye|EvilFetus|Evo2013|FPSMarksman|FeelsBadMan|FeelsGoodMan|FiteFiteFite|Fraud|FuzzyOtterOO|GOWSkull|GasJoker|GoCanada|GoChina|GoEU|GoFrance|GoJapan|GoKorea|GoMexico|GoTaiwan|GoUK|GoUSA|ItsATrap|KAPOldW|KZskull|MechaSupes|NerfBlueBlaster|NerfRedBlaster|NervousMonkey|NightBat|NinjaTroll|NoNoSpot|OMGScoots|OSbeaver|OSblob|OSbury|OSdeo|OSrob|PJHarley|PackItUp|PazPazowitz|PeteZaroll|PeteZarollTie|PuppeyFace|SGlemon|SGmouth|SGrasp|SMSkull|SPKFace|SPKWave|Shazam|ShibeZ|Soulfist|SriHead|Stormtrooper|Sullustan|TBCheesePull|TBTacoLeft|TBTacoRight|TheKing|TriZard|TwitchRPGCoin|UleetBackup|Volcania|WAHAHA|WinWaker|ausC|ausThump|deExcite|deIlluminati|evo2015|evoKapow|evoKappaOno|evoMcRib|kappaRyu|kappaSagat|mm2Nice|mm2NotNice|shazamicon|tgaTrophy|tppFogChamp|tppRobored)\b/g,
		'<img src="/emotes/-x/$&.png" alt="$&" title="$&" class="emote"/>');
	return str;
};
