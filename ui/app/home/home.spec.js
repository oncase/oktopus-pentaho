"use strict";

describe("portalApp.home module", function() {
  beforeEach(module("portalApp.home"));

  describe("home controller", function() {
    it(
      "should ....",
      inject(function($controller) {
        //spec body
        var homeCtrl = $controller("HomeCtrl");
        expect(homeCtrl).toBeDefined();
      })
    );
  });
});
