angular.module('ProjectSALL', ['SallServices']).
	config(function($routeProvider) {
		$routeProvider.
			when('/', { controller: 'ListsController', templateUrl: 'views/lists.html' }).
			when('/searchresults', { controller: 'SearchResultsController', templateUrl: 'views/searchresults.html' }).
			when('/help', { controller: 'HelpController', templateUrl: 'views/help.html' }).
			when('/details', { controller: 'DetailsController', templateUrl: 'views/details.html' }).
			otherwise({redirectTo:'/'});
	});

var SavedLists;

window.onload = function(){
  if (localStorage.lists !== 'undefined')
    SavedLists = JSON.parse(localStorage.lists);
};
window.onbeforeunload = function(){
  localStorage.lists = JSON.stringify(SavedLists);
};
