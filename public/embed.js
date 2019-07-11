var script = document.createElement('script');
script.src = "https://www.youtube.com/iframe_api";
var first_script = document.getElementsByTagName('script')[0];
first_script.parentNode.insertBefore(script, first_script);

let error_dom = document.getElementById('error');

function player_creator(dom_id, video_id, start_second, end_second, loop)
{
    if
    (
        typeof(start_second) === 'number' &&
        typeof(end_second) === 'number'   &&
        start_second >= end_second
    )
    {
        end_second = undefined;
    }

    var player = new YT.Player
    (
        dom_id,
        {
            videoId : video_id,
            playerVars :
            {
                rel : 0,
                loop : loop ? 1 : 0,
                modestbranding : 1,
                start : start_second || 0,
                end : end_second,
                // iv_load_policy : 1, // CC on
                // cc_lang_pref : 'en', // CC lang
                // hl : 'en',
                // disablekb : 1,
                // controls: 0,
                color : 'white'
            },
            events :
            {
                onStateChange : function(e)
                {
                    if
                    (
                        typeof(end_second) === 'number' &&
                        e.target.getCurrentTime() >= end_second
                    )
                    {
                        if(loop)
                        {
                            player.seekTo(start_second);
                        }
                        else
                        {
                            player.pauseVideo();
                        }
                    }
                    else if
                    (
                        typeof(start_second) === 'number' &&
                        e.target.getCurrentTime() < start_second
                    )
                    {
                        player.seekTo(start_second);
                    }

                    if(loop) player.playVideo();
                },
                onError : function(error)
                {
                    if(error.data === 101 || error.data === 150)
                    {
                        error_dom.innerHTML =
"Owner of the video disabled playing on anywhere else but on youtube." +
" Here\'s the original youtube link: <a href='https://www.youtube.com/watch/?v=" +
video_id + "'>https://www.youtube.com/watch/?v=" + video_id + "</a>";

                    }
                },
                onReady : function()
                {
                    player.playVideo();
                }
            }
        }
    );
}

function onYouTubeIframeAPIReady()
{
    player_creator
    (
        'vid',
        url(1),
        Number(url('?start') || url('?s')),
        Number(url('?end')   || url('?e')),
        Boolean(url('?loop')  || url('?l'))
    );
}