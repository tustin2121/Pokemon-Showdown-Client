// music-helper.js
// Controlling the music-helper

const raf = window.requestAnimationFrame;
let wavesurfer;
let zoomLvl = 1;

let loadedMeta = {};
let loadedId3 = {};
let loopRegion = null;

/* global $, WaveSurfer, musicTable */

$(()=>{
	wavesurfer = window.wavesurfer = WaveSurfer.create({
		container: '#waveform .main',
		loopSelection: true,
		// progressColor: '#555555',
		// waveColor: '#999999',
		// cursorColor: '#333333',
		// cursorWidth: 1,
		// interact: true,
		// scrollParent: false,
		plugins: [
			WaveSurfer.timeline.create({ //new TimelinePlugin({
				container: '#waveform .timeline',
				formatTimeCallback: (sec)=>{
					let min = Math.floor(sec/60);
					sec = '00'+(sec%60).toFixed(3);
					sec = sec.slice(-6);
					return `${min}:${sec}`;
				},
			}),
			WaveSurfer.regions.create({
				
			}),
		],
	});
	// Replace this problematic function!
	wavesurfer.Region.prototype.bindInOut = function(){
		let lastPlaytime = -1;//this.wavesurfer.backend.lastPlay;
		let firedIn = false;
		let firedOut = false;
		
		let onProcess = (time)=>{
			if (!firedOut && firedIn && (this.start >= Math.round(time*100)/100 || this.end <= Math.round(time*100)/100)) {
				firedOut = true; firedIn = false;
				this.fireEvent('out');
				this.wavesurfer.fireEvent('region-out', this);
			}
			if (!firedIn && this.start <= time && this.end > time) {
				firedOut = false; firedIn = true;
				this.fireEvent('in');
				this.wavesurfer.fireEvent('region-in', this);
			}
		};
		let resetLoop = ()=>{
			firedIn = false;
			firedOut = false;
		};
		
		this.wavesurfer.on('seek', resetLoop);
		this.wavesurfer.on('pause', resetLoop);
		this.wavesurfer.backend.on('audioprocess', onProcess);
		this.on('remove', ()=>{
			this.wavesurfer.un('seek', resetLoop);
			this.wavesurfer.un('pause', resetLoop);
			this.wavesurfer.backend.un('audioprocess', onProcess);
		});
		
		/* Loop Playback */
		this.on('out', ()=>{
			if (this.loop) {
				this.wavesurfer.play(this.start);
			}
		});
	};
	
	wavesurfer.empty();
	wavesurfer.on('play', updateTS);
	// wavesurfer.on('play', ()=>{
	// 	setTimeout(()=>{ loopRegion.loop = true; }, 10);
	// });
	// wavesurfer.on('pause', ()=>{
	// 	loopRegion.loop = false;
	// });
	// wavesurfer.on('seek', ()=>{
	// 	loopRegion.loop = false;
	// 	setTimeout(()=>{ loopRegion.loop = true; }, 10);
	// });
	wavesurfer.on('interaction', ()=>setTimeout(updateTS,0));
	wavesurfer.on('ready', ()=>{
		loopRegion = wavesurfer.regions.add({
			drag:false,
			loop:false, //will set to true when we have both sides of the loop
			color: 'hsla(200, 100%, 30%, 0.1)',
		});
	});
	wavesurfer.on('error', ()=>{
		$('#main .ajax').hide();
		$('#main .songtitle')
			.prepend(`<i class="fa fa-warning" style='color:red; margin-right:8px'>`)
			.append(`<i class="fa fa-warning" style='color:red; margin-left:8px'>`);
	});
	wavesurfer.on('region-updated', (region)=>{
		$('input[name=loopin]').val(printTimestamp(region.start));
		$('input[name=loopout]').val(printTimestamp(region.end));
	});
	
	$('button[name=play]').on('click', ()=>{
		let loop = loopRegion.loop;
		loopRegion.loop = false;
		wavesurfer.playPause();
		setTimeout(()=>loopRegion.loop = loop, 0);
	});
	$('button[name=save]').on('click', ()=>saveMeta() );
	$('button[name=stop]').on('click', ()=>wavesurfer.stop() );
	$('button[name=zoomin]').on('click', ()=>zoom(2.0) );
	$('button[name=zoomout]').on('click', ()=>zoom(0.5) );
	$('input[name=tags]').selectize({
		delimiter: ',',
		options: [
			{ value:"random", text:"random" },
			{ value:"victory", text:"victory" },
			{ value:"trainer", text:"trainer" },
			{ value:"gym", text:"gym" },
			{ value:"e4", text:"e4" },
			{ value:"champion", text:"champion" },
		],
		// persist: false,
		// create: (input)=>{
		// 	input = input.replace(/ /g,'-').replace(/[^\w\d-]/g,'').toLowerCase();
		// 	return { value:input, text:input };
		// },
	});
	
	$('input[name=loopin],input[name=loopout]').on('change', (e)=>{
		let $el = $(e.currentTarget);
		let name = $(e.currentTarget).attr('name');
		
		let val = parseTimestamp($el.val());
		if (val === null) { //Invalid timestampt => clear region
			$el.val('');
			return;
		}
		$el.val(printTimestamp(val));
		updateLoopRegion();
	});
	$('button[name=loopin],button[name=loopout]').on('click', (e)=>{
		let name = $(e.currentTarget).attr('name');
		let $d = $(`input[name=${name}]`);
		let ts = wavesurfer.getCurrentTime();
		$d.val(ts.toFixed(3)).trigger('change');
		// let min = Math.floor(ts/60);
		// let sec = ('00'+(ts%60).toFixed(3)).slice(-6);
		// $d.val(`${min}:${sec}`);
	});
	$('.output')
		.append( $('<div>').text(`// Remember to add any output below to the bgm-index.js file. Clicking save only outputs changes here, to copy into that file.`) )
		.append( $('<div>').text(`// Also remember to cut off as much extra time as possible from the music before uploading to the server, for smaller, faster downloads.`) )
		.append( $('<div>').text(` `) )
		;
});

