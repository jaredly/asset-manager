var assert = require("chai").assert,
    path = require('path');

describe("contentResolver tests", function(){
  before(function(){
    this.cr = require('../lib/contentResolver');
  });
  
  describe("Test single file resolution with NO compression", function() {
    before(function(){
      this.cf = this.cr(['test/app1'], false);
    });
    
    it("for a js file", function() {
      var js = this.cf("", "app1", "js", "js");
      assert.equal(path.resolve("test/app1/js/app1.js"), js.getDiskPath());
      assert.equal("alert( 'hello' );", js.getContent());
      assert.equal("alert( 'hello' );", js.getContentRaw());
    });
    
    it("for a css file", function() {
      var css = this.cf("", "app1", "css", "css");
      assert.equal(path.resolve("test/app1/css/app1.css"), css.getDiskPath());
      assert.equal("body {}", css.getContent());
    });
    
    it("for a img file", function() {
      var img = this.cf("", "arrow", "png", "img");
      assert.equal(path.resolve("test/app1/img/arrow.png"), img.getDiskPath());
    });
  });
  
  describe("Test single file resolution with compression", function() {
    before(function(){
      this.cf = this.cr(['test/app1'], true);
    });
    
    it("for a js file", function() {
      var js = this.cf("", "app1", "js", "js");
      assert.equal(path.resolve("test/app1/js/app1.js"), js.getDiskPath());
      assert.equal("alert(\"hello\")", js.getContent());
      assert.equal("alert( 'hello' );", js.getContentRaw());
    });
  });
  
  describe("Test assembled module resolution with NO compression", function() {
    before(function(){
      this.cf = this.cr(['test/app1', 'test/app2', 'test/app3', 'test/app4/assets', 'test/app4/dummy_modules/shared-ui-dummy/assets', 'test/app4/dummy_modules/shared-ui-dummy/vendors/taco'], false);
    });
    
    it("for a simpleModule", function() {
      var js = this.cf("", "simpleModule", "js", "js");
      assert.equal(path.resolve("test/app2/js/simpleModule/assembly.json"), js.getDiskPath());
      assert.equal("//Module assembly: simpleModule\n\n/*\n * Included File: main.js\n */\n\nvar m=\"main.js\";\n\n", js.getContent());
    });
    
    it("for a fullModule", function() {
      var js = this.cf("", "fullModule", "js", "js");
      assert.equal(path.resolve("test/app1/js/fullModule/assembly.json"), js.getDiskPath());
      //assert.equal("//Module assembly: fullModule\n\n/*\n * Included File: helpers.js\n */\n\nvar h=\"helper.js\";\n\n/*\n * Included File: main.js\n */\n\nvar m=\"main.js\";\n\n/*\n * Included File: fullModule_en.json\n */\n\nvar langs = {\"en\":{\"title\":\"value\",\"onlyEN\":\"value\",\"full\":\"more\"});\"es\":{\"title\":\"espanol\"}};\n\n/*\n * Included File: Injected code\n */\n\nvar locale = FS.locale || window.locale || 'en';locale = typeof(locale) == 'string' ? locale : locale[0].split('-')[0];var l1 = langs[locale] || langs['en'];var lang = $.extend(langs['en'], l1);\n\n/*\n * Included File: template.html\n */\n\n\nvar snippetsRaw = \"\\n\" + \n\"    html template body\\n\" + \n\"\\n\" + \n\"\";\n\n\nfunction getSnippets(){\nvar snip = document.createElement('div');\n$(snip).html(snippetsRaw.format(lang));\n\nreturn snip;\n}\n\n\n", js.getContent());
    });
    
    it("for a fullModuleWithCSS", function() {
      var js = this.cf("", "fullModuleWithCSS", "js", "js");
      assert.equal(path.resolve("test/app3/js/fullModuleWithCSS/assembly.json"), js.getDiskPath());
      //assert.equal("//Module assembly: fullModuleWithCSS\n\n/*\n * Included File: helpers.js\n */\n\nvar h=\"helper.js\";\n\n/*\n * Included File: main.js\n */\n\nvar m=\"main.js\";\n\n/*\n * Included File: fullModuleWithCSS_en.json\n */\n\nvar langs = {\"en\":{\"title\":\"value\",\"onlyEN\":\"value\"});\"es\":{\"title\":\"espanol\"}};\n\n/*\n * Included File: Injected code\n */\n\nvar locale = FS.locale || window.locale || 'en';locale = typeof(locale) == 'string' ? locale : locale[0].split('-')[0];var l1 = langs[locale] || langs['en'];var lang = $.extend(langs['en'], l1);\n\n/*\n * Included File: template.html\n */\n\n\nvar snippetsRaw = \"\\n\" + \n\"    html template body\\n\" + \n\"\\n\" + \n\"\";\n\n\nfunction getSnippets(){\nvar snip = document.createElement('div');\n$(snip).html(snippetsRaw.format(lang));\n\nreturn snip;\n}\n\n\n", js.getContent());
    });

    it("for a Module with spread out parts (Uses Asset Resolution Paths)", function() {
      var js = this.cf("", "testModule", "js", "js");
      assert.equal(path.resolve("test/app4/assets/js/testModule/assembly.json"), js.getDiskPath());
      assert.equal("//Module assembly: testModule\n\n/*\n * Included File: main.js\n */\n\nvar m=\"main.js\";\n\n/*\n * Included File: shared-ui-assets.js\n */\n\nvar suia=\"suia.js\";\n\n/*\n * Included File: shared-ui-vendors.js\n */\n\nvar suiv=\"suiv.js\";\n\n", js.getContent());
    });
  });
});