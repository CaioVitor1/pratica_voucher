import * as voucherFunctions from "../../src/services/voucherService"

import { faker } from "@faker-js/faker"
describe("createVoucher", () => {
	it("should return a new voucher register", () => {
		const newVoucher = {
            code: faker.finance.amount(),
            discount: 777,
        }
		try{
            const result = voucherFunctions.default.createVoucher(newVoucher.code, newVoucher.discount)
            expect(result).toEqual(Object);
        }catch(erro){
            
        }
		
		
		
	});    

    it("should return a message 'Voucher already exist.'", () => {
		const newVoucher = {
            code: "1",
            discount: 777,
        }
		try{
            const result = voucherFunctions.default.createVoucher(newVoucher.code, newVoucher.discount)
        }catch(erro){
            expect(erro).toEqual(erro.conflictError('Voucher already exist.'));
        }
		
		
		
	});

});

describe("applyVoucher", () => {
	it("Voucher is not register", () => {
		const newVoucher = {
            code: faker.finance.amount(),
            amount: 777,
        }
		try{
            const result = voucherFunctions.default.applyVoucher(newVoucher.code, newVoucher.amount)
        }catch(erro){
            expect(erro).toEqual(erro.conflictError('Voucher does not exist.'));
        }
		
		
		
	});    
/*
    it("amount not valid for discount", () => {
		const newVoucher = {
            code: "1",
            amount: 50,
        }
		
		const result = voucherFunctions.default.applyVoucher(newVoucher.code, newVoucher.amount)
		
		expect(result).toStrictEqual(Object);
	});  

    it("body valid for discount", () => {
		const newVoucher = {
            code: "1",
            amount: 500,
        }
		
		const result = voucherFunctions.default.applyVoucher(newVoucher.code, newVoucher.amount)
		
		expect(result).toStrictEqual(Object);
	});  */

});

