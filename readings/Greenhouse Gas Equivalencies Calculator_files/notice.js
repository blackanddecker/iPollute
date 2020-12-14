var epa_www3_toponly = '';
var epa_www3_othermajor = '';
var epa_www3_allother = '';

// DO NOT EDIT ANYTHING BELOW
// EPA home page, all AA home pages, and all regional home pages
if(document.getElementById("sitewidea") && epa_www3_toponly != '') {
  var sitewidea = document.getElementById("sitewidea");
  sitewidea.innerHTML = epa_www3_toponly;
}
// Several other home pages
if(document.getElementById("sitewideb") && epa_www3_othermajor != '') {
  var sitewideb = document.getElementById("sitewideb");
  sitewideb.innerHTML = epa_www3_othermajor;
}

// ALL pages using EPA template versions 3 and later
if(document.getElementById("sitewidec") && epa_www3_allother != '') {
  var sitewidec = document.getElementById("sitewidec");
  sitewidec.innerHTML = epa_www3_allother;
}
