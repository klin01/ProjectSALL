var credentials_list = [
  /*
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
  */
  {
    owner: 'ron4',
    oauth_consumer_key: 'YA4mXxU3RxhIUyGgUpkYFA',
    oauth_consumer_secret: 'OuNaoY0JwZhwh8L65YoEx2BoVrw',
    oauth_token: 'fFQ9TujyU1vODZT10_G3Y3O6s4H3y2N1',
    accessor: {
      consumerSecret: 'OuNaoY0JwZhwh8L65YoEx2BoVrw',
			tokenSecret: 'wyt6tZPpbH0KdqeCLnQXdQ86iE0'
    }
  },
  {
    owner: 'ron5',
    oauth_consumer_key: '2iydcvkp-hbGbYnY-KDCuw',
    oauth_consumer_secret: 'eSLWfrwPg5Iwz858xep4TAYpC94',
    oauth_token: 'v3OOKWa4m3hX9EpNsUa1lbPv_XJtZHeZ',
    accessor: {
      consumerSecret: 'eSLWfrwPg5Iwz858xep4TAYpC94',
			tokenSecret: 'FOXGKLiy_3mUaJGoMnHhe5EfJTA'
    }
  },
    {
      owner: 'john',
      oauth_consumer_key: 'f7zEDdYZSwuf2cBE0DXGrw',
      oauth_consumer_secret: 'kDmTrs8AkDmC6ZRHmL6YMLaKI5c',
      oauth_token: 'apllBIdzs-aQaSf1m_gN2veZLoY08kTs',
      accessor: {
        consumerSecret: 'kDmTrs8AkDmC6ZRHmL6YMLaKI5c',
        tokenSecret: 'yc-sTQAoy9-av2G4A3Ba08Cfwqw'
      }
   },
    {
      owner: 'john2',
      oauth_consumer_key: 'wN21V6sIwsI8deqsHEqnyg',
      oauth_consumer_secret: 'igASb-zV3Jfngpw9KDo35oM02Us',
      oauth_token: 'Sk6FHStAavgnBe3-sPQYv1C4TeaX_jrL',
      accessor: {
        consumerSecret: 'igASb-zV3Jfngpw9KDo35oM02Us',
        tokenSecret: '2cAZxcbvbLEvbwPq60YhsfZ_Iws'
      }
   }
];

angular.module('SallServices', ['ngResource']).
	factory('YelpAPI', function($resource) {
		return $resource('proxy.php?url=:url', {}, {
			query: {method: 'GET', params: {}, isArray: false}
		});
	})
	.factory('OAuthRequest', function() {
		return {
			buildSearchUrl: function(term, limit, offset, sort, category_filter, location) {
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
        location = location ? location : 'New+York'; //if location isn't set, default to New+York
				parameters.push(['location', location]);
				//parameters.push(['callback', 'cb']);

        
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
				parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature);

				return message.action + '?' + OAuth.SignatureMethod.normalizeParameters(message.parameters) 
					+ "&oauth_signature=" + parameterMap.oauth_signature;
			},
      buildBusinessUrl: function(id) {
        parameters = [];
        if (id == null)
          return null;
        
        var randomIndex = Math.floor(Math.random()*credentials_list.length);
        var credentials = credentials_list[randomIndex];
        parameters.push(['oauth_consumer_key', credentials.oauth_consumer_key]);
        parameters.push(['oauth_consumer_secret', credentials.oauth_consumer_secret]);
        parameters.push(['oauth_token', credentials.oauth_token]);
        parameters.push(['oauth_signature_method', 'HMAC-SHA1']);

        var message = { 
            'action': 'http://api.yelp.com/v2/business/' + id,
            'method': 'GET',
            'parameters': parameters 
        };

        OAuth.setTimestampAndNonce(message);
        OAuth.SignatureMethod.sign(message, credentials.accessor);

        var parameterMap = OAuth.getParameterMap(message.parameters);
        parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature);

        return message.action + '?' + OAuth.SignatureMethod.normalizeParameters(message.parameters) 
          + "&oauth_signature=" + parameterMap.oauth_signature;
      }
		};
	})
	.factory('URL_Params', function() {
    return {
      parse: function(){
        var hash = window.location.hash.split('#');
        hash = hash[hash.length-1];
        var pairs = hash.split('&');
        var parameters = {};
        for (var i = 0; i < pairs.length; i++){
          var keyValue = pairs[i].split('=');
          parameters[keyValue[0]] = keyValue[1];
        }
        return parameters;
      }
    }
  })
  .factory('SearchParse', function() {
    return {
      scrub: function(results) {
        if (!_.isUndefined(results.error)) alert('Yelp Error: ' + results.error.text);
        var items = [];
        _.each(results.businesses, function(item) {
          var result = {};
          result.id = item.id;
          result.name = item.name;
          result.rating = item.rating;
          result.image_url = item.image_url;
          result.ratingString = "";
          var star = '&#9733;';
          var emptyStar = '&#9734;';
          for (var i = 0; i < item.rating; i++){
            result.ratingString += star;
          }
          while (result.ratingString.length < 5*star.length){
            result.ratingString += emptyStar;
          }
          result.url = item.url;
          result.phone = item.phone;
          result.snippet_text = item.snippet_text;
          result.address = "";
          for (var i = 0; i < item.location.display_address.length-2; i++){
            result.address += item.location.display_address[i] + " ";
          }
          result.address += '<br>' + item.location.display_address[
            item.location.display_address.length-2] + ", " +
            item.location.display_address[item.location.display_address.length-1];
          
          result.location = item.location.neighborhoods; //array
          result.categories = [];
          _.each(item.categories, function(cat){
            result.categories.push({'display':cat[0], 'type':cat[1]});
          });
          items.push(result);
        });
        return items;
      }
    };
  })
  .factory('BusinessParse', function() {
    return {
        scrub: function(result) {
          if (!_.isUndefined(results.error)) alert('Yelp Error: ' + results.error.text);
          var item = {};
          item.id = result.id;
          item.name = result.name;
          item.url = result.url;
          item.rating = result.rating;
          item.review_count = result.review_count;
          item.image_url = result.image_url;
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
