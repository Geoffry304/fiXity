var
  info   = document.getElementById('info'),
  update = function(response) {
    if (response.status != 'connected') {
      info.innerHTML = '<em>You must login using the controls at the top.</em>';
      return;
    }

    FB.api(
      {
        method: 'fql.query',
        query: 'SELECT name, pic_square FROM user WHERE uid=' + response.authResponse.userID
      },
      function(response) {
        info.innerHTML = (
          '<img src="' + response[0].pic_square + '"> ' +
          response[0].name
        );
      }
    );
  };


FB.Event.subscribe('auth.login', update);
FB.Event.subscribe('auth.logout', update);
FB.getLoginStatus(update);
