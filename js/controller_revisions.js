/* 
 * Tout droits réservés à Grisou!
 */

window.Grisou = window.Grisou || {};
Grisou.Controller_revisions = Grisou.Controller_revisions || {};

// ====================
// Module controller for the revisions
// aim to manage the state of the revisions received
// ====================
Grisou.Controller_revisions = (function (self, $, data) {

    var needNewRevisions = false;
    var revisionsArray = new Array();
    var uccontinueValue = null;
    
    // public
    self.getRevisionsNeededState = function() {
        console.log("processing get revisionsNeededStat as:" + needNewRevisions);
        return needNewRevisions;
    };
    
    self.setRevisionsNeededState = function(state) {
        console.log("processing set revisionsNeededState to " + state);        
        needNewRevisions = state;
    };
    
    self.getUccontinue = function() {
        if (revisionsArray.length < 1 ) {
            console.log("ERROR: cant get uccontinue as array is empty");
            return null;
        } else {
            var uccontinue = revisionsArray.last().uccontinue;
            console.log("processing get uccontinue:" + uccontinue);        
            return uccontinue;
        }
    };
    
    
    self.setUccontinue = function(value) {
        console.log("Setting uccontinue value to :" + value);
        uccontinue = value;
    };
    
    
    self.init = function() {
        console.log("Processing clearing revisions array");
        revisionsArray.clear();
    };
    
    
    self.add = function(revision) {
        console.log("Processing adding revision to array:" + revision);
        revisionsArray.push(revision);
    };
    
    return self;

}(Grisou.Controller_revisions, jQuery, {}));