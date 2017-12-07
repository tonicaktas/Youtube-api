// Searchbar Handler
$(function(){
	var searchField = $('#query');
	var icon = $('#search-btn');

	//  Animation på search fältet när man klickar på d (bred och ikonen)
	$(searchField).on('focus', function(){
		$(this).animate({
			width:'100%'
		},400);
		$(icon).animate({
			right: '10px'
		}, 400);
	});

	// Animation på search fältet när man klickar ur den (bred och ikonen)
	$(searchField).on('blur', function(){
		if(searchField.val() == ''){
			$(searchField).animate({
				width:'45%'
			},400, function(){});
			$(icon).animate({
				right:'360px'
			},400, function(){});
		}
	});

	$('#search-form').submit(function(e){
		e.preventDefault();
	});
})


function search(){
	// Tömma divar där all data ska byggas
	$('#results').html('');
	$('#buttons').html('');

	// Värde vi får från input
	q = $('#query').val();

	//GET Request on API
	$.get(
		"https://www.googleapis.com/youtube/v3/search",{
			part: 'snippet, id',
			q: q,
			type:'video',
			key: 'AIzaSyDGneuIqJ1fZmLSZQvn7L6U_RK69YiCGzc'},
			function(data){
				var nextPageToken = data.nextPageToken; //hämtar nästa sidan knappen
				var prevPageToken = data.prevPageToken; // hämtar föregående sidan knappen

				// Log Data
				console.log(data);

				$.each(data.items, function(i, item){ // loopar igenom data.items från API
					// Hämtar data som byggs i functionen getOutput()
					var output = getOutput(item);

					// Visar output
					$('#results').append(output);
				});
				// Hämtar data som byggs i functionen getButtons()
				var buttons = getButtons(prevPageToken, nextPageToken);

				// Visar buttons
				$('#buttons').append(buttons);
			}
	);
}

// Next Sida Function
function nextPage(){
	var token = $('#next-button').data('token'); // Hämtar data-token från var btnoutput
	var q = $('#next-button').data('query');	// Hämtar data-query från var btnoutput

	// tömer divar
	$('#results').html('');
	$('#buttons').html('');

	// Hämtar värde från Input när man klickar
	q = $('#query').val();

	// Kör en GET Request on API
	$.get(
		"https://www.googleapis.com/youtube/v3/search",{
			part: 'snippet, id',
			q: q,
			pageToken: token,
			type:'video',
			key: 'AIzaSyDGneuIqJ1fZmLSZQvn7L6U_RK69YiCGzc'},
			function(data){
				var nextPageToken = data.nextPageToken;
				var prevPageToken = data.prevPageToken;


				console.log(data);

				$.each(data.items, function(i, item){ // loopar igenom data.items från API

					// Hämtar data som byggs i functionen getOutput()
					var output = getOutput(item);

					// Visar output
					$('#results').append(output);
				});

				var buttons = getButtons(prevPageToken, nextPageToken);

				// Visar buttons
				$('#buttons').append(buttons);
			}
	);
}


// Föregående Sida Function
function prevPage(){
	var token = $('#prev-button').data('token');
	var q = $('#prev-button').data('query');

	// Tömer resultat
	$('#results').html('');
	$('#buttons').html('');

	// Hämtar värde från Input när man klickar
	q = $('#query').val();

	// Kör en GET Request on API
	$.get(
		"https://www.googleapis.com/youtube/v3/search",{
			part: 'snippet, id',
			q: q,
			pageToken: token,
			type:'video',
			key: 'AIzaSyDGneuIqJ1fZmLSZQvn7L6U_RK69YiCGzc'},
			function(data){
				var nextPageToken = data.nextPageToken;
				var prevPageToken = data.prevPageToken;


				console.log(data);

				$.each(data.items, function(i, item){// loopar igenom data.items från API

					// Hämtar data som byggs i functionen getOutput()
					var output = getOutput(item);

					// Visar output
					$('#results').append(output);
				});

				var buttons = getButtons(prevPageToken, nextPageToken);

				// Visar buttons
				$('#buttons').append(buttons);
			}
	);
}

// Bygger outputten som hämtas med loppen och läggs in i variabel output
function getOutput(item){
	var videoId = item.id.videoId;
	var title = item.snippet.title;
	var description = item.snippet.description;
	var thumb = item.snippet.thumbnails.high.url;
	var channelTitle = item.snippet.channelTitle;
	var videoDate = item.snippet.publishedAt;


	var output = '<li>' +
	'<div class="list-left">' +
	'<img src="'+thumb+'">' +
	'</div>' +
	'<div class="list-right">' +
	'<h3><a class="fancybox fancybox.iframe" href="http://www.youtube.com/embed/'+videoId+'">'+title+'</a></h3>' +
	'<small>By <span class="cTitle">'+channelTitle+'</span> on '+videoDate+'</small>' +
	'<p>'+description+'</p>' +
	'</div>' +
	'</li>' +
	'<div class="clearfix"></div>' +
	'';

	return output;
}

// Bygger functionen  getButtons på samma sätt som getOutput
function getButtons(prevPageToken, nextPageToken){
	if(!prevPageToken){
		var btnoutput = '<div class="button-container">'+'<button id="next-button" class="paging-button" data-token="'+nextPageToken+'" data-query="'+q+'"' +
		'onclick="nextPage();">Next Page</button></div>';
	} else {
		var btnoutput = '<div class="button-container">'+
		'<button id="prev-button" class="paging-button" data-token="'+prevPageToken+'" data-query="'+q+'"' +
		'onclick="prevPage();">Prev Page</button>' +
		'<button id="next-button" class="paging-button" data-token="'+nextPageToken+'" data-query="'+q+'"' +
		'onclick="nextPage();">Next Page</button></div>';
	}

	return btnoutput;
}
