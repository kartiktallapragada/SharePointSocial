//global variables
var web=null;
var totaltaskRows="new";
var unreadNewsfeedCount=0;
var followedSiteCount = 0;
var blogcount = 0;
var currentUser=0;
var username;
var siteURL = "/";
var $j = jQuery.noConflict();

//get current userID
function getWebUserData(){
context = new SP.ClientContext.get_current();
web = context.get_web();
currentUser = web.get_currentUser();
context.load(currentUser);
context.executeQueryAsync(Function.createDelegate(this, this.userQuerySucceeded), Function.createDelegate(this, this.userQueryFailed));
}

//get the active task count from search scope
function getTaskCount() {
    var url = "http://collaboration.com/_api/search/query?querytext=%27task%27&sourceid=%27yourscopeguid%27&source=";
    var hosturl = location.protocol + '//' + location.host;
    var finalurl = url + hosturl;
      $j.support.cors = true;//support for cors preflight
        $j.ajax({
            url: url + hosturl,
            async: false,
            type: "GET",
            crossDomain: true,
            xhrFields: { withCredentials: true },
            headers: { "Accept": "application/json; odata=verbose" },
            contentType: "application/json; odata=verbose"
        }).done(function (data, textStatus) {
            totaltaskRows = data.d.query.PrimaryQueryResult.RelevantResults.TotalRows;
            $j('#Suitebar_Tasks').prepend('<a data-notifications=' + totaltaskRows + ' href="#"></a>');

        }).error(function (xhr, status, error) {
            console.log(xhr, status, error);
        });
   
 }
