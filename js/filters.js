'use strict';

/* Filters */

angular.module('pkb.filters', [])
    .filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    }
  }])
  .filter('encodeURI', function ($window) {
      return $window.encodeURIComponent;
  })
  .filter('angled', function () {
      return function (uri) {
          return "<" + uri + ">";
      };
  })
  .filter('prefixedURI', function () {
      return function (text) {
          var prefixes = {
              "http://purl.org/phenoscape/vocab.owl#implies_presence_of_some_http://purl.obolibrary.org/obo/": "presence_of:",
              "http://purl.org/phenoscape/vocab.owl#has_part_inhering_in_some_http://purl.obolibrary.org/obo/": "hpi:",
              "http://purl.obolibrary.org/obo/UBERON_": "UBERON:",
              "http://purl.obolibrary.org/obo/": "obo:"
          }
          var match = _.find(_.keys(prefixes), function (key) {
              return (text.indexOf(key) === 0);
          });
          if (match) {
              var prefix = prefixes[match];
              return text.replace(match, prefix);
          } else {
              return text;
          }
      };
  });