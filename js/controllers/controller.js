/* 
 * Tout droits réservés à Grisou!
 */

window.Grisou = window.Grisou || {};
Grisou.Controller = Grisou.Controller || {};

// ====================
// Module pattern
// ====================
Grisou.Controller = (function (self, $, data) {

    //    not required when augmentation is used through parameter
    //    var self = Grisou.Controller;
    // private
    var variable1 = 'variable1';
    
    // public

    self.method = function() {
        return 'call to method1 from module pattern';
    };


    self.method2 = function (arg) {
        return 'call to method2 from module pattern with argument ' + arg;
    };
    
    self.method3 = function() {
        return $;
    };
    
    
    return self;

}( Grisou.Controller, jQuery, {} ));