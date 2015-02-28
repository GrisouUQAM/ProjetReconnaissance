/* 
 * Tout droits réservés à Grisou!
 */

window.Grisou = window.Grisou || {};
Grisou.WikiController = Grisou.WikiController || {};

// ====================
// WikiController module
// ====================
Grisou.WikiController = (function (self) {

// private
    var apiUrl = '';
    var RSD_KEYWORD = "EditURI";
    var user = '';
    var url = '';

	/*
    * AJAX call for requests
    */
	var doGet = function(url, callback) {
	  $.ajax({
	    url: url,
	    dataType: "jsonp",
	    type: 'GET',
	    success: function(response){
		callback(response)		
		} 
	  });
	}

    
//public

    self.getApiUrlPath = function() {
    	return apiUrl;
    }

    
    self.getUser = function() {
        return user;
    };


    self.setUser = function(username) {
        user = username;
    }


    self.setUrl = function(selectedUrl) {
        url = selectedUrl;
        if ( url.substr(0,7) !== 'http://' ) {
            apiUrl = 'http://' + url;
        } 
        if ( apiUrl !== 'http://wiki.grisou.ca') {
            apiUrl = apiUrl + '/w/api.php';
        } else {
            apiUrl = apiUrl + '/api.php';
        }
        // a faire: verifie si existe dans la bd
        // fais un appel ajax pour obtenir le fichier index.html
        // trouver la ligne qui contient le rel=RSD_KEYWORD
        // extirper le URL de l"API et le retourner.
    };	
	
    
   	/**
    * Returns String of parsed text in callback function
    */
    self.getArticle = function(revid, callback){
		if(!revid || !callback ){
			callback(null);
			return;
		}

		var wikiUrlRequest = self.getApiUrlPath() + "?action=parse&format=json&oldid=" + revid + "&prop=text"

		doGet(wikiUrlRequest, function getArticleTextAsync(response){
			var text = response.parse.text["*"];
			callback(text);
		});
	}


	/*
	* Returns array of Revision in parameter for callback function
	* uccontinue <= null for first call.
	* parameters is an object defined:
		{ 
		  dateFrom : date,
		  dateTo : date, 
		  hideMinorEdits : true/False  
		}
	*/
	self.getRevisions = function(uccontinue, callback){
        var parameters = Grisou.View.getAdvancedSearchValues();
        var limit = Grisou.View.getUcLimitCourrent();

		var wikiUrlRequest = self.getApiUrlPath() + "?action=query&list=usercontribs&format=json&uclimit=" 
			+ limit + "&ucuser=" + user;

		if(parameters){
			if(parameters.dateFrom && parameters.dateFrom instanceof Date){
				//Revisions are displayed in Desc order
				//ucend represent the first date
				wikiUrlRequest += "&ucend=" + parameters.dateFrom.toISOString();
			} 

			if(parameters.dateTo && parameters.dateTo instanceof Date){
				//Revisions are displayed in Desc order
				//ucstart represent the last date
				wikiUrlRequest += "&ucstart=" + parameters.dateTo.toISOString();
			}
			
			if(parameters.hideMinorEdits){
				wikiUrlRequest += "&ucshow=!minor";
			}
		}

		wikiUrlRequest += "&ucdir=older&ucnamespace=0&ucprop=ids%7Ctitle%7Ctimestamp%7Ccomment%7Csize%7Csizediff&converttitles=";
		
		if (uccontinue === null){
			wikiUrlRequest += "&continue=";
            uccontinue = "";
		} else {
			wikiUrlRequest += "&continue=-||&uccontinue=" + uccontinue;
		}
		
		doGet(wikiUrlRequest, function getRevisionsAsync(response){
            console.log("Processing getRevisionAsync: " + response);
            var revs = new Array();
            var uccontinueValue = response.continue.uccontinue;
            Grisou.Controller_revisions.setUccontinue(uccontinue);
			var contribs = response.query.usercontribs;
			for(i = 0; i < contribs.length; ++i){
				var rev = new Grisou.Revision(contribs[i]);
				rev.uccontinue = uccontinueValue;
				revs.push(rev);
			}	
			callback(revs);
		});		
	}
	
    
	/**
    * Returns array of Talk in the callback function
    */
	self.getTalks = function(callback){
		
		if(!user){
			callback(new Array());
			return;
		}
		
		var wikiUrlRequest = self.getApiUrlPath() + "?action=query&list=usercontribs&format=json&uclimit=500&ucuser=" + user + 
			"&ucdir=older&ucnamespace=1&ucprop=title%7Ccomment%7Cparsedcomment";
		
		doGet(wikiUrlRequest, function getTalksAsync(response){
			var talks = new Array();
			var wikiTalks = response.query.usercontribs;
			for(i = 0; i < wikiTalks.length; ++i){
				var talk = new Grisou.Talk(wikiTalks[i]);
				talks.push(talk);
			}
			callback(talks);
		});
	}

    return self;

}( Grisou.WikiController) );