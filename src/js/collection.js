// Local Store Cache.
const COLLECTION_STORAGE_KEY = "klook-collection-"

// Handle the Form state with this flag.
let $isCollectionLoading = false

// Handle GET request to the backend.
const getCollection = async ($method, $id) => {
    // Start being busy.
    if ($isCollectionLoading) return
    $isCollectionLoading = true
    // Send request to the API.
    return $.ajax({
        type: $method,
        contentType: "application/json",
        crossDomain: true,
        dataType: 'json',
        headers: {
            "x-api-key": "{{API_KEY}}",
        },
        url: `{{API_URL}}/v1/collections/${$id}`,
        // Handle successful requests.
        // Errors might still return a 200 OK.
        success: (xhr, textStatus) => {
            if (xhr.head.error) {
                console.error("Error:", xhr, xhr.head)
            } else {
                // Rendering Collection.
                renderCollection(xhr.body.collection)

                // Persisting to Cache.
                let $key = COLLECTION_STORAGE_KEY + $collection
                localStorage.setItem($key, JSON.stringify(xhr.body.collection))
            }
        },
        // Handling a fatal error such as a network problem.
        error: (xhr, textStatus, errorThrown) => {
            console.error("Error:", xhr, textStatus, errorThrown)
        },
        // Handling the rend of all requests.
        complete: () => {
            $isCollectionLoading = false
        }
    })
}

// Handle request to render response.
const renderCollection = collection => {
    $('#products-collection').css("background-image", `url("${collection.image.src}")`)
    $('#products-collection h1').html(collection.title)
    $('#products-collection').removeClass('hidden')
}

$(document).ready(() => {
    $('#products-collection').removeClass('hidden')
    if ($collection) {
        // Loading from backend.
        getCollection("get", $collection)

        // Restoring from Cache.
        let $key = COLLECTION_STORAGE_KEY + $collection
        let $data = localStorage.getItem($key)
        if ($data) {
            renderCollection(JSON.parse($data))
        }
    }
})
