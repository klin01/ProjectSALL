function ListsController ($scope, YelpAPI, OAuthRequest) {
	var test = OAuthRequest.buildSearchUrl('chinese');
	var test2;
	YelpAPI.query({ url: encodeURIComponent(test) }, function(rsp) {
		test2 = rsp;
    console.log(rsp);
	});
}
