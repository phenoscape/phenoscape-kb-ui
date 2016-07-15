'use strict';

/* Controllers */

angular.module('pkb.controllersext', ['ui.bootstrap'])
.controller('AnnotationsController', function ($scope, $routeParams, $location, OntologyTermSearch, QueryAnnotationsTaxon, Vocab, OMN, Label) {
    $scope.tabs = {
        taxonAnnotations: {active: true}
    }
    $scope.activateTab = function (tabname) {
        if (_.has($scope.tabs, tabname)) {
            $scope.tabs[tabname].active = true;
            $location.search('tab', tabname);
        }
    }
    if ($routeParams.tab && _.has($scope.tabs, $routeParams.tab)) {
        $scope.tabs[$routeParams.tab].active = true;
    }
    
    $scope.filters = {
        taxonFilter: null,
        entityFilter: null,
        qualityFilter: null
    }
    if ($routeParams['filter.taxon']) {
        $scope.filters.taxonFilter = {'@id': $routeParams['filter.taxon']};
        Label.query({'iri': $routeParams['filter.taxon']}).$promise.then(function (response) {
            $scope.filters.taxonFilter = response;
        });
    }
    if ($routeParams['filter.entity']) {
        $scope.filters.entityFilter = {'@id': $routeParams['filter.entity']};
        Label.query({'iri': $routeParams['filter.entity']}).$promise.then(function (response) {
            $scope.filters.entityFilter = response;
        });
    }
    if ($routeParams['filter.quality']) {
        $scope.filters.qualityFilter = {'@id': $routeParams['filter.quality']};
        Label.query({'iri': $routeParams['filter.quality']}).$promise.then(function (response) {
            $scope.filters.qualityFilter = response;
        });
    }
    $scope.$watch('filters.taxonFilter', function (value) {
        if ($scope.filters.taxonFilter) {
            $location.search('filter.taxon', $scope.filters.taxonFilter['@id']);
        } else {
            $location.search('filter.taxon', null);
        }
    });
    $scope.$watch('filters.entityFilter', function (value) {
        if ($scope.filters.entityFilter) {
            $location.search('filter.entity', $scope.filters.entityFilter['@id']);
        } else {
            $location.search('filter.entity', null);
        }
    });
    $scope.$watch('filters.qualityFilter', function (value) {
        if ($scope.filters.qualityFilter) {
            $location.search('filter.quality', $scope.filters.qualityFilter['@id']);
        } else {
            $location.search('filter.quality', null);
        }
    });
    
    $scope.autocompleteTaxa = function (text) {
        return OntologyTermSearch.query({
            limit: 20,
            text: text,
            definedBy: Vocab.VTO
        }).$promise.then(function (response) {
            return response.results;
        });
    };
    $scope.autocompleteEntity = function (text) {
        return OntologyTermSearch.query({
            limit: 20,
            text: text,
            definedBy: Vocab.Uberon
        }).$promise.then(function (response) {
            return response.results;
        });
    };
    $scope.autocompleteQuality = function (text) {
        return OntologyTermSearch.query({
            limit: 20,
            text: text,
            definedBy: Vocab.PATO
        }).$promise.then(function (response) {
            return response.results;
        });
    };
    
    $scope.taxonAnnotationsPagination = {
        page: 1,
        maxSize: 3,
        limit: 20
    };
    function taxonAnnotationQueryParams() {
        var params = {};
        if ($scope.filters.taxonFilter) {
            params.in_taxon = $scope.filters.taxonFilter['@id'];
        }
        if ($scope.filters.entityFilter) {
            params.entity = OMN.angled($scope.filters.entityFilter['@id']);
        }
        if ($scope.filters.qualityFilter) {
            params.quality = OMN.angled($scope.filters.qualityFilter['@id']);
        }
        return params;
    }
    function taxonAnnotationsPageChanged() {
        var params = taxonAnnotationQueryParams();
        params.limit = $scope.taxonAnnotationsPagination.limit
        params.offset = ($scope.taxonAnnotationsPagination.page - 1) * $scope.taxonAnnotationsPagination.limit;
        // if ($scope.taxonAnnotations) {
 //            $scope.taxonAnnotations.$cancelRequest();
 //        }
        $scope.taxonAnnotations = QueryAnnotationsTaxon.query(params);
    };
    function resetTaxonAnnotations () {
        var params = taxonAnnotationQueryParams();
        params.total = true;
        // if ($scope.taxonAnnotationsTotal) {
//             $scope.taxonAnnotationsTotal.$cancelRequest();
//         }
        $scope.taxonAnnotationsTotal = QueryAnnotationsTaxon.query(params);
        $scope.taxonAnnotationsPagination.page = 1;
        taxonAnnotationsPageChanged();
    };
    $scope.$watch('taxonAnnotationsPagination.page', function (newValue) {
        taxonAnnotationsPageChanged();
    });
    $scope.$watchGroup(['filters.taxonFilter["@id"]', 'filters.entityFilter["@id"]', 'filters.qualityFilter["@id"]'], function (newValues, oldValues) {
        if (($scope.filters.taxonFilter === undefined) || ($scope.filters.entityFilter === undefined) || ($scope.filters.qualityFilter === undefined)) {
            //still typing in autocomplete
        } else {
            resetTaxonAnnotations();
        }
    });
})
;