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
exports.getDb = getDb;
var mongodb_1 = require("mongodb");
var dotenv_1 = require("dotenv");
dotenv_1.default.config();
// Use the correct password for local development
var mongoUri = process.env.MONGODB_URL || 'mongodb+srv://vinaysarkar0:vinasawarkar@cluster0.4adl4tl.mongodb.net/reckonix?retryWrites=true&w=majority&authSource=admin';
var client = new mongodb_1.MongoClient(mongoUri, {
    serverApi: mongodb_1.ServerApiVersion.v1,
    retryWrites: true,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 10000,
    maxIdleTimeMS: 30000,
    retryReads: true,
    // Additional SSL/TLS options for production compatibility
    tls: true,
    tlsAllowInvalidCertificates: false,
    tlsAllowInvalidHostnames: false,
});
var isConnected = false;
function getDb() {
    return __awaiter(this, void 0, void 0, function () {
        var productionUri, prodClient, err_1;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    if (!!isConnected) return [3 /*break*/, 4];
                    if (!(process.env.NODE_ENV === 'production')) return [3 /*break*/, 2];
                    productionUri = mongoUri;
                    prodClient = new mongodb_1.MongoClient(productionUri, {
                        serverApi: mongodb_1.ServerApiVersion.v1,
                        retryWrites: true,
                        maxPoolSize: 5,
                        serverSelectionTimeoutMS: 15000,
                        socketTimeoutMS: 60000,
                        connectTimeoutMS: 15000,
                        maxIdleTimeMS: 30000,
                        retryReads: true,
                        tls: true,
                        tlsAllowInvalidCertificates: false,
                        tlsAllowInvalidHostnames: false,
                    });
                    return [4 /*yield*/, prodClient.connect()];
                case 1:
                    _a.sent();
                    isConnected = true;
                    // Console log removed for production');
                    return [2 /*return*/, prodClient.db('reckonix')];
                case 2: return [4 /*yield*/, client.connect()];
                case 3:
                    _a.sent();
                    isConnected = true;
                    _a.label = 4;
                case 4: return [2 /*return*/, client.db('reckonix')]; // Use your MongoDB database name
                case 5:
                    err_1 = _a.sent();
                    // Console log removed for production
                    isConnected = false;
                    // Try to reconnect after a short delay
                    setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                        var retryErr_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, client.connect()];
                                case 1:
                                    _a.sent();
                                    isConnected = true;
                                    return [3 /*break*/, 3];
                                case 2:
                                    retryErr_1 = _a.sent();
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); }, 5000);
                    throw err_1;
                case 6: return [2 /*return*/];
            }
        });
    });
}
