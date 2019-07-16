var format_1 = new RegExp
(
    `^https:\\/\\/(?:www|m)\\.youtube\\.com\\/watch\\?` +
    `(?:.+\\&|)v=([a-zA-Z0-9_\\-]{11})(?:(\\&.*)|$)`
);

var format_2 = new RegExp
(
    `^https:\\/\\/youtu.be\\/([a-zA-Z0-9_\\-]{11})`
);

var format_3 = new RegExp
(
    `^https:\\/\\/www\\.(?:youtube|youtube\\-nocookie)*\\.com\\/embed\\/` +
    `([a-zA-Z0-9_\\-]{11})`
);

function get_video_id(url)
{
    if(!url || url.constructor !== String) return null;

    let arr = url.match(format_1);
    if(arr) return arr[1];

    arr = url.match(format_2);
    if(arr) return arr[1];

    arr = url.match(format_3);
    if(arr) return arr[1];

    return null;
}

var demo_created = false;

var app = new Vue
({
    el : '#app',
    data :
    {
        out  : '',
        id   : null,
        sm   : 0,
        ss   : 0,
        em   : 0,
        es   : 0,
        loop : true,
        link : ''
    },
    methods :
    {
        process_link : function(e)
        {
            if(!e.target.value.trim().length)
            {
                this.out = 'Enter a Youtube video URL';
            }
            else
            {
                this.id = get_video_id(e.target.value.trim());
                if(!this.id) this.out = 'Invalid URL';
                this.generate_link();
            }
        },
        generate_link : function(e)
        {
            if(!this.id)
            {
                this.link = '';
                return;
            }

            if(!demo_created)
            {
                demo_created = true;
                player_creator('demo', this.id, null, null, null, true);
            }

            function build_query_string(obj)
            {
                return Object.keys(obj).map
                (
                    function(k)
                    {
                        return k + '=' + obj[k];
                    }
                ).join('&');
            }

            var qr_obj = { };

            this.sm = Number(this.sm);
            this.ss = Number(this.ss);
            this.em = Number(this.em);
            this.es = Number(this.es);

            if(typeof(this.sm) === 'number' && this.sm >= 0)
                qr_obj.s = this.sm * 60;
            if(typeof(this.ss) === 'number' && this.ss >= 0)
            {
                if(qr_obj.s) qr_obj.s += this.ss;
                else         qr_obj.s = this.ss;
            }

            if(typeof(this.em) === 'number' && this.em >= 0)
                qr_obj.e = this.em * 60;
            if(typeof(this.es) === 'number' && this.es >= 0)
            {
                if(qr_obj.e) qr_obj.e += this.es;
                else         qr_obj.e = this.es;
            }

            if
            (
                typeof(qr_obj.s) === 'number' &&
                typeof(qr_obj.e) === 'number' &&
                qr_obj.e <= qr_obj.s
            )
            {
                delete qr_obj.e;
            }

            if(typeof(qr_obj.s) === 'number' && qr_obj.s < 1) delete qr_obj.s;

                this.out = 'Generated link:';
                if(this.loop) qr_obj.l = this.loop;
                this.link =
                    'http://localhost:9001/' + this.id +
                    ( build_query_string(qr_obj).length ?
                        '?' + build_query_string(qr_obj) : '');
                qr_obj = { };
        }
    }
});