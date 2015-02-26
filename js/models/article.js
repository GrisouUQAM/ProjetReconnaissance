/* 
 * Tout droits réservés à Grisou!
 */

window.Grisou = window.Grisou || {};
Grisou.Article = Grisou.Article || {};

// ====================
// Module Article
// ====================
Grisou.Article = (function (self, $, data) {

    //    not required when augmentation is used through parameter
    //    var self = Grisou.Article;
    // private
    var qqc = true;
    
    // public

    self.getArticle = function(item) {
        return item;
    };
    
    return self;

}( Grisou.Article, jQuery, {} ));