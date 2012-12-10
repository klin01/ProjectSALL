function ListsController ($scope, YelpAPI, OAuthRequest, SearchParse, BusinessParse) {
	var test = OAuthRequest.buildSearchUrl('chinese');
	var test2 = OAuthRequest.buildBusinessUrl('new-kam-hing-coffee-shop-new-york');

	var samplesearchresults;
	YelpAPI.query({ url: encodeURIComponent(test) }, function(rsp) {
    	samplesearchresults = SearchParse.scrub(rsp);
    	console.log(samplesearchresults);
	});
	var samplebusinessresult;
	YelpAPI.query({ url: encodeURIComponent(test2) }, function(rsp) {
    	samplebusinessresult = BusinessParse.scrub(rsp);
    	console.log(samplebusinessresult);
	});
}

