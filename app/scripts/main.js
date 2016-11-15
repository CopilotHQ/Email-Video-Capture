var tag = document.createElement('script'),
    player,
    playerState,
    listID = $('#inputAweberListID').val();

// This code loads the IFrame Player API code asynchronously.
tag.src = 'https://www.youtube.com/iframe_api';
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// This function creates an <iframe> (and YouTube player) after the API code downloads.
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    width: '560',
    height: '315',
    videoId: '',
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
  //event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event) {
  /* Time based function
  if (event.data == YT.PlayerState.PLAYING && !done) {
    setTimeout(stopVideo, 6000);
    done = true;
  }
  */
  playerState = event.data;
}
function stopVideo() {
  player.stopVideo();
}

$('#buildEmbed').on('click', function() {
  $('#youTube input').each(function(){
    if(!$(this).val()) {
      $(this).css('background-color', '#fae7e7');
    } else {
      $(this).css('background-color', 'white');
    }
  });

  if(!$('#youTube input').val()) {

  } else {
    fillCard();
  }

  // Populate Player
  // player.cueVideoById(youTubeID);
  // $('#video').fadeIn('medium');
});


function getYouTubeId(url) {
  var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  var match = url.match(regExp);
  if (match && match[2].length == 11) {
    return match[2];
  } else {
    //error
  }
}

function fillCard() {
  var youTubeURL = $('#youTubeURL').val(),
      youTubeID = getYouTubeId(youTubeURL),
      youTubeAPI = 'AIzaSyAMZJhvhaUGqsBuzxWYc8Df8hQz6t2igyA',
      AWeberListID = $('#AWeberID').val(),
      embeddable = $('#aw-cardContainer').html();

  // Get YouTube Info from API
  $.ajax({
      url: 'https://www.googleapis.com/youtube/v3/videos?id=' + youTubeID + '&key=' + youTubeAPI + '&part=snippet,contentDetails,statistics,status',
      dataType: 'jsonp',

      // https://www.googleapis.com/youtube/v3/videos?id=-30htnn3BM0&key=AIzaSyAMZJhvhaUGqsBuzxWYc8Df8hQz6t2igyA&part=snippet,contentDetails,statistics,status

      success: function(data){
        var thumbnail = data.items[0].snippet.thumbnails.standard.url,
            title = data.items[0].snippet.title,
            channelTitle = data.items[0].snippet.channelTitle;
        $('#aw-thumbnail').css('background-image', 'url(' + thumbnail + ')');
        $('#aw-content').html(`
          <div class="aw-card__header">` + title + `</div>
        `);
        $('input[name="listname"]').val(AWeberListID);
        $('input[name="redirect"]').val(youTubeURL);
        $('#embedCode textarea').val(embeddable).fadeIn(1200);
        $('#aw-pageTitle').slideUp(200);
        $('#aw-cardContainer').css('opacity', 0)
          .slideDown(400)
          .animate(
            { opacity: 1 },
            { queue: false, duration: 800 }
          );
      },
      error: function(jqXHR, textStatus, errorThrown) {
          alert (textStatus, + ' | ' + errorThrown);
      }
  });
}

$('textarea').on('focus', function() {
  $(this).select();
  $('#copyHelper').css('opacity', 0)
    .slideDown(200)
    .animate(
      { opacity: 1 },
      { queue: false, duration: 400 }
    );
});
$('textarea').on('blur', function() {
  $('#copyHelper').css('opacity', 1)
    .slideUp(200)
    .animate(
      { opacity: 0 },
      { queue: false, duration: 400 }
    );
});
