//post-redirect
{
    let URLinfo = new URLSearchParams(location.search);
    if ( URLinfo.has('v') ) {
        /*
        //second-redirect
        let target = URLinfo.get('r');
        let posts = document.nowPost.posts;
        let len = posts.length;
        for ( let i=0;i < len;i++ ) {
            if ( posts[i].href.includes(target) ) {
                //location.search = "?v=import-" + i;
                location.search = "?v="
            }
        }
        */
    } else {
        //first-redirect
        let date = location.href.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}-[0-9]{2}-[0-9]{2}-[0-9]{2}/g);
        if ( date ) {
            date = date[0];
            window.history.replaceState(null, null, "../?v=" + date);
            location.reload();
            //location.href += "../?v=" + date;
        }
    }
}