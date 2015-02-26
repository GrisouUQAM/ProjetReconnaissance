/* 
 * Tout droits réservés à Grisou!
 *
 * Copyright VOGG 2013
 * Revision Fev 2014 AP et AS
 */

var wikiUrlApiPath, wiki, analysisTable, url, user, activeAjaxConnections = 0,
tabSelected = "Articles", articleLoadEvent = false;
var dataController = Grisou.WikiController;
var needNewRevisions = false;
var advancedSearchValues;

var revisions = new Array();

//Adding functionnality to Array object
Array.prototype.clear = function clearArray(){
	while(this.length > 0){
		this.pop();
	}
}

Array.prototype.last = function returnLastItem(){
	return this.slice(-1)[0];
}


function clearScreen() {
  if(tabSelected === "Articles"){
    $("#articles").html("");
    $("#titre").html("");
  }else if(tabSelected === "Talks"){
    $("#talks").html("");
  }
}

function stopLoading() {
  $("#article_loading").attr("src", "");
  $("#article_loading").hide();
}

function doNext(elem, curIndex) {
  $(elem.children()[curIndex++]).animate({
    top: "0%"
  }, 100, function () {
    doNext(elem, curIndex);
  });
}

function loading() {
  var img = $("<img />");
  img.attr("src", "images/465.gif");
  img.attr("alt", "Loading");
  img.appendTo("#article_loading");
}

//Function that display revisions data
function callback_Q1(data) {
	
  var totalVal = 0, html_list_articles = "";
  var lastItem = $(".last_item .list_articles_item_pageid").val();
  $(".list_articles_item").removeClass("last_item");
  if(lastItem){
    totalVal = parseInt($("#total_score_contr").text());
    html_list_articles = $("#articles").html();
  }else{
    $("#titre").html('Articles which ' + user + ' contributed to with total score: <span id="total_score_contr"></span>');
  }

  for (var i = 0; i < data.length; ++i) {
      if(i === data.length - 1)
        html_list_articles += '<div class="list_articles_item last_item" onclick="getArticle(this);">';
      else
        html_list_articles += '<div class="list_articles_item" onclick="getArticle(this);">';

        html_list_articles += '<div class="list_articles_item_title">' + data[i].title + '</div>' +
                              '<span class="list_articles_item_surv"></span>' +
                              '<div class="list_articles_item_size">Size: ' + data[i].size + '</div>';
      if (data[i].sizediff < 0) {
        html_list_articles += '<div class="list_articles_item_size_diff">Size diff: <span class="sizediff_neg">' + Math.abs(data[i].sizediff) + '</span></div>';
      } else {
        html_list_articles += '<div class="list_articles_item_size_diff">Size diff: ' + data[i].sizediff + '</div>';
      }
      html_list_articles += '<span class="list_articles_item_time">' + data[i].timestamp + '</span>';
      html_list_articles += '<input class="list_articles_item_pageid" type="hidden" value="' + data[i].pageid + '"/>' +
        '<input class="list_articles_item_revid" type="hidden" value="' + data[i].revid + '"/>' +
        '<input class="list_articles_item_parentid" type="hidden" value="' + data[i].parentid + '"/></div>';
      totalVal += Math.abs(data[i].sizediff);      
      revisions.push(data[i]);
  }
  $("#total_score_contr").text(totalVal);
  stopLoading();
  $("#articles").html(html_list_articles)
  doNext($("#articles"), 0);
  needNewRevisions = false;
}

//Function that display Talks
function callback_Q2(response) {
	
  //var usercontribs = response.query.usercontribs;
  var html_list_talks = "";
  if (response.length > 0) {
    
    var i;
    for (i = 0; i < response.length; ++i) {
      html_list_talks += '<div class="list_talks_item">' +
                       '<div class="list_talks_item_title">' + response[i].title + '</div>' +
                       '<div class="list_talks_item_comment">' + response[i].comment + '</div></div>';
    }
  }
  stopLoading();
  $("#talks").html(html_list_talks);
  doNext($("#talks"), 0);
}

//Function that fetch more data from user revisions 
function getNextUserContributions(){
    if(needNewRevisions){
	return;
    }
    needNewRevisions = true;
    var uclimitContribution = getUclimitCourrent();

  var lastRev = revisions.last();
  dataController.getRevisions(user, uclimitContribution, lastRev.uccontinue, advancedSearchValues, callback_Q1);
}

