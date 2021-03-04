$(document).ready(function() {
    const collection = PARAMS.collection || {{collections.Default}}
    $("#search-collection").val(collection)
    $("#search-collection-debug").html("Collection ID: " + collection)
    $('#search-collection').select2()
    const $searchTitle = unescape(PARAMS.title || "{{strings.Catalog}}").replace(/\+/g," ")
    const $searchKeyword = unescape(PARAMS.search || "").replace(/\+/g," ")
    $("#search-keyword").val($searchKeyword)
    $("search-title").val($searchTitle)
    $("search-h1").html(`
        <h1>${$searchTitle}</h1>
    `)
})
