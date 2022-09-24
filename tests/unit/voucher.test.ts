import { jest } from '@jest/globals';

import voucherRepository from '../../src/repositories/voucherRepository';
import voucherService from '../../src/services/voucherService';

beforeEach(() => {
  jest.resetAllMocks();
  jest.clearAllMocks();
});

describe('Testes unitários do voucher service', () => {
  it('Deve criar um voucher', async () => {
    const voucher = {
      code: 'aaa',
      discount: 10
    };

    jest
      .spyOn(voucherRepository, 'getVoucherByCode')
      .mockImplementationOnce((): any => {});

    jest
      .spyOn(voucherRepository, 'createVoucher')
      .mockImplementationOnce((): any => {});

    await voucherService.createVoucher(voucher.code, voucher.discount);

    expect(voucherRepository.getVoucherByCode).toBeCalled();
    expect(voucherRepository.createVoucher).toBeCalled();
  });

  it('Não deve criar um voucher duplicado', async () => {
    const voucher = {
      code: 'aaa',
      discount: 10
    };

    jest
      .spyOn(voucherRepository, 'getVoucherByCode')
      .mockImplementationOnce((): any => {
        return {
          code: 'aaa',
          discount: 10
        };
      });

    const promise = voucherService.createVoucher(
      voucher.code,
      voucher.discount
    );

    expect(promise).rejects.toEqual({
      type: 'conflict',
      message: 'Voucher already exist.'
    });

    expect(voucherRepository.createVoucher).not.toBeCalled();
  });

  it('Deveria aplicar desconto', async () => {
    const voucher = { code: 'AAA', discount: 10 };

    jest
      .spyOn(voucherRepository, 'getVoucherByCode')
      .mockImplementationOnce((): any => {
        return {
          id: 1,
          code: voucher.code,
          discount: voucher.discount,
          used: false
        };
      });
    jest
      .spyOn(voucherRepository, 'useVoucher')
      .mockImplementationOnce((): any => {});

    const amount = 1000;
    const order = await voucherService.applyVoucher(voucher.code, amount);
    expect(order.amount).toBe(amount);
    expect(order.discount).toBe(voucher.discount);
    expect(order.finalAmount).toBe(amount - amount * (voucher.discount / 100));
  });

  it('Não deve aplicar desconto para valores abaixo de 100', async () => {
    const voucher = { code: 'AAA', discount: 10 };

    jest
      .spyOn(voucherRepository, 'getVoucherByCode')
      .mockImplementationOnce((): any => {
        return {
          id: 1,
          code: voucher.code,
          discount: voucher.discount,
          used: false
        };
      });
    jest
      .spyOn(voucherRepository, 'useVoucher')
      .mockImplementationOnce((): any => {});

    const amount = 99;
    const order = await voucherService.applyVoucher(voucher.code, amount);
    expect(order.amount).toBe(amount);
    expect(order.discount).toBe(voucher.discount);
    expect(order.finalAmount).toBe(amount);
  });

  it('Não deve aplicar desconto para voucher usado', async () => {
    const voucher = { code: 'BBB', discount: 10 };

    jest
      .spyOn(voucherRepository, 'getVoucherByCode')
      .mockImplementationOnce((): any => {
        return {
          id: 1,
          code: voucher.code,
          discount: voucher.discount,
          used: true
        };
      });

    const amount = 1000;
    const order = await voucherService.applyVoucher(voucher.code, amount);
    expect(order.amount).toBe(amount);
    expect(order.discount).toBe(voucher.discount);
    expect(order.finalAmount).toBe(amount);
    expect(order.applied).toBe(false);
  });

  it('Não deve aplicar desconto para voucher inválido', async () => {
    const voucher = { code: 'CCC', discount: 10 };

    jest
      .spyOn(voucherRepository, 'getVoucherByCode')
      .mockImplementationOnce((): any => {
        return undefined;
      });

    const amount = 1000;
    const promise = voucherService.applyVoucher(voucher.code, amount);
    expect(promise).rejects.toEqual({
      message: 'Voucher does not exist.',
      type: 'conflict'
    });
  });
});