//Function called to initiate new query
function getJsonWiki() {
  clearScreen();
  revisions.clear();
  articlesLoaded = talksLoaded = false;
  var uclimitContribution = getUclimitCourrent();
  
  if ($.trim($("#user").val()).length === 0) {
    $("#user").css({
      "background-color": "#FFDBDB"
    });
    $("#user").focus();
    return;
  }
  if ($.trim($("#url").val()).length === 0) {
    $("#url").css({
      "background-color": "#FFDBDB"
    });
    $("#url").focus();
    return;
  }
  
  loading();
  
  user = $("#user").val();
  url = $('#url').val();
  dataController.setApiUrlPath(url);
  
  var dateFrom = null, dateTo = null, minorEdit = false;
  //Read advanced search parameters
  if ($("#advanced_search_elems_container").hasClass("visible_advance")) {
    if ($("#datepicker_from").val().length > 0) {
      dateFrom = $("#datepicker_from").datepicker('getDate');
      dateFrom.setUTCHours(0);
    }

    if ($("#datepicker_to").val().length > 0) {
      dateTo = $("#datepicker_to").datepicker('getDate');
      dateTo.setUTCHours(0);
    }

    if ($('#minorEdit').is(":checked")) {
      minorEdit = true;
    }

    advancedSearchValues = { 
		dateTo : dateTo, 
		dateFrom : dateFrom, 
		hideMinorEdits : minorEdit
		}; 
  } 

  //Get and show data
  if(tabSelected === "Articles") {
	dataController.getRevisions(user, uclimitContribution, null, advancedSearchValues, callback_Q1);
  }else if(tabSelected === "Talks"){
	dataController.getTalks(user, callback_Q2);
  }
}

function getUclimitCourrent(){
  return Math.ceil(($("#articles").height() / 70));
}

$(document).ready(function () {
  $(document).tooltip();
  $("button").button();
  $("#datepicker_from").datepicker({changeMonth: true, changeYear: true}).datepicker("option", "dateFormat", "yy-mm-dd");
  $("#datepicker_to").datepicker({changeMonth: true, changeYear: true}).datepicker("option", "dateFormat", "yy-mm-dd");

  $('#url').bind('keypress', function (e) {
    var code = e.keyCode || e.which;
    if (code === 13) {
      getJsonWiki();
    } else {
      $("#url").css({
        "background-color": "#EBF3FF"
      });
    }
  });

  $('#user').bind('keypress', function (e) {
    var code = e.keyCode || e.which;
    if (code === 13) {
      getJsonWiki();
    } else {
      $("#user").css({
        "background-color": "#EBF3FF"
      });
    }
  });

  $('#tabs').tabs({
    activate: function (event, ui) {
      if (ui.newTab.context.text === "Articles") {
        tabSelected = "Articles";
        $("#tab_article").animate({ left: "0%" }, 400);
        setTimeout(function () {
          $("#tab").css({'z-index': '1'});
        }, 400);
        $("#tabs").removeClass("tabs_expand");
	getJsonWiki();
      } else {
        tabSelected = "Talks";
        $("#tab_article").css({'z-index': '-1'});
        $("#tab_article").animate({ left: "-100%", }, 400);
        $("#tabs").addClass("tabs_expand");
	getJsonWiki();
      }
    }
  });
  
  $('#tab_article').tabs();
  
  $("#articles").scroll(function(event){
    var elem = $(this);
    if (elem[0].scrollHeight - elem.scrollTop() - 100 < elem.outerHeight()){
      getNextUserContributions();
    }
  });

  $("#btn_advanced_search").click(function () {
    if ($("#advanced_search_elems_container").hasClass("hidden_advance")) {
      $("#advanced_search_elems_container").removeClass("hidden_advance");
      $("#advanced_search_elems_container").addClass("visible_advance");
      $("#advanced_search_elems_container").slideDown(400);
    } else {
      $("#advanced_search_elems_container").removeClass("visible_advance");
      $("#advanced_search_elems_container").addClass("hidden_advance");
      $("#advanced_search_elems_container").slideUp(400);
    }
  });
});

function getArticle(item) {
  var article = "";
  loading();
  var title = $(item).find(".list_articles_item_title").text();
  var parentid = $(item).find(".list_articles_item_parentid").val();
  //TODO investigate why grisou.ca return a rev id = 0 as 0 is an error message.
  if (parentid == 0) { parentid = 1 ;}
  var revid = $(item).find(".list_articles_item_revid").val();
  
  var oldText, newText, ajaxConnCompleted = 0;
  
  dataController.getArticle(revid, function storeCurrentRev(response){ 
		newText = response;
		++ajaxConnCompleted; 
	});

  dataController.getArticle(parentid, function storeParentRev(response){ 
		oldText = response; 
		++ajaxConnCompleted;
	});

  //Waiting for ajax functions returns
  var inter = setInterval(function getRevisions(){
			if(ajaxConnCompleted == 2){
				clearInterval(inter);
				ajaxConnCompleted = 0;
				//Procedure
				analysisTable = getDiff(oldText, newText);
				article += analysisTable;
				$("#article_head").text("Article: '" + title + "' on " + $("#url").val());
			      	$("#contr_survived").text("The contribution survived: N/A");
			      	$("#article").html(analysisTable);
			      	stopLoading();
			}
		}
		, 500); //500ms intervals
}

