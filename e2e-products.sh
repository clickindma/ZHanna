#!/bin/bash
set -uo pipefail

ROOT="/Users/jaishreeram/Documents/Zhanna  Ecommerce Webite"
MONGOD=/tmp/mongodb-binaries/mongod-x64-unknown-8.2.6
DBPATH=$(mktemp -d /tmp/zhanna-prod.XXXXXX)
MONGO_PORT=27099
APP_PORT=3100
BASE="http://127.0.0.1:$APP_PORT"

fail() { echo "FAIL: $1"; exit 1; }
check() { python3 -c "import sys,json;d=json.load(open(sys.argv[1]));assert $2, 'assertion failed'" "$1" 2>/dev/null && echo "    OK" || fail "$3"; }

pkill -9 -f "next start -p $APP_PORT" 2>/dev/null; pkill -9 -f "next-server" 2>/dev/null; sleep 1

cleanup() {
  pkill -9 -f "next start -p $APP_PORT" 2>/dev/null
  pkill -9 -f "next-server" 2>/dev/null
  [ -n "${MONGO_PID:-}" ] && kill "$MONGO_PID" 2>/dev/null
  sleep 1
  rm -rf "$DBPATH" /tmp/zhanna-prod-*.json /tmp/zhanna-prod-*.html /tmp/zhanna-prod-mongod.log /tmp/zhanna-prod-app.log /tmp/zhanna-prod-seed.out
}
trap cleanup EXIT

echo "==> mongod"
"$MONGOD" --dbpath "$DBPATH" --port "$MONGO_PORT" --bind_ip 127.0.0.1 >/tmp/zhanna-prod-mongod.log 2>&1 &
MONGO_PID=$!
for i in $(seq 1 60); do (echo >/dev/tcp/127.0.0.1/$MONGO_PORT) 2>/dev/null && break; sleep 1; done

echo "==> seed"
MONGODB_URI="mongodb://127.0.0.1:$MONGO_PORT/zhanna" npx tsx src/scripts/seed.ts --reset >/tmp/zhanna-prod-seed.out 2>&1
grep -q '"productsCreated": 10' /tmp/zhanna-prod-seed.out || fail "seed"

echo "==> app"
(cd "$ROOT" && MONGODB_URI="mongodb://127.0.0.1:$MONGO_PORT/zhanna" AUTH_SECRET=test NEXTAUTH_URL=$BASE AUTH_URL=$BASE npx next start -p "$APP_PORT") >/tmp/zhanna-prod-app.log 2>&1 &
APP_PID=$!
for i in $(seq 1 60); do curl -sf "$BASE/api/products" >/dev/null 2>&1 && break; sleep 1; done

echo "==> GET /api/products"
curl -s "$BASE/api/products" -o /tmp/zhanna-prod-all.json
check /tmp/zhanna-prod-all.json "len(d['products']) == 10 and d['total'] == 10" "expected 10 products"
check /tmp/zhanna-prod-all.json "all('name' in p and 'price' in p and 'slug' in p for p in d['products'])" "missing product fields"
check /tmp/zhanna-prod-all.json "all(p['category'] and 'name' in p['category'] for p in d['products'])" "category not populated"

echo "==> GET /api/products?category=rings"
curl -s "$BASE/api/products?category=rings" -o /tmp/zhanna-prod-cat.json
check /tmp/zhanna-prod-cat.json "d['total'] == 2" "expected 2 rings"

echo "==> GET /api/products?featured=true"
curl -s "$BASE/api/products?featured=true" -o /tmp/zhanna-prod-feat.json
check /tmp/zhanna-prod-feat.json "d['total'] == 7 and all(p['isFeatured'] for p in d['products'])" "featured filter"

echo "==> GET /api/products?search=diamond"
curl -s "$BASE/api/products?search=diamond" -o /tmp/zhanna-prod-search.json
check /tmp/zhanna-prod-search.json "d['total'] >= 1" "search should match diamond products"

echo "==> GET /api/products?sort=price-asc"
curl -s "$BASE/api/products?sort=price-asc" -o /tmp/zhanna-prod-sort.json
check /tmp/zhanna-prod-sort.json "d['products'][0]['price'] <= d['products'][1]['price']" "price-asc sort"

