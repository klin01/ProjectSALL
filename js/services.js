angular.module('SallServices', ['ngResource']).
	factory('YelpAPI', function($resource) {
		return $resource('http://localhost/UIDAssignment1/proxy.php?url=:url', {}, {
			query: {method: 'GET', params: {}, isArray: false}
		});
	})
	.factory('OAuthRequest', function() {
		return {
			buildSearchUrl: function(term, limit, offset, sort, category_filter) {
				var accessor = {
				  	consumerSecret: 'WEmWod-6fiDU0sR8o5_J8THvv1A',
				  	tokenSecret: 'mA6XVBI_uaApfrJ2vbU1c3FyuFg'
				};

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
				//parameters.push(['callback', 'cb']);
				parameters.push(['oauth_consumer_key', 'UZL6qwkoVqDIByHuz4WF7g']);
				parameters.push(['oauth_consumer_secret', 'WEmWod-6fiDU0sR8o5_J8THvv1A']);
				parameters.push(['oauth_token', 'Vj32b4Ga1f0oHEj8KF5_KUEwzuGvrGhX']);
				parameters.push(['oauth_signature_method', 'HMAC-SHA1']);

				var message = { 
				  	'action': 'http://api.yelp.com/v2/search',
				  	'method': 'GET',
				  	'parameters': parameters 
				};

				OAuth.setTimestampAndNonce(message);
				OAuth.SignatureMethod.sign(message, accessor);

				return message.action + '?' + OAuth.SignatureMethod.normalizeParameters(message.parameters);
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