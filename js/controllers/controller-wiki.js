/* 
 * Tout droits réservés à Grisou!
 */

window.Grisou = window.Grisou || {};
Grisou.WikiController = Grisou.WikiController || {};

// ====================
// WikiController module
// ====================
Grisou.WikiController = (function () {

// private
    var self = Grisou.WikiController;
    var apiUrl = '';
    var RSD_KEYWORD = "EditURI";
    
//public

    self.getApiUrlPath = function() {
    	return apiUrl;
    }


    self.setApiUrlPath = function (url) {
        if ( url.substr(0,7) !== 'http://' ) {
            apiUrl = 'http://' + url;
        } 
        if ( apiUrl !== 'http://wiki.grisou.ca') {
            apiUrl = apiUrl + '/w/api.php';
        } else {
            apiUrl = apiUrl + '/api.php';
        }
        // verifie si existe dans la bd
        // fais un appel ajax pour obtenir le fichier index.html
        // trouver la ligne qui contient le rel=RSD_KEYWORD
        // extirper le URL de l"API et le retourner.
        return apiUrl;
    };	
	
   	//Returns String of parsed text in callback function
    self.getArticle = function(revid, callback){
		if(!revid){
			callback(null);
			return;
		}
		
		if(!callback){
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
	Returns array of Revision in parameter for callback function
	uccontinue <= null for first call.
	parameters is an object defined:
		{ 
		  dateFrom : date,
		  dateTo : date, 
		  hideMinorEdits : true/False  
		}
	*/
	self.getRevisions = function(user, limit, uccontinue, parameters, callback){
		var uclimitContribution = getUclimitCourrent();
		if (!limit || isNaN(limit)) {
			limit = 10;
		}

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
		
		if (!uccontinue){
			wikiUrlRequest += "&continue=";
		} else {
			wikiUrlRequest += "&continue=-||&uccontinue=" + uccontinue;
		}
		
		doGet(wikiUrlRequest, function getRevisionsAsync(response){
			var revs = new Array();
			var uccontinueValue = response["continue"].uccontinue;
			var contribs = response.query.usercontribs;
			for(i = 0; i < response.query.usercontribs.length; ++i){
				var rev = new WikiRevision(contribs[i]);
				rev.uccontinue = uccontinueValue;
				revs.push(rev);
			}
			
			callback(revs);
		});
		
	}
	
	//Returns array of Talk in the callback function
	self.getTalks = function(user, callback){
		
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
				var talk = new WikiTalk(wikiTalks[i]);
				talks.push(talk);
			}
			callback(talks);
		});
		
	}

	//AJAX call for requests
	function doGet(url, callback) {
	  $.ajax({
	    url: url,
	    dataType: "jsonp",
	    type: 'GET',
	    success: function(response){
		callback(response)		
		} 
	  });
	}
	
	function WikiRevision(contribElem){
		var ret = new Grisou.Revision();
		ret.title = contribElem.title;
		ret.text = contribElem.text;
		ret.revid = contribElem.revid;
		ret.user = contribElem.user;
		ret.userid = contribElem.userid;
		ret.size = contribElem.size;
		ret.sizediff = contribElem.sizediff;
		ret.pageid = contribElem.pageid;
		ret.timestamp = contribElem.timestamp;
		ret.parentid = contribElem.parentid;
		ret.uccontinue = "";
		
		return ret;
	}

	function WikiTalk(contribElem){
		var ret = new Grisou.Talk();
		ret.title = contribElem.title;
		ret.comment = contribElem.comment;
		return ret;
	}
    
    return self;

}( Grisou.WikiController = Grisou.WikiController || {} ));