"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios = require("axios");
var cheerio = require("cheerio");
var mongo_js_1 = require("../server/mongo.js");
var baseUrl = 'https://www.reckonix.in';
function fetchProductLinks() {
    return __awaiter(this, void 0, void 0, function () {
        var productLinks, response, $_1, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    productLinks = [];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios.default.get(baseUrl + '/products')];
                case 2:
                    response = _a.sent();
                    $_1 = cheerio.load(response.data);
                    // Assuming product links are in anchor tags under product listing
                    $_1('a').each(function (_, element) {
                        var href = $_1(element).attr('href');
                        if (href && href.startsWith('/product/')) {
                            productLinks.push(baseUrl + href);
                        }
                    });
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error('Error fetching product links:', error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/, productLinks];
            }
        });
    });
}
function fetchProductDetails(url) {
    return __awaiter(this, void 0, void 0, function () {
        var response, $_2, name_1, category, subcategory, shortDescription, technicalDetails, specifications, featuresBenefits, certifications, imageUrl, catalogPdfUrl, datasheetPdfUrl, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.default.get(url)];
                case 1:
                    response = _a.sent();
                    $_2 = cheerio.load(response.data);
                    name_1 = $_2('h1').first().text().trim();
                    category = $_2('a').filter(function (i, el) { return $_2(el).text().toLowerCase().includes('category'); }).first().text().trim();
                    subcategory = $_2('a').filter(function (i, el) { return $_2(el).text().toLowerCase().includes('subcategory'); }).first().text().trim();
                    shortDescription = $_2('p').first().text().trim();
                    technicalDetails = $_2('#technical-details').text().trim();
                    specifications = $_2('#specifications').text().trim();
                    featuresBenefits = $_2('#features-benefits').text().trim();
                    certifications = $_2('#certifications').text().trim();
                    imageUrl = $_2('img').first().attr('src');
                    catalogPdfUrl = $_2('a').filter(function (i, el) { return $_2(el).text().toLowerCase().includes('catalog'); }).attr('href');
                    datasheetPdfUrl = $_2('a').filter(function (i, el) { return $_2(el).text().toLowerCase().includes('datasheet'); }).attr('href');
                    return [2 /*return*/, {
                            name: name_1,
                            category: category,
                            subcategory: subcategory,
                            shortDescription: shortDescription,
                            technicalDetails: technicalDetails,
                            specifications: specifications,
                            featuresBenefits: featuresBenefits,
                            certifications: certifications,
                            imageUrl: imageUrl ? baseUrl + imageUrl : null,
                            catalogPdfUrl: catalogPdfUrl ? baseUrl + catalogPdfUrl : null,
                            datasheetPdfUrl: datasheetPdfUrl ? baseUrl + datasheetPdfUrl : null,
                        }];
                case 2:
                    error_2 = _a.sent();
                    console.error('Error fetching product details from', url, error_2);
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var db, productsCollection, productLinks, createdCount, _i, productLinks_1, link, product, existingProduct, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('Starting Reckonix product import...');
                    return [4 /*yield*/, (0, mongo_js_1.getDb)()];
                case 1:
                    db = _a.sent();
                    productsCollection = db.collection('Product');
                    return [4 /*yield*/, fetchProductLinks()];
                case 2:
                    productLinks = _a.sent();
                    console.log('Found ' + productLinks.length + ' products to process.');
                    createdCount = 0;
                    _i = 0, productLinks_1 = productLinks;
                    _a.label = 3;
                case 3:
                    if (!(_i < productLinks_1.length)) return [3 /*break*/, 10];
                    link = productLinks_1[_i];
                    return [4 /*yield*/, fetchProductDetails(link)];
                case 4:
                    product = _a.sent();
                    if (!product)
                        return [3 /*break*/, 9];
                    _a.label = 5;
                case 5:
                    _a.trys.push([5, 8, , 9]);
                    return [4 /*yield*/, productsCollection.findOne({ name: product.name })];
                case 6:
                    existingProduct = _a.sent();
                    if (existingProduct) {
                        console.log('Product already exists, skipping: ' + product.name);
                        return [3 /*break*/, 9];
                    }
                    return [4 /*yield*/, productsCollection.insertOne(product)];
                case 7:
                    _a.sent();
                    createdCount++;
                    console.log('Added new product: ' + product.name);
                    return [3 /*break*/, 9];
                case 8:
                    error_3 = _a.sent();
                    console.error('Error inserting product:', product.name, error_3);
                    return [3 /*break*/, 9];
                case 9:
                    _i++;
                    return [3 /*break*/, 3];
                case 10:
                    console.log('Import completed. Added ' + createdCount + ' new products.');
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .then(function () {
    console.log('Reckonix product import finished.');
    process.exit(0);
})
    .catch(function (error) {
    console.error('Reckonix product import failed:', error);
    process.exit(1);
});
