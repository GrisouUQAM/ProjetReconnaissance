/* 
 * Tout droits réservés à Grisou!
 */

window.Grisou = window.Grisou || {};
Grisou.View = Grisou.View || {};

// ====================
// Module view
// ====================
Grisou.View = (function (self, $, data) {

    //    not required when augmentation is used through parameter
    //    var self = Grisou.View;
    // private
    var articleTabSelected = true;
    var advancedSearchValues = {};
    
    
    // public
    self.test = "";
    self.isArticleTabSelected = function () {
        return articleTabSelected;
    };
    
    
    self.setTabSelectedArticle = function() {
        articleTabSelected = true;
        return undefined;
    };
    
    
    self.setTabSelectedTalks = function() {
        articleTabSelected = false;
    };

    
    self.clearScreen = function () {
      if( self.isArticleTabSelected() ){
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
        return Math.ceil(($("#articles").height() / 70));
    }
        
    
    self.areInputFieldsValid = function() {
        if ($.trim($("#user").val()).length === 0) {
            $("#user").css({"background-color": "#FFDBDB"});
            $("#user").focus();
            return false;
        }
        if ($.trim($("#url").val()).length === 0) {
            $("#url").css({"background-color": "#FFDBDB"});
            $("#url").focus();
            return false;
        }
        return true;
    }
        
        
    return self;

}( Grisou.View, jQuery, {} ));
