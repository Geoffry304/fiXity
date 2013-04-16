  window.fbAsyncInit = function() {
    FB.init({
      appId      : '118529111674998', // App ID
      channelUrl : '//www.webs.hogent.be/timvdv/index.html', // Channel File
      status     : true, // check login status
      cookie     : true, // enable cookies to allow the server to access the session
      xfbml      : true  // parse XFBML
    });

FB.getLoginStatus(function(response) {
    if (response.status === 'connected') {
        window.location.href = "#page"
    } else if (response.status === 'not_authorized') {
        // not_authorized
        login();
    } else {
        // not_logged_in

    }
});
};

  // Load the SDK Asynchronously
  (function(d){
     var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement('script'); js.id = id; js.async = true;
     js.src = "//connect.facebook.net/en_US/all.js";
     ref.parentNode.insertBefore(js, ref);
   }(document));
   
   function login() {
    FB.login(function(response) {
        if (response.authResponse) {
            // connected
			window.location.href = "#pageTut1"
        } else {
            // cancelled
        }
    });
}