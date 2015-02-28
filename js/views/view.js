/* 
 * Tout droits réservés à Grisou!
 */

window.Grisou = window.Grisou || {};
Grisou.View = Grisou.View || {};

// ====================
// Module view
// ====================
Grisou.View = (function(self, $, data) {

    //    not required when augmentation is used through parameter
    //    var self = Grisou.View;
    // private
    var articleTabSelected = true;
    var advancedSearchValues = {};


    var doNext = function(elem, curIndex) {
        $(elem.children()[curIndex++]).animate({top: "0%"}, 100, function() {
            doNext(elem, curIndex);
        });
    };


    // public
    self.test = "";
    self.isArticleTabSelected = function() {
        return articleTabSelected;
    };


    self.setTabSelectedArticle = function() {
        articleTabSelected = true;
        return self;
    };


    self.setTabSelectedTalks = function() {
        articleTabSelected = false;
    };


    self.clearScreen = function() {
        if (self.isArticleTabSelected()) {
            $("#articles").html("");
            $("#titre").html("");
        } else {
            $("#talks").html("");
        }
    };


    self.loading = function() {
        var img = $("<img />");
        img.attr("src", "images/465.gif");
        img.attr("alt", "Loading");
        img.appendTo("#article_loading");
    };


    self.stopLoading = function() {
        $("#article_loading").attr("src", "");
        $("#article_loading").hide();
    };


    self.keyPressed = function(e, element) {
        console.log("Processing url keypress event and this is: " + element);
        var code = e.keyCode || e.which;
        if (code === 13) {
            self.getJsonWiki();
        } else {
            console.log("Keypressed in : " + this);
            $(element).css({
                "background-color": "#EBF3FF"
            });
        }
    };



    self.readAdvancedSearchValues = function() {
        var dateFrom = null;
        var dateTo = null;
        var minorEdit = false;

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
                dateTo: dateTo,
                dateFrom: dateFrom,
                hideMinorEdits: minorEdit
            };
        }
    };


    self.getAdvancedSearchValues = function() {
        return advancedSearchValues;
    };


    self.getUcLimitCourrent = function() {
		var limit = Math.ceil(($("#articles").height() / 70));
        if (!limit || isNaN(limit)) {
			limit = 100;
		}        
        return 10;
    }


    self.areInputFieldsValid = function() {
        if ($.trim($("#user").val()).length === 0) {
            $("#user").css({
                "background-color": "#FFDBDB"
            });
            $("#user").focus();
            return false;
        }
        if ($.trim($("#url").val()).length === 0) {
            $("#url").css({
                "background-color": "#FFDBDB"
            });
            $("#url").focus();
            return false;
        }
        return true;
    }


    /*
    * Est appelé lors d'une nouvelle requete
    */
    self.getJsonWiki = function() {
        console.log("Processing getJsonWiki");
        self.clearScreen();
        Grisou.Controller_revisions.init();

        if (Grisou.View.areInputFieldsValid()) {
            Grisou.View.loading();
            dataController.setUser($("#user").val());
            dataController.setUrl($('#url').val());
            Grisou.View.readAdvancedSearchValues();
            //Get and show data
            if (Grisou.View.isArticleTabSelected()) {
                dataController.getRevisions(null, Grisou.View.displayArticles);
            } else {
                dataController.getTalks(Grisou.View.displayTalks);
            }
            Grisou.View.stopLoading();
        }
    }


    self.displayTalks = function(response) {
        console.log("Processing display talks");
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
        $("#talks").html(html_list_talks);
        doNext($("#talks"), 0);  
    };

    //Function that display revisions data

    self.displayArticles = function(data) {
        console.log("Processing display articles");
        var totalVal = 0;
        var html_list_articles = "";
        var lastItem = $(".last_item .list_articles_item_pageid").val();
        $(".list_articles_item").removeClass("last_item");
        if (lastItem) {
            totalVal = parseInt($("#total_score_contr").text());
            html_list_articles = $("#articles").html();
        } else {
            $("#titre").html('Articles which ' + dataController.getUser() + ' contributed to with total score: <span id="total_score_contr"></span>');
        }

        for (var i = 0; i < data.length; ++i) {
            if (i === data.length - 1)
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
            Grisou.Controller_revisions.add(data[i]);
        }
        $("#total_score_contr").text(totalVal);
        $("#articles").html(html_list_articles)
        doNext($("#articles"), 0);
        Grisou.Controller_revisions.setRevisionsNeededState(false);
    };




    return self;

}(Grisou.View, jQuery, {}));
