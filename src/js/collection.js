// Handle the Form state with this flag.
let $isCollectionLoading = false

// Handle GET request to the backend.
const getCollection = async ($method, $id) => {
    console.log("Method:", $method)
    console.log("ID:", $id)
    // Start being busy.
    if ($isCollectionLoading) return
    $isCollectionLoading = true
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
        url: `{{API_URL}}/v1/collections/${$id}`,
        // Handle successful requests.
        // Errors might still return a 200 OK.
        success: (xhr, textStatus) => {
            console.log("Response:", xhr, textStatus)
            if (xhr.head.error) {
                // pass
            } else {
                alert(xhr.body.collection)
                return
                renderCollection(xhr.body.collections.map(x => {
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
            $isCollectionLoading = false
        }
    })
}

// Handle request to render response.
const renderCollection = rows => {
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
    if ($collection)
        getCollection("get", $collection)
})
