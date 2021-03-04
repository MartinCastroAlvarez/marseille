// Handle the Form state with this flag.
let $isProductLoading = false

// Handle GET request to the backend.
const getProduct = async ($method, $id) => {
    // Start being busy.
    if ($isProductLoading) return
    $isProductLoading = true
    // Start loading product.
    $('#product-loading').show()
    $('#product-error').hide()
    // Send request to the API.
    return $.ajax({
        type: $method,
        contentType: "application/json",
        crossDomain: true,
        dataType: 'json',
        headers: {
            "x-api-key": "{{API_KEY}}",
        },
        url: `{{API_URL}}/v1/products/${$id}`,
        // Handle successful requests.
        // Errors might still return a 200 OK.
        success: (xhr, textStatus) => {
            if (xhr.head.error) {
                console.error("Error:", xhr, xhr.head)
            } else {
                renderProduct(xhr.body.product)
            }
        },
        // Handling a fatal error such as a network problem.
        error: (xhr, textStatus, errorThrown) => {
            console.error("Error:", xhr, textStatus, errorThrown)
            $('#product-error').show()
        },
        // Handling the rend of all requests.
        complete: () => {
            $('#product-loading').hide()
            $isProductLoading = false
        }
    })
}

// Handle request to render response.
const renderProduct = product => {
    console.error(product)
    const images = product.images.map(x => {
        return `
            <div class="col-xs-6 col-sm-4 col-md-4 col-lg-3">
                <div
                    class="product-image"
                    style="background-image: url('${x.src}')">
                </div>
            </div>
        `
    })
    const variants = product.variants.map(x => {
        return `
            <option value="${x.id}">
                ${getString(x.title)}
                -
                {{CURRENCY}} ${x.price}
            </option>
        `
    })
    $('#product').html(`
        <div class="row">
            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <div
                    class="product-image"
                    style="background-image: url('${product.image.src}')">
                </div>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 padding-sm">
                <h1>${product.title}</h1>
                <br/>
                <h5>${product.vendor}</h5>
                <br/>
                <h6>
                    <a href="products.html?type=${product.product_type}">
                        ${getString(product.product_type)}
                    </a>
                </h6>
                <form action="WIP.html" method="GET" class="padding-sm">
                    <input type="hidden" name="product_id" value="${product.id}"/>
                    <select id="variant-select" class="variant-select" name="variant">
                        ${variants.join('')}
                    </select>
                    <br/>
                    <br/>
                    <button class="padding-sm">{{strings.Buy}}</button>
                </form>
            </div>
        </div>
        <div class="row">
            <div class="col-12 product-images padding-sm row">
                ${images.join('')}
            </div>
        </div>
    `)
    $('#variant-select').select2()
}

$(document).ready(() => {
    // Start Loading.
    $('#product-error').hide()
    $('#product-loading').show()

    // Fetch from API.
    if ($product)
        getProduct("get", $product)
})
