/* 
 * Tout droits réservés à Grisou!
 *
 * Copyright VOGG 2013
 * Revision Fev 2014 AP et AS
 */

var dataController = Grisou.WikiController;
//var revisions = new Array();

//Adding functionnality to Array object
Array.prototype.clear = function clearArray() {
    while (this.length > 0) {
        this.pop();
    }
}

Array.prototype.last = function returnLastItem() {
    return this.slice(-1)[0];
}


$(document).ready(function() {
    $(document).tooltip();
    $("button").button();
    $("#datepicker_from").datepicker({
        changeMonth: true,
        changeYear: true
    }).datepicker("option", "dateFormat", "yy-mm-dd");
    $("#datepicker_to").datepicker({
        changeMonth: true,
        changeYear: true
    }).datepicker("option", "dateFormat", "yy-mm-dd");

    $('#url').bind( 'keypress', function(e) { Grisou.View.keyPressed(e, this)});
    $('#user').bind('keypress', function(e) { Grisou.View.keyPressed(e, this)});

    Grisou.View.setTabSelectedArticle();

    $('#tabs').tabs({
        activate: function(event, ui) {
            if (ui.newTab.context.text === "Articles") {
                console.log("Processing tabs event: " + event + " ui: " + ui);
                Grisou.View.setTabSelectedArticle();
                $("#tab_article").animate( {left: "0%"}, 400);
                setTimeout( function() { $("#tab").css( {'z-index': '1'} ); }, 400 );
                $("#tabs").removeClass("tabs_expand");
                // why Grisou.View.getJsonWiki() was here?
            } else {
                console.log("Processing tabs event: " + event + " ui: " + ui);
                Grisou.View.setTabSelectedTalks();
                $("#tab_article").css({
                    'z-index': '-1'
                });
                $("#tab_article").animate( {left: "-100%"}, 400);
                $("#tabs").addClass("tabs_expand");
                Grisou.View.getJsonWiki();
            }
        }
    });


    $('#tab_article').tabs();

    $("#articles").scroll(function(event) {
        console.log("Processing scroll");
      var elem = $(this);
      if (elem[0].scrollHeight - elem.scrollTop() - 100 < elem.outerHeight()) {
          //Function that fetch more data from user revisions 
          if (!Grisou.Controller_revisions.getRevisionsNeededState()) {
              Grisou.Controller_revisions.setRevisionsNeededState(true);
              dataController.getRevisions(
                  Grisou.View.displayArticles
              );
          }
      }
  });


    $("#btn_advanced_search").click(function() {
        console.log("Processing click");
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
    console.log("Processing getArticle");
    Grisou.View.loading();
    var article = "";
    var title = $(item).find(".list_articles_item_title").text();
    var parentid = $(item).find(".list_articles_item_parentid").val();
    //TODO investigate why grisou.ca return a rev id = 0 as 0 is an error message.
    if (parentid == 0) {
        parentid = 1;
    }
    var revid = $(item).find(".list_articles_item_revid").val();

    var oldText, newText, ajaxConnCompleted = 0;

    dataController.getArticle(revid, function storeCurrentRev(response) {
        newText = response;
        ++ajaxConnCompleted;
    });

    dataController.getArticle(parentid, function storeParentRev(response) {
        oldText = response;
        ++ajaxConnCompleted;
    });

    //Waiting for ajax functions returns
    var inter = setInterval(function getRevisions() {
        var analysisTable = 0;
        if (ajaxConnCompleted == 2) {
            clearInterval(inter);
            ajaxConnCompleted = 0;
            //Procedure
            analysisTable = getDiff(oldText, newText);
            article += analysisTable;
            $("#article_head").text("Article: '" + title + "' on " + $("#url").val());
            $("#contr_survived").text("The contribution survived: N/A");
            $("#article").html(analysisTable);
        }
    }, 500); //500ms intervals
    Grisou.View.stopLoading();
};
