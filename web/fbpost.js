
FB.init({appId: "118529111674998", status: true, cookie: true});

      function postToFeed() {

        // calling the API ...
        var obj = {
          method: 'feed',
          redirect_uri: '//www.webs.hogent.be/timvdv/index.html',
          link: 'http://webs.hogent.be/timvdv/',
          picture: 'http://www.webs.hogent.be/timvdv/fixicon.png',
          name: 'FiXity',
          caption: 'Together we fix our city!',
          description: 'Using Dialogs to interact with users.'
        };

        function callback(response) {
          document.getElementById('msg').innerHTML = "Post ID: " + response['post_id'];
        }

        FB.ui(obj, callback);
      }
	  