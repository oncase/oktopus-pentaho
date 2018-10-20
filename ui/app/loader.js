window.showLoading = function() {
  var $div = $("<div />").appendTo("body");
  $div
    .addClass(".page-loading")
    .html('<img src="assets/img/source.gif" width="50" /><br />Carregando...');
};

window.hideLoading = function() {
  $(".page-loading-box").remove();
  $(".page-loading").remove();
};

