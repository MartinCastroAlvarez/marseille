$(document).ready(function() {

    // Debugging.
    $("#search-collection-debug").html("Collection ID: " + $collection)
    $("#search-type-debug").html("Product Type: " + $type)

    // Updating Inputs.
    $("#search-type").val($type)
    $("#search-collection").val($collection)
    $("#search-keyword").val($search)
    $("search-title").val($title)

    // Updating HTML.
    $("search-h1").html(`
        <h1>${$search}</h1>
    `)

    $('#search-type').select2()
})
