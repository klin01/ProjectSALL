angular.module('ProjectSALL', ['SallServices', 'ngSanitize']).
	config(function($routeProvider) {
		$routeProvider.
			when('/', { controller: 'ListsController', templateUrl: 'views/lists.html' }).
      when('/search', {redirectTo: '/searchresults'}).
      when('/searchresults', { controller: 'SearchResultsController', templateUrl: 'views/searchresults.html' }).
			when('/help', { controller: 'HelpController', templateUrl: 'views/help.html' }).
      when('/reset', { controller: 'ResetController', templateUrl: 'views/lists.html'}).
			otherwise({redirectTo:'/'});
	});

var SavedLists;

window.onload = function(){
  if (localStorage.lists === '"undefined"' ||
      localStorage.lists === 'undefined' ||
      _.isEmpty(JSON.parse(localStorage.lists)))
    SavedLists = [{name:'Favorites', venues: []}];    
  else
    SavedLists = JSON.parse(localStorage.lists);

  window.checkedList = [];
};
window.onbeforeunload = function(){
  localStorage.lists = JSON.stringify(SavedLists);
};

//Mousetrap is a library that makes binding keyboard shortcuts to functions easy
Mousetrap.bind('enter', function(a,b,c){
  if ($('#searchBar').is(":focus") ||
      $('#locationBar').is(":focus"))
    onSearchClicked();
    //window.location= window.location.origin + window.location.pathname + $('#searchAnchor').attr('href');
//  console.log($($(document.activeElement).context.parentNode).find('a'));
  
});

function onSearchClicked(){
  var query = $('#searchBar').val().split(' ').join('+');
  var location = $('#locationBar').val().split(' ').join('+');
  if (query === '' && location === '') {
    alert('Please enter a search term, location, or both, to search');
    return;
    
  }
  
  var origin = (_.isUndefined(window.location.origin))
    ? window.location.origin = window.location.protocol + '//' + window.location.host
    : window.location.origin;

  var newLocation = origin + window.location.pathname +
    '#/search#query='+ query +
    '&location='+ location;
  window.location = newLocation;

};

var alert = function(string){
  $('#alertBox').html(string).fadeIn(500);
  setTimeout(function(){
    $('#alertBox').html(string).fadeOut(500)
  }, 2000);
  
}
