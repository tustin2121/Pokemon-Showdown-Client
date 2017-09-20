<?php 
chdir("/home/showdown/assets/audio/bgm/");
function loadDir($dir) {
	foreach(scandir($dir) as $file) {
		if ($file === '.') continue;
		if ($file === '..') continue;
		$path = "$dir/$file";
		if (is_dir($path)) {
			echo "{ name:'$file', dir: [\n";
			loadDir($path);
			echo "], },\n";
		} else {
			echo "{ name:'$file', path:'".ltrim($path, "./")."', },\n";
		}
	}
}
?>
<!DOCTYPE html>
<html>
<head>
	<title></title>
	<meta charset=utf-8>
	<link rel="stylesheet" href="/style/font-awesome.css?" />
	<link rel="stylesheet" href="lib/selectize.css">
	<link rel="stylesheet" href="lib/selectize.default.css">
	<link rel="stylesheet" href="music-helper.css">
	<script type="text/javascript" src="lib/jquery-3.1.1.min.js"></script>
	<script type="text/javascript" src="lib/selectize.min.js"></script>
	<script type="text/javascript" src="lib/wavesurfer.js"></script>
	<script type="text/javascript" src="lib/wavesurfer.regions.js"></script>
	<script type="text/javascript" src="lib/wavesurfer.timeline.js"></script>
	<script type="text/javascript" src="/audio/bgm-index.js"></script>
	<script type="text/javascript" src="music-helper.js"></script>
</head>
<body>
	<ul id="filetree">
<script>
/* global $, updateFileList */
$(()=>updateFileList([
<?php loadDir('.'); ?>
]));
</script>
	</ul>
	<div id="main">
		<img class='ajax' src='lib/ajax-loader.gif' />
		<div class="songtitle">&nbsp;</div>
		<div id="waveform">
			<div class="main"></div>
			<div class="timeline"></div>
			<div class="controls">
				<span class="timestamp">0:00.000</span>
				<button name='save' style='float:right'><i class="fa fa-2x fa-save"></i></button>
				<button name='play'><i class="fa fa-2x fa-play"></i><i class="fa fa-2x fa-pause"></i></button>
				<button name='stop'><i class="fa fa-2x fa-stop"></i></button>
				<button name='zoomin'><i class="fa fa-2x fa-search-plus"></i></button>
				<button name='zoomout'><i class="fa fa-2x fa-search-minus"></i></button>
			</div>
		</div>
		<div class="musicdata" label="Loop">
			<div>
				<button name='loopin'><i class="fa fa-lg fa-rotate-right"></i></button>
				<input name="loopin" type="text" placeholder="--:--.---">
			</div>
			<div>
				<button name='loopout'><i class="fa fa-lg fa-rotate-left"></i></button>
				<input name="loopout" type="text" placeholder="--:--.---">
			</div>
		</div>
		<div class="musicdata" label="Song Info">
			<div><input name="metaName" type="text" style="width: 300px;" /></div>
		</div>
		
		<div class="musicdata" label="Tags" style="width:350px">
			<input name="tags" type="text" />
		</div>
		
		<pre class="output"></div>
	</div>
</body>
</html>