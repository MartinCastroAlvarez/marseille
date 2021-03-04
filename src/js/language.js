const $lang = {
    {% for id, value in strings.items() %}
        "{{id|upper}}": "{{value}}",
    {% endfor %}
}

const getString = key => {
    newKey = key.toUpperCase()
        .replace(/ /g, "")
        .replace(/\//g, "")
        .replace(/-/g, "")
    return $lang[newKey] || key
}
