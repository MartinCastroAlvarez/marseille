// Handle the Form state with this flag.
let $isProductLoading = false

// Handle GET request to the backend.
const getProduct = async ($method, $id) => {
    // Start being busy.
    if ($isProductLoading) return
    $isProductLoading = true
    // Start loading product.
    $('#product-loading').removeClass('hidden')
    $('#product-error').addClass('hidden')
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
                renderCart($id)
            }
        },
        // Handling a fatal error such as a network problem.
        error: (xhr, textStatus, errorThrown) => {
            console.error("Error:", xhr, textStatus, errorThrown)
            $('#product-error').removeClass('hidden')
        },
        // Handling the rend of all requests.
        complete: () => {
            $('#product-loading').addClass('hidden')
            $isProductLoading = false
        }
    })
}

// Handle request to render response.
const renderProduct = product => {
    const language = "{{LANGUAGE}}".toUpperCase()
    const body = product.body_html
        .replace('<br/>', '\n')
        .replace('<br>', '\n')
        .split('\n')
    let description = []
    let active = false
    for (i = 0; i < body.length; i++) {
        if (active) {
            if (body[i].includes("--------------")) {
                break
            } else {
                description.push(body[i]
                    .replace('<span>', '').replace('</span>', ' ')
                    .replace('<strong>', '<b>').replace('</strong>', '</b>')
                    .replace('<p>', '').replace('</p>', ' ')
                    .replace('<br>', '').replace('</br>', ' ')
                    .replace('</div>', '').replace('<div>', ' ')
                    .trim())
            }
        } else if (body[i].includes("LANG:{{LANGUAGE}}--------------".toUpperCase())) {
            active = true
        }
    }
    const images = product.images.map(x => {
        return `
            <div class="col-xs-6 col-sm-4 col-md-4 col-lg-3">
                <div
                    class="bg-image"
                    style="background-image: url('${x.src}')">
                </div>
            </div>
        `
    })
    const type = product.product_type ? `<p>
        <i class="fa fa-plus-circle"></i>
        <a href="products.html?type=${product.product_type}">
            {{strings.SeeMore}}
        </a>
    </p>` : ''
    $('#product').html(`
        <div class="row">
            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <div
                    class="bg-image"
                    style="background-image: url('${product.image.src}')">
                </div>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 padding-lg">
                <h3 class="justify">${product.title}</h3>
                <br/>
                <h5 class="justify">
                    <a href="index.html">
                        <img src="favicon/favicon-32x32.png" width="20px"/>
                        ${product.vendor}
                    </a>
                </h5>
                <br/>
                <p class="justify">${description.filter(x => x).join('<br/>')}</p>
                ${type}
                <hr/>
                <div id='kproduct'></div>
                <hr/>
                <div class="row">
                    <div class="col-xs-6">
                        <p>
                            <i class="fa fa-question-circle"></i>
                            <a target="find" href="{{link.FindSize}}">
                                {{strings.FindSize}}
                            </a>
                        </p>
                    </div>
                    <div class="col-xs-6">
                        <p>
                            <i class="fa fa-info-circle"></i>
                            <a target="find" href="{{link.SizeGuide}}">
                                {{strings.SizeGuide}}
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-12 product-images padding-sm row">
                ${images.join('')}
            </div>
        </div>
    `)
}

$(document).ready(() => {
    // Start Loading.
    $('#product-error').addClass('hidden')
    $('#product-loading').removeClass('hidden')

    // Fetch from API.
    if ($product)
        getProduct("get", $product)
})
