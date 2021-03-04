$(document).ready(function() {

    // Debugging.
    $("#search-collection-debug").html("Collection ID: " + $collection)
    $("#search-type-debug").html("Product Type: " + $type)

    // Updating Inputs.
    $("#search-type").val($type)
    $("#search-collection").val($collection)
    $("#search-keyword").val($search)
    $("search-title").val($title)

    // Select dropdown.
    $('#search-type').select2()
})
