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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getToken = void 0;
const getRequest_1 = require("./getRequest");
const userAlreadyExist = {
    first_name: 'Petar',
    last_name: 'Stojanovic',
    password: 'petar',
};
const getToken = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield getRequest_1.request
        .post(`${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/users" /* AppRoutePath.ENDPOINT_USERS */}/signin`)
        .send(userAlreadyExist);
    const body = (yield result.body);
    return body.output.token;
});
exports.getToken = getToken;