function parseTimestamp(value) {
	let res = /^(?:(\d+):)?(\d+)(?:\.(\d+))?$/.exec(value);
	if (!res) { // reject
		console.log(`Rejected timestamp format:`, value);
		return null;
	}
	
	let min = Number.parseInt(res[1]||0);
	let sec = Number.parseFloat(`${res[2]}.${res[3]||0}`);
	sec += min * 60;
	if (Number.isNaN(sec)) {
		console.log(`NaN timestamp format:`, res);
		return null;
	}
	return sec;
}
function printTimestamp(ts) {
	let min = Math.floor(ts/60);
	let sec = ('00'+(ts%60).toFixed(3)).slice(-6);
	return `${min}:${sec}`;
}

function zoom(z) {
	zoomLvl *= z;
	let ppi = zoomLvl * (wavesurfer.drawer.getWidth() / wavesurfer.getDuration());
	wavesurfer.zoom(ppi);
	setTimeout(()=>loopRegion.updateRender(ppi), 10);
}

function updateLoopRegion() {
	loopRegion.start = parseTimestamp($('input[name=loopin]').val()) || 0;
	loopRegion.end = parseTimestamp($('input[name=loopout]').val()) || 0;
	if (loopRegion.start < loopRegion.end) {
		loopRegion.loop = true;
	} else {
		loopRegion.loop = false;
	}
	loopRegion.updateRender();
}

function updateTS() {
	let ts = wavesurfer.getCurrentTime();
	let min = Math.floor(ts/60);
	let sec = ('00'+(ts%60).toFixed(3)).slice(-6);
	$('.controls .timestamp').text(`${min}:${sec}`);
	if (!wavesurfer.isPlaying()) return;
	raf(updateTS);
}

function updateFileList(filelist){
	let tree = $('#filetree');
	tree.addClass('loading');
	tree.empty();
	_loopDir(tree, filelist);
	tree.removeClass('loading');
	renumber();
	return;
	
	function _loopDir($ls, files){
		for (let f of files) {
			let music = /\.(mp3|wav)$/i.test(f.name);
			
			if (f.path) { //stats.isFile()
				let css = [];
				let meta;
				try {
					let key = f.path.slice(0, f.path.indexOf('.'));
					meta = musicTable.meta[key];
					if (!meta) css.push('nometa');
				} catch (e) {
					css.push('metaerr');
				}
				if (!music) css.push('notmusic');
				const $li = $(`<li>`);
				const $lbl = $(`<span class='${css.join(' ')}'>${f.name}</span>`);
				meta = Object.assign(meta||{}, {
					_$lbl : $lbl,
					_id : f.path.slice(0, f.path.indexOf('.')),
				});
				$lbl.on('click', (e)=>{ loadMusic(f.path, meta); });
				$li.append($lbl).appendTo($ls);
			}
			else if (f.dir) { //stats.isDirectory()
				const $li = $(`<li class='closed'></li>`);
				const $lbl = $(`<span class='dir'>${f.name}</span>`);
				const $sub = $('<ul>');
				$lbl.on('click', (e)=>{
					$li.toggleClass('closed');
					renumber();
				});
				$li.append($lbl).append($sub).appendTo($ls);
				_loopDir($sub, f.dir);
			}
		}
	}
}


