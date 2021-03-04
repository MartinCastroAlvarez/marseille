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
const $type = PARAMS.type || ""
const $id = PARAMS.id || ""
