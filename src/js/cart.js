// Local Store Cache.
const CART_STORAGE_KEY = "klook-cart"

// Handle request to render the cart.
const renderCart = $cart => {
    const products = Object.keys($cart).map(x => {
        return `
            <div class="col-xs-6 col-sm-6 col-md-4 col-lg-3">
                <div
                    class="bg-image"
                    style="background-image: url('${$cart[x].image}')">
                    <div class="overlay padding-sm">
                        <h5>${getString($cart[x].title)}</h5>
                        <p>{{CURRENCY}} ${$cart[x].price}</p>
                        <form method="GET" action="cart.html">
                            <input name="action" type="hidden" value="del"/>
                            <input name="variant_id" type="hidden" value="${x}"/>
                            <button class="button-white padding-sm" type="submit">
                                {{strings.Remove}}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        `
    })
    $('#cart').html(`
        <div class="center padding-xs">
            <h3>{{strings.YourCart}}</h3>
            <div class="row padding-lg">
                ${products.join('')}
            </div>
        </div>
    `)
}

$(document).ready(() => {
    // Restoring from Cache.
    let $cart = localStorage.getItem(CART_STORAGE_KEY)
    if ($cart) {
        $cart = JSON.parse($cart) || {}
    } else {
        $cart = {}
    }

    // Adding product to Cart.
    if ($action == "add" && $title && $variant && $product && $image && $price) {
        $cart[$variant] = {
            product_id: $product,
            variant_id: $product,
            image: $image,
            price: $price,
            title: $title,
        }
    }

    // Removing product from Cart.
    if ($action == "del" && $variant) {
        delete $cart[$variant]
    }

    // Rendering cart...
    if (Object.keys($cart).length) {
        $("#cart").html("")
        renderCart($cart)
        $("#cart-buy").removeClass('hidden')
    }

    // Saving into Cache.
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify($cart))
})
