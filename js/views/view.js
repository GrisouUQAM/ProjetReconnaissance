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
    
    // public

    self.isArticleTabSelected = function () {
        return articleTabSelected;
    };
    
    self.setTabSelectedArticle = function() {
        articleTabSelected = true;
        return undefined;
    };
    
    self.setTabSelectedTalks = function() {
        articleTabSelected = false;
    }

    
    self.clearScreen = function () {
      if( self.isArticleTabSelected() ){
        $("#articles").html("");
        $("#titre").html("");
      } else {
        $("#talks").html("");
      }
    }
    

    self.loading = function() {
      var img = $("<img />");
      img.attr("src", "images/465.gif");
      img.attr("alt", "Loading");
      img.appendTo("#article_loading");
    }    
    

    self.stopLoading = function() {
      $("#article_loading").attr("src", "");
      $("#article_loading").hide();
    }
    
    
    return self;

}( Grisou.View, jQuery, {} ));
