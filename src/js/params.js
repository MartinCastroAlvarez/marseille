// URL PARAMETERS
// https://stackoverflow.com/questions/19491336
const PARAMS = {}
window.location.search
  .replace(/[?&]+([^=&]+)=([^&]*)/gi,
           (str, key, value) => {
                PARAMS[key] = value
            })
