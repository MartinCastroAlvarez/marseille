// Handle the Form state with this flag.
let $isCollectionsLoading = false

// Handle GET request to the backend.
const getCollections = async ($method, $payload) => {
    console.log("Method:", $method)
    console.log("Payload :", $payload)
    // Start being busy.
    if ($isCollectionsLoading) return
    $isCollectionsLoading = true
    // Hide errors.
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
            console.log("Response:", xhr, textStatus)
            if (xhr.head.error) {
                // pass
            } else {
                renderCollections(xhr.body.collections.map(x => {
                    let price = ""
                    return {
                        id: x.id,
                        image: x.image.src,
                    }
                }))
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
    console.log("Render:", rows)
    $('#collections').html("")
    if (!rows.length) return
    rows.forEach(row => {
        $('#collections').append(`
            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 padding-xs">
                <div class="bg-image" style="background-image: url(${row.image})">
                    <div class="overlay padding-lg">
                        <form method="GET" action="products.html">
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
})