echo "==> GET /api/products?sort=price-desc"
curl -s "$BASE/api/products?sort=price-desc" -o /tmp/zhanna-prod-sort2.json
check /tmp/zhanna-prod-sort2.json "d['products'][0]['price'] == 6999" "price-desc sort first should be 6999"

echo "==> GET /api/products?minPrice=5000&maxPrice=7000"
curl -s "$BASE/api/products?minPrice=5000&maxPrice=7000" -o /tmp/zhanna-prod-range.json
check /tmp/zhanna-prod-range.json "all(5000 <= p['price'] <= 7000 for p in d['products'])" "price range filter"

echo "==> GET /api/products/[slug]"
curl -s "$BASE/api/products/signature-eternity-diamond-ring" -o /tmp/zhanna-prod-one.json
check /tmp/zhanna-prod-one.json "d['product']['name'] == 'Signature Eternity Diamond Ring' and d['product']['price'] == 2499" "single product by slug"

echo "==> GET /api/products/nonexistent"
CODE=$(curl -s -o /tmp/zhanna-prod-404.json -w "%{http_code}" "$BASE/api/products/nonexistent-piece")
[ "$CODE" = "404" ] && echo "    404 OK" || fail "expected 404 got $CODE"

echo "==> GET /api/categories"
curl -s "$BASE/api/categories" -o /tmp/zhanna-prod-cats.json
check /tmp/zhanna-prod-cats.json "len(d['categories']) == 5" "expected 5 categories"
check /tmp/zhanna-prod-cats.json "sum(c['productCount'] for c in d['categories']) == 10" "category counts should sum to 10"

echo "==> /shop page"
CODE=$(curl -s -o /tmp/zhanna-prod-shop.html -w "%{http_code}" "$BASE/shop")
[ "$CODE" = "200" ] || fail "/shop $CODE"
grep -q "Signature Eternity Diamond Ring" /tmp/zhanna-prod-shop.html || fail "/shop missing product"
grep -q "Rani Jadau Bridal Necklace" /tmp/zhanna-prod-shop.html || fail "/shop missing second product"

echo "==> /shop?category=rings"
CODE=$(curl -s -o /tmp/zhanna-prod-shop2.html -w "%{http_code}" "$BASE/shop?category=rings")
[ "$CODE" = "200" ] || fail "/shop?category=rings $CODE"
grep -q "Rings" /tmp/zhanna-prod-shop2.html || fail "category heading missing"
grep -q "Timeless Tennis Bracelet" /tmp/zhanna-prod-shop2.html && fail "rings page should not show bracelets"

echo "==> /shop?search=diamond"
CODE=$(curl -s -o /tmp/zhanna-prod-shop3.html -w "%{http_code}" "$BASE/shop?search=diamond")
[ "$CODE" = "200" ] || fail "/shop?search=diamond $CODE"

echo "==> /product/[slug] page"
CODE=$(curl -s -o /tmp/zhanna-prod-pdp.html -w "%{http_code}" "$BASE/product/signature-eternity-diamond-ring")
[ "$CODE" = "200" ] || fail "/product $CODE"
grep -q "Signature Eternity Diamond Ring" /tmp/zhanna-prod-pdp.html || fail "pdp missing name"
grep -q "₹2,499" /tmp/zhanna-prod-pdp.html || fail "pdp missing price"
grep -q "Behind the" /tmp/zhanna-prod-pdp.html || fail "pdp missing story section"
grep -q "You may also" /tmp/zhanna-prod-pdp.html || fail "pdp missing related section"
grep -q "Add to bag" /tmp/zhanna-prod-pdp.html || fail "pdp missing add to bag"

echo "==> /product/unknown piece (streamed notFound -> 200 + noindex, per Next docs)"
CODE=$(curl -s -o /tmp/zhanna-prod-pdp404.html -w "%{http_code}" "$BASE/product/not-a-real-piece")
[ "$CODE" = "200" ] || fail "pdp expected 200 (streamed) got $CODE"
grep -qi 'name="robots" content="noindex"' /tmp/zhanna-prod-pdp404.html || fail "pdp not-found missing noindex meta"
grep -q "Piece not found" /tmp/zhanna-prod-pdp404.html || fail "pdp not-found missing title"
echo "    streamed-200 + noindex OK"

echo "ALL PRODUCT E2E CHECKS PASSED"
