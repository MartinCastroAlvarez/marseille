// URL PARAMETERS
// https://stackoverflow.com/questions/19491336
const PARAMS = {}
window.location.search
  .replace(/[?&]+([^=&]+)=([^&]*)/gi,
           (str, key, value) => {
                PARAMS[key] = value
            })

// Collection URL Params.
const $title = unescape(PARAMS.title || "")
    .replace(/\+/g, " ") || "{{strings.Catalog}}"
const $search = unescape(PARAMS.search || "").replace(/\+/g, " ")
const $collection = PARAMS.collection || ""
const $product = PARAMS.product_id || ""
const $image = unescape(unescape(PARAMS.product_image || ""))
const $variant = PARAMS.variant_id !== undefined ? PARAMS.variant_id.split('-')[0] : ""
const $price = PARAMS.variant_id !== undefined ? PARAMS.variant_id.split('-')[1] : ""
const $action = PARAMS.action || ""
const $type = PARAMS.type || ""
const $id = PARAMS.id || ""
