angular.module('SallServices', ['ngResource']).
	factory('YelpAPI', function($resource) {
		return $resource('proxy.php?url=:url&term=:term&location=:location'
							+ "&oauth_consumer_key=:oauth_consumer_key"
							+ "&oauth_consumer_secret=:oauth_consumer_secret"
							+ "&oauth_nonce=:oauth_nonce"
							+ "&oauth_signature_method=:oauth_signature_method"
							+ "&oauth_timestamp=:oauth_timestamp"
							+ "&oauth_token=:oauth_token"
							+ "&oauth_signature=:oauth_signature", {}, {
			query: {method: 'GET', params: {}, isArray: false}
		});
	})
	.factory('OAuthRequest', function() {
		return {
			buildSearchUrl: function(term, limit, offset, sort, category_filter) {
				parameters = [];
				if (term != null)
					parameters.push(['term', term]);
				if (limit != null)
					parameters.push(['limit', limit]);
				if (offset != null)
					parameters.push(['offset', offset]);
				if (sort != null)
					parameters.push(['sort', sort]);
				if (category_filter != null)
					parameters.push(['category_filter', category_filter]);
				parameters.push(['location', 'New+York']);
				//parameters.push(['callback', 'cb']);

        var credentials_list = [
          {
            owner: 'kevin',
            oauth_consumer_key: 'UZL6qwkoVqDIByHuz4WF7g',
            oauth_consumer_secret: 'WEmWod-6fiDU0sR8o5_J8THvv1A',
            oauth_token: 'Vj32b4Ga1f0oHEj8KF5_KUEwzuGvrGhX',
            accessor: {
              consumerSecret: 'WEmWod-6fiDU0sR8o5_J8THvv1A',
				  	  tokenSecret: 'mA6XVBI_uaApfrJ2vbU1c3FyuFg'
            }
          },
          {
            owner: 'ron',
            oauth_consumer_key: 'KdILwA5w8bjV8NTx47HkJA',
            oauth_consumer_secret: 'nhFInOMyjm95pK9iyKy92drlaQc',
            oauth_token: '7dMxuTAzgUVczcnpBdkOpJV4nEt2hLAu',
            accessor: {
              consumerSecret: 'nhFInOMyjm95pK9iyKy92drlaQc',
				  	  tokenSecret: 'Jok4V3Day9Z3Y6VYLh6dMcJTdpU'
            }
          }
        ];
        var randomIndex = Math.floor(Math.random()*credentials_list.length);
        var credentials = credentials_list[randomIndex];
        parameters.push(['oauth_consumer_key', credentials.oauth_consumer_key]);
				parameters.push(['oauth_consumer_secret', credentials.oauth_consumer_secret]);
				parameters.push(['oauth_token', credentials.oauth_token]);
				parameters.push(['oauth_signature_method', 'HMAC-SHA1']);

				var message = { 
				  	'action': 'http://api.yelp.com/v2/search',
				  	'method': 'GET',
				  	'parameters': parameters 
				};

				OAuth.setTimestampAndNonce(message);
				OAuth.SignatureMethod.sign(message, credentials.accessor);

				var parameterMap = OAuth.getParameterMap(message.parameters);
				//parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature);

				return message.action + '?' + OAuth.SignatureMethod.normalizeParameters(message.parameters) 
					+ "&oauth_signature=" + OAuth.percentEncode(parameterMap.oauth_signature);
				//return parameterMap;
			}
		};
	});

var auth = { 
  //
  // Update with your auth tokens
  //
  consumerKey: "UZL6qwkoVqDIByHuz4WF7g",
  consumerSecret: "WEmWod-6fiDU0sR8o5_J8THvv1A",
  accessToken: "Vj32b4Ga1f0oHEj8KF5_KUEwzuGvrGhX",
  // This example is a proof of concept, for how to use the Yelp v2 API with javascript.
  // You wouldn't actually want to expose your access token secret like this in a real application.
  accessTokenSecret: "mA6XVBI_uaApfrJ2vbU1c3FyuFg",
  serviceProvider: { 
    signatureMethod: "HMAC-SHA1"
  }
};
