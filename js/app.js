angular.module('ProjectSALL', ['SallServices', 'ngSanitize']).
	config(function($routeProvider) {
		$routeProvider.
			when('/', { controller: 'ListsController', templateUrl: 'views/lists.html' }).
      when('/search', {redirectTo: '/searchresults'}).
      when('/searchresults', { controller: 'SearchResultsController', templateUrl: 'views/searchresults.html' }).
			when('/help', { controller: 'HelpController', templateUrl: 'views/help.html' }).
			when('/details', { controller: 'DetailsController', templateUrl: 'views/details.html' }).
      when('/reset', { controller: 'ResetController', templateUrl: 'views/lists.html'}).
			otherwise({redirectTo:'/'});
	});

var SavedLists;

window.onload = function(){
  if (localStorage.lists === '"undefined"' ||
      localStorage.lists === 'undefined' ||
      _.isEmpty(JSON.parse(localStorage.lists)))
    SavedLists = [{name:'Initial List', venues: []}];    
  else
    SavedLists = JSON.parse(localStorage.lists);

};
window.onbeforeunload = function(){
  localStorage.lists = JSON.stringify(SavedLists);
};

//Mousetrap is a library that makes binding keyboard shortcuts to functions easy
Mousetrap.bind('enter', function(){
  if ($('#searchBar').is(":focus") ||
      $('#locationBar').is(":focus"))
    onSearchClicked();
    //window.location= window.location.origin + window.location.pathname + $('#searchAnchor').attr('href');
});

function onSearchClicked(){
  var query = $('#searchBar').val().split(' ').join('+');
  var location = $('#locationBar').val().split(' ').join('+');
  window.location= window.location.origin + window.location.pathname +
    '#/search#query='+ query +
    '&location='+ location;
};
