/* 
 * Tout droits réservés à Grisou!
 */

window.Grisou = window.Grisou || {};

// ====================
// Class that represent a revision in an article (article state)
// ====================
Grisou.Revision = function Revision(contribElem) {

    // private
    
    // public
	this.title = contribElem.title;
	this.text = contribElem.text;
	this.revid = contribElem.revid;
	this.user = contribElem.user;
	this.userid = contribElem.userid;
	this.size = contribElem.size;
	this.sizediff = contribElem.sizediff;
	this.pageid = contribElem.pageid;
	this.timestamp = contribElem.timestamp;
	this.parentid = contribElem.parentid;
	this.uccontinue = "";
    
    // methods
    
}