function renumber() {
	$('#filetree li:visible').each((i,e)=>{
		$(e).removeClass('n0 n1').addClass('n'+(i%2));
	});
}

function loadMusic(fpath, meta) {
	$('#main .ajax').show();
	wavesurfer.empty();
	wavesurfer.regions.clear();
	wavesurfer.params.scrollParent = false;
	loadedMeta = meta || {};
	$('#main .songtitle').text(fpath);
	$('#waveform .timeline').empty();
	
	wavesurfer.once('ready', ()=>{
		$('#main .ajax').hide()
		loadMeta();
	});
	wavesurfer.load(`/audio/bgm/${fpath}`);
	/*
	fs.readFile(fpath, (err, data)=>{
		if (err) throw err;
		let tags = id3.id3v2(data);
		if (tags) {
			loadedMeta.info = loadedMeta.info || {};
			loadedMeta.info.name = loadedMeta.info.name || (tags.title);
			loadedMeta.info.artist = loadedMeta.info.artist || (tags.artist) || (tags.composer);
			loadedMeta.info.album = loadedMeta.info.album || (tags.album);
		}
		wavesurfer.once('ready', ()=>{
			$('#main .ajax').hide()
			loadMeta();
		});
		wavesurfer.loadArrayBuffer(data.buffer);
	});
	*/
	return;
}

function loadMeta() {
	if (loadedMeta.loop) {
		$('#main input[name=loopin]').val(loadedMeta.loop[0]).trigger('change');
		$('#main input[name=loopout]').val(loadedMeta.loop[1]);
	} else {
		$('#main input[name=loopin]').val('').trigger('change');
		$('#main input[name=loopout]').val('');
	}
	setTimeout(()=>$('#main input[name=loopout]').trigger('change'));
	if (loadedMeta.info) {
		$('#main input[name=metaName]').val(loadedMeta.info);
	} else {
		$('#main input[name=metaName]').val('Pokémon ???');
	}
	if (loadedMeta.tags) {
		let s = $('#main input[name=tags]')[0].selectize;
		// loadedMeta.tags.forEach((x)=>s.createItem(x));
		s.setValue(Object.keys(loadedMeta.tags));
	} else {
		$('#main input[name=tags]')[0].selectize.clear();
	}
	
	$('.output div').removeClass('curr');
	$('.output').find(`[name="${loadedMeta._id}"]`).addClass('curr');
}

function saveMeta() {
	let loopin = parseTimestamp($('#main input[name=loopin]').val());
	let loopout = parseTimestamp($('#main input[name=loopout]').val());
	let metaName = $('#main input[name=metaName]').val();
	let tags = $('#main input[name=tags]').val();
	
	let meta = {};
	if (loopin && loopout) {
		meta.loop = [loopin, loopout];
	}
	meta.tags = {};
	tags.split(',').filter(x=>x&&x.trim()).forEach(t=> meta.tags[t]=1 );
	meta.info = metaName;
	
	Object.assign(loadedMeta, meta);
	
	let output = `{ `;
	output += `loop:[${spaceOut(meta.loop[0].toFixed(3), 6)},${spaceOut(meta.loop[1].toFixed(3), 7)}], `;
	output += `tags:{ `;
	for (let t in meta.tags) { output += `${t}:1, `; }
	output += `},`;
	output = tabOut(`"${loadedMeta._id}":`,7) + tabOut(output, 15)+`info:"${meta.info}" },`;
	
	let outTag = $('.output').find(`[name="${loadedMeta._id}"]`);
	if (!outTag.length) {
		outTag = $('<div>').attr('name', loadedMeta._id).addClass('curr').appendTo('.output');
	}
	outTag.text(output);
	return;
	
	function spaceOut(str, nSpaces) {
		let rSpaces = nSpaces - str.length;
		if (rSpaces < 0) return str;
		for (let i = 0; i < rSpaces; i++) str = ' '+str;
		return str;
	}
	function tabOut(str, nTabs) {
		let nSpaces = nTabs * 4;
		nSpaces -= str.length;
		let rTabs = Math.floor(nSpaces / 4);
		if (nSpaces % 4 > 0) rTabs++;
		for (let i = 0; i < rTabs; i++) str += '\t';
		return str;
	}
}