/* 
 * Tout droits réservés à Grisou!
 */

window.Grisou = window.Grisou || {};
Grisou.Revision = Grisou.Revision || {};

// ====================
// Class that represent a revision in an article (article state)
// ====================
Grisou.Revision = (function (self, $, data) {

    // private
    
    // public
    self.title = "";
    self.text = "";
    self.revid = "";
    self.user = "";
    self.userid = "";
    self.size = "";
    self.sizediff = "";
    self.pageid = "";
    self.timestamp = "";
    self.parentid = "";
    self.uccontinue = "";    
    
    // methods
    return self;

}( Grisou.Article, jQuery, {} ));
