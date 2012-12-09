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
          },
          {
            owner: 'ron2',
            oauth_consumer_key: 'nF8RKvn6uMd8wIUXVLhvHg',
            oauth_consumer_secret: '8kvsD5QpGrljKC8YFBtfEiVWbls',
            oauth_token: 'CuQ4y866Q6iEz8XVbua922J4fgYMJgc4',
            accessor: {
              consumerSecret: '8kvsD5QpGrljKC8YFBtfEiVWbls',
				  	  tokenSecret: 'w93Pt2gGba328_OSncj8FxHkjKs'
            }
          },
          {
            owner: 'ron3',
            oauth_consumer_key: 'lXkkkeStEoJiBDi69cCpNw',
            oauth_consumer_secret: 'vPG32CCG5eHRegIlOu6L5yjBfXo',
            oauth_token: 'cz5w-nSKGkA3NDomq2S4diSqboZdwVYb',
            accessor: {
              consumerSecret: 'vPG32CCG5eHRegIlOu6L5yjBfXo',
				  	  tokenSecret: 'BJOxOKelArw6AIyJwoQ4IEdz59o'
            }
          },
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
			},
      buildBusinessUrl: {
        
      }
		};
	})
	.factory('URL_Params', function() {
    var hash = window.location.hash.split('#');
    hash = hash[hash.length-1];
    var pairs = hash.split('&');
    var parameters = {};
    for (var i = 0; i < pairs.length; i++){
      var keyValue = pairs[i].split('=');
      parameters[keyValue[0]] = keyValue[1];
    }
    console.log(parameters);
    return parameters;
  })
  .factory('SearchParse', function() {
    return {
      scrub: function(results) {
        var items = [];
        _.each(results.businesses, function(item) {
          var result = {};
          result.id = item.id;
          result.name = item.name;
          result.rating = item.rating;
          result.img_url = item.img_url;
          result.url = item.url;
          result.phone = item.phone;
          result.snippet_text = item.snippet_text;
          result.address = item.location.display_address; //array
          result.location = item.location.neighborhoods; //array
          result.categories = item.categories; //array
          items.push(result);
        });
        return items;
      }
    };
  })
  .factory('BusinessParse', function() {
    return {
        scrub: function(result) {
          var item = {};
          item.id = result.id;
          item.name = result.name;
          item.url = result.url;
          item.rating = result.rating;
          item.review_count = result.review_count;
          item.img_url = result.img_url;
          item.address = result.location.display_address; //array
          item.neighborhoods = result.location.neighborhoods; //array
          item.categories = result.categories; //array
          item.phone = result.display_phone;
          item.reviews = _.each(result.reviews, function (rv) {
            var review = {};
            review.rating = rv.rating;
            review.excerpt = rv.excerpt;
            review.user = rv.user.name;
          });
          return item;
        }
    }  
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