//Gets the external news scroll, you can add any rss feed url here. 
function getNews() {
	$j('.feed').breakingNews({
  url: 'http://rss.cnn.com/rss/cnn_topstories.rss',
  feedSize: {
    height: '20px',
    width: '500px'
  },
  numberToShow: 10,
  refresh: 2000,
  effect: 'tricker',
  effectDuration: 50,
  onComplete: function() {
	$j(this).prepend('<div class="feed-title-3">CNN News</div>');
    $j(this).prepend('<div class="feed-title">');
    //$j('.feed-title').html(arguments[0].responseData.feed.title);
  }
});
}
// Get the newsfeed count of the current user for the last 5 days
function getNewsfeedCount(){

var todaysDate = new Date();
var minfivedays = (todaysDate.getMonth() + '/' +(todaysDate.getDate() - 5) + '/' +  todaysDate.getFullYear());
    var url = "http://www.collaboration.com/_api/social.feed/my/timelinefeed(MaxThreadCount=10,NewerThan=@v)?@v='"+minfivedays+"'";
	var hosturl = location.protocol + '//' + location.host;
	    jQuery.support.cors=true;
    jQuery.ajax({
        url: url+"&source="+hosturl,
		async: false,
		crossDomain:true,
		method: "GET",
        dataType: 'json',
        xhrFields: {withCredentials:true},
		headers:{ "Accept": "application/json; odata=verbose" },
        contentType: "application/json; odata=verbose" 
         }).done(function(data, textStatus){
           unreadNewsfeedCount =  data.d.SocialFeed.Threads.results.length;
         	 
  }).fail(function(){
     //console.log("failed");
  });

}
 //Gets the count of all the blogs published within the farm
 function getBlogCount(){

var hosturl = location.protocol + '//' + location.host;
    var url = "http://www.collaboration.com/_api/search/query?querytext=%27*%27&sourceid=%27Your Scope GUID here%27";
	jQuery.support.cors=true;
    jQuery.ajax({
        url: url+"&source="+hosturl,
		async: false,
        method: "GET",
		crossDomain:true,
		xhrFields: {withCredentials:true},
        headers: { "Accept": "application/json; odata=verbose" },
		contentType: "application/json; odata=verbose" 
		}).done(function(data, textStatus){
           blogcount = data.d.query.PrimaryQueryResult.RelevantResults.TotalRows;
		}).fail(function(){
     //console.log("failed");
  });

}
 // Gets the count of all the sites the user is following
 function getfollowedSiteCount(){
//console.log("1");
var hosturl = location.protocol + '//' + location.host;
    var url = "http://www.collaboration.com/_api/social.following/my/FollowedCount(types=4)";
	jQuery.support.cors=true;
    jQuery.ajax({
        url: url+"?source="+hosturl,
		async: false,
        method: "GET",
		crossDomain:true,
		xhrFields: {withCredentials:true},
        headers: { "Accept": "application/json; odata=verbose" },
        contentType: "application/json; odata=verbose" 
		}).done(function(data, textStatus){
		followedSiteCount =  data.d.FollowedCount;
        }).fail(function(){
     //console.log("failed");
  });

}
//main call function which will add the suitebar html to you website. you might have to modify the html if you intent to add it to a non-sharepoint website. 
 function userQuerySucceeded(sender, args) {
    this.username = currentUser.get_loginName();
	var accntName = this.username;
	var domain = "ADD YOUR DOMAIN HERE";
	var dot = ".";
	var underscore = "_";
	accntName = accntName.replace(/^(.*[\\\/])/, '','');
	accntName = accntName.replace(/\./g,underscore);
    var $s = jQuery.noConflict();
    var linkString = ' <ul class=".SuiteBar-TabRowRightMainSpan" unselectable = "on" role="tablist"> \
                               <li class="SuiteBar-TabRowRightLinks" unselectable = "on" role="tablist"> \
                                <a class="SuiteBar-TabRowRightLinks-a" href="http://mysite.com/personal/'+accntName+'/Highlights.aspx?showTaskTab=1"> <span class="SuiteBar-TabRowRightSpan" id="Suitebar_Tasks" unselectable = "on">Tasks</span> </a> \
                              </li> \
                              <li class="SuiteBar-TabRowRightLinks" unselectable = "on" role="tablist"> \
                                <a class="SuiteBar-TabRowRightLinks-a" href="http://mysite.com/SitePages/KBHome.aspx"> <span class="SuiteBar-TabRowRightSpan" id="Suitebar_KB" unselectable = "on">Knowledge Base</span> </a> \
                              </li> \
							  <li class="SuiteBar-TabRowRightLinks" unselectable = "on" role="tablist"> \
                                <a class="SuiteBar-TabRowRightLinks-a" href="http://mysite.com/CSLPages/Blogs.aspx"> <span class="SuiteBar-TabRowRightSpan" id="Suitebar_Blogs" unselectable = "on">Blogs</span> </a> \
                              </li> \
							  <li class="SuiteBar-TabRowRightLinks" unselectable = "on" role="tablist"> \
                               <a class="SuiteBar-TabRowRightLinks-a" href="http://mysite.com/"> <span class="SuiteBar-TabRowRightSpan" id="Suitebar_Communities" unselectable = "on">Ideas</span> </a> \
                             </li> \
							  <li class="SuiteBar-TabRowRightLinks" unselectable = "on" role="tablist"> \
                                <a class="SuiteBar-TabRowRightLinks-a" href="http://mysite.com/default.aspx"> <span class="SuiteBar-TabRowRightSpan" id="Suitebar_Newsfeed" unselectable = "on">Company Feed</span> </a> \
                              </li> \
							  <li class="SuiteBar-TabRowRightLinks" unselectable = "on" role="tablist"> \
                                <a class="SuiteBar-TabRowRightLinks-a" href="http://mysite.com/personal/'+accntName+'/Documents/Forms/All.aspx"> <span class="SuiteBar-TabRowRightSpan" id="Suitebar_OneDrive" unselectable = "on">One Drive</span> </a> \
                              </li> \
							  <li class="SuiteBar-TabRowRightLinks" unselectable = "on" role="tablist"> \
                                <a class="SuiteBar-TabRowRightLinks-a" href="http://mysite.com/personal/'+accntName+'/Social/Sites.aspx"> <span class="SuiteBar-TabRowRightSpan" id="Suitebar_Sites" unselectable = "on">Sites</span> </a> \
                              </li> </ul> ';

     $s('<div id="SuiteBar-TabRowRights" class="SuiteBar-TabRowRights"> </div>').prependTo('body');
	 
	$s('#SuiteBar-TabRowRights').append('<div id="suiteBarLeft"> </div>');
	$s('#suiteBarLeft').append('<div class="feed"></div>');
    $s('#suiteBarLeft').prepend(linkString);
	

	//this allows users to interact with the newsfeed page right from the www.intranet.com page without having to go to the mySite web Application. 
	$s('#Suitebar_Newsfeed').on('click', function (e) {
        e.preventDefault();
		var options = {
	    title: "MyNewsFeed",
		width: 800,
		height:400,
		resizable: 1,
		scroll:1,
		url: "http://www.collaboration.com/Pages/Newsfeedpage.aspx"};//This is the newsfeed page with allow framing=true.
        SP.UI.ModalDialog.showModalDialog(options);
       return false;
	 });
   getTaskCount();
   getNews();
   getNewsfeedCount();
   getfollowedSiteCount();
   getBlogCount();

$s('#Suitebar_Newsfeed').prepend('<a data-notifications='+unreadNewsfeedCount+' href="#"></a>');
$s('#Suitebar_Blogs').prepend('<a data-notifications='+blogcount+' href="#"></a>');
$s('#Suitebar_Sites').prepend('<a data-notifications='+followedSiteCount+' href="#"></a>');

}

function userQueryFailed(sender, args) {
    alert('request failed ' + args.get_message() + '\n' + args.get_stackTrace());
}
//Needed for sharepoint webapplications, if non sharepoint web site just call the getWebUserData function
ExecuteOrDelayUntilScriptLoaded(getWebUserData, "sp.js");


