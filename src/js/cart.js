const renderCart = productId => {

    const scriptUrl = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js'

    if (window.ShopifyBuy) {
        if (window.ShopifyBuy.UI) {
            ShopifyBuyInit()
        } else {
            loadScript()
        }
    } else {
        loadScript()
    }

    function loadScript() {
        const script = document.createElement('script')
        script.async = true
        script.src = scriptUrl
        if (document.getElementsByTagName('head')[0])
            document.getElementsByTagName('body')[0].appendChild(script)
        script.onload = ShopifyBuyInit
    }

    function ShopifyBuyInit() {
        const client = ShopifyBuy.buildClient({
            domain: '{{shop.id}}.myshopify.com',
            storefrontAccessToken: '{{shop.token}}',
        })

        // https://shopify.github.io/buy-button-js/customization/
        ShopifyBuy.UI.onReady(client).then(function (ui) {
            ui.createComponent('product', {
                id: productId,
                node: document.getElementById('kproduct'),
                moneyFormat: '%E2%82%AC%7B%7Bamount_with_comma_separator%7D%7D',
                options: {
                    // Main product embed. Displays information about your
                    // product and an “Add to cart” button. Creates options
                    // component. Depending on configuration, may create a
                    // modal and cart component.
                    "product": {
                        "contents": {
                            "img": false
                        },
                        "buttonDestination": "checkout",
                        "styles": {
                            "product": {
                                "button": {
                                    "font-family": "'Cinzel', 'Lalezar', 'Poppins', 'sans-serif'",
                                    "background": "{{style.Primary}}",
                                    "color": "{{style.Black}}",
                                },
                                "title": {
                                    "display": "none",
                                },
                                "options": {
                                    "background": "{{style.White}}",
                                    "color": "2px solid {{style.Primary}}",
                                },
                            }
                        },
                        "text": {
                            "button": "{{strings.Buy}}"
                        }
                    },
                    "productSet": {
                        "contents": {
                            "img": false
                        },
                        "styles": {
                            "products": {
                                "@media (min-width: 601px)": {
                                    "margin-left": "-20px"
                                }
                            }
                        }
                    },
                    "modalProduct": {
                        "contents": {
                            "img": false,
                            "imgWithCarousel": false,
                            "button": false,
                            "buttonWithQuantity": false 
                        },
                        "styles": {
                            "product": {
                                "@media (min-width: 601px)": {
                                    "max-width": "100%",
                                    "margin-left": "0px",
                                    "margin-bottom": "0px"
                                }
                            }
                        },
                        "text": {
                            "button": "{{strings.AddToCart}}"
                        }
                    },
                    "option": {},
                    "cart": {
                        "startOpen": false,
                        "text": {
                            "total": "{{strings.Subtotal}}",
                            "button": "{{strings.Checkout}}"
                        }
                    },
                    "toggle": {}
                }
            })
        })
    }

}
