// Local Store Cache.
const COLLECTIONS_STORAGE_KEY = "klook-collections"

// Handle the Form state with this flag.
let $isCollectionsLoading = false

// Handle GET request to the backend.
const getCollections = async ($method, $payload) => {
    // Start being busy.
    if ($isCollectionsLoading) return
    $isCollectionsLoading = true
    // Send request to the API.
    return $.ajax({
        type: $method,
        contentType: "application/json",
        crossDomain: true,
        dataType: 'json',
        headers: {
            "x-api-key": "{{API_KEY}}",
        },
        url: "{{API_URL}}/v1/collections",
        data: $payload,
        // Handle successful requests.
        // Errors might still return a 200 OK.
        success: (xhr, textStatus) => {
            if (xhr.head.error) {
                console.error("Error:", xhr, xhr.head)
            } else {
                // Rendering Collections.
                renderCollections(xhr.body.collections)

                // Persisting to Cache.
                localStorage.setItem(COLLECTIONS_STORAGE_KEY,
                                     JSON.stringify(xhr.body.collections))
            }
        },
        // Handling a fatal error such as a network problem.
        error: (xhr, textStatus, errorThrown) => {
            console.error("Error:", xhr, textStatus, errorThrown)
        },
        // Handling the rend of all requests.
        complete: () => {
            $isCollectionsLoading = false
        }
    })
}

// Handle request to render response.
const renderCollections = rows => {
    $('#collections').html("")
    if (!rows.length) return
    rows.forEach(row => {
        $('#collections').append(`
            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 padding-xs">
                <div
                    class="bg-image center"
                    style="background-image: url(${row.image.src})">
                    <div class="overlay padding-lg">
                        <h2>${getString(row.title)}</h2>
                        <form method="GET" target="${row.id}" action="products.html">
                            <input
                                type="hidden"
                                name="collection"
                                value="${row.id}"/>
                            <button class="padding-sm" type="submit">
                                {{strings.ViewMore}}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        `)
    })
}

$(document).ready(() => {
    // Loading collections...
    $("#collections").html("")

    // Sending request to backend.
    getCollections("get", {})

    // Restoring from Cache.
    let $data = localStorage.getItem(COLLECTIONS_STORAGE_KEY)
    if ($data) {
        renderCollections(JSON.parse($data))
    }
})
