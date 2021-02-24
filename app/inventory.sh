URL="https://${USER}:${PASS}@${SHOP}.myshopify.com/admin/api/2021-01/products.json"
echo $URL
curl \
    -X "GET" \
    -H "Content-Type: application/json" \
    $URL | jq
