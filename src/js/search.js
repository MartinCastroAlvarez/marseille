$(document).ready(function() {
    $("#search-collection").val(PARAMS.collection || "")
    $('#search-collection').select2()
    const $searchTitle = unescape(PARAMS.title || "{{strings.Catalog}}").replace(/\+/g," ")
    $("search-title").val($searchTitle)
    $("search-h1").html(`
        <h1>${$searchTitle}</h1>
        <br/>
        <br/>
    `)
})
