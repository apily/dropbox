var request = require('request');
var querystring = require('querystring');

var dropbox = exports;

var errors = {
  missing_parameter: {
    status: '100',
    message: 'missing parameter'
  }
};

var href = '/api-oauth/dropbox/oauth';
href += '?request_token_url=https://api.dropbox.com/1/oauth/request_token';
href += '&access_token_url=https://api.dropbox.com/1/oauth/access_token';
href += '&authorize_url=https://www.dropbox.com/1/oauth/authorize';
href += '&oauth_version=1.0';
href += '&signature_method=HMAC-SHA1';
// href += '&client_callback_url=/api-oauth/end'; // which is default
href += '&client_callback_url=/';

dropbox.auth = function (options, callback) {
  if (typeof options === 'function') {
    callback = options;
  }

  request
    .get('/api-oauth/dropbox/authorized')
    .end(function (res) {
      var data = res.body || res.text;

      if (res.ok) {
        callback(null, data);
        return;
      }
      if (res.status === 403) {
        window.location = href;
        return;
      }

      // any other status
      err.data = data;
      err.status = res.status;
      callback(err, null);
      return;
    });
};

dropbox.is_authorized = function (options, callback) {
  if (typeof options === 'function') {
    callback = options;
  }

  request
    .get('/api-oauth/dropbox/is_authorized')
    .end(function (res) {
      var data = res.body || res.text;

      if (res.ok) {
        callback(null, data);
        return;
      } else {
        err.data = data;
        err.status = res.status;
        callback(err, null);
      }
    });
};

dropbox.account = {};

dropbox.account.info = function (options, callback) {
  var query_params = {};
  var options = options || {};
  var url = 'https://api.dropbox.com/1/account/info?';

  //optional params
  if (options.locale !== undefined) {
    query_params.locale = options.locale;
  }

  url += querystring.stringify(query_params);

  request
    .get('/api-oauth/dropbox/group/account/endpoint/info')
    .query({
      url: url
    })
    .end(function (res) {
      var data = res.body || res.text;
      var err = {};

      if (res.ok) {
        callback(null, data);
        return;
      }
      if (res.status === 403) {
        window.location = href;
        return;
      }

      // any other status
      err.data = data;
      err.status = res.status;
      callback(err, null);
      return;
    });
};

dropbox.files = {};

dropbox.files.metadata = function (options, callback) {
  var url_params = {};
  var query_params = {};
  var options = options || {};
  var url = 'https://api.dropbox.com/1/metadata/';

  // mandatory params
  if (options.root !== undefined) {
    url_params.root = options.root;
  } else {
    callback({
      status: errors.missing_parameter.status,
      message: errors.missing_parameter.message
    });
    return;
  }

  if (options.path !== undefined) {
    url_params.path = options.path;
  } else {
    callback({
      status: errors.missing_parameter.status,
      message: errors.missing_parameter.message
    });
    return;
  }

  // defaulted params
  if (options.file_limit !== undefined) {
    query_params.file_limit = options.file_limit;
  } else {
    query_params.file_limit = 10000;
  }

  if (options.list !== undefined) {
    query_params.list = options.list;
  } else {
    query_params.list = true;
  }

  if (options.include_deleted !== undefined) {
    query_params.include_deleted = options.include_deleted;
  } else {
    query_params.include_deleted = false;
  }

  // optional params
  if (options.hash !== undefined) {
    query_params.hash = options.hash;
  }

  if (options.rev !== undefined) {
    query_params.rev = options.rev;
  }

  if (options.locale !== undefined) {
    query_params.locale = options.locale;
  }

  url += url_params.root + '/' + url_params.path + '?';
  url += querystring.stringify(query_params);

  request
    .get('/api-oauth/dropbox/group/files/endpoint/metadata')
    .query({url: url})
    .end(function (res) {
      var data = res.body || res.text;
      var err = {};

      if (res.ok) {
        callback(null, data);
        return;
      }
      if (res.status === 403) {
        window.location = href;
        return;
      }

      // any other status
      err.data = data;
      err.status = res.status;
      callback(err, null);
      return;
    });
};
