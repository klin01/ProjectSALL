function ListsController ($scope, YelpAPI, OAuthRequest, SearchParse, BusinessParse) {
	var test = OAuthRequest.buildSearchUrl('chinese');
	var test2 = OAuthRequest.buildBusinessUrl('new-kam-hing-coffee-shop-new-york');

    $scope.lists = SavedLists;

    $scope.addNew = function () {
        SavedLists.push({name:$scope.addListText, venues: []});
        $scope.addListText = '';
    };
  /*
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
  */
}

function SearchResultsController($scope, YelpAPI, OAuthRequest, SearchParse, URL_Params, $location){
  //TODO - Have some sort of notifications system/display of system status
  //TODO - next/previous paging
  URL_Params = URL_Params.parse()
  $('#filters').hide();
  var queryString = URL_Params.query ? URL_Params.query : '';
  $('#searchBar').val(''); //clear the search bar
  var location = URL_Params.location ? URL_Params.location : '';
  $('#locationBar').val(''); //clear the location bar
  var limit = 20;
  var offset = URL_Params.offset ? parseInt(URL_Params.offset) : 0;
  var sort = URL_Params.sort ? URL_Params.sort : (URL_Params.location ? 1 : 0); //if a location is given, sort by location. otherwise, sort by best match
  var category_filter = URL_Params.category_filter ? URL_Params.category_filter : null;
  
  var request = OAuthRequest.buildSearchUrl(queryString, limit, offset, sort, category_filter, location);
  var categories = [];
  $('#search-loading-icon').show();
  var startTime = new Date();
	YelpAPI.query({ url: encodeURIComponent(request) }, function(yelpResponse) {
    $('#search-loading-icon').hide();
    $scope.results = SearchParse.scrub(yelpResponse);
    if ($scope.results.length === 0) $('#noResults').show();
    else $('#noResults').hide();
    _.each($scope.results, function(item){
      if (item.phone)
        item.phoneString = '('+item.phone.substring(0,3)+') ' + item.phone.substring(3,6)+'-'+item.phone.substring(6,10);
      else
        item.phoneString = ''

      var categoryDisplays = []
      _.each(item.categories, function(cat){
        if (!_.contains(_.pluck(categories, 'display'), cat.display)) categories.push(cat);
        categoryDisplays.push(cat.display);
      });
      item.categoriesString = categoryDisplays.join(', ');
      item.bookmark = function(){ //callback function to display lists
        $('#'+item.id+' .bookmark-btn').hide();
        var labels = [];
        for (var i = 0; i < SavedLists.length; i++){ //iterate through all lists and see if the venue is checked in the list
          var checked = "";
          if (SavedLists[i].venues !== undefined){
            for (var j = 0; j < SavedLists[i].venues.length; j++){
              if (SavedLists[i].venues[j].id === item.id) checked = " checked";
            }
          }
          labels.push('<label class="checkbox"><input type="checkbox"' + checked + '>'+SavedLists[i].name +'</label>');
        }
        var listsHTML = labels.join(', ');

        item.addNewList = function(){
          var newListName = $('#'+item.id+ ' .add-new-list-input').val();
          if (newListName === '')
            alert('Please provide a name for that list.');
          else if (_.contains(_.pluck(SavedLists, 'name'), newListName)){
            alert('A list already exists with that name.');
          }
          else {
            $('#'+item.id+ ' .add-new-list-input').val('');
            var comma = (labels.length > 0) ? ', ' : '';
            var newListHTML = comma+'<label class="checkbox"><input type="checkbox">'+ newListName +'</label>';
            _.each($('.lists-form'), function(listForm){ //add the list name to all visible lists of bookmarks. I was having trouble making this part dynamic with angular so I just did it manually
              $(listForm).append(newListHTML);
            });
            if (labels.length === 0){
              _.each($('.list-of-lists'), function(listToCreate){
                $(listToCreate).html(newListHTML);
              });
            }
            labels.push(newListHTML);
            SavedLists.push({name: newListName, venues:[]}); //add the list
          }
        }
        
        if (labels.length !== 0){
          listsHTML = '<br><form class="lists-form form-inline">'+listsHTML;
        }
        //TODO - maybe at a "Close/Cancel" button?
        item.save = function(){
          var count = 0;
          _.each($('#'+item.id+' .lists-form input'), function(checkbox){
            if (checkbox.checked === true){
              if (!_.contains(_.pluck(SavedLists[count].venues, 'id'), item.id)){ //see if the list has an object with an 'id' equivalent to the id of the venue
                //Item is not in the current list, so add it
                if (SavedLists[count].venues == undefined) SavedLists[count].venues = [];
                SavedLists[count].venues.push(item);
              }
            }
            else {
              SavedLists[count].venues = _.reject(SavedLists[count].venues, function(venue){ //remove the item from the list if it exists
                if (venue.id === item.id) return true; //this function is used as an iterator to test if the current venue in the saved list is the same venue as the one being removed
                else return false;
              });
            }
            count++;
          });
          $('#'+item.id+' .save-section').hide();
          $('#'+item.id+' .bookmark-btn').show(); 
        };
        $('#'+item.id+ ' .list-of-lists').html(listsHTML);
        $('#'+item.id+ ' .save-section').slideDown('fast');
        $('#'+item.id+ ' .save-btn').show();
      };
      item.bookmarksShowing = false;
      item.isBookmarked = false;
      if (item.isBookmarked) item.bookmarkButtonText = "Edit Bookmark";
      else item.bookmarkButtonText = "Bookmark This!";
      if (offset !== 0){
        $('a.previousPage').show();
        $scope.previousPage = function(){
          var newOffset = offset-20;
          if (newOffset < 0) newOffset = 0;
          window.location= window.location.origin + window.location.pathname
            + '#/search#query='+queryString
            + '&limit=' + limit
            + '&offset=' + newOffset
            + '&sort=' + sort
            + '&category_filter=' + (_.isNull(category_filter) ? '' : category_filter)
            + '&location=' + location;
            //var request = OAuthRequest.buildSearchUrl(queryString, limit, offset, sort, category_filter, location);
        };

      }
      else {
        $scope.previousPage = undefined;
        $('a.previousPage').hide();
      }
      if ($scope.results.length === limit){
        $('a.nextPage').show();
        $scope.nextPage = function(){
          var newOffset = offset+20;
          window.location= window.location.origin + window.location.pathname
            + '#/search#query='+queryString
            + '&limit=' + limit
            + '&offset=' + newOffset
            + '&sort=' + sort
            + '&category_filter=' + (_.isNull(category_filter) ? '' : category_filter)
            + '&location=' + location;
            //var request = OAuthRequest.buildSearchUrl(queryString, limit, offset, sort, category_filter, location);
        };
      }
      else {
        $scope.nextPage = undefined;
        $('a.nextPage').hide();
      }
      $scope.categories = _(categories).sortBy(function(cat){
        return cat.display;
      });
      window.filterSearch = function(){
        console.log('filter search');
        var updatedCategories = [];
        var selectedCategory = ''
        _.each(categories, function(cat){
          if (cat.display === $('#filterPicker').val())
            selectedCategory = cat.type;
        });
        
        window.location= window.location.origin + window.location.pathname
          + '#/search#query='+queryString
          + '&limit=' + limit
          + '&offset=' + offset
          + '&sort=' + sort
          + '&category_filter=' + selectedCategory
          + '&location=' + location;
      }

      $('#filters').show();
      var description = 'Request for <strong>"' + queryString.split('+').join(' ') + '"</strong>';
      if (parseInt(location) + '' === location) description += ' in <em>Zip code ' + location + '</em>';
      else if (location.length > 0) description += ' in <em>' + location.split('+').join(' ') + '</em>';
      if (!_.isNull(category_filter) && category_filter.length > 0) description += ' in the category ';
      _.each(categories, function(cat){
        if (cat.type === category_filter) description += '<em>'+cat.display+'</em>';
      });
      var totalTime = (new Date() - startTime)/1000;
      description += ' took ' + totalTime + ' seconds.';
      $('#description').html(description);
  
    });//end query
	});
}

function ResetController(){
  SavedLists = [];
}
