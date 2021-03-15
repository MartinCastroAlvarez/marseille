// Handle the Form state with this flag.
let $isProductsLoading = false

// Handle GET request to the backend.
const getProducts = async ($method, $payload) => {
    // Start being busy.
    if ($isProductsLoading) return
    $('#catalog-loading').removeClass('hidden')
    $isProductsLoading = true
    // Hide errors.
    $("#catalog-error").addClass('hidden')
    // Send request to the API.
    return $.ajax({
        type: $method,
        contentType: "application/json",
        crossDomain: true,
        dataType: 'json',
        headers: {
            "x-api-key": "{{API_KEY}}",
        },
        url: "{{API_URL}}/v1/products",
        data: $payload,
        // Handle successful requests.
        // Errors might still return a 200 OK.
        success: (xhr, textStatus) => {
            if (xhr.head.error) {
                console.error("Error:", xhr, xhr.head)
                $("#catalog-error").removeClass('hidden')
            } else {
                renderProducts(xhr.body.products.map(x => {
                    let price = ""
                    if (x.variants.length) {
                        const minPrice = Math.max.apply(Math, x.variants.map(y => y.price))
                        price = "{{CURRENCY}}" + minPrice
                    }
                    return {
                        id: x.id,
                        name: x.title,
                        price: price,
                        image: x.image.src,
                    }
                }))
            }
        },
        // Handling a fatal error such as a network problem.
        error: (xhr, textStatus, errorThrown) => {
            console.error("Error:", xhr, textStatus, errorThrown)
            $("#catalog-error").removeClass('hidden')
        },
        // Handling the rend of all requests.
        complete: () => {
            $("#catalog-loading").addClass('hidden')
            $isProductsLoading = false
        }
    })
}

// Handle request to render response.
const renderProducts = rows => {
    $('#catalog-products').html("")
    if (!rows.length) {
        $("#catalog-empty").removeClass('hidden')
        return
    }
    rows.forEach(row => {
        $('#catalog-products').append(`
            <div class="col-xs-12 col-sm-6 col-md-3 col-xs-3 padding-sm">
                <div class="bg-image"
                    style="background-image: url('${row.image}')">
                    <div class="overlay padding-sm">
                        <h5 class="nowrap">${row.name}</h5>
                        <h2>${row.price}</h2>
                        <form action="product.html" target="${row.id}" method="GET">
                            <input type="hidden" name="product_id" value="${row.id}"/>
                            <button class="button-white padding-sm">{{strings.View}}</button>
                        </form>
                    </div>
                </div>
            </div>
        `)
    })
}

$(document).ready(() => {

    // Loading products...
    $("#catalog-error").addClass('hidden')
    $("#catalog-empty").addClass('hidden')
    $("#catalog-loading").addClass('hidden')
    $("#catalog-products").html("")

    // Sending request to backend.
    getProducts("get", {
        search: $search,
        collection_id: $collection,
        product_type: $type,
        limit: PARAMS.limit || 30,
        since_id: PARAMS.since_id || "",
    })
})
