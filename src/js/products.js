// Handle the Form state with this flag.
let $isProductsLoading = false

// Handle GET request to the backend.
const getProducts = async ($method, $payload) => {
    console.log("Method:", $method)
    console.log("Payload:", $payload)
    // Start being busy.
    if ($isProductsLoading) return
    $('#catalog-loading').show()
    $isProductsLoading = true
    // Hide errors.
    $("#catalog-error").hide()
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
            console.log("Response:", xhr, textStatus)
            if (xhr.head.error) {
                $("#catalog-error").show()
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
            $("#catalog-error").show()
        },
        // Handling the rend of all requests.
        complete: () => {
            $("#catalog-loading").hide()
            $isProductsLoading = false
        }
    })
}

// Handle request to render response.
const renderProducts = rows => {
    console.log("Render:", rows)
    $('#catalog-products').html("")
    if (!rows.length) {
        $("#catalog-empty").show()
        return
    }
    rows.forEach(row => {
        $('#catalog-products').append(`
            <div class="col-xs-6 col-sm-4 col-md-3 col-lg-4 padding-sm catalog-product">
                <div class="catalog-image"
                    style="background-image: url('${row.image}')">
                </div>
                <div class="catalog-content padding-sm">
                    <p class="nowrap">${row.name}</p>
                    <br/>
                    <h3>${row.price}</h3>
                    <br/>
                    <form target="product.html" method="GET">
                        <input type="hidden" name="product_id" value="${row.id}"/>
                        <button class="padding-sm">{{strings.View}}</button>
                    </form>
                </div>
            </div>
        `)
    })
}

$(document).ready(() => {

    // Loading products...
    $("#catalog-error").hide()
    $("#catalog-empty").hide()
    $("#catalog-loading").hide()
    $("#catalog-products").html("")

    // Sending request to backend.
    getProducts("get", {
        search: $search,
        collection: $collection,
        product_type: $type,
        limit: PARAMS.limit || 30,
        since_id: PARAMS.since_id || "",
    })
})
